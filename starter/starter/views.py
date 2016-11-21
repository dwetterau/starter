from collections import defaultdict
import json
import urllib

from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.shortcuts import render
from django.views.decorators.http import require_http_methods

from starter.models import Tag, Task, TagEdge
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
        tags=[tag.to_dict() for tag in Tag.get_all_owned_tags(request.user)],
    ))
    return render(request, 'starter/index.html', dict(props=props))


#
# API v1
#

class ValidationError(Exception):
    pass


def _validate(args, validation_map):
    args = [(arg.decode(), values.decode()) for arg, values in args]
    if set(validation_map.keys()) != {k for k, v in args}:
        a = {k for k, v in args}
        b = set(validation_map.keys())
        missing_keys = (a | b) - (a & b)

        # We want to allow empty array inputs
        if not all(x.endswith("[]") for x in missing_keys):
            raise ValidationError(missing_keys)

    # Check each argument
    converted_args = []
    for arg, supplied_arg in args:
        func = validation_map[arg]
        try:
            converted_arg = func(supplied_arg)
        except Exception:
            raise ValidationError("Bad argument: {}: {}".format(arg, supplied_arg))
        converted_args.append((arg, converted_arg))
    return converted_args


@login_required(login_url=u'/auth/login')
@require_http_methods(["POST"])
def create_task(request):
    arguments = urllib.parse.parse_qsl(request.body)
    validation_map = {
        'title': str,
        'description': str,
        'priority': lambda x: Task.Priority(int(x)),
        'state': lambda x: Task.State(int(x)),
        'authorId': lambda user_id: User.objects.get(id=int(user_id)),
        'ownerId': lambda user_id: User.objects.get(id=int(user_id)),
    }

    try:
        arguments = dict(_validate(arguments, validation_map))
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
    arguments = urllib.parse.parse_qsl(request.body)
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
        arguments = dict(_validate(arguments, validation_map))
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
    arguments = urllib.parse.parse_qsl(request.body)
    validation_map = {
        'id': int,
    }
    try:
        arguments = dict(_validate(arguments, validation_map))
    except ValidationError as e:
        print(e)
        return HttpResponse(str(e.args).encode(), status=400)

    # Business logic checks
    task = Task.get_by_local_id(arguments["id"], request.user)
    if not task or task.author != request.user:
        return HttpResponse("Invalid task specified".encode(), status=400)

    task.delete()
    return HttpResponse(json.dumps(dict(id=arguments["id"])), status=200)


@login_required(login_url=u'/auth/login')
@require_http_methods(["POST"])
def create_tag(request):
    arguments = urllib.parse.parse_qsl(request.body)
    validation_map = {
        'name': str,
        'childTagIds[]': lambda x: Tag.objects.filter(id__in=x).all(),
        'ownerId': lambda user_id: User.objects.get(id=int(user_id)),
    }

    try:
        arguments = _validate(arguments, validation_map)
    except ValidationError as e:
        print(e)
        return HttpResponse(str(e.args).encode(), status=400)

    # Combine child tags:
    child_tags_by_id = {tags[0].id: tags[0] for arg, tags in arguments if arg == "childTagIds[]"}

    # Now it's safe to squash all the arguments together into a dict
    arguments = dict(arguments)

    # Business logic
    if request.user != arguments["ownerId"]:
        return HttpResponse("Must create as owner".encode(), status=400)

    # Note that creation can never create a cycle since we don't allow a parent to be specified.

    l_name = arguments["name"].lower()
    for t in Tag.get_all_owned_tags(request.user):
        if t.name.lower() == l_name:
            return HttpResponse("Name must be unique".encode(), status=400)

    tag = Tag.objects.create(
        name=arguments["name"],
        owner_id=request.user.id,
    )
    if child_tags_by_id:
        tag.set_children(child_tags_by_id.values())

    return HttpResponse(json.dumps(tag.to_dict()), status=200)


@login_required(login_url=u'/auth/login')
@require_http_methods(["POST"])
def update_tag(request):
    arguments = urllib.parse.parse_qsl(request.body)
    validation_map = {
        'id': int,
        'name': str,
        'childTagIds[]': lambda x: Tag.objects.filter(id__in=x).all(),
        'ownerId': lambda user_id: User.objects.get(id=int(user_id)),
    }

    try:
        arguments = _validate(arguments, validation_map)
    except ValidationError as e:
        print(e)
        return HttpResponse(str(e.args).encode(), status=400)

    # Combine child tags:
    child_tags_by_id = {tags[0].id: tags[0] for arg, tags in arguments if arg == "childTagIds[]"}

    # Now it's safe to squash all the arguments together into a dict
    arguments = dict(arguments)

    # Business logic checks
    tag = Tag.objects.get(id=arguments["id"])
    if not tag:
        return HttpResponse("Tag not found".encode(), status=400)

    if request.user != arguments["ownerId"]:
        return HttpResponse("Must edit as owner".encode(), status=400)

    all_tags_by_id = {t.id: t for t in Tag.get_all_owned_tags(request.user)}

    # Make sure this is a new name.
    l_name = arguments["name"].lower()
    for t in all_tags_by_id.values():
        if t.name.lower() == l_name and t.id != tag.id:
            return HttpResponse("Name must be unique".encode(), status=400)

    all_edges = [(edge.parent_tag_id, edge.child_tag_id)
                 for edge in TagEdge.objects.filter(parent_tag_id__in=all_tags_by_id.keys())]

    # See if this would create a cycle:
    graph = defaultdict(set)
    for parent_id, child_id in all_edges:
        graph[parent_id].add(child_id)

    # Substitute in this modification:
    original_children_id_set = graph[tag.id]
    graph[tag.id] = set(child_tags_by_id.keys())

    # Detect cycles:
    not_seen = set(graph.keys())
    seen_set = set()

    def dfs(tag_id: Tag):
        not_seen.discard(tag_id)
        if tag_id in seen_set:
            return True
        else:
            seen_set.add(tag_id)
            if not graph[tag_id]:
                any_children = False
            else:
                any_children = any(dfs(child) for child in graph[tag_id])
            seen_set.remove(tag_id)
            return any_children

    while not_seen:
        root = not_seen.pop()
        seen_set = set()
        if dfs(root):
            return HttpResponse("Change would induce cycle in tag graph".encode(), status=400)

    # Copy in all the mutable fields
    tag.name = arguments["name"]
    tag.save()

    if set(child_tags_by_id.keys()) != original_children_id_set:
        tag.set_children(child_tags_by_id.values())

    return HttpResponse(json.dumps(tag.to_dict()), status=200)
