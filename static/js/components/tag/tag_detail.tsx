import * as moment from "moment";
import * as React from "react"
import { Chart } from "react-google-charts";

import {Event, EventsById, Tag, TagsById, getTagAndDescendantsRecursive, getTagParentIds} from "../../models";
import {renderDuration} from "../lib/util";
import {TagComponent} from "./tag";

const orderedColors =["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac", "#b77322", "#16d620", "#b91383", "#f4359e", "#9c5935", "#a9c413", "#2a778d", "#668d1c", "#bea413", "#0c5922", "#743411"];

interface TagDetailProps {
    // TODO: Allow this to also show a tag for "everything" by being empty?
    tag: Tag,
    eventsById: EventsById,
    tagsById: TagsById,
    closeCallback: () => void,
}

interface TagDetailState {
    graphWindowDays: number,
}

export class TagDetailComponent extends React.Component<TagDetailProps, TagDetailState> {
    constructor(props: TagDetailProps) {
        super(props);
        this.state = {
            graphWindowDays: 30,
        }
    }

    refreshLoopId = 0;
    componentDidMount() {
        // Register a loop to keep refreshing the "time spent" estimates and percentage.
        let loop = () => {
            this.forceUpdate();
        };
        this.refreshLoopId = window.setInterval(loop, 10 * 1000);
    }

    componentWillUnmount() {
        if (this.refreshLoopId) {
            window.clearInterval(this.refreshLoopId)
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

    computeStartTimes(): Array<number> {
        // Returns the following (all in milliseconds):
        // - start of day
        // - start of week
        // - start of 2 weeks ago
        // - start of month
        let monday = this.computeStartMonday();
        let startTimes = [
            moment().startOf("day"),
            monday,
            moment(monday).subtract(1, "week"),
            moment().startOf("month"),
        ];
        return startTimes.map((time: moment.Moment) => {
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

    computeSpentTimes(eventIds: Array<number>): [number, number, number, number] {
        // Returns three durations in seconds: time spent this month, this week, and this day
        let timeSpentMonth = 0, timeSpentWeek = 0, timeSpentLastWeek = 0, timeSpentDay = 0;
        let [todayStart, weekStart, twoWeekStart, monthStart] = (
            this.computeStartTimes()
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
            timeSpentLastWeek += this.computeDurationOfEventBetweenTimestamps(
                event, twoWeekStart, weekStart,
            );
            timeSpentMonth += this.computeDurationOfEventBetweenTimestamps(
                event, monthStart, nowUnix
            );
        }
        return [timeSpentDay, timeSpentWeek, timeSpentLastWeek, timeSpentMonth];
    }

    spentTimeGraphData(eventIds: Array<number>) {
        // TODO: Allow options for the time window to compute data for.
        // TODO: Allow different aggregations as well (daily, monthly, etc.)
        // Output format example:
        // [["Date", "Hours"], ['2019-07-28', 5.5], ['2019-07-29', 12]]
        let buckets = [];
        let curStart = moment().startOf("day");
        let curEnd = moment();
        const allTags = getTagAndDescendantsRecursive(this.props.tag.id, this.props.tagsById);
        let sortedTags = [];
        for (let tagId in allTags) {
            sortedTags.push([this.props.tagsById[tagId].name, tagId])
        }
        sortedTags.sort((a, b) => {
           return a[0].localeCompare(b[0]);
        });


        // Compute buckets for the past `n` days;
        let tagHasTime = {};
        for (let i = 0; i < this.state.graphWindowDays; i++) {
            let tagToHours = {};
            for (let tagId in allTags) {
                tagToHours[tagId] = 0
            }
            let total = 0;
            for (let eventId of eventIds) {
                const event = this.props.eventsById[eventId];
                let curBucket = this.computeDurationOfEventBetweenTimestamps(
                    event,
                    curStart.unix() * 1000,
                    curEnd.unix() * 1000,
                );
                if (curBucket == 0) {
                    continue;
                }
                total += curBucket / (60 * 60);
                for (let tagId of event.tagIds) {
                    tagHasTime[tagId] = true;
                    tagToHours[tagId] += curBucket / event.tagIds.length / (60 * 60);
                }
            }
            let bucketValues = [curStart.toDate()];
            for (let [, tagId] of sortedTags) {
                if (!tagToHours[tagId]) {
                    bucketValues.push(null);
                    continue;
                }
                bucketValues.push(tagToHours[tagId])
            }
            buckets.push(bucketValues);
            // Adjust the time bounds
            curEnd = moment(curStart);
            curStart = curStart.subtract(1, "day");
        }
        let headers = ["Date"];
        for (let [name, ] of sortedTags) {
            headers.push(name)
        }
        buckets.push(headers);
        let withZeros = buckets.reverse();
        for (let i = headers.length - 1; i > 0; i--) {
            let [, tagId] = sortedTags[i-1];
            if (tagHasTime[tagId]) {
                continue
            }
            // Delete this column!
            for (let j = 0; j < withZeros.length; j++) {
                withZeros[j].splice(i, 1);
            }
        }
        return withZeros;
    }

    pieChartData(eventIds: Array<number>) {
        // TODO: Allow options for the time window to compute data for.
        // TODO: Unify this computation with the above.
        let end = moment();
        let start = moment(end).startOf("day").subtract(this.state.graphWindowDays, "day");
        const allTags = getTagAndDescendantsRecursive(this.props.tag.id, this.props.tagsById);
        let tagToHours = {};
        for (let tagId in allTags) {
            tagToHours[tagId] = 0
        }
        for (let eventId of eventIds) {
            const event = this.props.eventsById[eventId];
            let contribution = this.computeDurationOfEventBetweenTimestamps(
                event,
                start.unix() * 1000,
                end.unix() * 1000,
            );
            if (contribution == 0) {
                continue;
            }
            // TODO: Maybe only portion the time to the deepest tag?
            for (let tagId of event.tagIds) {
                tagToHours[tagId] += contribution / event.tagIds.length / (60 * 60);
            }
        }
        let buckets = [["Tag", "Hours"]];
        for (let tagId in tagToHours) {
            if (!tagToHours[tagId]) {
                continue;
            }
            buckets.push([this.props.tagsById[tagId].name, tagToHours[tagId]]);
        }
        return buckets.sort((a, b) => {
            if (a[0] == "Tag") {
                return -1
            }
            return a[0].localeCompare(b[0])
        })
    }

    changeGraphDays(days: number) {
        this.setState({graphWindowDays: days});
    }

    renderOptions() {
        const isSelected = (n: number) => {
            if (n == this.state.graphWindowDays) {
                return "days-button selected"
            }
            return "days-button";
        };
        return <div className="options">
            <a className={isSelected(7)} onClick={this.changeGraphDays.bind(this, 7)}>7d</a>
            <a className={isSelected(14)} onClick={this.changeGraphDays.bind(this, 14)}>14d</a>
            <a className={isSelected(30)} onClick={this.changeGraphDays.bind(this, 30)}>30d</a>
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
            {name}: {renderDuration(amount, false, false)}
        </div>
    }

    renderCharts(relevantEventIds: Array<number>) {
        let chartData = this.spentTimeGraphData(relevantEventIds);
        let pieChartData = this.pieChartData(relevantEventIds);
        if (pieChartData.length == 1) {
            // Hide all the charts if there's no data.
            return
        }
        let genAxis = () => {
            return {
                "minValue": 0,
                "title": "Hours",
                "viewWindow": {"min": 0},
            }
        };

        return <div className={"chart-container"}>
            <div>
            <Chart
                chartType={"SteppedAreaChart"}
                options={{
                    vAxis: genAxis(),
                    "isStacked": true,
                    "connectSteps": false,
                    "responsive": true,
                    "maintainAspectRatio": false,
                    "title": `Daily time spent tagged with "${this.props.tag.name}"`,
                    "colors": orderedColors.slice(0, chartData[0].length),
                }}
                data={chartData}
                height={"300px"}
                width={"100%"}
            />
            </div>
            <div>
            <Chart
                chartType={"PieChart"}
                options={{
                    "responsive": true,
                    "maintainAspectRatio": false,
                    "title": `Total time breakdown for "${this.props.tag.name}"`,
                    "colors": orderedColors.slice(0, pieChartData.length),
                }}
                data={pieChartData}
                height={"300px"}
                width={"100%"}
            />
            </div>
        </div>
    }

    renderTimeInfo() {
        let relevantEvents = this.computeAllRelevantEvents();
        let [timeSpentDay, timeSpentWeek, timeSpentLastWeek, timeSpentMonth] =
            this.computeSpentTimes(relevantEvents);
        return <div className="time-info">
            {this.renderCharts(relevantEvents)}
            {this.renderDurationWithName("Spent today", timeSpentDay)}
            {this.renderDurationWithName("Spent this week", timeSpentWeek)}
            {this.renderDurationWithName("Spent last week", timeSpentLastWeek)}
            {this.renderDurationWithName("Spent this month", timeSpentMonth)}
        </div>
    }

    render() {
        return <div className="detail-container">
            {this.renderHeader()}
            {this.renderTimeInfo()}
            {this.renderParentTags()}
            {this.renderDescendantTags()}
        </div>
    }
}
