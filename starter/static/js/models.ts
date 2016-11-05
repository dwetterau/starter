export class User {
    readonly id: number;
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly username: string;
}

export class Task {
    readonly id: number;
    title: string;
    description: string;
    readonly authorId: number;
    ownerId: number;
    tags: Array<Tag>;
    priority: string;
    state: string;
}

export class Tag {
    readonly id: number;
    name: string;
}

export class TagGroup {
    readonly  id: number;
    name: string;
    tags: Array<Tag>
}