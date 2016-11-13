import json
import urllib

from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.shortcuts import render
from django.views.decorators.http import require_http_methods

from starter.models import Task
from starter.utils import user_to_dict

#
# Views
#


@login_required(login_url=u'/auth/login')
@require_http_methods(["GET"])
def index(request):
    props = json.dumps(dict(
        meUser=user_to_dict(request.user),
        tasks=[task.to_dict() for task in Task.get_by_owner_id(request.user.id)],
    ))
    return render(request, 'starter/index.html', dict(props=props))


#
# API v1
#

class ValidationError(Exception):
    pass


def _validate(args, validation_map):
    args = {arg.decode(): values[0].decode() for arg, values in args.items()}
    if set(validation_map.keys()) != set(args.keys()):
        a = set(args.keys())
        b = set(validation_map.keys())
        raise ValidationError((a | b) - (a & b))

    # Check each argument
    converted_args = {}
    for arg, func in validation_map.items():
        supplied_arg = args[arg]
        try:
            converted_arg = func(supplied_arg)
        except Exception:
            raise ValidationError("Bad argument: {}: {}".format(arg, supplied_arg))
        converted_args[arg] = converted_arg
    return converted_args


@login_required(login_url=u'/auth/login')
@require_http_methods(["POST"])
def create_task(request):
    arguments = urllib.parse.parse_qs(request.body)
    validation_map = {
        'title': str,
        'description': str,
        'priority': lambda x: Task.Priority(int(x)),
        'state': lambda x: Task.State(int(x)),
        'authorId': lambda user_id: User.objects.get(id=int(user_id)),
        'ownerId': lambda user_id: User.objects.get(id=int(user_id)),
    }

    try:
        arguments = _validate(arguments, validation_map)
    except ValidationError as e:
        print(e)
        return HttpResponse(str(e.args).encode(), status=400, )

    # Business logic checks
    if arguments["authorId"] != request.user:
        return HttpResponse("Logged in user not the author".encode(), status=400)

    # TODO: tags!
    task = Task.objects.create(
        title=arguments["title"],
        description=arguments["description"],
        priority=arguments["priority"].value,
        state=arguments["state"].value,
        author=arguments["authorId"],
        owner=arguments["ownerId"],
    )
    task.create_local_id(arguments["authorId"])

    return HttpResponse(json.dumps(task.to_dict()), status=200)


@login_required(login_url=u'/auth/login')
@require_http_methods(["POST"])
def update_task(request):
    arguments = urllib.parse.parse_qs(request.body)
    validation_map = {
        'id': int,
        'title': str,
        'description': str,
        'priority': lambda x: Task.Priority(int(x)),
        'state': lambda x: Task.State(int(x)),
        'authorId': lambda user_id: User.objects.get(id=int(user_id)),
        'ownerId': lambda user_id: User.objects.get(id=int(user_id)),
    }

    try:
        arguments = _validate(arguments, validation_map)
    except ValidationError as e:
        print(e)
        return HttpResponse(str(e.args).encode(), status=400)

    # Business logic checks
    if request.user not in [arguments["authorId"], arguments["ownerId"]]:
        return HttpResponse("Must edit as owner or author".encode(), status=400)

    task = Task.get_by_local_id(arguments["id"], request.user)
    if not task or task.author != arguments["authorId"]:
        return HttpResponse("Invalid task specified.".encode(), status=400)

    # Copy in all the mutable fields
    task.title = arguments["title"]
    task.description = arguments["description"]
    task.priority = arguments["priority"].value
    task.state = arguments["state"].value
    task.owner = arguments["ownerId"]
    task.save()

    return HttpResponse(json.dumps(task.to_dict()), status=200)


@login_required(login_url=u'/auth/login')
@require_http_methods(["POST"])
def delete_task(request):
    arguments = urllib.parse.parse_qs(request.body)
    validation_map = {
        'id': int,
    }
    try:
        arguments = _validate(arguments, validation_map)
    except ValidationError as e:
        print(e)
        return HttpResponse(str(e.args).encode(), status=400)

    # Business logic checks
    task = Task.get_by_local_id(arguments["id"], request.user)
    if not task or task.author != request.user:
        return HttpResponse("Invalid task specified".encode(), status=400)

    task.delete()
    return HttpResponse(json.dumps(dict(id=arguments["id"])), status=200)
