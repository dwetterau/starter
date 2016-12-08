import * as React from "react";
import {User, Event, TagsById} from "../../models";
import {TokenizerComponent, Tokenizable} from "../tokenizer";

export interface EditEventProps {
    meUser: User,
    event?: Event,
    tagsById: TagsById,
    createMode: boolean,
    initialCreationTime?: number,
    initialDurationSecs?: number,
    initialTags?: Array<number>,
    createEvent: (event: Event) => void,
    updateEvent: (event: Event) => void,
    deleteEvent: (event: Event) => void,
}
export interface EditEventState {
    event: Event,
    submitted: boolean,
}

export class EditEventComponent extends React.Component<EditEventProps, EditEventState> {

    constructor(props: EditEventProps) {
        super(props);
        if (props.createMode) {
            this.state = {
                event: this._getEmptyEvent(
                    props.meUser,
                    props.initialCreationTime,
                    props.initialDurationSecs,
                    props.initialTags
                ),
                submitted: false,
            }
        } else {
            this.state = {
                event: props.event,
                submitted: false,
            }
        }
    }

    componentWillReceiveProps(newProps: EditEventProps) {
        if (newProps.createMode) {
            const newEvent = this._getEmptyEvent(
                newProps.meUser,
                newProps.initialCreationTime,
                newProps.initialDurationSecs,
                newProps.initialTags
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
                newEvent.name = this.state.event.name
            }
            this.setState({event: newEvent, submitted: false})
        } else {
            this.setState({event: newProps.event, submitted: false})
        }
    }

    _getEmptyEvent(
        user: User,
        initialCreationTime?: number,
        initialDurationSecs?: number,
        initialTags?: Array<number>
    ): Event {
        return {
            id: 0,
            name: '',
            authorId: user.id,
            ownerId: user.id,
            tagIds: (initialTags) ? initialTags : [],
            startTime: (initialCreationTime) ? initialCreationTime: 0,
            durationSecs: (initialDurationSecs) ? initialDurationSecs: 900,
        }
    }

    submitForm(eventType: string) {
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
        this.state.submitted = true;
        this.setState(this.state)
    }

    onKeyDown(event: any) {
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

    renderFormTitle() {
        if (this.props.createMode) {
            return <h3>Create Event Form:</h3>
        } else {
            return <h3>Event Edit Form:</h3>
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
            <div className="name-container">
                <label htmlFor="name">Name: </label>
                <input
                    id="event-name"
                    type="text" name="name"
                    value={this.state.event.name}
                    onKeyDown={this.onKeyDown.bind(this)}
                    onChange={this.updateAttr.bind(this, "name")}
                />
            </div>

            <div className="tag-tokenizer-container">
                <TokenizerComponent
                    onChange={this.retrieveTagNames.bind(this)}
                    initialValues={this.getCurrentTags()}
                    possibleTokens={this.getAllTagNames()}
                />
            </div>

             <div className="start-time-container">
                <label htmlFor="start-time">Start time: </label>
                <input
                    type="number" name="start-time"
                    value={this.state.event.startTime}
                    onChange={this.updateAttr.bind(this, "startTime")}
                />
            </div>

             <div className="duration-secs-container">
                <label htmlFor="duration-secs">Duration (s): </label>
                <input
                    type="number" name="duration-secs"
                    value={this.state.event.durationSecs}
                    onChange={this.updateAttr.bind(this, "durationSecs")}
                />
            </div>
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
