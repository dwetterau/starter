import datetime
import json
import re

from collections import defaultdict
from urllib.parse import parse_qsl
from typing import Any, Callable, Dict, List, Set, Tuple

from django.contrib.auth import views as auth_views
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import HttpRequest, HttpResponse
from django.shortcuts import render
from django.views.decorators.http import require_http_methods

from starter.models import (
    Event,
    LocalTaskId,
    Tag,
    TagId,
    TagEdge,
    Task,
    UserId,
    Note)
from starter.utils import user_to_dict

#
# Views
#


@login_required(login_url=u'/auth/login')
@require_http_methods(["GET"])
def index(request: HttpRequest) -> HttpResponse:
    props = json.dumps(dict(
        meUser=user_to_dict(request.user),
        tasks=[task.to_dict() for task in Task.get_by_owner_id(request.user.id)],
        events=[event.to_dict() for event in Event.get_by_owner_id(request.user.id)],
        tags=[tag.to_dict() for tag in Tag.get_all_owned_tags(request.user)],
        notes=[note.to_dict() for note in Note.get_by_author_id(request.user.id)],
    ))
    return render(request, 'starter/index.html', dict(props=props))

#
# Views for auth
#


@require_http_methods(["GET"])
def logout(request: HttpRequest) -> HttpResponse:
    return auth_views.logout(request, next_page=u"/")

#
# API v1
#


class ValidationError(Exception):
    pass


def parse(body: Any) -> List[Tuple[str, str]]:
    args = parse_qsl(body, keep_blank_values=True)
    return [(arg.decode(), val.decode()) for arg, val in args]


def _validate(
        args: List[Tuple[str, str]],
        validation_map: Dict[str, Callable[[str], Any]]
) -> List[Tuple[str, Any]]:
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


def _required_string(x: str) -> str:
    x = str(x)
    assert len(x) > 0
    return x


def _nonnegative_number(x: str) -> int:
    num = int(x)
    assert num >= 0
    return num


def _timestamp_millis(x: str) -> datetime.datetime:
    return datetime.datetime.utcfromtimestamp(int(x) / 1000.0)


@login_required(login_url=u'/auth/login')
@require_http_methods(["POST"])
def create_task(request: HttpRequest) -> HttpResponse:
    validation_map = {
        'title': _required_string,
        'description': lambda x: str(x),
        'priority': lambda x: Task.Priority(int(x)),
        'state': lambda x: Task.State(int(x)),
        'expectedDurationSecs': _nonnegative_number,
        'tagIds[]': lambda x: Tag.objects.get(id=int(x)),
        'authorId': lambda user_id: User.objects.get(id=int(user_id)),
        'ownerId': lambda user_id: User.objects.get(id=int(user_id)),
        'dueTime': _timestamp_millis,
    }  # type: Dict[str, Callable[[str], Any]]

    try:
        arguments = _validate(parse(request.body), validation_map)
    except ValidationError as e:
        print(e)
        return HttpResponse(str(e.args).encode(), status=400, )

    # Combine new tags:
    new_tags_by_id = {tag.id: tag for arg, tag in arguments if arg == "tagIds[]"}

    # Now it's safe to squash all the arguments together into a dict
    args_to_objects = dict(arguments)

    # Business logic checks
    if args_to_objects["authorId"] != request.user:
        return HttpResponse("Logged in user not the author".encode(), status=400)

    if any(tag.owner_id != request.user.id for tag in new_tags_by_id.values()):
        return HttpResponse("Tag not found".encode(), status=400)

    task = Task.objects.create(
        title=args_to_objects["title"],
        description=args_to_objects["description"],
        priority=args_to_objects["priority"].value,
        state=args_to_objects["state"].value,
        author=args_to_objects["authorId"],
        owner=args_to_objects["ownerId"],
        expected_duration_secs=args_to_objects["expectedDurationSecs"],
        due_time=args_to_objects["dueTime"],
    )
    task.create_local_id(args_to_objects["authorId"])
    if new_tags_by_id:
        task.set_tags(new_tags_by_id.values())

    return HttpResponse(json.dumps(task.to_dict()), status=200)


@login_required(login_url=u'/auth/login')
@require_http_methods(["POST"])
def update_task(request: HttpRequest) -> HttpResponse:
    validation_map = {
        'id': lambda x: int(x),
        'title': _required_string,
        'description': lambda x: str(x),
        'priority': lambda x: Task.Priority(int(x)),
        'state': lambda x: Task.State(int(x)),
        'expectedDurationSecs': _nonnegative_number,
        'tagIds[]': lambda x: Tag.objects.get(id=int(x)),
        'authorId': lambda user_id: User.objects.get(id=int(user_id)),
        'ownerId': lambda user_id: User.objects.get(id=int(user_id)),
        'dueTime': _timestamp_millis,
    }  # type: Dict[str, Callable[[str], Any]]

    try:
        arguments = _validate(parse(request.body), validation_map)
    except ValidationError as e:
        print(e)
        return HttpResponse(str(e.args).encode(), status=400)

    # Combine new tags:
    new_tags_by_id = {
        tag.id: tag for arg, tag in arguments if arg == "tagIds[]"
    }  # type: Dict[TagId, Tag]

    # Now it's safe to squash all the arguments together into a dict
    args_to_objects = dict(arguments)

    # Business logic checks
    if request.user not in [args_to_objects["authorId"], args_to_objects["ownerId"]]:
        return HttpResponse("Must edit as owner or author".encode(), status=400)

    task = Task.get_by_local_id(args_to_objects["id"], request.user)
    if not task or task.author != args_to_objects["authorId"]:
        return HttpResponse("Invalid task specified.".encode(), status=400)

    if any(tag.owner_id != request.user.id for tag in new_tags_by_id.values()):
        return HttpResponse("Tag not found".encode(), status=400)

    # Copy in all the mutable fields
    task.title = args_to_objects["title"]
    task.description = args_to_objects["description"]
    task.priority = args_to_objects["priority"].value
    task.state = args_to_objects["state"].value
    task.owner = args_to_objects["ownerId"]
    task.expected_duration_secs = args_to_objects["expectedDurationSecs"]
    task.due_time = args_to_objects["dueTime"]
    task.save()

    if set(new_tags_by_id.keys()) != set(task.get_tag_ids()):
        task.set_tags(new_tags_by_id.values())

    return HttpResponse(json.dumps(task.to_dict()), status=200)


@login_required(login_url=u'/auth/login')
@require_http_methods(["POST"])
def delete_task(request: HttpRequest) -> HttpResponse:
    validation_map = {
        'id': lambda x: int(x),
    }  # type: Dict[str, Callable[[str], Any]]
    try:
        arguments = dict(_validate(parse(request.body), validation_map))
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
def create_event(request: HttpRequest) -> HttpResponse:
    validation_map = {
        'name': _required_string,
        'startTime': _timestamp_millis,
        'durationSecs': _nonnegative_number,
        'tagIds[]': lambda x: Tag.objects.get(id=TagId(int(x))),
        'authorId': lambda user_id: User.objects.get(id=UserId(int(user_id))),
        'ownerId': lambda user_id: User.objects.get(id=UserId(int(user_id))),
        'taskIds[]': lambda x: Task.get_by_local_id(LocalTaskId(int(x)), request.user),
    }  # type: Dict[str, Callable[[str], Any]]

    try:
        arguments = _validate(parse(request.body), validation_map)
    except ValidationError as e:
        print(e)
        return HttpResponse(str(e.args).encode(), status=400, )

    # Combine new tags:
    new_tags_by_id = {tag.id: tag for arg, tag in arguments if arg == "tagIds[]"}

    # Combine new tasks:
    new_tasks_by_id = {task.id: task for arg, task in arguments if arg == "taskIds[]"}

    # Now it's safe to squash all the arguments together into a dict
    args_to_objects = dict(arguments)

    # Business logic checks
    if args_to_objects["authorId"] != request.user:
        return HttpResponse("Logged in user not the author".encode(), status=400)

    if any(tag.owner_id != request.user.id for tag in new_tags_by_id.values()):
        return HttpResponse("Tag not found".encode(), status=400)

    if any(task.owner_id != request.user.id for task in new_tasks_by_id.values()):
        return HttpResponse("Task not found".encode(), status=400)

    event = Event.objects.create(
        name=args_to_objects["name"],
        start_time=args_to_objects["startTime"],
        duration_secs=args_to_objects["durationSecs"],
        author=args_to_objects["authorId"],
        owner=args_to_objects["ownerId"],
    )
    event.create_local_id(args_to_objects["authorId"])
    if new_tags_by_id:
        event.set_tags(new_tags_by_id.values())

    if new_tasks_by_id:
        event.set_tasks(args_to_objects["authorId"], new_tasks_by_id.values())

    return HttpResponse(json.dumps(event.to_dict()), status=200)


@login_required(login_url=u'/auth/login')
@require_http_methods(["POST"])
def update_event(request: HttpRequest) -> HttpResponse:
    validation_map = {
        'id': int,
        'name': _required_string,
        'startTime': _timestamp_millis,
        'durationSecs': _nonnegative_number,
        'tagIds[]': lambda x: Tag.objects.get(id=int(x)),
        'authorId': lambda user_id: User.objects.get(id=int(user_id)),
        'ownerId': lambda user_id: User.objects.get(id=int(user_id)),
        'taskIds[]': lambda x: Task.get_by_local_id(LocalTaskId(int(x)), request.user),
    }  # type: Dict[str, Callable[[str], Any]]

    try:
        arguments = _validate(parse(request.body), validation_map)
    except ValidationError as e:
        print(e)
        return HttpResponse(str(e.args).encode(), status=400)

    # Combine new tags:
    new_tags_by_id = {tag.id: tag for arg, tag in arguments if arg == "tagIds[]"}

    # Combine new tasks:
    new_tasks_by_id = {task.id: task for arg, task in arguments if arg == "taskIds[]"}

    # Now it's safe to squash all the args_to_objects together into a dict
    args_to_objects = dict(arguments)

    # Business logic checks
    if request.user not in [args_to_objects["authorId"], args_to_objects["ownerId"]]:
        return HttpResponse("Must edit as owner or author".encode(), status=400)

    event = Event.get_by_local_id(args_to_objects["id"], request.user)
    if not event or event.author != args_to_objects["authorId"]:
        return HttpResponse("Invalid event specified.".encode(), status=400)

    if any(tag.owner_id != request.user.id for tag in new_tags_by_id.values()):
        return HttpResponse("Tag not found".encode(), status=400)

    if any(task.owner_id != request.user.id for task in new_tasks_by_id.values()):
        return HttpResponse("Task not found".encode(), status=400)

    # Copy in all the mutable fields
    event.name = args_to_objects["name"]
    event.start_time = args_to_objects["startTime"]
    event.duration_secs = args_to_objects["durationSecs"]
    event.owner = args_to_objects["ownerId"]
    event.save()

    if set(new_tags_by_id.keys()) != set(event.get_tag_ids()):
        event.set_tags(new_tags_by_id.values())

    if set(new_tasks_by_id.keys()) != set(event.get_task_ids()):
        event.set_tasks(args_to_objects["ownerId"], new_tasks_by_id.values())

    return HttpResponse(json.dumps(event.to_dict()), status=200)


@login_required(login_url=u'/auth/login')
@require_http_methods(["POST"])
def delete_event(request: HttpRequest) -> HttpResponse:
    validation_map = {
        'id': lambda x: int(x),
    }  # type: Dict[str, Callable[[str], Any]]
    try:
        arguments = dict(_validate(parse(request.body), validation_map))
    except ValidationError as e:
        print(e)
        return HttpResponse(str(e.args).encode(), status=400)

    # Business logic checks
    event = Event.get_by_local_id(arguments["id"], request.user)
    if not event or event.author != request.user:
        return HttpResponse("Invalid event specified".encode(), status=400)

    event.delete_by_user(request.user)
    return HttpResponse(json.dumps(dict(id=arguments["id"])), status=200)


_tag_name_pattern = re.compile("^[a-zA-Z0-9_]+$")


def _valid_tag_name(x: str) -> str:
    x = _required_string(x)
    assert _tag_name_pattern.match(x)
    return x


@login_required(login_url=u'/auth/login')
@require_http_methods(["POST"])
def create_tag(request: HttpRequest) -> HttpResponse:
    validation_map = {
        'name': _valid_tag_name,
        'childTagIds[]': lambda x: Tag.objects.get(id=int(x)),
        'ownerId': lambda user_id: User.objects.get(id=int(user_id)),
    }  # type: Dict[str, Callable[[str], Any]]

    try:
        arguments = _validate(parse(request.body), validation_map)
    except ValidationError as e:
        print(e)
        return HttpResponse(str(e.args).encode(), status=400)

    # Combine child tags:
    child_tags_by_id = {tag.id: tag for arg, tag in arguments if arg == "childTagIds[]"}

    # Now it's safe to squash all the arguments together into a dict
    args_to_objects = dict(arguments)

    # Business logic
    if request.user != args_to_objects["ownerId"]:
        return HttpResponse("Must create as owner".encode(), status=400)

    # Note that creation can never create a cycle since we don't allow a parent to be specified.

    l_name = args_to_objects["name"].lower()
    for t in Tag.get_all_owned_tags(request.user):
        if t.name.lower() == l_name:
            return HttpResponse("Name must be unique".encode(), status=400)

    tag = Tag.objects.create(
        name=args_to_objects["name"],
        owner_id=request.user.id,
    )
    if child_tags_by_id:
        tag.set_children(child_tags_by_id.values())

    return HttpResponse(json.dumps(tag.to_dict()), status=200)


@login_required(login_url=u'/auth/login')
@require_http_methods(["POST"])
def update_tag(request: HttpRequest) -> HttpResponse:
    validation_map = {
        'id': int,
        'name': _valid_tag_name,
        'childTagIds[]': lambda x: Tag.objects.get(id=int(x)),
        'ownerId': lambda user_id: User.objects.get(id=int(user_id)),
    }  # type: Dict[str, Callable[[str], Any]]

    try:
        arguments = _validate(parse(request.body), validation_map)
    except ValidationError as e:
        print(e)
        return HttpResponse(str(e.args).encode(), status=400)

    # Combine child tags:
    child_tags_by_id = {tag.id: tag for arg, tag in arguments if arg == "childTagIds[]"}

    # Now it's safe to squash all the arguments together into a dict
    args_to_objects = dict(arguments)

    # Business logic checks
    tag = Tag.objects.get(id=args_to_objects["id"])
    if not tag:
        return HttpResponse("Tag not found".encode(), status=400)

    if request.user != args_to_objects["ownerId"]:
        return HttpResponse("Must edit as owner".encode(), status=400)

    if any(tag.owner_id != request.user.id for tag in child_tags_by_id.values()):
        return HttpResponse("Tag not found".encode(), status=400)

    all_tags_by_id = {t.id: t for t in Tag.get_all_owned_tags(request.user)}

    # Make sure this is a new name.
    l_name = args_to_objects["name"].lower()
    for t in all_tags_by_id.values():
        if t.name.lower() == l_name and t.id != tag.id:
            return HttpResponse("Name must be unique".encode(), status=400)

    all_edges = [(edge.parent_tag_id, edge.child_tag_id)
                 for edge in TagEdge.objects.filter(parent_tag_id__in=all_tags_by_id.keys())]

    # See if this would create a cycle:
    graph = defaultdict(set)  # type: Dict[TagId, Set[TagId]]
    for parent_id, child_id in all_edges:
        graph[parent_id].add(child_id)

    # Substitute in this modification:
    original_children_id_set = graph[tag.id]
    graph[tag.id] = set(child_tags_by_id.keys())

    # Detect cycles:
    not_seen = set(graph.keys())
    seen_set = set()  # type: Set[TagId]

    def dfs(tag_id: TagId) -> bool:
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
    tag.name = args_to_objects["name"]
    tag.save()

    if set(child_tags_by_id.keys()) != original_children_id_set:
        tag.set_children(child_tags_by_id.values())

    return HttpResponse(json.dumps(tag.to_dict()), status=200)


@login_required(login_url=u'/auth/login')
@require_http_methods(["POST"])
def create_note(request: HttpRequest) -> HttpResponse:
    validation_map = {
        'title': _required_string,
        'content': lambda x: str(x),
        'creationTime': _timestamp_millis,
        'tagIds[]': lambda x: Tag.objects.get(id=int(x)),
        'authorId': lambda user_id: User.objects.get(id=int(user_id)),
    }  # type: Dict[str, Callable[[str], Any]]

    try:
        arguments = _validate(parse(request.body), validation_map)
    except ValidationError as e:
        print(e)
        return HttpResponse(str(e.args).encode(), status=400, )

    # Combine new tags:
    new_tags_by_id = {tag.id: tag for arg, tag in arguments if arg == "tagIds[]"}

    # Now it's safe to squash all the arguments together into a dict
    args_to_objects = dict(arguments)

    # Business logic checks
    if args_to_objects["authorId"] != request.user:
        return HttpResponse("Logged in user not the author".encode(), status=400)

    if any(tag.owner_id != request.user.id for tag in new_tags_by_id.values()):
        return HttpResponse("Tag not found".encode(), status=400)

    note = Note.objects.create(
        title=args_to_objects["title"],
        content=args_to_objects["content"],
        author=args_to_objects["authorId"],
        creation_time=args_to_objects["creationTime"],
    )
    note.create_local_id(args_to_objects["authorId"])
    if new_tags_by_id:
        note.set_tags(new_tags_by_id.values())

    return HttpResponse(json.dumps(note.to_dict()), status=200)


@login_required(login_url=u'/auth/login')
@require_http_methods(["POST"])
def update_note(request: HttpRequest) -> HttpResponse:
    validation_map = {
        'id': int,
        'title': _required_string,
        'content': lambda x: str(x),
        'creationTime': _timestamp_millis,
        'tagIds[]': lambda x: Tag.objects.get(id=int(x)),
        'authorId': lambda user_id: User.objects.get(id=int(user_id)),
    }  # type: Dict[str, Callable[[str], Any]]

    try:
        arguments = _validate(parse(request.body), validation_map)
    except ValidationError as e:
        print(e)
        return HttpResponse(str(e.args).encode(), status=400)

    # Combine new tags:
    new_tags_by_id = {tag.id: tag for arg, tag in arguments if arg == "tagIds[]"}

    # Now it's safe to squash all the args_to_objects together into a dict
    args_to_objects = dict(arguments)

    # Business logic checks
    if request.user != args_to_objects["authorId"]:
        return HttpResponse("Must edit as owner or author".encode(), status=400)

    note = Note.get_by_local_id(args_to_objects["id"], request.user)
    if not note or note.author != args_to_objects["authorId"]:
        return HttpResponse("Invalid note specified.".encode(), status=400)

    if any(tag.owner_id != request.user.id for tag in new_tags_by_id.values()):
        return HttpResponse("Tag not found".encode(), status=400)

    # Copy in all the mutable fields
    note.title = args_to_objects["title"]
    note.content = args_to_objects["content"]
    note.creation_time = args_to_objects["creationTime"]
    note.save()

    if set(new_tags_by_id.keys()) != set(note.get_tag_ids()):
        note.set_tags(new_tags_by_id.values())

    return HttpResponse(json.dumps(note.to_dict()), status=200)


@login_required(login_url=u'/auth/login')
@require_http_methods(["POST"])
def delete_note(request: HttpRequest) -> HttpResponse:
    validation_map = {
        'id': lambda x: int(x),
    }  # type: Dict[str, Callable[[str], Any]]
    try:
        arguments = dict(_validate(parse(request.body), validation_map))
    except ValidationError as e:
        print(e)
        return HttpResponse(str(e.args).encode(), status=400)

    # Business logic checks
    note = Note.get_by_local_id(arguments["id"], request.user)
    if not note or note.author != request.user:
        return HttpResponse("Invalid note specified".encode(), status=400)

    note.delete_by_user(request.user)
    return HttpResponse(json.dumps(dict(id=arguments["id"])), status=200)
