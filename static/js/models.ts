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
    stateUpdatedTime: number;
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
    ["Open", 0],
    ["In Progress", 500],
    ["Blocked", 750],
    ["Project", 900],
    ["Closed", 1000],
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

    static clone(e: Event): Event {
        return {
            id: e.id,
            name: e.name,
            authorId: e.authorId,
            ownerId: e.ownerId,
            tagIds: e.tagIds.slice(0),
            startTime: e.startTime,
            durationSecs: e.durationSecs,
            taskIds: e.taskIds.slice(0),
        }
    }
}

export interface EventsById {[eventId: number]: Event}

export const ROOT_TAG_ID = 0;

export class Tag {
    readonly id: number;
    name: string;
    readonly ownerId: number;
    color: string;
    childTagIds: Array<number>;
}

export interface TagsById {[tagId: number]: Tag}

export function getRootTag(userID, allTags: Array<Tag>): Tag {
    let tagsById = {};
    for (let tag of allTags) {
        tagsById[tag.id] = tag
    }
    return {
        id: ROOT_TAG_ID,
        name: "Root",
        ownerId: userID,
        color: "",
        childTagIds: getTopmostTags(tagsById),
    }
}

export function getTagAndDescendantsRecursive(tagId: number, tagsById: TagsById):
    {[tagId: number]: boolean}
{
    const tagDescendantSet: {[tagId: number]: boolean} = {};
    const queue: Array<number> = [tagId];
    while (queue.length) {
        const curTagId = queue.pop();
        tagDescendantSet[curTagId] = true;
        for (let tagId of tagsById[curTagId].childTagIds) {
            if (!tagDescendantSet[tagId]) {
                queue.push(tagId);
            }
        }
    }
    return tagDescendantSet;
}

export function getTagParentIds(tagId: number, tagsById: TagsById): Array<number> {
    const tagParentIds: Array<number> = [];
    for (let parentTagId of Object.keys(tagsById)) {
        let parentTag: Tag = tagsById[parentTagId];
        for (let childTagId of parentTag.childTagIds) {
            if (childTagId == tagId) {
                tagParentIds.push(parentTag.id);
                break
            }
        }
    }
    return tagParentIds
}

// Initially we think that all tags are root tags.
export function getTopmostTags(tagsById: TagsById): Array<number> {
    const rootTagIds: { [tagId: string]: boolean } = {};
    Object.keys(tagsById).forEach((tagId) => {
        if (tagId == ROOT_TAG_ID + "") {
            return
        }
        rootTagIds[tagId] = true;
    });
    Object.keys(tagsById).forEach((tagId) => {
        if (tagId == ROOT_TAG_ID + "") {
            return
        }
        const tag = tagsById[+tagId];
        for (let childTagId of tag.childTagIds) {
            if (rootTagIds.hasOwnProperty("" + childTagId)) {
                delete rootTagIds[childTagId]
            }
        }
    });

    const rootTagIdList: Array<number> = [];
    Object.keys(rootTagIds).forEach((rootTagId) => {
        rootTagIdList.push(+rootTagId)
    });
    return rootTagIdList;
}

export class Note {
    readonly id: number;
    title: string;
    content: string;
    creationTime: number;
    readonly authorId: number;
    tagIds: Array<number>;
}

export interface NotesById{[noteId: number]: Note}

export class Capture {
    readonly id: number;
    content: string;
    creationTime: number;
    readonly authorId: number;
}

export interface CapturesById{[captureId: number]: Capture}
