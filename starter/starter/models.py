import enum

from django.contrib.auth.models import User
from django.db import models


class Tag(models.Model):
    """
    A way to keep track of many different tasks.
    """
    name = models.CharField("descriptive name of the tag", max_length=64)


class TagGroup(models.Model):
    """
    A higher-order tag that contains other tags. In the future this may contain other TagGroups
    as well.
    """
    name = models.CharField("descriptive name of the tag group", max_length=64)
    models.ManyToManyField(Tag, verbose_name="The tags for this group of tags")


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

    def to_dict(self):
        return dict(
            id=self.get_local_id(),
            title=self.title,
            description=self.description,
            authorId=self.author_id,
            ownerId=self.owner_id,

            # TODO: include tags?

            priority=self.Priority(self.priority).value,
            state=self.State(self.state).value,
        )


class TaskGlobalId(models.Model):
    user = models.ForeignKey(User, related_name="user")
    task = models.ForeignKey(Task, related_name="task")
    local_id = models.IntegerField(db_index=True)
