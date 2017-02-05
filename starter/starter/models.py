import enum
from collections import defaultdict
from threading import Lock

from django.contrib.auth.models import User
from django.db import models


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

    def get_children(self):
        return self.child_tag.all()

    def set_children(self, new_children):
        # TODO: Optimize this
        self.child_tag.all().delete()
        for child in new_children:
            TagEdge.objects.create(
                parent_tag_id=self.id,
                child_tag_id=child.id
            )

    def get_parents(self):
        return self.parent_tag.all()

    def to_dict(self):
        return dict(
            id=self.id,
            name=self.name,
            ownerId=self.owner_id,
            childTagIds=[x.child_tag_id for x in self.get_children()],
        )

    @classmethod
    def get_all_owned_tags(cls, user: User):
        return user.owned_tags.all()


class TagEdge(models.Model):
    # No, these related names are not flipped. It's just unintuitive.
    parent_tag = models.ForeignKey(Tag, related_name='child_tag')
    child_tag = models.ForeignKey(Tag, related_name='parent_tag')


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

    def __init__(self, *args, **kwargs):
        super(Task, self).__init__(*args, **kwargs)

        self._cached_local_id = None
        self._cached_tag_ids = None
        self._cached_event_ids = None

    @classmethod
    def get_by_owner_id(cls, user_id):
        all_tasks = Task.objects.filter(owner_id=user_id)

        # Now, we also want all the local ids so that we can attach them correctly
        task_id_to_local_id = {
            tgi.task_id: tgi.local_id for tgi in TaskGlobalId.objects.filter(user_id=user_id)
        }

        # Also cache in the tag ids
        task_id_to_tag_ids = defaultdict(list)
        all_task_tags = TaskTags.objects.filter(task__in=task_id_to_local_id)
        for task_tag in all_task_tags:
            task_id_to_tag_ids[task_tag.task_id].append(task_tag.tag_id)

        task_id_to_event_ids = defaultdict(list)
        all_task_events = TaskEvents.objects.filter(task__in=task_id_to_local_id)

        # Do the global -> local id conversion for linked events as well
        event_id_to_local_id = {
            egi.event_id: egi.local_id
            for egi in EventGlobalId.objects.filter(
                user_id=user_id, event__in=[x.event_id for x in all_task_events],
            )
        }

        for task_event in all_task_events:
            task_id_to_event_ids[task_event.task_id].append(
                event_id_to_local_id[task_event.event_id]
            )

        for task in all_tasks:
            task._cached_local_id = task_id_to_local_id[task.id]
            task._cached_tag_ids = task_id_to_tag_ids[task.id]
            task._cached_event_ids = task_id_to_event_ids[task.id]

        return all_tasks

    @classmethod
    def get_by_local_id(cls, local_id, user):
        task_id = TaskGlobalId.objects.get(user_id=user.id, local_id=local_id).task_id
        return Task.objects.get(id=task_id)

    def create_local_id(self, user):
        with TaskGlobalId.GLOBAL_WLOCK:
            cur_last = TaskGlobalId.objects.filter(user_id=user.id).order_by("local_id").last()
            last_id = cur_last.local_id if cur_last else 0
            TaskGlobalId.objects.create(
                task=self,
                user=user,
                local_id=last_id + 1,
            )

    def get_local_id(self):
        if self._cached_local_id is not None:
            return self._cached_local_id

        local_id = TaskGlobalId.objects.get(task_id=self.id, user_id=self.author_id).local_id
        self._cached_local_id = local_id
        return local_id

    def get_tag_ids(self):
        if self._cached_tag_ids is not None:
            return self._cached_tag_ids

        tag_ids = [x.id for x in self.tags.all()]
        self._cached_tag_ids = tag_ids
        return tag_ids

    def set_tags(self, new_tags):
        # TODO: Optimize this
        self._cached_tag_ids = None
        self.tags.clear()
        for tag in new_tags:
            self.tags.add(tag)

    def get_event_ids(self):
        if self._cached_event_ids is not None:
            return self._cached_event_ids

        event_ids = [x.get_local_id() for x in self.events.all()]
        self._cached_event_ids = event_ids
        return event_ids

    def to_dict(self):
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

    def __init__(self, *args, **kwargs):
        super(Event, self).__init__(*args, **kwargs)

        self._cached_local_id = None
        self._cached_tag_ids = None
        self._cached_task_ids = None

    @classmethod
    def get_by_owner_id(cls, user_id):
        all_events = Event.objects.filter(owner_id=user_id)

        event_id_to_local_id = {
            egi.event_id: egi.local_id for egi in EventGlobalId.objects.filter(user_id=user_id)
        }

        event_id_to_tag_ids = defaultdict(list)
        all_event_tags = EventTags.objects.filter(event__in=event_id_to_local_id)
        for event_tag in all_event_tags:
            event_id_to_tag_ids[event_tag.event_id].append(event_tag.tag_id)

        event_id_to_task_ids = defaultdict(list)
        all_task_events = TaskEvents.objects.filter(event__in=event_id_to_local_id)

        # Do the global -> local id conversion for the linked tasks as well
        task_id_to_local_id = {
            tgi.task_id: tgi.local_id
            for tgi in TaskGlobalId.objects.filter(
                user_id=user_id, task__in=[x.task_id for x in all_task_events]
            )
        }

        for task_event in all_task_events:
            event_id_to_task_ids[task_event.event_id].append(
                task_id_to_local_id[task_event.task_id]
            )

        for event in all_events:
            event._cached_local_id = event_id_to_local_id[event.id]
            event._cached_tag_ids = event_id_to_tag_ids[event.id]
            event._cached_task_ids = event_id_to_task_ids[event.id]

        return all_events

    @classmethod
    def get_by_local_id(cls, local_id, user):
        event_id = EventGlobalId.objects.get(user_id=user.id, local_id=local_id).event_id
        return Event.objects.get(id=event_id)

    def create_local_id(self, user):
        with EventGlobalId.GLOBAL_WLOCK:
            cur_last = EventGlobalId.objects.filter(user_id=user.id).order_by("local_id").last()
            last_id = cur_last.local_id if cur_last else 0
            EventGlobalId.objects.create(
                event=self,
                user=user,
                local_id=last_id + 1,
            )

    def get_local_id(self):
        if self._cached_local_id is not None:
            return self._cached_local_id

        local_id = EventGlobalId.objects.get(event_id=self.id, user_id=self.author_id).local_id
        self._cached_local_id = local_id
        return local_id

    def get_tag_ids(self):
        if self._cached_tag_ids is not None:
            return self._cached_tag_ids

        tag_ids = [x.id for x in self.tags.all()]
        self._cached_tag_ids = tag_ids
        return tag_ids

    def set_tags(self, new_tags):
        # TODO: Optimize this
        self._cached_tag_ids = None
        self.tags.clear()
        for tag in new_tags:
            self.tags.add(tag)

    def get_task_ids(self):
        if self._cached_task_ids is not None:
            return self._cached_task_ids

        task_ids = [x.get_local_id() for x in self.task_set.all()]
        self._cached_task_ids = task_ids
        return task_ids

    def set_tasks(self, new_tasks):
        # TODO: Optimize this
        self._cached_task_ids = None
        self.task_set.clear()
        for task in new_tasks:
            self.task_set.add(task)

    def to_dict(self):
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
