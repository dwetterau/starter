import * as React from "react";
import {Task, User} from "../models";

export interface AppProps {user: User; tasks: Array<Task>;}

export class App extends React.Component<AppProps, {}> {

    static renderTask(task: Task) {
        return <div key={task.id}>
            <div className="task-title">{task.title}</div>
            <div className="task-description">{task.description}</div>
            <div className="task-owner">{task.ownerId}</div>
        </div>
    }

    render() {
        return <div>
            {this.props.tasks.map(App.renderTask)}
        </div>
    }
}

