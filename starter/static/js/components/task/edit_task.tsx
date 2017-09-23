import "react-datetime/css/react-datetime.css";
import * as React from "react";
import {User, Task, TagsById} from "../../models";
import {TokenizerComponent, Tokenizable} from "../tokenizer";
import * as Datetime from "react-datetime"
import * as moment from "moment";

export interface EditTaskProps {
    meUser: User,
    task?: Task,
    tagsById: TagsById,
    createMode: boolean,
    initialPriority?: number,
    initialState?: number,
    initialTags?: Array<number>,
    createTask: (task: Task) => void,
    updateTask: (task: Task) => void,
    deleteTask: (task: Task) => void,
}
export interface EditTaskState {
    task: Task,
}

export class EditTaskComponent extends React.Component<EditTaskProps, EditTaskState> {

    constructor(props: EditTaskProps) {
        super(props);
        if (props.createMode) {
            this.state = {
                task: this._getEmptyTask(props)
            }
        } else {
            this.state = {
                task: props.task,
            }
        }
    }

    componentWillReceiveProps(newProps: EditTaskProps) {
        if (newProps.createMode) {
            this.setState({
                task: this._getEmptyTask(newProps),
            })
        } else {
            this.setState({
                task: newProps.task,
            })
        }
    }

    _getEmptyTask(props: EditTaskProps): Task {
        let task: Task = {
            id: 0,
            title: '',
            description: '',
            authorId: props.meUser.id,
            ownerId: props.meUser.id,
            tagIds: [],
            priority: 0,
            state: 0,
            eventIds: [],
            expectedDurationSecs: 0,
            dueTime: 0,
        };
        if (props.initialPriority) {
            task.priority = props.initialPriority
        }
        if (props.initialState) {
            task.state = props.initialState
        }
        if (props.initialTags) {
            task.tagIds = props.initialTags
        }
        return task
    }

    submitForm(eventType: string) {
        if (eventType == "save") {
            this.props.updateTask(this.state.task);
        } else if (eventType == "delete") {
            this.props.deleteTask(this.state.task);
        } else if (eventType == "create") {
            this.props.createTask(this.state.task);
        } else {
            throw Error("Unknown submit type!");
        }
    }

    onKeyDownCreate(event: any) {
        if (event.key == "Enter" && this.props.createMode) {
            this.submitForm("create");
        }
    }

    updateAttr(attrName: string, event: any) {
        this.state.task[attrName] = event.target.value;
        this.setState(this.state);
    }

    updateEstimate(event: any) {
        let newDuration = event.target.value;
        this.state.task.expectedDurationSecs = newDuration * 60;
        this.setState(this.state)
    }

    updateDueTime(time: moment.Moment) {
        this.state.task.dueTime = time.unix() * 1000;
        this.setState(this.state)
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

    renderFormTitle() {
        if (this.props.createMode) {
            return <h3>Create Task</h3>
        } else {
            return <h3>Editing T{this.state.task.id}</h3>
        }
    }

    renderButtons() {
        if (this.props.createMode) {
             return (
                <div className="edit-task-button-container">
                    <input type="button" value="create"
                           onClick={this.submitForm.bind(this, "create")} />
                </div>
            )
        } else {
            return (
                <div className="edit-task-button-container">
                    <input type="button" value="delete"
                           onClick={this.submitForm.bind(this, "delete")} />
                    <input type="button" value="save"
                           onClick={this.submitForm.bind(this, "save")} />
                </div>
            )
        }
    }

    renderDueTime() {
        if (this.state.task.dueTime > 0) {
            let initialDate = moment(this.state.task.dueTime).toDate();
            return <Datetime
                value={initialDate}
                timeFormat={false}
                closeOnSelect={true}
                onChange={this.updateDueTime.bind(this)}
            />
        }

        return <Datetime
            timeFormat={false}
            closeOnSelect={true}
            onChange={this.updateDueTime.bind(this)}
        />
    }

    renderForm() {
        return <div>
            <div className="title-container">
                <label htmlFor="title">Title: </label>
                <input
                    type="text" name="title"
                    value={this.state.task.title}
                    onKeyDown={this.onKeyDownCreate.bind(this)}
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

            <div className="estimate-container">
                <label htmlFor="estimate">Estimated Time (minutes): </label>
                <input
                    type="number" name="estimate"
                    value={Math.round(this.state.task.expectedDurationSecs / 60)}
                    onChange={this.updateEstimate.bind(this)}
                />
            </div>

            <div className="priority-selector">
                <label htmlFor="priority">Priority: </label>
                <select name="priority" value={this.state.task.priority}
                        onChange={this.updateAttr.bind(this, "priority")} >
                    <option value="0">Unknown</option>
                    <option value="500">Highest</option>
                    <option value="400">High</option>
                    <option value="300">Normal</option>
                    <option value="200">Low</option>
                    <option value="100">Lowest</option>
                </select>
            </div>

            <div className="state-selector">
                <label htmlFor="state">Status: </label>
                <select name="state" value={this.state.task.state}
                        onChange={this.updateAttr.bind(this, "state")} >
                    <option value="0">Open</option>
                    <option value="500">In Progress</option>
                    <option value="750">Blocked</option>
                    <option value="900">Project</option>
                    <option value="1000">Closed</option>
                </select>
            </div>

            <div className="due-time-selector">
                <label htmlFor="dueTime">Due date:</label>
                {this.renderDueTime()}
            </div>

            <div className="tag-tokenizer-container">
                <label>Tags:</label>
                <TokenizerComponent
                    onChange={this.retrieveTagNames.bind(this)}
                    initialValues={this.getCurrentTags()}
                    possibleTokens={this.getAllTagNames()}
                />
            </div>

            {this.renderButtons()}
        </div>
    }

    render() {
        return <div className="edit-task-container">
            {this.renderFormTitle()}
            {this.renderForm()}
        </div>
    }
}
