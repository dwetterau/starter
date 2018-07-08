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

    toggleCreateNote() {
        this.setState({
            creatingNote: !this.state.creatingNote,
        });
    }

    renderNote(note: Note) {
        return <div
            key={note.id}
            className="note-container"
        >
            <NoteComponent
                meUser={this.props.meUser}
                note={note}
                tagsById={this.props.tagsById}
                updateNote={this.props.updateNote}
                deleteNote={this.props.deleteNote}
            />
        </div>
    }

    renderNotes() {
        return <div className="notes-container">
            {this.state.sortedNotes.map(this.renderNote.bind(this))}
        </div>
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
            {this.renderNotes()}
        </div>
    }
}
