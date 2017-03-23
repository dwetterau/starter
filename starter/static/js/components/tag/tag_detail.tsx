import * as moment from "moment";
import * as React from "react"
import {Event, EventsById, Tag, TagsById} from "../../models";
import {getTagAndDescendantsRecursive, renderDuration, getTagParentIds} from "../lib/util";
import {TagComponent} from "./tag";

interface TagDetailProps {
    tag: Tag,
    eventsById: EventsById,
    tagsById: TagsById,
    closeCallback: () => void,
}

export class TagDetailComponent extends React.Component<TagDetailProps, {}> {
    refreshLoopId = 0;

    componentDidMount() {
        // Register a loop to keep refreshing the "time spent" estimates and percentage.
        let loop = () => {
            this.forceUpdate();
        };
        this.refreshLoopId = setInterval(loop, 10 * 1000);
    }

    componentWillUnmount() {
        if (this.refreshLoopId) {
            clearInterval(this.refreshLoopId)
        }
    }

    computeAllRelevantEvents(): Array<number> {
        const allTags = getTagAndDescendantsRecursive(this.props.tag.id, this.props.tagsById);
        const eventIds = [];
        for (let eventId of Object.keys(this.props.eventsById)) {
            let event: Event = this.props.eventsById[eventId];
            for (let tagId of event.tagIds) {
                if (allTags[tagId]) {
                    // This event has the relevant tag, add it to the return list
                    eventIds.push(event.id);
                    break;
                }
            }
        }
        return eventIds;
    }

    computeStartMonday() {
        let startOfWeek = moment().startOf("week").add(1, "days");
        if (startOfWeek > moment()) {
            // This sent us to the next week, subtract off a week
            startOfWeek = startOfWeek.subtract(1, "week")
        }
        return startOfWeek;
    }

    computeStartAndEndTimes(): Array<number> {
        // Returns the following (all in milliseconds):
        // - start of day, end of day
        // - start of week, end of week
        // - start of month, end of month
        let startTimes = [
            moment().startOf("day"),
            this.computeStartMonday(),
            moment().startOf("month"),
        ];
        let startAndEndMoments = [
            moment(startTimes[0]),
            startTimes[0].add(1, "days"),
            moment(startTimes[1]),
            startTimes[1].add(1, "week"),
            moment(startTimes[2]),
            startTimes[2].add(1, "month"),
        ];
        return startAndEndMoments.map((time: moment.Moment) => {
            return time.unix() * 1000;
        })
    }

    computeDurationOfEventBetweenTimestamps(
        event: Event, intervalStart, intervalEnd
    ) {
        // intervalStart and intervalEnd are unix timestamps in milliseconds. The interval
        // is inclusive.
        if (intervalEnd <= intervalStart) {
            // We allow inverted intervals, but assume nothing can overlap with them.
            return 0;
        }

        let duration = 0;
        let endTimestamp = event.startTime + (event.durationSecs * 1000);
        if (intervalStart < endTimestamp) {
            // The event doesn't end before this interval begins.
            if (intervalStart >= event.startTime) {
                // Event starts before interval does
                let truncatedDuration = (
                    event.durationSecs - (intervalStart - event.startTime) / 1000
                );
                if (endTimestamp <= intervalEnd) {
                    // Ends within interval too, include the whole duration
                    duration = truncatedDuration;
                } else {
                    // Ends later than interval, subtract off the excess
                    duration = truncatedDuration - (endTimestamp - intervalEnd) / 1000;
                }
            } else if (intervalEnd > event.startTime) {
                // Event starts during interval
                if (endTimestamp <= intervalEnd) {
                    // Ends within interval too, include the whole duration
                    duration = event.durationSecs;
                } else {
                    // Ends later than interval, subtract off the excess
                    duration = event.durationSecs - (endTimestamp - intervalEnd) / 1000;
                }
            }
        }
        return duration;
    }

    computeScheduledTimes(eventIds: Array<number>): [number, number, number] {
        // Returns three durations in seconds: time scheduled this month, this week, and this day
        let timeScheduledDay = 0, timeScheduledWeek = 0, timeScheduledMonth = 0;
        let [todayStart, todayEnd, weekStart, weekEnd, monthStart, monthEnd] = (
            this.computeStartAndEndTimes()
        );

        for (let eventId of eventIds) {
            let event: Event = this.props.eventsById[eventId];
            timeScheduledDay += this.computeDurationOfEventBetweenTimestamps(
                event, todayStart, todayEnd
            );
            timeScheduledWeek += this.computeDurationOfEventBetweenTimestamps(
                event, weekStart, weekEnd
            );
            timeScheduledMonth += this.computeDurationOfEventBetweenTimestamps(
                event, monthStart, monthEnd
            );
        }
        return [timeScheduledDay, timeScheduledWeek, timeScheduledMonth];
    }

    computeSpentTimes(eventIds: Array<number>): [number, number, number] {
        // Returns three durations in seconds: time spent this month, this week, and this day
        let timeSpentMonth = 0, timeSpentWeek = 0, timeSpentDay = 0;
        let [todayStart, todayEnd, weekStart, weekEnd, monthStart, monthEnd] = (
            this.computeStartAndEndTimes()
        );

        // Clamp all end times to now
        let nowUnix = moment().unix() * 1000;
        for (let eventId of eventIds) {
            let event: Event = this.props.eventsById[eventId];
            timeSpentDay += this.computeDurationOfEventBetweenTimestamps(
                event, todayStart, nowUnix
            );
            timeSpentWeek += this.computeDurationOfEventBetweenTimestamps(
                event, weekStart, nowUnix
            );
            timeSpentMonth += this.computeDurationOfEventBetweenTimestamps(
                event, monthStart, nowUnix
            );
        }
        return [timeSpentDay, timeSpentWeek, timeSpentMonth];
    }

    renderOptions() {
        return <div className="options">
            <a className="close-button" onClick={this.props.closeCallback}>Close</a>
        </div>
    }

    renderHeader() {
        return <div className="tag-detail-header">
            <div className="options-container tag-options-container">
                <div className="title">{this.props.tag.name}</div>
                {this.renderOptions()}
            </div>
        </div>
    }

    renderParentTags() {
        const parentTagIds = getTagParentIds(this.props.tag.id, this.props.tagsById);
        if (parentTagIds.length == 0) {
            // Doesn't have any parents
            return
        }
        return <div className="related-tag-names">
            Parents:
            {parentTagIds.map((tagId) => {
                let tag = this.props.tagsById[tagId];
                return <TagComponent key={tag.id} tag={tag}/>
            })}
        </div>
    }

    renderDescendantTags() {
        const allTags = getTagAndDescendantsRecursive(this.props.tag.id, this.props.tagsById);
        if (Object.keys(allTags).length <= 1) {
            // Doesn't have any descendants...
            return
        }

        return <div className="related-tag-names">
            Descendants:
            {Object.keys(allTags).map((tagId) => {
                if (parseInt(tagId) == this.props.tag.id) {
                    return;
                }
                let tag = this.props.tagsById[tagId];
                return <TagComponent key={tag.id} tag={tag}/>
            })}
        </div>
    }

    renderDurationWithName(name: string, amount: number) {
        if (!amount) {
            return
        }
        return <div className="tag-time-duration">
            {name}: {renderDuration(amount, false)}
        </div>
    }

    renderTimeInfo() {
        let relevantEvents = this.computeAllRelevantEvents();
        let [timeSpentDay, timeSpentWeek, timeSpentMonth] = this.computeSpentTimes(relevantEvents);
        return <div className="time-info">
            {this.renderDurationWithName("Spent today", timeSpentDay)}
            {this.renderDurationWithName("Spent this week", timeSpentWeek)}
            {this.renderDurationWithName("Spent this month", timeSpentMonth)}
        </div>
    }

    render() {
        return <div className="detail-container">
            {this.renderHeader()}
            {this.renderParentTags()}
            {this.renderDescendantTags()}
            {this.renderTimeInfo()}
        </div>
    }
}
