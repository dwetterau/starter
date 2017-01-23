import * as React from "react";
import {Event, TagsById} from "../../models";
import {TagComponent} from "../tag/tag";

export interface EventProps {
    event: Event,
    tagsById: TagsById,
}

export class EventComponent extends React.Component<EventProps, {}> {

    renderTag(tagId: number) {
        const tag = this.props.tagsById[tagId];
        return <TagComponent tag={tag} key={tagId}/>
    }

    renderName() {
        return <div className="name">
            {this.props.event.name}
        </div>
    };

    renderTags() {
        if (!this.props.event.tagIds.length) {
            return;
        }
        return (
            <div className="event-tags-container">
                {this.props.event.tagIds.map(this.renderTag.bind(this))}
            </div>
        )
    }

    renderTasks() {
        if (!this.props.event.taskIds.length) {
            return;
        }
        return (
            <div className="event-tasks-container">
                {this.props.event.taskIds.map((taskId) => {
                    return <div className="task-id-card card">
                        {`T${taskId}`}
                    </div>
                })}
            </div>
        )
    }

    render() {
        return <div className="event-container">
            {this.renderName()}
            <div className="event-card-container">
                {this.renderTags()}
                {this.renderTasks()}
            </div>
        </div>
    }
}
