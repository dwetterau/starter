# -*- coding: utf-8 -*-
# Generated by Django 1.10.2 on 2017-01-23 05:33
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('starter', '0009_authtoken_stravaactivity'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='events',
            field=models.ManyToManyField(to='starter.Event', verbose_name='The events for this task'),
        ),
    ]
