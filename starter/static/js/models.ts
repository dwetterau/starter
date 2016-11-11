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
    tags: Array<Tag>;
    priority: number;
    state: number;
}

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

export class Tag {
    readonly id: number;
    name: string;
}

export class TagGroup {
    readonly  id: number;
    name: string;
    tags: Array<Tag>
}