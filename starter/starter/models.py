import enum
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

    @classmethod
    def get_by_owner_id(cls, user_id):
        return Task.objects.filter(owner_id=user_id)

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
        # TODO: Cache this locally since it's immutable?
        return TaskGlobalId.objects.get(task_id=self.id, user_id=self.author_id).local_id

    def get_tag_ids(self):
        return [x.id for x in self.tags.all()]

    def set_tags(self, new_tags):
        # TODO: Optimize this
        self.tags.clear()
        for tag in new_tags:
            self.tags.add(tag)

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
        )


class TaskGlobalId(models.Model):
    user = models.ForeignKey(User, related_name="user")
    task = models.ForeignKey(Task, related_name="task")
    local_id = models.IntegerField(db_index=True)

    GLOBAL_WLOCK = Lock()
