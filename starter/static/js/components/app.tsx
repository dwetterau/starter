import * as React from "react";
import {CreateTaskComponent} from "./create_task"
import {Task, User} from "../models";
import {TaskBoardComponent} from "./task_board"

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

    renderTaskBoard() {
        return <TaskBoardComponent tasks={this.props.tasks} />
    }

    render() {
        return <div>
            {this.renderHeader()}
            {this.renderTaskBoard()}
            {this.renderCreateTask()}
        </div>
    }
}
