export class User {
    readonly id: number;
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly username: string;
}

export class Task {
    [k: string]: any // Needed because of some hacky reflection in edit_task.

    readonly id: number;
    title: string;
    description: string;
    readonly authorId: number;
    ownerId: number;
    tagIds: Array<number>;
    priority: number;
    state: number;
    eventIds: Array<number>;
    expectedDurationSecs: number;
    dueTime: number;
}

export interface TasksById {[taskId: number]: Task}

export const priorityNameList = [
    ["Unknown",   0],
    ["Highest", 500],
    ["High",    400],
    ["Normal",  300],
    ["Low",     200],
    ["Lowest",  100],
];

export const stateNameList = [
    ["Open", 0], ["In Progress", 500],
    ["Blocked", 750], ["Closed", 1000]
];

export class Event {
    [k: string]: any // Needed because of some hacky reflection in edit_event.

    readonly id: number;
    name: string;
    readonly authorId: number;
    ownerId: number;
    tagIds: Array<number>;
    // timestamp in milliseconds
    startTime: number;
    durationSecs: number;
    taskIds: Array<number>;
}

export interface EventsById {[eventId: number]: Event}

export class Tag {
    readonly id: number;
    name: string;
    readonly ownerId: number;
    childTagIds: Array<number>;
}

export interface TagsById {[tagId: number]: Tag}

export class Note {
    readonly id: number;
    title: string;
    content: string;
    creationTime: number;
    readonly authorId: number;
    tagIds: Array<number>;
}

export interface NotesById{[noteId: number]: Note}
