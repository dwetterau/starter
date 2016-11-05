import * as React from "react";
import {CreateTaskComponent} from "./create_task"
import {Task, User} from "../models";
import {TaskComponent} from "./task"

export interface AppProps {meUser: User; tasks: Array<Task>;}

export class App extends React.Component<AppProps, {}> {

    renderAccountInfo() {
        return <div className="profile-container">
            {"Logged in as: " + this.props.meUser.username}
        </div>
    }

    renderHeader() {
        return <div className="header-container">
            <div>Starter</div>
            {this.renderAccountInfo()}
        </div>
    }

    renderCreateTask() {
        return <CreateTaskComponent meUser={this.props.meUser}/>
    }

    render() {
        return <div>
            {this.renderHeader()}
            {this.props.tasks.map((task) => {
                return <TaskComponent task={task} key={task.id}/>
            })}
            {this.renderCreateTask()}
        </div>
    }
}
