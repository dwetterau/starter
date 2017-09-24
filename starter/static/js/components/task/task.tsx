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
                Est: {renderDuration(this.props.task.expectedDurationSecs, true)}
            </div>
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
                </div>
            </div>
        </div>
    }
}
