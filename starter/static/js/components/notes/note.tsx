import * as React from "react";
import * as ReactMarkdown from "react-markdown";
import {Note, TagsById, User} from "../../models";
import {TagComponent} from "../tag/tag";
import {EditNoteComponent} from "./edit_note";
import {ModalComponent} from "../lib/modal";

export interface NoteProps {
    meUser: User,
    note: Note,
    tagsById: TagsById,
    updateNote: (note: Note) => void;
    deleteNote: (note: Note) => void,
}

interface NoteState {
    editing: boolean,
}

export class NoteComponent extends React.Component<NoteProps, NoteState> {

    constructor(props: NoteProps) {
        super(props);
        this.state = {
            editing: false,
        }
    }

    componentWillReceiveProps(props: NoteProps) {
        this.state = {editing: false}
    }

    toggleEditing() {
        this.setState({
            editing: !this.state.editing,
        });
    }

    renderNoteId() {
        return (
            <div className="note-id">
                N{this.props.note.id}
            </div>
        )
    }

    renderTag(tagId: number) {
        const tag = this.props.tagsById[tagId];
        return <TagComponent tag={tag} key={tagId}/>
    }

    renderTags() {
        if (!this.props.note.tagIds.length) {
            return;
        }
        return (
            <div className="note-tags-container">
                Tags:
                {this.props.note.tagIds.map(this.renderTag.bind(this))}
            </div>
        )
    }

    renderOptions() {
        return <div className="note-options">
            <div className="Edit" onClick={this.toggleEditing.bind(this)}>Edit</div>
        </div>
    }

    renderNoteHeader() {
        return <div className="note-header">
            <div className="note-title">{this.props.note.title}</div>
            <div className="note-right-header">
                {this.renderOptions()}
                {this.renderNoteId()}
            </div>
        </div>
    }

    renderEditingNote() {
        if (!this.state.editing) {
            return
        }
        return <ModalComponent cancelFunc={this.toggleEditing.bind(this)}>
            <EditNoteComponent
                meUser={this.props.meUser}
                note={this.props.note}
                tagsById={this.props.tagsById}
                createMode={false}
                createNote={(note: Note) => {}}
                updateNote={this.props.updateNote}
                deleteNote={this.props.deleteNote}
            />
        </ModalComponent>
    }

    renderNote() {
        if (this.state.editing) {
            return
        }
        return <div className="note-content">
            <ReactMarkdown
                source={this.props.note.content}
                escapeHtml={true}
                sourcePos={true}
            />
            {this.renderTags()}
        </div>
    }

    render() {
        return <div className="note card">
            {this.renderNoteHeader()}
            {this.renderNote()}
            {this.renderEditingNote()}
        </div>
    }
}
