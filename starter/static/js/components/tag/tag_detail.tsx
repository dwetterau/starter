import * as React from "react"
import {EventsById, Tag} from "../../models";

interface TagDetailProps {
    tag: Tag,
    eventsById: EventsById,
    closeCallback: () => void,
}

export class TagDetailComponent extends React.Component<TagDetailProps, {}> {
    refreshLoopId = 0;

    componentDidMount() {
        // Register a loop to keep refreshing the "time spent" estimates and percentage.
        let loop = () => {
            this.forceUpdate();
        };
        this.refreshLoopId = setInterval(loop, 10 * 1000);
    }

    componentWillUnmount() {
        if (this.refreshLoopId) {
            clearInterval(this.refreshLoopId)
        }
    }

    render() {
        return <div>YAY TAG DETAIL {this.props.tag.id} - {this.props.tag.name}</div>
    }
}
