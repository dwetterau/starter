# -*- coding: utf-8 -*-
# Generated by Django 1.10.2 on 2017-01-24 06:22
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('starter', '0010_task_events'),
    ]

    operations = [
        migrations.CreateModel(
            name='EventTags',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('event', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='_tags', to='starter.Event')),
                ('tag', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='_events', to='starter.Tag')),
            ],
            options={
                'db_table': 'starter_event_tags',
            },
        ),
        migrations.CreateModel(
            name='TaskEvents',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('event', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='_tasks', to='starter.Event')),
                ('task', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='_events', to='starter.Task')),
            ],
            options={
                'db_table': 'starter_task_events',
            },
        ),
        migrations.CreateModel(
            name='TaskTags',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tag', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='_tasks', to='starter.Tag')),
                ('task', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='_tags', to='starter.Task')),
            ],
            options={
                'db_table': 'starter_task_tags',
            },
        ),
    ]