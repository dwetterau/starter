import * as React from "react";
import {User} from "../models";
import * as jQuery from "jquery";

export interface CreateTaskProps {meUser: User; createTask: (taskArgs: string) => void}

export class CreateTaskComponent extends React.Component<CreateTaskProps, {}> {

    submitForm(event: React.FormEvent<HTMLFormElement>) {
        // Note: This is pretty hacky, but for now it beats copying all form state out of the dom
        // with a lot of onChange handler stuff.
        event.preventDefault();
        const data = jQuery(event.target).serialize();
        this.props.createTask(data)
    }

    renderForm() {
        return <form onSubmit={this.submitForm.bind(this)}>
            <div className="title-container">
                <label htmlFor="title">Title: </label>
                <input type="text" name="title" />
            </div>

            <div className="description-container">
                <label htmlFor="description">Description: </label>
                <textarea type="text" name="description" />
            </div>

            <div className="priority-selector">
                <label htmlFor="priority">Priority: </label>
                <select name="priority" defaultValue="300">
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
                <select name="state" defaultValue="0">
                    <option value="0">Open</option>
                    <option value="500">In Progress</option>
                    <option value="750">Blocked</option>
                    <option value="1000">Closed</option>
                </select>
            </div>

            <input type="hidden" name="authorId" value={this.props.meUser.id} />
            <input type="hidden" name="ownerId" value={this.props.meUser.id} />

            <input type="submit" value="Create" />
        </form>
    }

    render() {
        return <div>
            {this.renderForm()}
        </div>
    }
}
