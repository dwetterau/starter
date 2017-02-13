
import {TagsById} from "../../models";
export function debounce(func, window) {
    // Executes the given function at most once per window milliseconds, on the first call.

    let timeout: number = null;
    return function() {
        let context = this;
        let args = arguments;
        let later = function () {
            timeout = null;
        };
        let callNow = !timeout;
        if (!timeout) {
            timeout = setTimeout(later, window);
        }
        if (callNow) {
            func.apply(context, args)
        }
    }
}

export function renderDuration(seconds: number): string {
    // Given a time in seconds, returns a string in english that describes the duration
    let final = '';
    if (seconds >= 24 * 60 * 60) {
        let numDays  = Math.floor(seconds / (24 * 60 * 60));
        final += `${numDays} day`;
        if (numDays != 1) {
            final += "s"
        }
        seconds -= (numDays * (24 * 60 * 60))
    }
    if (seconds >= 60 * 60) {
        if (final.length) {
            final += ", "
        }
        let numHours = Math.floor(seconds / (60 * 60));
        final += `${numHours} hour`;
        if (numHours != 1) {
            final += "s"
        }
        seconds -= (numHours * (60 * 60))
    }
    if (seconds >= 60) {
        if (final.length) {
            final += ", "
        }
        let numMinutes = Math.floor(seconds / 60);
        final += `${numMinutes} minute`;
        if (numMinutes != 1) {
            final += "s"
        }
        seconds -= (numMinutes * 60)
    }
    if (seconds > 0) {
        if (final.length) {
            final += ", "
        }
        final += `${seconds} second`;
        if (seconds != 1) {
            final += "s"
        }
    }
    if (!final.length) {
        // The 0 case
        return "None"
    }

    return final
}

// TODO: Put this in a tag model class
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
