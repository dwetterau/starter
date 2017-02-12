import * as React from "react";
import {Tag} from "../../models";
import {signalDisplayTagInfo} from "../../events";

export interface TagProps {
    tag: Tag,
}

export class TagComponent extends React.Component<TagProps, {}> {

    selectTag(e) {
        // We want to stop the event from continuing so that we can select tags on-top of other
        // elements.
        e.stopPropagation();
        let event = new CustomEvent(
            signalDisplayTagInfo,
            {'detail': this.props.tag.id},
        );
        document.dispatchEvent(event);
    }

    render() {
        return (
            <div
                className="tag card"
                onClick={this.selectTag.bind(this)}
            >
                {this.props.tag.name}
            </div>
        )
    }
}
