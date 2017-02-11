import * as React from "react";
import {Task, priorityNameList, stateNameList, TagsById} from "../../models";
import {TaskBoardViewType} from "./task_board";
import {TagComponent} from "../tag/tag";

export interface TaskProps {
    task: Task,
    viewType: TaskBoardViewType,
    tagsById: TagsById,
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

    render() {
        return <div className="task card">
            <div className="task-columns">
                {this.renderPriority()}
                {this.renderState()}
                <div className="main-column">
                    {this.renderTaskId()}
                    <div className="task-title">{this.props.task.title}</div>
                    {this.renderTags()}
                </div>
            </div>
        </div>
    }
}
