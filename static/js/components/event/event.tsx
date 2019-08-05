import * as moment from "moment";
import * as React from "react";

import {Event, TagsById} from "../../models";
import {TagComponent} from "../tag/tag";
import {signalDisplayTaskInfo} from "../../events";

export interface EventProps {
    event: Event,
    tagsById: TagsById,
}

export class EventComponent extends React.Component<EventProps, {}> {

    selectTask(taskId: number) {
        let event = new CustomEvent(
            signalDisplayTaskInfo,
            {'detail': taskId},
        );
        document.dispatchEvent(event);
    }

    shortTimeMoment(m: moment.Moment, includeAM: boolean): string {
        const amSuffix = includeAM? "a": "";
        if (m.minutes() != 0) {
            return m.format("h:mm" + amSuffix)
        }
        return m.format("h" + amSuffix);
    }

    timeString() {
        const startMoment = moment(this.props.event.startTime);

        // We render short events with just the start time.
        if (this.isShortEvent()) {
            return this.shortTimeMoment(startMoment, true)
        }
        // Otherwise, we'll render "start - end"
        const endMoment = moment(
            this.props.event.startTime + (this.props.event.durationSecs * 1000),
        );
        let startString = this.shortTimeMoment(startMoment, true);
        // If they're in the same part of the day, omit the "am" part from the start;
        if (endMoment.format("wwYa") == startMoment.format("wwYa")) {
            startString = this.shortTimeMoment(startMoment, false);
        }
        let endString = this.shortTimeMoment(endMoment, true);
        return `${startString} - ${endString}`
    }

    renderTag(tagId: number) {
        const tag = this.props.tagsById[tagId];
        return <TagComponent tag={tag} key={tagId}/>
    }

    renderName() {
        return <div className="name">
            {this.props.event.name}
        </div>
    }

    renderTime() {
        return <div className="event-time-container">
            {this.timeString()}
        </div>
    }

    isShortEvent(): boolean {
        if (this.props.event.durationSecs > 30 * 60) {
            return false;
        }
        return this.props.event.name.length <= 10;

    }

    renderNameAndTime() {
        if (!this.isShortEvent()) {
            return <div className="event-name-and-time-container">
                {this.renderName()}
                {this.renderTime()}
            </div>
        }
        return <div className="event-name-and-time-container inline-name-and-time">
            <div className="name">
                {this.props.event.name + ","}
            </div>
            <div className="event-time-container">
                {this.timeString()}
            </div>
        </div>
    }

    renderTags() {
        if (!this.props.event.tagIds.length) {
            return;
        }
        return this.props.event.tagIds.map(this.renderTag.bind(this))
    }

    renderTasks() {
        if (!this.props.event.taskIds.length) {
            return;
        }
        return this.props.event.taskIds.map((taskId) => {
            return <div
                className="task-id-card card"
                key={`T${taskId}`}
                onClick={this.selectTask.bind(this, taskId)}
            >
                {`T${taskId}`}
            </div>
        });
    }

    render() {
        return <div className="event-container">
            {this.renderNameAndTime()}
            <div className="event-card-container">
                {this.renderTags()}
                {this.renderTasks()}
            </div>
        </div>
    }
}
