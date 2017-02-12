import * as React from "react"
import * as moment from "moment";
import {Task, TagsById, EventsById, stateNameList, priorityNameList} from "../../models"
import {Linkify} from "../lib/Linkify"
import {renderDuration} from "../lib/util";

interface TaskDetailProps {
    task: Task,
    eventsById: EventsById,
    closeCallback: () => void
    editCallback: () => void
}

export class TaskDetailComponent extends React.Component<TaskDetailProps, {}> {

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
            clearInterval(this.refreshLoopId);
        }
    }

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
            <a className="edit-button" onClick={this.props.editCallback}>Edit</a>
            <a className="close-button" onClick={this.props.closeCallback}>Close</a>
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

    renderCurrentStatus() {
        let priorityName = '';
        priorityNameList.forEach((nameAndPriority: [string, number]) => {
            let [n, priority] = nameAndPriority;
            if (this.props.task.priority == priority) {
                priorityName = n;
            }
        });

        let stateName = '';
        stateNameList.forEach((nameAndState: [string, number]) => {
            let [n, state] = nameAndState;
            if (this.props.task.state == state) {
                stateName = n;
            }
        });

        return <div className="task-status">
            <div className="info-container">
                <div className={`task-color -p${this.props.task.priority}`}/>
                <div>{priorityName}</div>
            </div>
            <div className="info-container">
                <div className={`task-color -s${this.props.task.state}`}/>
                <div>{stateName}</div>
            </div>
        </div>
    }

    renderEstimatedTime() {
        let estimatedTime = this.props.task.expectedDurationSecs;
        if (estimatedTime == 0) {
            return
        }
        return <div className="time-estimate">
            Estimated: {renderDuration(estimatedTime)}
        </div>
    }

    renderProgress(spentTime: number) {
        if (!spentTime || !this.props.task.expectedDurationSecs) {
            return
        }

        let percent = Math.round(spentTime / this.props.task.expectedDurationSecs * 100);

        return <div className="progress">
            Estimated Time Spent: {percent}%
        </div>
    }

    renderTimeInfo() {
        let scheduledTime = this.computeTotalTimeScheduled();
        let spentTime = this.computeTotalTimeSpent();

        if (scheduledTime == 0) {
            return <div className="task-time-info">
                {this.renderEstimatedTime()}
            </div>
        }

        if (scheduledTime == spentTime) {
         return <div className="task-time-info">
             {this.renderEstimatedTime()}
             Scheduled and Spent: {renderDuration(scheduledTime)}
             {this.renderProgress(spentTime)}
         </div>
        }

        return <div className="task-time-info">
            {this.renderEstimatedTime()}
            Scheduled: {renderDuration(scheduledTime)}
            <br />
            Spent: {renderDuration(spentTime)}
            {this.renderProgress(spentTime)}
        </div>
    }

    render() {
        return <div className="task-detail-container">
            {this.renderHeader()}
            {this.renderDescription()}
            {this.renderCurrentStatus()}
            {this.renderTimeInfo()}
        </div>
    }
}