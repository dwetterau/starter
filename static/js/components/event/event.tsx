import * as React from "react";
import {Event, TagsById} from "../../models";
import {TagComponent} from "../tag/tag";
import {signalDisplayTaskInfo} from "../../events";

export interface EventProps {
    event: Event,
    tagsById: TagsById,
}

export class EventComponent extends React.Component<EventProps, {}> {

    selectTask(taskId: number) {
        let event = new CustomEvent(
            signalDisplayTaskInfo,
            {'detail': taskId},
        );
        document.dispatchEvent(event);
    }

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
        return this.props.event.tagIds.map(this.renderTag.bind(this))
    }

    renderTasks() {
        if (!this.props.event.taskIds.length) {
            return;
        }
        return this.props.event.taskIds.map((taskId) => {
            return <div
                className="task-id-card card"
                key={`T${taskId}`}
                onClick={this.selectTask.bind(this, taskId)}
            >
                {`T${taskId}`}
            </div>
        });
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