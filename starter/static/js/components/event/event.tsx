import * as React from "react";
import {Event, TagsById} from "../../models";
import {TagComponent} from "../tag/tag";

export interface EventProps {
    event: Event,
    tagsById: TagsById,
}

export class EventComponent extends React.Component<EventProps, {}> {

    renderEventId() {
        return (
            <div className="event-id">
                E{this.props.event.id}
            </div>
        )
    }

    renderTag(tagId: number) {
        const tag = this.props.tagsById[tagId];
        return <TagComponent tag={tag} key={tagId}/>
    }

    renderTags() {
        if (!this.props.event.tagIds.length) {
            return;
        }
        return (
            <div className="event-tags-container">
                Tags:
                {this.props.event.tagIds.map(this.renderTag.bind(this))}
            </div>
        )
    }

    render() {
        return <div className="event-container">
            {this.renderEventId()}
            {this.props.event.name}
            {this.renderTags()}
        </div>
    }
}
