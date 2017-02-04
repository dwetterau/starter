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
        if (this.props.viewType == TaskBoardViewType.priority) {
            return
        }

        let name = '';
        priorityNameList.forEach((nameAndPriority: [string, number]) => {
            let [n, priority] = nameAndPriority;
            if (this.props.task.priority == priority) {
                name = n;
            }
        });
        return (
            <div className="task-priority">Priority: {name}</div>
        );
    }

    renderState() {
        // If we are viewing in state columns, omit this line
        if (this.props.viewType == TaskBoardViewType.status) {
            return
        }

        let name = '';
        stateNameList.forEach((nameAndState: [string, number]) => {
            let [n, state] = nameAndState;
            if (this.props.task.state == state) {
                name = n;
            }
        });
        return (
            <div className="task-state">State: {name}</div>
        );
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
            {this.renderTaskId()}
            <div className="task-title">{this.props.task.title}</div>
            {this.renderPriority()}
            {this.renderState()}
            {this.renderTags()}
        </div>
    }
}
