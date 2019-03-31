import * as jQuery from "jquery";
import {
    Capture,
    CapturesById,
    Event, EventsById,
    Note,
    NotesById,
    Tag,
    TagsById,
    Task,
    TasksById
} from "./models";

export class API {

    static getTasksById(tasks: Array<Task>): TasksById {
        const tasksById: TasksById = {};
        for (let task of tasks) {
            tasksById[task.id] = task;
        }
        return tasksById;
    }

    static createTask(task: Task, updateFunc: (task: Task) => void) {
        let requestedTask = {
            title: task.title,
            description: task.description,
            authorId: task.authorId,
            ownerId: task.ownerId,
            tagIds: task.tagIds,
            priority: task.priority,
            state: task.state,
            eventIds: task.eventIds,
            expectedDurationSecs: task.expectedDurationSecs,
            dueTime: task.dueTime,
            stateUpdatedTime: task.stateUpdatedTime,
        };
        return jQuery.post('/api/1/task/create', requestedTask, (newTaskJson: string) => {
            updateFunc(JSON.parse(newTaskJson));
        });
    }

    static updateTask(task: Task, updateFunc: (task: Task) => void) {
        let updatedTask = {
            id: task.id,
            title: task.title,
            description: task.description,
            authorId: task.authorId,
            ownerId: task.ownerId,
            tagIds: task.tagIds,
            priority: task.priority,
            state: task.state,
            expectedDurationSecs: task.expectedDurationSecs,
            dueTime: task.dueTime,
            stateUpdatedTime: task.stateUpdatedTime,
        };
        return jQuery.post('/api/1/task/update', updatedTask, (updatedTaskJson: string) => {
            updateFunc(JSON.parse(updatedTaskJson));
        });
    }

    static deleteTask(task: Task, updateFunc: (task: Task) => void) {
        return jQuery.post('/api/1/task/delete', {id: task.id}, (deletedTaskJson: string) => {
            if (JSON.parse(deletedTaskJson).id != task.id) {
                throw Error("Deleted wrong task?")
            }
            updateFunc(task);
        });
    }

    static getTasksAfterEventChange(tasks: Array<Task>, changedEvent: Event, isDelete: boolean): Array<Task> {
        // When an event is updated, we need to make sure that all the associated tasks are also
        // updated
        let oldTaskMap = {};
        for (let task of tasks) {
            for (let eventId of task.eventIds) {
                if (eventId == changedEvent.id) {
                    oldTaskMap[task.id] = true;
                }
            }
        }

        let newTaskMap = {};
        let tasksToUpdate = [];
        let tasksById = API.getTasksById(tasks);
        for (let taskId of changedEvent.taskIds) {
            // Only add the task to the newTask map if this isn't a delete.
            // All delete cases are handled in the next loop over oldTaskMap.
            if (!isDelete) {
                newTaskMap[taskId] = true;

                if (!oldTaskMap[taskId]) {
                    // This task just got added to this event. Add the eventId to the task
                    let newTask = tasksById[taskId];
                    newTask.eventIds.push(changedEvent.id);
                    tasksToUpdate.push(newTask);
                }
            }
        }

        for (let taskId in oldTaskMap) {
            if (!newTaskMap[taskId]) {
                // This tag no longer has this event, update it's list of events
                let newTask = tasksById[taskId];
                newTask.eventIds = newTask.eventIds.filter((eventId) => {
                        return eventId != changedEvent.id
                });
                tasksToUpdate.push(newTask);
            }
        }
        return tasksToUpdate;
    }

    static getEventsById(events: Array<Event>): EventsById {
        const eventsById: EventsById = {};
        for (let event of events) {
            eventsById[event.id] = event;
        }
        return eventsById;
    }

    static createEvent(event: Event, updateFunc: (event: Event) => void) {
        let requestedEvent = {
            name: event.name,
            authorId: event.authorId,
            ownerId: event.ownerId,
            tagIds: event.tagIds,
            startTime: event.startTime,
            durationSecs: event.durationSecs,
            taskIds: event.taskIds,
        };
        return jQuery.post('/api/1/event/create', requestedEvent, (newEventJson: string) => {
            updateFunc(JSON.parse(newEventJson));
        });
    }

    static updateEvent(event: Event, updateFunc: (event: Event) => void) {
        return jQuery.post('/api/1/event/update', event, (updatedEventJson: string) => {
            updateFunc(JSON.parse(updatedEventJson));
        });
    }

    static deleteEvent(event: Event, updateFunc: (event: Event) => void) {
        return jQuery.post('/api/1/event/delete', {id: event.id}, (deletedEventJson: string) => {
            if (JSON.parse(deletedEventJson).id != event.id) {
                throw Error("Deleted wrong event?")
            }
            updateFunc(event);
        });
    }

    static getTagsById(tags: Array<Tag>): TagsById {
        const tagsById: TagsById = {};
        for (let tag of tags) {
            tagsById[tag.id] = tag;
        }
        return tagsById;
    }

    static createTag(tag: Tag, updateFunc: (tag: Tag) => void) {
        let requestedTag = {
            name: tag.name,
            ownerId: tag.ownerId,
            childTagIds: tag.childTagIds,
            color: tag.color,
        };
        return jQuery.post('/api/1/tag/create', requestedTag, (newTagJson: string) => {
            updateFunc(JSON.parse(newTagJson));
        });
    }

    static updateTag(tag: Tag, updateFunc: (tag: Tag) => void) {
        return jQuery.post('/api/1/tag/update', tag, (updatedTagJson: string) => {
            updateFunc(JSON.parse(updatedTagJson));
        });
    }

    static getNotesById(notes: Array<Note>): NotesById {
        const notesById: NotesById = {};
        for (let note of notes) {
            notesById[note.id] = note;
        }
        return notesById;
    }

    static createNote(note: Note, updateFunc: (note: Note) => void) {
        let requestedNote = {
            title: note.title,
            content: note.content,
            creationTime: note.creationTime,
            authorId: note.authorId,
            tagIds: note.tagIds,
        };
        return jQuery.post('/api/1/note/create', requestedNote, (newNoteJson: string) => {
            updateFunc(JSON.parse(newNoteJson));
        });
    }

    static updateNote(note: Note, updateFunc: (note: Note) => void) {
        return jQuery.post('/api/1/note/update', note, (updatedNoteJson: string) => {
            updateFunc(JSON.parse(updatedNoteJson));
        });
    }

    static deleteNote(note: Note, updateFunc: (note: Note) => void) {
        return jQuery.post('/api/1/note/delete', {id: note.id}, (deletedNoteJson: string) => {
            if (JSON.parse(deletedNoteJson).id != note.id) {
                throw Error("Deleted wrong note?")
            }
            updateFunc(note);
        });
    }

    static getCapturesById(captures: Array<Capture>): CapturesById {
        const capturesById: CapturesById = {};
        for (let capture of captures) {
            capturesById[capture.id] = capture;
        }
        return capturesById;
    }

    static createCapture(capture: Capture, updateFunc: (capture: Capture) => void) {
        const requestedCapture = {
            content: capture.content,
            creationTime: capture.creationTime,
            authorId: capture.authorId,
        };
        return jQuery.post('/api/1/capture/create', requestedCapture, (newCaptureJson: string) => {
            updateFunc(JSON.parse(newCaptureJson));
        });
    }

    static deleteCapture(capture: Capture, updateFunc: (capture: Capture) => void) {
        return jQuery.post('/api/1/capture/delete', {id: capture.id}, (deletedCaptureJson: string) => {
            if (JSON.parse(deletedCaptureJson).id != capture.id) {
                throw Error("Deleted wrong capture?")
            }
            updateFunc(capture);
        });
    }
}

