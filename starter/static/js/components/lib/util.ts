
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
        let final = '';
        if (seconds >= 60 * 60) {
            let numHours = Math.floor(seconds / (60 * 60));
            final = `${numHours} hour`;
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

