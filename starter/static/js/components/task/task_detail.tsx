import * as React from "react"
import * as moment from "moment";
import {Task, TagsById, EventsById} from "../../models"
import {Linkify} from "../lib/Linkify"

interface TaskDetailProps {
    task: Task,
    tagsById: TagsById,
    eventsById: EventsById,
    closeCallback: () => void
    editCallback: () => void
}

export class TaskDetailComponent extends React.Component<TaskDetailProps, {}> {

    computeTotalTimeScheduled() {
        // Returns the sum of all events that involved this task
        let totalTime = 0;
        this.props.task.eventIds.forEach((eventId) => {
            let event = this.props.eventsById[eventId];
            totalTime += event.durationSecs;
        });
        return totalTime
    }

    computeTotalTimeSpent() {
        // Returns all time spent on this task so far (not including future scheduled work)
        let now = moment().unix() * 1000;
        let timeSpent = 0;
        this.props.task.eventIds.forEach((eventId) => {
            let event = this.props.eventsById[eventId];
            if (event.startTime > now) {
                return
            }
            timeSpent += Math.min((now - event.startTime) / 1000, event.durationSecs);
        });
        return timeSpent
    }

    renderOptions() {
        return <div className="options">
            <a href="#" className="edit-button" onClick={this.props.editCallback}>Edit</a>
            <a href="#" className="close-button" onClick={this.props.closeCallback}>Close</a>
        </div>
    }

    renderHeader() {
        return <div className="task-detail-header">
            <div className="id-and-options">
                T{this.props.task.id}
                {this.renderOptions()}
            </div>
            <div className="title">{this.props.task.title}</div>
        </div>
    }

    renderDescription() {
        let items = this.props.task.description.split("\n");
        return <Linkify className="task-description">
            {items.map((item, index) => {
                return <span key={index}>
                    {item}
                    {(index < items.length - 1) ? <br /> : ''}
                </span>
            })}
        </Linkify>
    }

    renderDuration(seconds: number): string {
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
        return final
    }

    renderTimeInfo() {
        let scheduledTime = this.computeTotalTimeScheduled();
        let spentTime = this.computeTotalTimeSpent();

        if (scheduledTime == 0) {
            return;
        }

        if (scheduledTime == spentTime) {
         return <div className="task-time-info">
             Scheduled and Spent: {this.renderDuration(scheduledTime)}
         </div>
        }
        return <div className="task-time-info">
            Scheduled: {this.renderDuration(scheduledTime)}
            <br />
            Spent: {this.renderDuration(spentTime)}
        </div>
    }

    render() {
        return <div className="task-detail-container">
            {this.renderHeader()}
            {this.renderDescription()}
            {this.renderTimeInfo()}
        </div>
    }
}