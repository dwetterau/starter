import json

from django.contrib.auth.decorators import login_required
from django.shortcuts import render

from starter.models import Task
from starter.utils import user_to_dict


@login_required(login_url=u'/auth/login')
def index(request):
    props = json.dumps(dict(
        user=user_to_dict(request.user),
        tasks=[task.to_dict() for task in Task.get_by_owner_id(request.user)],
    ))
    return render(request, 'starter/index.html', dict(props=props))
