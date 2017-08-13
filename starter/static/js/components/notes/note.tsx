import * as jQuery from "jquery";
import * as React from "react";
import * as ReactDOM from "react-dom";
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

    renderedMarkdown: ReactMarkdown;

    constructor(props: NoteProps) {
        super(props);
        this.state = {
            editing: false,
        }
    }

    componentWillReceiveProps(props: NoteProps) {
        this.state = {editing: false}
    }

    componentDidMount() {
       this.checkboxHandling()
    }

    componentDidUpdate() {
        this.checkboxHandling()
    }

    checkboxHandling() {
        // See if we have any checkboxes within it.
        let dom = ReactDOM.findDOMNode(this.renderedMarkdown);
        let checkboxes: any = jQuery(dom).find('input[type=checkbox]');
        if (!checkboxes.length) {
            return
        }

        for (let checkbox of checkboxes) {
            // See if it's checked or not. If so, add a class that we can use
            // to render strikethrough stuff.
            if (jQuery(checkbox).prop("checked")) {
                jQuery(checkbox.parentNode.parentNode).addClass("checked")
            } else {
                jQuery(checkbox.parentNode.parentNode).removeClass("checked")
            }

            // Add a listener for clicking to update the markdown (maximum hacks)
            checkbox.onclick = function(e) {
                let position = e.target.dataset['sourcepos'].split(":");
                let line = parseInt(position[0]) - 1;
                let splitContent = this.props.note.content.split("\n");
                let current = splitContent[line][1];
                if (splitContent[line][0] != "[" || splitContent[line][2] != "]") {
                    throw Error("Invalid checkbox click")
                }
                let newChar = ' ';
                if (current == ' ') {
                    newChar = 'x';
                }
                splitContent[line] =
                    splitContent[line].substr(0, 1) +
                    newChar +
                    splitContent[line].substring(2);

                // Actually update the content
                let n = this.props.note;
                n.content = splitContent.join("\n");
                this.props.updateNote(n);
            }.bind(this)
        }
    }

    toggleEditing() {
        this.state.editing = !this.state.editing;
        this.setState(this.state);
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
                ref={(markdown) => {this.renderedMarkdown = markdown;}}
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
