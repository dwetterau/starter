import * as React from "react";
import * as jQuery from "jquery";
import {CreateTaskComponent} from "./create_task"
import {Task, User} from "../models";
import {TaskBoardComponent} from "./task_board"

export interface AppProps {meUser: User; tasks: Array<Task>;}
export interface AppState {tasks: Array<Task>}

export class App extends React.Component<AppProps, AppState> {

    constructor(props: AppProps) {
        super(props);
        this.state = {
            tasks: props.tasks
        }
    }

    updateTask(task: Task) {
        jQuery.post('/api/1/task/update', task, (updatedTaskJson: string) => {
            let updatedTask: Task = JSON.parse(updatedTaskJson);
            const newTasks = this.state.tasks.map((task: Task) => {
                if (task.id == updatedTask.id) {
                    return updatedTask
                } else {
                    return task
                }
            });
            this.setState({tasks: newTasks});
        });
    }

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
        return <TaskBoardComponent tasks={this.state.tasks}
                                   updateTask={this.updateTask.bind(this)} />
    }

    render() {
        return <div>
            {this.renderHeader()}
            {this.renderTaskBoard()}
            {this.renderCreateTask()}
        </div>
    }
}
