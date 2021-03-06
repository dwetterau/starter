import * as moment from "moment";
import * as React from "react";
import {User, Event, TagsById, TasksById, EventsById} from "../../models";
import {TokenizerComponent, Tokenizable} from "../tokenizer";

export interface EditEventProps {
    meUser: User,
    event?: Event,
    tagsById: TagsById,
    createMode: boolean,
    eventsById: EventsById,
    tasksById: TasksById,
    initialCreationTime?: number,
    initialDurationSecs?: number,
    initialTags?: Array<number>,
    initialTasks?: Array<number>,
    createEvent: (event: Event) => void,
    updateEvent: (event: Event) => void,
    deleteEvent: (event: Event) => void,
}
export interface EditEventState {
    event: Event,
    startNow: boolean,
    startAfterLast: boolean,
    endNow: boolean,
    submitted: boolean,
}

export class EditEventComponent extends React.Component<EditEventProps, EditEventState> {

    constructor(props: EditEventProps) {
        super(props);
        let event = null;
        if (props.createMode) {
            event = this._getEmptyEvent(
                props.meUser,
                props.initialCreationTime,
                props.initialDurationSecs,
                props.initialTags,
                props.initialTasks,
            );
        } else {
            event = props.event;
        }
        this.state = {
            event,
            startNow: false,
            startAfterLast: false,
            endNow: false,
            submitted: false,
        }
    }

    componentWillReceiveProps(newProps: EditEventProps) {
        let event = newProps.event;
        if (newProps.createMode) {
            const newEvent = this._getEmptyEvent(
                newProps.meUser,
                newProps.initialCreationTime,
                newProps.initialDurationSecs,
                newProps.initialTags,
                newProps.initialTasks,
            );
            if (this.state && !this.state.submitted) {
                // Copy over the name field so it doesn't get cleared out. As well as all fields
                // that weren't set in the new props.
                if (newProps.initialCreationTime == null) {
                    newEvent.startTime = this.state.event.startTime
                }
                if (newProps.initialDurationSecs == null) {
                    newEvent.durationSecs = this.state.event.durationSecs
                }
                if (!(newProps.initialTags && newProps.initialTags.length)) {
                    newEvent.tagIds = this.state.event.tagIds
                }
                if (!(newProps.initialTasks && newProps.initialTasks.length)) {
                    newEvent.taskIds = this.state.event.taskIds;
                }
                newEvent.name = this.state.event.name
            }
            event = newEvent;
        }
        this.setState({event: event});
    }

    _getEmptyEvent(
        user: User,
        initialCreationTime?: number,
        initialDurationSecs?: number,
        initialTags?: Array<number>,
        initialTasks?: Array<number>,
    ): Event {
        return {
            id: 0,
            name: '',
            authorId: user.id,
            ownerId: user.id,
            tagIds: (initialTags) ? initialTags : [],
            startTime: (initialCreationTime) ? initialCreationTime: 0,
            durationSecs: (initialDurationSecs) ? initialDurationSecs: 900,
            taskIds: (initialTasks) ? initialTasks: [],
        }
    }

    toggleStartNow() {
        const startNow = !this.state.startNow;
        let startAfterLast = this.state.startAfterLast;
        if (startNow) {
            startAfterLast = false;
        }

        this.setState({
            startAfterLast: startAfterLast,
            startNow: startNow,
        });
    }

    toggleStartAfterLast() {
        const startAfterLast = !this.state.startAfterLast;
        let startNow = this.state.startNow;
        if (startAfterLast) {
            startNow = false;
        }

        this.setState({
            startAfterLast: startAfterLast,
            startNow: startNow,
        });
    }

    toggleEndNow() {
        this.setState({endNow: !this.state.endNow});
    }

    submitForm(eventType: string) {
        let now = moment().unix() * 1000;
        if (this.state.startNow) {
            let currentEndTime = this.state.event.startTime + (
                this.state.event.durationSecs * 1000
            );
            this.state.event.startTime = now;
            this.state.event.durationSecs = Math.floor((currentEndTime - now) / 1000)
        } else if (this.state.startAfterLast) {
            let candidateStartTime = 0;
            for (let eventId of Object.keys(this.props.eventsById)) {
                let event = this.props.eventsById[eventId];
                let endTime = event.startTime + (event.durationSecs * 1000);
                if (endTime > candidateStartTime && endTime <= this.state.event.startTime) {
                    candidateStartTime = endTime;
                }
            }

            // If the last event wasn't within 24 hours, just use now
            if (now - candidateStartTime > 24 * 60 * 60 * 1000) {
                candidateStartTime = now;
            }
            this.state.event.startTime = candidateStartTime;
        }

        if (this.state.endNow) {
            if (now > this.state.event.startTime) {
                // This only makes sense to do if the start time is in the past.
                this.state.event.durationSecs = Math.floor(
                    (now - this.state.event.startTime) / 1000
                );
            }
        }

        // Lets do some magic auto-name filling if name isn't set.
        if (!this.state.event.name.trim().length) {
            this.state.event.name = this.autoFillName()
        }

        if (eventType == "save") {
            this.props.updateEvent(this.state.event);
        } else if (eventType == "delete") {
            this.props.deleteEvent(this.state.event);
        } else if (eventType == "create") {
            this.props.createEvent(this.state.event);
        } else {
            throw Error("Unknown submit type!");
        }
        // Reset the form after a submission. We don't clear anything out in case the
        // request fails. We wait for the new props to actually clear it out.
        this.setState({submitted: true})
    }

    autoFillName(): string {
        const event = this.state.event;
        if (event.taskIds.length == 1) {
            return `Working on T${event.taskIds[0]}`
        }
        if (event.tagIds.length > 0) {
            const tagNames = this.getCurrentTags();

            if (event.tagIds.length == 2) {
                return `${tagNames[0].label} & ${tagNames[1].label}`
            } else if (event.tagIds.length == 1) {
                return `${tagNames[0].label}`
            }
        }

        return ''
    }

    onKeyDownCreate(event: any) {
        if (event.key == "Enter" && this.props.createMode) {
            this.submitForm("create");
        }
    }

    updateAttr(attrName: string, event: any) {
        this.state.event[attrName] = event.target.value;
        this.setState(this.state);
    }

    getCurrentTags(): Array<Tokenizable> {
        const tagNames: Array<Tokenizable> = [];
        this.state.event.tagIds.forEach((tagId) => {
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
        this.state.event.tagIds = tokens.map((token: Tokenizable) => {
            return token.value;
        });
        this.setState(this.state)
    }

    getCurrentTasks(): Array<Tokenizable> {
        // TODO: Do after we have the format
        return this.state.event.taskIds.map((taskId) => {
            let task = this.props.tasksById[taskId];
            return {
                label: `T${taskId}`,
                subtext: task.title,
                value: taskId,
            }
        })
    }

    getAllTaskNames(): Array<Tokenizable> {
        let names = [];
        for (let taskId in this.props.tasksById) {
            let task = this.props.tasksById[taskId];
            names.push({
                label: `T${taskId}`,
                subtext: task.title,
                value: taskId
            })
        }
        return names;
    }

    onTagTokenizerExit() {
        if (this.props.createMode) {
            this.submitForm("create");
        }
    }

    retrieveTaskNames(tokens: Array<Tokenizable>) {
        // Determine if there are any new ids.
        let oldTaskIdMap = {};
        for (let taskId of this.state.event.taskIds) {
            oldTaskIdMap[taskId] = true;
        }

        let newTaskIds = [];
        this.state.event.taskIds = tokens.map((token: Tokenizable) => {
            if (!oldTaskIdMap.hasOwnProperty(token.value)) {
                newTaskIds.push(token.value);
            }
            return token.value;
        });

        // With the new TaskIds, see if there are any tag ids that we don't currently have
        let oldTagIdMap = {};
        for (let tagId of this.state.event.tagIds) {
            oldTagIdMap[tagId] = true;
        }
        for (let taskId of newTaskIds) {
            for (let tagId of this.props.tasksById[taskId].tagIds) {
                if (!oldTagIdMap.hasOwnProperty(tagId + "")) {
                    this.state.event.tagIds.push(tagId);
                }
            }
        }

        this.setState(this.state);
    }

    renderFormTitle() {
        if (this.props.createMode) {
            return <h3>Create Event</h3>
        } else {
            return <h3>Editing E{this.state.event.id}</h3>
        }
    }

    renderButtons() {
        if (this.props.createMode) {
             return (
                <div className="edit-event-button-container">
                    <input type="button" value="create"
                           onClick={this.submitForm.bind(this, "create")} />
                </div>
            )
        } else {
            return (
                <div className="edit-event-button-container">
                    <input type="button" value="delete"
                           onClick={this.submitForm.bind(this, "delete")} />
                    <input type="button" value="save"
                           onClick={this.submitForm.bind(this, "save")} />
                </div>
            )
        }
    }

    renderForm() {
        return <div>
            <div className="tag-tokenizer-container">
                <label>Tags:</label>
                <TokenizerComponent
                    onChange={this.retrieveTagNames.bind(this)}
                    onExit={this.onTagTokenizerExit.bind(this)}
                    initialValues={this.getCurrentTags()}
                    possibleTokens={this.getAllTagNames()}
                />
            </div>

            <div className="name-container">
                <label htmlFor="name">Name: </label>
                <input
                    id="event-name"
                    type="text" name="name"
                    value={this.state.event.name}
                    onKeyDown={this.onKeyDownCreate.bind(this)}
                    onChange={this.updateAttr.bind(this, "name")}
                />
            </div>

            <div className="task-tokenizer-container">
                <label>Tasks:</label>
                <TokenizerComponent
                    onChange={this.retrieveTaskNames.bind(this)}
                    initialValues={this.getCurrentTasks()}
                    possibleTokens={this.getAllTaskNames()}
                />
            </div>

            <div className="start-now checkbox-container">
                <label onClick={this.toggleStartNow.bind(this)}>Start Now?</label>
                <input
                    type="checkbox"
                    onChange={this.toggleStartNow.bind(this)}
                    checked={this.state.startNow}
                />
            </div>

            <div className="start-now checkbox-container">
                <label onClick={this.toggleStartAfterLast.bind(this)}>After Last?</label>
                <input
                    type="checkbox"
                    onChange={this.toggleStartAfterLast.bind(this)}
                    checked={this.state.startAfterLast}
                />
            </div>

            <div className="end-now checkbox-container">
                <label onClick={this.toggleEndNow.bind(this)}>End Now?</label>
                <input
                    type="checkbox"
                    onChange={this.toggleEndNow.bind(this)}
                    checked={this.state.endNow}
                />
            </div>

            {/*TODO: Add a start time selector dropdown*/}
            {/*TODO: More granular duration adjustment*/}
            {this.renderButtons()}
        </div>
    }

    render() {
        return <div className="edit-event-container">
            {this.renderFormTitle()}
            {this.renderForm()}
        </div>
    }
}
