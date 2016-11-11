import * as React from "react";
import {User, Task} from "../models";
import {TokenizerComponent, Tokenizable} from "./tokenizer";

export interface EditTaskProps {
    meUser: User;
    task: Task;
    updateTask: (task: Task) => void;
    deleteTask: (task: Task) => void;
}
export interface EditTaskState {task: Task}

export class EditTaskComponent extends React.Component<EditTaskProps, EditTaskState> {

    constructor(props: EditTaskProps) {
        super(props);
        this.state = {
            task: props.task
        }
    }

    componentWillReceiveProps(newProps: EditTaskProps) {
        this.setState({task: newProps.task})
    }

    submitForm(eventType: string) {
        if (eventType == "save") {
            this.props.updateTask(this.state.task);
        } else {
            this.props.deleteTask(this.state.task);
        }
    }

    updateAttr(attrName: string, event: any) {
        this.state.task[attrName] = event.target.value;
        this.setState(this.state);
    }

    retrieveTags(tokens: Array<Tokenizable>) {
        // TODO: Take the tags and send them to the server on save.
        // console.log("Got new token:", tokens)
    }

    renderForm() {
        return <div>
            <div className="title-container">
                <label htmlFor="title">Title: </label>
                <input
                    type="text" name="title"
                    value={this.state.task.title}
                    onChange={this.updateAttr.bind(this, "title")}
                />
            </div>

            <div className="description-container">
                <label htmlFor="description">Description: </label>
                <textarea
                    type="text" name="description"
                    value={this.state.task.description}
                    onChange={this.updateAttr.bind(this, "description")}
                />
            </div>

            <div className="priority-selector">
                <label htmlFor="priority">Priority: </label>
                <select name="priority" value={this.state.task.priority}
                        onChange={this.updateAttr.bind(this, "priority")} >
                    <option value="0">Unknown</option>
                    <option value="100">Lowest</option>
                    <option value="200">Low</option>
                    <option value="300">Normal</option>
                    <option value="400">High</option>
                    <option value="500">Highest</option>
                </select>
            </div>

            <div className="state-selector">
                <label htmlFor="state">Status: </label>
                <select name="state" value={this.state.task.state}
                        onChange={this.updateAttr.bind(this, "state")} >
                    <option value="0">Open</option>
                    <option value="500">In Progress</option>
                    <option value="750">Blocked</option>
                    <option value="1000">Closed</option>
                </select>
            </div>

            <div className="tag-tokenizer-container">
                <TokenizerComponent onChange={this.retrieveTags.bind(this)} />
            </div>

            <input type="hidden" name="authorId" value={this.state.task.authorId} />
            <input type="hidden" name="ownerId" value={this.state.task.ownerId} />

            <input type="button" value="delete" onClick={this.submitForm.bind(this, "delete")} />
            <input type="button" value="save" onClick={this.submitForm.bind(this, "save")} />
        </div>
    }

    render() {
        return <div className="edit-task-container">
            <h3>Task Edit Form:</h3>
            {this.renderForm()}
        </div>
    }
}
