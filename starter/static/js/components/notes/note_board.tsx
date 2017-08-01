import * as React from "react";
import {NotesById, User, Note, TagsById} from "../../models";
import {ModalComponent} from "../lib/modal";

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
}

export class NoteBoardComponent extends React.Component<NoteBoardProps, NoteBoardState> {

    clearEditingNote() {
        this.state.editingNote = null;
        this.setState(this.state);
    }

    toggleCreateNote() {
        this.state.creatingNote = !this.state.creatingNote;
        this.setState(this.state);
    }

    renderNotes() {
        // TODO(davidw): Render them
        return <div className="notes-container">
            insert notes here..
        </div>
    }

    renderEditNote() {
        if (!this.state.editingNote) {
            return
        }
        return <ModalComponent cancelFunc={this.clearEditingNote.bind(this)}>
            <EditNoteComponent
                tag={this.state.editingNote}
                tagsById={this.props.tagsById}
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
            <CreateNoteComponent
                meUser={this.props.meUser}
                createNote={this.props.createNote}
                tagsById={this.props.tagsById} />
        </ModalComponent>
    }

    render() {
        return <div className="note-board">
            {this.renderNotes()}
            {this.renderEditNote()}
            {this.renderCreateNote()}
        </div>
    }
}
