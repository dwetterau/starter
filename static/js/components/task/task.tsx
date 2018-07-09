import * as React from "react";
import * as moment from "moment";
import {Task, TagsById, EventsById, stateNameList} from "../../models";
import {TaskBoardViewType} from "./task_board";
import {TagComponent} from "../tag/tag";
import {renderDuration} from "../lib/util";

export interface TaskProps {
    task: Task,
    viewType: TaskBoardViewType,
    tagsById: TagsById,
    eventsById: EventsById,
}

export class TaskComponent extends React.Component<TaskProps, {}> {

    renderTaskId() {
        return (
            <div className="task-id">
                T{this.props.task.id}
            </div>
        )
    }

    renderPriority() {
        let className = `task-color -p${this.props.task.priority}`;
        return (
            <div className={className}></div>
        );
    }

    renderState() {
        // If we are viewing in state columns, omit this line
        if (this.props.viewType == TaskBoardViewType.status) {
            return
        }
        // We don't show the state on the priority view in any way right now.
        let className = "task-state";
        if (this.props.task.state == 900) {
        }

        let state = '';
        for (let [stateName, stateNumber] of stateNameList) {
            if (stateNumber == this.props.task.state) {
                state = stateName as string;
            }
        }

        return <div className={className}>{state}</div>;
    }

    renderTag(tagId: number) {
        const tag = this.props.tagsById[tagId];
        return <TagComponent tag={tag} key={tagId}/>
    }

    renderTags() {
        if (!this.props.task.tagIds.length) {
            return;
        }
        return (
            <div className="task-tags-container">
                {this.props.task.tagIds.map(this.renderTag.bind(this))}
            </div>
        )
    }

    renderEstimate() {
        if (!this.props.task.expectedDurationSecs) {
            return;
        }

        return (
            <div className="estimate-container">
                Est: {renderDuration(this.props.task.expectedDurationSecs, true, false)}
            </div>
        )
    }

    computeTimeUntilTarget(targetMS: number): [number, string] {
        let timeToTarget = Math.round(
            (targetMS / 1000) - moment().unix()
        );
        if (timeToTarget > 0) {
            timeToTarget += 24 * 60 * 60 - 1;
        }
        return [timeToTarget, renderDuration(Math.abs(timeToTarget), true, true)];
    }

    renderDueDate() {
        if (!this.props.task.dueTime) {
            return;
        }
        // If the task is closed, don't show a due date
        if (this.props.task.state == 1000) {
            return;
        }

        let [timeToDue, durationString] = this.computeTimeUntilTarget(this.props.task.dueTime);
        let dueString = "";
        let className = "task-due-date";
        if (durationString == "None") {
            className += " -due-today";
            dueString = "Due today"
        } else if (timeToDue < 0) {
            if (timeToDue < -(3 * 24 * 60 * 60)) {
                className += " -very-overdue"
            } else {
                className += " -overdue"
            }
            dueString = `Due ${durationString} ago`
        } else {
            if (timeToDue > 3 * 24 * 60 * 60) {
                className += " -due-not-soon"
            } else {
                className += " -due-soon"
            }
            dueString = `Due in ${durationString}`
        }

        return (
            <div className={className}>{dueString}</div>
        )
    }

    renderClosedDate() {
        if (this.props.task.state != 1000) {
            return;
        }
        if (!this.props.task.stateUpdatedTime) {
            return;
        }

        let [timeToClosed, durationString] = this.computeTimeUntilTarget(
            this.props.task.stateUpdatedTime
        );
        let sinceClosedString = "Closed ";
        if (durationString == "None") {
            sinceClosedString += "today";
        } else if (timeToClosed < 0) {
            sinceClosedString += `${durationString} ago`
        } else {
            sinceClosedString += `${durationString} from now`
        }
        return (
            <div className="closed-time">{sinceClosedString}</div>
        )
    }

    render() {
        return <div className="task card">
            <div className="task-columns">
                {this.renderPriority()}
                <div className="main-column">
                    {this.renderTaskId()}
                    <div className="task-title">{this.props.task.title}</div>
                    {this.renderTags()}
                    {this.renderState()}
                    {this.renderEstimate()}
                    {this.renderDueDate()}
                    {this.renderClosedDate()}
                </div>
            </div>
        </div>
    }
}
