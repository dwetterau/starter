import * as React from "react";
import {NotesById, User, Note, TagsById} from "../../models";
import {ModalComponent} from "../lib/modal";
import {EditNoteComponent} from "./edit_note";
import {NoteComponent} from "./note";

export interface NoteBoardProps {
    meUser: User,
    notesById: NotesById,
    tagsById: TagsById,
    createNote: (note: Note) => void,
    updateNote: (note: Note) => void,
    deleteNote: (note: Note) => void,
}

export interface NoteBoardState {
    creatingNote: boolean,
    editingNote?: Note,
    sortedNotes: Array<Note>,
}

export class NoteBoardComponent extends React.Component<NoteBoardProps, NoteBoardState> {

    constructor(props: NoteBoardProps) {
        super(props);
        this.state = this.getState(props)
    }

    componentWillReceiveProps(props: NoteBoardProps) {
        this.setState(this.getState(props))
    }

    getState(props: NoteBoardProps): NoteBoardState {
        return {
            sortedNotes: this.getSortedNotes(props),
            creatingNote: false,
            editingNote: null,
        }
    }

    getSortedNotes(props: NoteBoardProps): Array<Note> {
        let notes = [];
        for (let noteId of Object.keys(props.notesById)) {
            notes.push(props.notesById[noteId])
        }

        // Sort by creation time largest first
        notes.sort((n1: Note, n2: Note) => {
            return n2.creationTime - n1.creationTime;
        });

        return notes
    }

    onDoubleClick(note: Note) {
        this.state.editingNote = note;
        this.setState(this.state)
    }

    clearEditingNote() {
        this.state.editingNote = null;
        this.setState(this.state);
    }

    toggleCreateNote() {
        this.state.creatingNote = !this.state.creatingNote;
        this.setState(this.state);
    }

    renderNote(note: Note) {
        return <div
            key={note.id}
            className="note-container"
            onDoubleClick={this.onDoubleClick.bind(this, note)}
        >
            <NoteComponent
                note={note}
                tagsById={this.props.tagsById}
                updateNote={this.props.updateNote}
            />
        </div>
    }

    renderNotes() {
        return <div className="notes-container">
            {this.state.sortedNotes.map(this.renderNote.bind(this))}
        </div>
    }

    renderEditNote() {
        if (!this.state.editingNote) {
            return
        }
        return <ModalComponent cancelFunc={this.clearEditingNote.bind(this)}>
            <EditNoteComponent
                meUser={this.props.meUser}
                note={this.state.editingNote}
                tagsById={this.props.tagsById}
                createMode={false}
                createNote={(note: Note) => {}}
                updateNote={this.props.updateNote}
                deleteNote={this.props.deleteNote}
            />
        </ModalComponent>
    }

    renderCreateNote() {
        if (!this.state.creatingNote) {
            return <div className="create-note-button-container">
                <a onClick={this.toggleCreateNote.bind(this)}>Create New</a>
            </div>
        }
        return <ModalComponent cancelFunc={this.toggleCreateNote.bind(this)}>
            <EditNoteComponent
                meUser={this.props.meUser}
                tagsById={this.props.tagsById}
                createMode={true}
                createNote={this.props.createNote}
                updateNote={(note: Note) => {}}
                deleteNote={(note: Note) => {}}
            />
        </ModalComponent>
    }

    render() {
        return <div className="note-board">
            {this.renderCreateNote()}
            {this.renderEditNote()}
            {this.renderNotes()}
        </div>
    }
}
