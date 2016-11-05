import * as React from "react";
import {Task} from "../models";

export interface TaskProps {task: Task;}

export class TaskComponent extends React.Component<TaskProps, {}> {

    render() {
        return <div>
            <div className="task-title">{this.props.task.title}</div>
            <div className="task-description">{this.props.task.description}</div>
            <div className="task-priority">{this.props.task.priority}</div>
            <div className="task-state">{this.props.task.state}</div>
            <div className="task-owner">{this.props.task.ownerId}</div>
        </div>
    }
}
