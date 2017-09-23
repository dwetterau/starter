import * as moment from "moment";
import * as React from "react";
import Textarea from "react-textarea-autosize";
import {Note, TagsById, User} from "../../models";
import {TokenizerComponent, Tokenizable} from "../tokenizer";

export interface EditNoteProps {
    meUser: User,
    note?: Note;
    tagsById: TagsById,
    createMode: boolean,
    createNote: (note: Note) => void;
    updateNote: (note: Note) => void;
    deleteNote: (note: Note) => void;
}
export interface EditNoteState {
    note: Note;
}

export class EditNoteComponent extends React.Component<EditNoteProps, EditNoteState> {

    constructor(props: EditNoteProps) {
        super(props);
        if (props.createMode) {
            this.state = {
                note: this._getEmptyNote(props)
            }
        } else {
            this.state = {
                note: props.note,
            }
        }
    }

    componentWillReceiveProps(newProps: EditNoteProps) {
        if (newProps.createMode) {
            this.setState({
                note: this._getEmptyNote(newProps)
            })
        } else {
            this.setState({
                note: newProps.note,
            })
        }
    }

    _getEmptyNote(props: EditNoteProps): Note {
        let note: Note = {
            id: 0,
            title: '',
            content: '',
            authorId: props.meUser.id,
            creationTime: moment().unix() * 1000,
            tagIds: [],
        };
        // TODO(davidw): Initial tags?
        return note
    }

    submitForm(eventType: string) {
        if (eventType == "save") {
            this.props.updateNote(this.state.note);
        } else if (eventType == "delete") {
            this.props.deleteNote(this.state.note);
        } else if (eventType == "create") {
            this.props.createNote(this.state.note);
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
        this.state.note[attrName] = event.target.value;
        this.setState(this.state);
    }

    getCurrentTags(): Array<Tokenizable> {
        const tagNames: Array<Tokenizable> = [];
        this.state.note.tagIds.forEach((tagId) => {
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
        this.state.note.tagIds = tokens.map((token: Tokenizable) => {
            return token.value;
        });
        this.setState(this.state)
    }

    renderFormTitle() {
        if (this.props.createMode) {
            return <h3>Create Note</h3>
        } else {
            return <h3>Editing N{this.state.note.id}</h3>
        }
    }

    renderButtons() {
        if (this.props.createMode) {
             return (
                <div className="edit-note-button-container">
                    <input type="button" value="create"
                           onClick={this.submitForm.bind(this, "create")} />
                </div>
            )
        } else {
            return (
                <div className="edit-note-button-container">
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
                <label htmlFor="title">Title: </label>
                <input
                    type="text" name="title"
                    value={this.state.note.title}
                    onKeyDown={this.onKeyDownCreate.bind(this)}
                    onChange={this.updateAttr.bind(this, "title")}
                />
            </div>

            <div className="content-container">
                <label htmlFor="content">Description: </label>
                <Textarea
                    type="text"
                    name="content"
                    value={this.state.note.content}
                    onChange={this.updateAttr.bind(this, "content")}
                />
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
        return <div className="edit-note-container">
            {this.renderFormTitle()}
            {this.renderForm()}
        </div>
    }
}
