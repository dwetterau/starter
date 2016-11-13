import * as React from "react";
import {Task, priorityNameList, stateNameList} from "../models";
import {TaskBoardViewType} from "./task_board";

export interface TaskProps {task: Task; viewType: TaskBoardViewType}

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

    render() {
        return <div className="task card">
            {this.renderTaskId()}
            <div className="task-title">{this.props.task.title}</div>
            <div className="task-description">{this.props.task.description}</div>
            {this.renderPriority()}
            {this.renderState()}
        </div>
    }
}
