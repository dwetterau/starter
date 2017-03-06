import * as React from "react";
import * as moment from "moment";
import {Task, TagsById, EventsById} from "../../models";
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
        // If we are viewing in priority columns, omit this line
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
        return (<div/>);
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
                Tags:
                {this.props.task.tagIds.map(this.renderTag.bind(this))}
            </div>
        )
    }

    renderProgress() {

        // compute the amount of time spent for the task so far
        let now = moment().unix() * 1000;
        let spentTime = 0;
        this.props.task.eventIds.forEach((eventId) => {
            let event = this.props.eventsById[eventId];
            if (event.startTime > now) {
                return
            }
            spentTime += Math.min((now - event.startTime) / 1000, event.durationSecs)
        });

        let progressPercentage = spentTime / this.props.task.expectedDurationSecs;
        progressPercentage = Math.round(progressPercentage * 100);
        // Use different colors for the different stages

        let className = "percentage";
        if (progressPercentage > 100) {
            // Overdone..
            className += " -bad"
        } else if (progressPercentage > 0) {
            // Started, make it green..
            className += " -good"
        }

        return (
            <div className="progress-container">
                Progress: <span className={className}>{progressPercentage}%</span>
            </div>
        )
    }

    renderEstimate() {
        if (!this.props.task.expectedDurationSecs) {
            return;
        }

        return (
            <div className="estimate-container">
                Est: {renderDuration(this.props.task.expectedDurationSecs, true)}
                {this.renderProgress()}
            </div>

        )
    }

    render() {
        return <div className="task card">
            <div className="task-columns">
                {this.renderPriority()}
                {this.renderState()}
                <div className="main-column">
                    {this.renderTaskId()}
                    <div className="task-title">{this.props.task.title}</div>
                    {this.renderTags()}
                    {this.renderEstimate()}
                </div>
            </div>
        </div>
    }
}
