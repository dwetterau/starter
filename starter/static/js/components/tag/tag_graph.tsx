import * as React from "react";

import {Tag, TagsById, User} from "../../models";
import {EditTagComponent} from "./edit_tag";
import {CreateTagComponent} from "./create_tag";

export interface TagGraphProps {
    meUser: User,
    tagsById: TagsById,
    createTag: (tag: Tag) => void,
    updateTag: (tag: Tag) => void,
    deleteTag: (tag: Tag) => void,
}

interface TagGraph {[parentTagId: number]: Array<number>}
export interface TagGraphState {
    tagGraph: TagGraph,
    rootTagIds: Array<number>,
    tagsById: TagsById,
    editingTag?: Tag,
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
        const [tagGraph, rootTagIds] = this.computeTagGraph(props.tagsById);
        return {
            tagGraph: tagGraph,
            rootTagIds: rootTagIds,
            tagsById: props.tagsById,
            editingTag: null,
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

    onDoubleClick(tag: Tag, event: any) {
        // Idk, open an editor modal or something
        this.state.editingTag = tag;
        this.setState(this.state);

        // Don't let this keep going to the parent element.
        event.preventDefault();
        event.stopPropagation();
    }

    renderTagById(tagId: number) {
        const tag = this.state.tagsById[tagId];

        const renderChildren = () => {
            if (tag.childTagIds.length == 0) {
                return
            }
            return (
                <div className="tag-children-container">
                    {tag.childTagIds.map(this.renderTagById.bind(this))}
                </div>
            )
        };

        return <div
            className="tag-container"
            key={tag.id}
            onDoubleClick={this.onDoubleClick.bind(this, tag)}
        >
            Name: {tag.name}
            {renderChildren()}
        </div>
    }

    renderFromRootTagId(rootTagId: number) {
        return <div className="tags-root-container" key={rootTagId}>
            {this.renderTagById(rootTagId)}
        </div>
    }

    renderTags() {
        return <div className="tags-container">
            {this.state.rootTagIds.map(this.renderFromRootTagId.bind(this))}
        </div>
    }

    renderEditingTag() {
        if (!this.state.editingTag) {
            return
        }
        return <EditTagComponent tag={this.state.editingTag}
                                 tagsById={this.state.tagsById}
                                 updateTag={this.props.updateTag}
                                 deleteTag={this.props.deleteTag} />
    }

    renderCreateTag() {
        return <CreateTagComponent
            meUser={this.props.meUser}
            createTag={this.props.createTag}
            tagsById={this.state.tagsById}
        />
    }

    render() {
        return <div className="tag-graph">
            {this.renderTags()}
            {this.renderEditingTag()}
            {this.renderCreateTag()}
        </div>
    }
}
