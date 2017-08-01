import * as React from "react";
import * as moment from "moment";
import {Note, TagsById} from "../../models";
import {TagComponent} from "../tag/tag";

export interface NoteProps {
    note: Note,
    tagsById: TagsById,
}

export class NoteComponent extends React.Component<NoteProps, {}> {

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

    render() {
        // TODO(davidw): Markdown rendering
        return <div className="note card">
            {this.renderNoteId()}
            <div className="note-title">{this.props.note.title}</div>
            <div className="note-content">{this.props.note.content}</div>
            {this.renderTags()}
        </div>
    }
}
