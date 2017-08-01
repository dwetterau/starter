import enum

from collections import defaultdict
from threading import Lock
from typing import Any, Dict, Iterable, List, Optional, NewType, Tuple

from django.contrib.auth.models import User
from django.db import models


UserId = NewType("UserId", int)

TaskId = NewType("TaskId", int)
LocalTaskId = NewType("LocalTaskId", int)

EventId = NewType("EventId", int)
LocalEventId = NewType("LocalEventId", int)

TagId = NewType("TagId", int)

NoteId = NewType("NoteId", int)
LocalNoteId = NewType("LocalNoteId", int)


class Tag(models.Model):
    """
    A way to keep track of many different tasks.
    """
    name = models.CharField("descriptive name of the tag", max_length=64, db_index=True)
    models.ManyToManyField("self",
                           through="TagEdge",
                           symmetrical=False,
                           verbose_name="The tags contained by this tag")
    owner = models.ForeignKey(User, related_name="owned_tags", verbose_name="Owner of this tag")

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super(Tag, self).__init__(*args, **kwargs)

        self._cached_child_ids = None  # type: Optional[List[TagId]]

    def get_child_ids(self) -> List[TagId]:
        if self._cached_child_ids is not None:
            return self._cached_child_ids

        tag_ids = [x.child_tag_id for x in self.child_tag.all()]
        self._cached_child_ids = tag_ids
        return tag_ids

    def set_children(self, new_children: List["Tag"]) -> None:
        # TODO: Optimize this
        self._cached_child_ids = None
        self.child_tag.all().delete()
        for child in new_children:
            TagEdge.objects.create(
                parent_tag_id=self.id,
                child_tag_id=child.id
            )

    def get_parents(self) -> List["Tag"]:
        return self.parent_tag.all()

    def to_dict(self) -> Dict[str, Any]:
        return dict(
            id=self.id,
            name=self.name,
            ownerId=self.owner_id,
            childTagIds=self.get_child_ids(),
        )

    @classmethod
    def get_all_owned_tags(cls, user: User) -> List["Tag"]:
        tags = user.owned_tags.all()
        all_edges = TagEdge.objects.filter(parent_tag_id__in=[t.id for t in tags]).all()
        parent_id_to_child_ids = defaultdict(list)  # type: Dict[TagId, List[TagId]]
        for edge in all_edges:
            parent_id_to_child_ids[edge.parent_tag_id].append(edge.child_tag_id)
        for tag in tags:
            tag._cached_child_ids = parent_id_to_child_ids[tag.id]
        return tags


class TagEdge(models.Model):
    # No, these related names are not flipped. It's just unintuitive.
    parent_tag = models.ForeignKey(Tag, related_name='child_tag')
    child_tag = models.ForeignKey(Tag, related_name='parent_tag')

global_task_cache = {}  # type: Dict[TaskId, Tuple[LocalTaskId, List[TagId], List[LocalEventId]]]

global_event_cache = {}  # type: Dict[EventId, Tuple[LocalEventId, List[TagId], List[LocalTaskId]]]

global_note_cache = {}  # type: Dict[NoteId, Tuple[LocalNoteId, List[TagId]]]


class Task(models.Model):

    @enum.unique
    class Priority(enum.Enum):
        UNKNOWN = 0
        LOWEST = 100
        LOW = 200
        NORMAL = 300
        HIGH = 400
        HIGHEST = 500

    @enum.unique
    class State(enum.Enum):
        OPEN = 0
        IN_PROGRESS = 500
        BLOCKED = 750
        CLOSED = 1000

    title = models.CharField("Title of the task", max_length=128)
    description = models.TextField("Description of the task", max_length=2000)
    author = models.ForeignKey(User, related_name="authored_tasks",
                               verbose_name="Original author of the task")
    owner = models.ForeignKey(User, related_name="owned_tasks",
                              verbose_name="Current owner of the task")

    tags = models.ManyToManyField(Tag, verbose_name="The tags for the task")
    priority = models.SmallIntegerField("The assigned priority of the task")
    state = models.SmallIntegerField("The current state of the task")
    events = models.ManyToManyField('Event', verbose_name="The events for this task")
    expected_duration_secs = models.IntegerField("Expected duration of the task in seconds")

    @classmethod
    def get_by_owner_id(cls, user_id: UserId) -> List["Task"]:
        all_tasks = Task.objects.filter(owner_id=user_id)

        uncached_task_ids = [t.id for t in all_tasks if t.id not in global_task_cache]

        # Now, we also want all the local ids so that we can attach them correctly
        for tgi in TaskGlobalId.objects.filter(user_id=user_id, task_id__in=uncached_task_ids):
            global_task_cache[tgi.task_id] = (tgi.local_id, [], [])

        # Also cache in the tag ids
        all_task_tags = TaskTags.objects.filter(task_id__in=uncached_task_ids)
        for task_tag in all_task_tags:
            cache_entry = global_task_cache[task_tag.task_id]
            cache_entry[1].append(task_tag.tag_id)

        all_task_events = TaskEvents.objects.filter(task__in=uncached_task_ids)

        # Do the global -> local id conversion for linked events as well
        event_id_to_local_id = {
            egi.event_id: egi.local_id
            for egi in EventGlobalId.objects.filter(
                user_id=user_id, event__in=[x.event_id for x in all_task_events],
            )
        }

        for task_event in all_task_events:
            cache_entry = global_task_cache[task_event.task_id]
            cache_entry[2].append(event_id_to_local_id[task_event.event_id])

        return all_tasks

    @classmethod
    def get_by_local_id(cls, local_id: LocalTaskId, user: User) -> "Task":
        task_id = TaskGlobalId.objects.get(user_id=user.id, local_id=local_id).task_id
        task = Task.objects.get(id=task_id)
        task.add_to_cache()
        return task

    def create_local_id(self, user: User) -> None:
        with TaskGlobalId.GLOBAL_WLOCK:
            cur_last = TaskGlobalId.objects.filter(user_id=user.id).order_by("local_id").last()
            last_id = cur_last.local_id if cur_last else 0
            TaskGlobalId.objects.create(
                task=self,
                user=user,
                local_id=last_id + 1,
            )

    def get_local_id(self) -> LocalTaskId:
        if self.id in global_task_cache:
            return global_task_cache[self.id][0]

        local_id = TaskGlobalId.objects.get(task_id=self.id, user_id=self.author_id).local_id
        return local_id

    def get_tag_ids(self) -> List[TagId]:
        if self.id in global_task_cache:
            return global_task_cache[self.id][1]

        return [x.id for x in self.tags.all()]

    def set_tags(self, new_tags: Iterable[Tag]) -> None:
        # TODO: Optimize this
        global_task_cache.pop(self.id, None)
        self.tags.clear()
        for tag in new_tags:
            self.tags.add(tag)

    def get_event_ids(self) -> List[LocalEventId]:
        if self.id in global_task_cache:
            return global_task_cache[self.id][2]

        return [x.get_local_id() for x in self.events.all()]

    def add_to_cache(self) -> None:
        global_task_cache[self.id] = (
            self.get_local_id(),
            self.get_tag_ids(),
            self.get_event_ids(),
        )

    def to_dict(self) -> Dict[str, Any]:
        return dict(
            id=self.get_local_id(),
            title=self.title,
            description=self.description,
            authorId=self.author_id,
            ownerId=self.owner_id,
            tagIds=self.get_tag_ids(),
            priority=self.Priority(self.priority).value,
            state=self.State(self.state).value,
            eventIds=self.get_event_ids(),
            expectedDurationSecs=self.expected_duration_secs,
        )

    def delete(self, **kwargs: Any) -> None:
        global_task_cache.pop(self.id, None)
        self.set_tags([])
        super(Task, self).delete(**kwargs)


class TaskGlobalId(models.Model):
    user = models.ForeignKey(User, related_name="user")
    task = models.ForeignKey(Task, related_name="task")
    local_id = models.IntegerField(db_index=True)

    GLOBAL_WLOCK = Lock()


class TaskTags(models.Model):
    task = models.ForeignKey(Task, related_name="_tags")
    tag = models.ForeignKey(Tag, related_name="_tasks")

    class Meta:
        db_table = "starter_task_tags"


class TaskEvents(models.Model):
    task = models.ForeignKey(Task, related_name="_events")
    event = models.ForeignKey("Event", related_name="_tasks")

    class Meta:
        db_table = "starter_task_events"


class Event(models.Model):
    name = models.CharField("Name of the event", max_length=128)
    start_time = models.DateTimeField("Start time of the event")
    duration_secs = models.IntegerField("Duration of events in seconds")

    author = models.ForeignKey(User, related_name="authored_events",
                               verbose_name="Original author of the event")
    owner = models.ForeignKey(User, related_name="owned_events",
                              verbose_name="Current owner of the event")

    tags = models.ManyToManyField(Tag, verbose_name="The tags for the event")

    @classmethod
    def get_by_owner_id(cls, user_id: UserId) -> List["Event"]:
        # Note: Iterating over these the first time is a huge perf hit
        all_events = Event.objects.filter(owner_id=user_id).all()

        uncached_event_ids = [e.id for e in all_events if e.id not in global_event_cache]

        for egi in EventGlobalId.objects.filter(user_id=user_id, event_id__in=uncached_event_ids):
            global_event_cache[egi.event_id] = (egi.local_id, [], [])

        for event_tag in EventTags.objects.filter(event__in=uncached_event_ids):
            cache_entry = global_event_cache[event_tag.event_id]
            cache_entry[1].append(event_tag.tag_id)

        all_task_events = TaskEvents.objects.filter(event__in=uncached_event_ids)

        # Do the global -> local id conversion for the linked tasks as well
        task_id_to_local_id = {
            tgi.task_id: tgi.local_id
            for tgi in TaskGlobalId.objects.filter(
                user_id=user_id, task__in=[x.task_id for x in all_task_events]
            )
        }

        for task_event in all_task_events:
            cache_entry = global_event_cache[task_event.event_id]
            cache_entry[2].append(task_id_to_local_id[task_event.task_id])

        return all_events

    @classmethod
    def get_by_local_id(cls, local_id: LocalEventId, user: User) -> "Event":
        event_id = EventGlobalId.objects.get(user_id=user.id, local_id=local_id).event_id
        event = Event.objects.get(id=event_id)
        event.add_to_cache()
        return event

    def create_local_id(self, user: User) -> None:
        with EventGlobalId.GLOBAL_WLOCK:
            cur_last = EventGlobalId.objects.filter(user_id=user.id).order_by("local_id").last()
            last_id = cur_last.local_id if cur_last else 0
            EventGlobalId.objects.create(
                event=self,
                user=user,
                local_id=last_id + 1,
            )

    def get_local_id(self) -> LocalEventId:
        if self.id in global_event_cache:
            return global_event_cache[self.id][0]

        local_id = EventGlobalId.objects.get(event_id=self.id, user_id=self.author_id).local_id
        return local_id

    def get_tag_ids(self) -> List[TagId]:
        if self.id in global_event_cache:
            return global_event_cache[self.id][1]

        return [x.id for x in self.tags.all()]

    def set_tags(self, new_tags: Iterable[TagId]) -> None:
        # TODO: Optimize this
        global_event_cache.pop(self.id, None)
        self.tags.clear()
        for tag in new_tags:
            self.tags.add(tag)

    def get_task_ids(self) -> List[LocalTaskId]:
        if self.id in global_event_cache:
            return global_event_cache[self.id][2]

        return [x.get_local_id() for x in self.task_set.all()]

    def set_tasks(self, user: User, new_tasks: Iterable[Task]) -> None:
        # TODO: Optimize this
        current_local_task_ids = self.get_task_ids()
        for task_id in current_local_task_ids:
            t = Task.get_by_local_id(task_id, user)
            global_task_cache.pop(t.id, None)

        global_event_cache.pop(self.id, None)
        self.task_set.clear()
        for task in new_tasks:
            global_task_cache.pop(task.id, None)
            self.task_set.add(task)

    def add_to_cache(self) -> None:
        global_event_cache[self.id] = (
            self.get_local_id(),
            self.get_tag_ids(),
            self.get_task_ids(),
        )

    def to_dict(self) -> Dict[str, Any]:
        return dict(
            id=self.get_local_id(),
            name=self.name,
            authorId=self.author_id,
            ownerId=self.owner_id,
            tagIds=self.get_tag_ids(),
            startTime=int(self.start_time.timestamp() * 1000),
            durationSecs=self.duration_secs,
            taskIds=self.get_task_ids()
        )

    def delete_by_user(self, user: User) -> None:
        global_event_cache.pop(self.id, None)
        self.set_tags([])
        self.set_tasks(user, [])
        self.delete()


class EventGlobalId(models.Model):
    user = models.ForeignKey(User, related_name="user_events")
    event = models.ForeignKey(Event, related_name="event_user")
    local_id = models.IntegerField(db_index=True)

    GLOBAL_WLOCK = Lock()


class EventTags(models.Model):
    event = models.ForeignKey(Event, related_name="_tags")
    tag = models.ForeignKey(Tag, related_name="_events")

    class Meta:
        db_table = "starter_event_tags"


class AuthToken(models.Model):

    @enum.unique
    class Type(enum.Enum):
        STRAVA = 1

    user = models.ForeignKey(User, related_name="auth_tokens",
                             verbose_name="The user authorized by the token")
    type = models.SmallIntegerField("The type of auth token", db_index=True)
    token = models.CharField("The token given out by the provider", max_length=128)


class StravaActivity(models.Model):
    strava_id = models.IntegerField("The id of the activity", db_index=True, unique=True)
    athlete = models.IntegerField("The strava id of the athlete that performed the activity")

    # Connect this to our internal models
    # Note: Since there is only one importer, we should only import activities by the user.
    importer = models.ForeignKey(User, related_name="strava_activities",
                                 verbose_name="The user that imported the data")
    event = models.ForeignKey(Event, related_name="strava_activity",
                              verbose_name="The strava activity for this event")

    # Relevant cached fields
    moving_time = models.IntegerField("The amount of time spent moving")
    elapsed_time = models.IntegerField("The amount of time the total activity took")
    distance = models.FloatField("The total distance of the activity")
    start_date = models.DateTimeField("The time the activity started")


class Note(models.Model):
    title = models.CharField("Title of note", max_length=128)
    content = models.TextField("Content of the note", max_length=65536)
    author = models.ForeignKey(User, related_name="authored_notes",
                               verbose_name="Original author of the note")
    creation_time = models.DateTimeField("Creation time of the note")

    tags = models.ManyToManyField(Tag, verbose_name="The tags for the note", through=NoteTags)

    @classmethod
    def get_by_author_id(cls, user_id: UserId) -> List["Note"]:
        all_notes = Note.objects.filter(author_id=user_id).all()

        uncached_note_ids = [n.id for n in all_notes if n.id not in global_note_cache]

        for ngi in NoteGlobalId.objects.filter(user_id=user_id, note_id__in=uncached_note_ids):
            global_note_cache[ngi.note_id] = (ngi.local_id, [])

        for note_tag in NoteTags.objects.filter(user_id=user_id, note_id__in=uncached_note_ids):
            cache_entry = global_note_cache[note_tag.note_id]
            cache_entry[1].append(note_tag.tag_id)

        return all_notes

    @classmethod
    def get_by_local_id(cls, local_id: LocalNoteId, user: User) -> "Note":
        note_id = NoteGlobalId.objects.get(user_id=user.id, local_id=local_id).note_id
        note = Event.objects.get(id=note_id)
        note.add_to_cache()
        return note

    def create_local_id(self, user: User) -> None:
        with NoteGlobalId.GLOBAL_WLOCK:
            cur_last = NoteGlobalId.objects.filter(user_id=user.id).order_by("local_id").last()
            last_id = cur_last.local_id if cur_last else 0
            NoteGlobalId.objects.create(
                note=self,
                user=user,
                local_id=last_id + 1,
            )

    def get_local_id(self) -> LocalNoteId:
        if self.id in global_note_cache:
            return global_note_cache[self.id][0]

        local_id = NoteGlobalId.objects.get(note_id=self.id, user_id=self.author_id).local_id
        return local_id

    def get_tag_ids(self) -> List[TagId]:
        if self.id in global_note_cache:
            return global_note_cache[self.id][1]
        return [x.id for x in self.tags.all()]

    def set_tags(self, new_tags: Iterable[TagId]) -> None:
        # TODO: Optimize this
        global_note_cache.pop(self.id, None)
        self.tags.clear()
        for tag in new_tags:
            self.tags.add(tag)

    def add_to_cache(self) -> None:
        global_note_cache[self.id] = (self.get_local_id(), self.get_tag_ids())

    def to_dict(self) -> Dict[str, Any]:
        return dict(
            id=self.get_local_id(),
            title=self.title,
            content=self.content,
            creationTime=self.creation_time,
            authorId=self.author_id,
            tagIds=self.get_tag_ids(),
        )

    def delete_by_user(self, user: User) -> None:
        global_note_cache.pop(self.id, None)
        self.set_tags([])
        self.delete()


class NoteGlobalId(models.Model):
    user = models.ForeignKey(User, related_name="user_notes")
    note = models.ForeignKey(Note, related_name="note_user")
    local_id = models.IntegerField(db_index=True)

    GLOBAL_WLOCK = Lock()


class NoteTags(models.Model):
    note = models.ForeignKey(Note)
    tag = models.ForeignKey(Tag)

