import * as React from "react";

import {Tag} from "../models";

export interface TagGraphProps {
    tags: Array<Tag>,
}

interface TagGraph {[parentTagId: number]: Array<number>}
interface TagsById {[tagId: number]: Tag}
export interface TagGraphState {
    tagGraph: TagGraph,
    rootTagIds: Array<number>;
    tagsById: TagsById
}

export class TagGraphComponent extends React.Component<TagGraphProps, TagGraphState> {

    constructor(props: TagGraphProps) {
        super(props);
        this.state = this.getState(props);
    }

    componentWillReceiveProps(props: TagGraphProps) {
        this.setState(this.getState(props))
    }

    getState(props: TagGraphProps): TagGraphState {
        const tagsById: TagsById = {};
        for (let tag of props.tags) {
            tagsById[tag.id] = tag;
        }
        const [tagGraph, rootTagIds] = this.computeTagGraph(tagsById);
        return {
            tagGraph,
            rootTagIds,
            tagsById,
        }
    }

    computeTagGraph(tagsById: TagsById): [TagGraph, Array<number>] {
        const tagGraph: TagGraph = {};

        // Initially we think that all tags are root tags.
        const rootTagIds: {[tagId: string]: boolean} = {};
        Object.keys(tagsById).forEach((tagId) => {
            rootTagIds[tagId] = true;
        });
        Object.keys(tagsById).forEach((tagId) => {
            const tag = tagsById[+tagId];
            const childTagIds: Array<number> = [];
            for (let childTagId of tag.childTagIds) {
                childTagIds.push(childTagId);
                if (rootTagIds.hasOwnProperty("" + childTagId)) {
                    delete rootTagIds[childTagId]
                }
            }
            tagGraph[tag.id] = childTagIds;
        });

        const rootTagIdList: Array<number> = [];
        Object.keys(rootTagIds).forEach((rootTagId) => {
            rootTagIdList.push(+rootTagId)
        });

        return [tagGraph, rootTagIdList]
    }

    renderTag(tag: Tag) {
        return <div className="tag-container" key={tag.id}>
            Name: {tag.name}
        </div>
    }

    renderTags() {
        return <div className="tags-container">
            {/*this.state.tags.map(this.renderTag)*/}
        </div>
    }

    render() {
        return <div className="tag-graph">
            {this.renderTags()}
        </div>
    }
}
