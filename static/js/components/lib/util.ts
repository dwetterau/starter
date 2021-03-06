import {TagsById, Tag, ROOT_TAG_ID} from "../../models";

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

export function renderDuration(seconds: number, short: boolean, days: boolean): string {
    // Given a time in seconds, returns a string in english that describes the duration
    // If days is provided, we won't provide hour or less granularity to the returned duration.
    let final = '';
    let addUnit = (name: string, durationInSeconds: number, includeS: boolean) => {
        if (seconds < durationInSeconds) {
            return;
        }
        if (final.length) {
            final += ", "
        }
        let numUnits = Math.floor(seconds / durationInSeconds);
        final += `${numUnits} ${name}`;
        if (numUnits != 1 && includeS) {
            final += "s";
        }
        seconds -= (numUnits * durationInSeconds)
    };

    if (days) {
        addUnit(short ? "w": "week", 7 * 24 * 60 * 60, !short);
        addUnit(short ? "d": "day", 24 * 60 * 60, !short);
    } else {
        addUnit(short ? "hr" : "hour", 60 * 60, true);
        addUnit(short ? "min" : "minute", 60, true);
        if (!short) {
            addUnit("second", 1, true);
        }
    }

    if (!final.length) {
        // The 0 case
        return "None"
    }

    return final
}
