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
    priority: string;
}
