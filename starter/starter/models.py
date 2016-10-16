import enum

from django.contrib.auth.models import User
from django.db import models


class Tag(models.Model):
    name = models.CharField("descriptive name of the tag", max_length=64)


class Task(models.Model):

    @enum.unique
    class Priority(enum.Enum):
        UNKNOWN = 0
        LOWEST = 100
        LOW = 200
        NORMAL = 300
        HIGH = 400
        HIGHEST = 500

    title = models.CharField("Title of the task", max_length=128)
    description = models.TextField("Description of the task", max_length=2000)
    author = models.ForeignKey(User, related_name="authored_tasks",
                               verbose_name="Original author of the task")
    owner = models.ForeignKey(User, related_name="owned_tasks",
                              verbose_name="Current owner of the task")

    tags = models.ManyToManyField(Tag, verbose_name="The tags for the task")
    priority = models.SmallIntegerField("The assigned priority of the task")

    @classmethod
    def get_by_owner_id(cls, user):
        return Task.objects.filter(owner_id=user.id)

    def to_dict(self):
        return dict(
            id=self.id,
            title=self.title,
            description=self.description,
            authorId=self.author_id,
            ownerId=self.owner_id,

            # TODO: include tags?

            priority=self.Priority(self.priority).name,
        )
