import * as React from "react";
import {User, Event, TagsById} from "../../models";
import {TokenizerComponent, Tokenizable} from "../tokenizer";

export interface EditEventProps {
    meUser: User,
    event?: Event,
    tagsById: TagsById,
    createMode: boolean,
    createEvent: (event: Event) => void,
    updateEvent: (event: Event) => void,
    deleteEvent: (event: Event) => void,
}
export interface EditEventState {
    event: Event,
}

export class EditEventComponent extends React.Component<EditEventProps, EditEventState> {

    constructor(props: EditEventProps) {
        super(props);
        if (props.createMode) {
            this.state = {
                event: this._getEmptyEvent(props.meUser)
            }
        } else {
            this.state = {
                event: props.event,
            }
        }
    }

    componentWillReceiveProps(newProps: EditEventProps) {
        if (newProps.createMode) {
            this.setState({
                event: this._getEmptyEvent(newProps.meUser),
            })
        } else {
            this.setState({
                event: newProps.event,
            })
        }
    }

    _getEmptyEvent(user: User): Event {
        return {
            id: 0,
            name: '',
            authorId: user.id,
            ownerId: user.id,
            tagIds: [],
            startTime: 0,
            durationSecs: 900, // TODO: Find out how these will be passed in
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
            <div className="title-container">
                <label htmlFor="name">Name: </label>
                <input
                    type="text" name="name"
                    value={this.state.event.name}
                    onChange={this.updateAttr.bind(this, "name")}
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

            <div className="tag-tokenizer-container">
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
        return <div className="edit-event-container">
            {this.renderFormTitle()}
            {this.renderForm()}
        </div>
    }
}
