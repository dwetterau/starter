import * as React from "react";
import {User, Task, TagsById} from "../models";
import {TokenizerComponent, Tokenizable} from "./tokenizer";

export interface EditTaskProps {
    meUser: User,
    task: Task,
    tagsById: TagsById,
    updateTask: (task: Task) => void,
    deleteTask: (task: Task) => void,
}
export interface EditTaskState {
    task: Task,
}

export class EditTaskComponent extends React.Component<EditTaskProps, EditTaskState> {

    constructor(props: EditTaskProps) {
        super(props);
        this.state = {
            task: props.task,
        }
    }

    componentWillReceiveProps(newProps: EditTaskProps) {
        this.setState({
            task: newProps.task,
        })
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

    getCurrentTags(): Array<Tokenizable> {
        const tagNames: Array<Tokenizable> = [];
        this.state.task.tagIds.forEach((tagId) => {
            const tag = this.props.tagsById[tagId];
            tagNames.push({
                label: tag.name,
                value: tag.id
            })
        });
        return tagNames;
    }

    getAllTagNames(): Array<Tokenizable> {
        // This function is used to determine the set of valid tokens for the tokenizer.
        // We should think about excluding tokens from here that would cause cycles.
        const allNames: Array<Tokenizable> = [];
        Object.keys(this.props.tagsById).forEach((tagId) => {
            const tag = this.props.tagsById[+tagId];
            allNames.push({
                label: tag.name,
                value: tag.id
            })
        });
        return allNames;
    }

    retrieveTagNames(tokens: Array<Tokenizable>) {
        this.state.task.tagIds = tokens.map((token: Tokenizable) => {
            return token.value;
        });
        this.setState(this.state)
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
                <TokenizerComponent
                    onChange={this.retrieveTagNames.bind(this)}
                    initialValues={this.getCurrentTags()}
                    possibleTokens={this.getAllTagNames()}
                />
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
