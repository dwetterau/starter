# The configuration for the django admin page
from django.contrib import admin

from .models import Task, Event, Tag


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_local_id', 'title', 'author', 'priority', 'state', 'get_tag_ids')
    list_display_links = ('title', 'author')


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_local_id', 'name', 'author', 'start_time', 'duration_secs',
                    'get_task_ids', 'get_tag_ids')
    list_display_links = ('name', 'author')


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'owner', 'get_child_ids')
    list_display_links = ('name', 'owner')
