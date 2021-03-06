# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2017-08-01 06:14
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('starter', '0012_task_expected_duration_secs'),
    ]

    operations = [
        migrations.CreateModel(
            name='Note',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=128, verbose_name='Title of note')),
                ('content', models.TextField(max_length=65536, verbose_name='Content of the note')),
                ('creation_time', models.DateTimeField(verbose_name='Creation time of the note')),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='authored_notes', to=settings.AUTH_USER_MODEL, verbose_name='Original author of the note')),
            ],
        ),
        migrations.CreateModel(
            name='NoteGlobalId',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('local_id', models.IntegerField(db_index=True)),
                ('note', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='note_user', to='starter.Note')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_notes', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='NoteTags',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('note', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='starter.Note')),
                ('tag', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='starter.Tag')),
            ],
        ),
        migrations.AddField(
            model_name='note',
            name='tags',
            field=models.ManyToManyField(through='starter.NoteTags', to='starter.Tag', verbose_name='The tags for the note'),
        ),
    ]
