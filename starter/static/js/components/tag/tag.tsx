import * as React from "react";
import {Tag} from "../../models";

export interface TagProps {
    tag: Tag,
}

export class TagComponent extends React.Component<TagProps, {}> {

    render() {
        return (
            <div className="tag card">
                {this.props.tag.name}
            </div>
        )
    }
}
