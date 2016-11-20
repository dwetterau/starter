import * as React from "react";
import * as jQuery from "jquery";
import {CreateTaskComponent} from "./create_task"
import {Tag, Task, User} from "../models";
import {TagGraphComponent} from "./tag_graph";
import {TaskBoardComponent} from "./task_board"

export interface AppProps {
    meUser: User;
    tasks: Array<Task>;
    tags: Array<Tag>;
}
export interface AppState {tasks: Array<Task>}

export class App extends React.Component<AppProps, AppState> {

    constructor(props: AppProps) {
        super(props);
        this.state = {
            tasks: props.tasks
        }
    }

    createTask(taskArgs: string) {
        jQuery.post('/api/1/task/create', taskArgs, (newTaskJson: string) => {
            this.state.tasks.push(JSON.parse(newTaskJson));
            this.setState(this.state)
        });
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

    deleteTask(task: Task) {
        jQuery.post('/api/1/task/delete', {id: task.id}, (deletedTaskJson: string) => {
            const deletedTaskId = JSON.parse(deletedTaskJson).id;
            const newTasks = this.state.tasks.filter((task: Task) => {
                return task.id != deletedTaskId;
            });
            this.setState(({tasks: newTasks}));
        })
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

    renderTaskBoard() {
        return <TaskBoardComponent
            meUser={this.props.meUser}
            tasks={this.state.tasks}
            updateTask={this.updateTask.bind(this)}
            deleteTask={this.deleteTask.bind(this)}
        />
    }

    renderTagGraph() {
        return <TagGraphComponent tags={this.props.tags} />
    }

    renderCreateTask() {
        return <CreateTaskComponent meUser={this.props.meUser}
                                    createTask={this.createTask.bind(this)} />
    }

    render() {
        return <div>
            {this.renderHeader()}
            {this.renderTaskBoard()}
            {this.renderTagGraph()}
            {this.renderCreateTask()}
        </div>
    }
}
