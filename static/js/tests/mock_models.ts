import {User, Event} from "../models";

export function mockUser(): User {
   return {
       id: 1,
       firstName: "David",
       lastName: "Wetterau",
       email: "david@email.com",
       username: "david",
   }
}

export class mockEventFactory {
    id: number;

    constructor() {
        this.id = 0;
    }

    makeEvent(startTimeMillis: number, durationSecs: number): Event {
        this.id++;
        return {
            id: this.id,
            name: `Event with id=${this.id}`,
            authorId: 1,
            ownerId: 1,
            tagIds: [],
            startTime: startTimeMillis,
            durationSecs: durationSecs,
            taskIds: [],
        }
    }
}


