import * as React from "react";
import * as jQuery from "jquery";
import {CreateTagComponent} from "./create_tag"
import {CreateTaskComponent} from "./create_task"
import {Tag, Task, User} from "../models";
import {TagGraphComponent} from "./tag_graph";
import {TaskBoardComponent} from "./task_board"

export interface AppProps {
    meUser: User;
    tasks: Array<Task>;
    tags: Array<Tag>;
}
export interface AppState {
    tasks: Array<Task>,
    tags: Array<Tag>,
}

export class App extends React.Component<AppProps, AppState> {

    constructor(props: AppProps) {
        super(props);
        this.state = {
            tasks: props.tasks,
            tags: props.tags,
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
            this.state.tasks = this.state.tasks.map((task: Task) => {
                if (task.id == updatedTask.id) {
                    return updatedTask
                } else {
                    return task
                }
            });
            this.setState(this.state);
        });
    }

    deleteTask(task: Task) {
        jQuery.post('/api/1/task/delete', {id: task.id}, (deletedTaskJson: string) => {
            const deletedTaskId = JSON.parse(deletedTaskJson).id;
            this.state.tasks = this.state.tasks.filter((task: Task) => {
                return task.id != deletedTaskId;
            });
            this.setState(this.state);
        })
    }

    createTag(tag: Tag) {
        delete tag["id"];
        jQuery.post('/api/1/tag/create', tag, (newTagJson: string) => {
            this.state.tags.push(JSON.parse(newTagJson));
            this.setState(this.state);
        })
    }

    updateTag(tag: Tag) {
        jQuery.post('/api/1/tag/update', tag, (updatedTagJson: string) => {
            let updatedTag: Tag = JSON.parse(updatedTagJson);
            this.state.tags = this.state.tags.map((tag: Tag) => {
                if (tag.id == updatedTag.id) {
                    return updatedTag;
                } else {
                    return tag;
                }
            });
            this.setState(this.state);
        })
    }

    deleteTag(tag: Tag) {
        // TODO: Filter out all tags and children or something
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
        return <TagGraphComponent
            tags={this.props.tags}
            updateTag={this.updateTag.bind(this)}
            deleteTag={this.deleteTag.bind(this)}
        />
    }

    renderCreateTask() {
        return <CreateTaskComponent meUser={this.props.meUser}
                                    createTask={this.createTask.bind(this)} />
    }

    renderCreateTag() {
        return <CreateTagComponent
            meUser={this.props.meUser}
            createTag={this.createTag.bind(this)}
            tags={this.state.tags}
        />
    }

    render() {
        return <div>
            {this.renderHeader()}
            {this.renderTaskBoard()}
            {this.renderTagGraph()}
            {this.renderCreateTask()}
            {this.renderCreateTag()}
        </div>
    }
}
