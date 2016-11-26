import * as React from "react";
import {Tag, TagsById} from "../../models";
import {TokenizerComponent, Tokenizable} from "../tokenizer";

export interface EditTagProps {
    tag: Tag;
    tagsById: TagsById;
    updateTag: (tag: Tag) => void;
    deleteTag: (tag: Tag) => void;
}
export interface EditTagState {
    tag: Tag;
    tagsById: TagsById;
}

export class EditTagComponent extends React.Component<EditTagProps, EditTagState> {

    constructor(props: EditTagProps) {
        super(props);
        this.state = {
            tag: props.tag,
            tagsById: props.tagsById,
        }
    }

    componentWillReceiveProps(newProps: EditTagProps) {
        this.setState({
            tag: newProps.tag,
            tagsById: newProps.tagsById
        })
    }

    submitForm(eventType: string) {
        if (eventType == "save") {
            this.props.updateTag(this.state.tag);
        } else {
            this.props.deleteTag(this.state.tag);
        }
    }

    updateName(event: any) {
        this.state.tag.name = event.target.value;
        this.setState(this.state);
    }

    getCurrentChildren(): Array<Tokenizable> {
        const childrenNames: Array<Tokenizable> = [];
        this.state.tag.childTagIds.forEach((tagId) => {
            const tag = this.state.tagsById[tagId];
            childrenNames.push({
                label: tag.name,
                value: tag.id
            })
        });
        return childrenNames;
    }

    getAllTagNames(): Array<Tokenizable> {
        // This function is used to determine the set of valid tokens for the tokenizer.
        // We should think about excluding tokens from here that would cause cycles.
        const allNames: Array<Tokenizable> = [];
        Object.keys(this.state.tagsById).forEach((tagId) => {
            const tag = this.state.tagsById[+tagId];
            allNames.push({
                label: tag.name,
                value: tag.id
            })
        });
        return allNames;
    }

    retrieveChildNames(tokens: Array<Tokenizable>) {
        this.state.tag.childTagIds = tokens.map((token: Tokenizable) => {
            return token.value;
        });
        this.setState(this.state)
    }

    renderForm() {
        return <div>
            <div className="name-container">
                <label htmlFor="name">Name: </label>
                <input
                    type="text" name="name"
                    value={this.state.tag.name}
                    onChange={this.updateName.bind(this)}
                />
            </div>

            <div className="children-container">
                <label htmlFor="children">Children: </label>
                <TokenizerComponent
                    onChange={this.retrieveChildNames.bind(this)}
                    initialValues={this.getCurrentChildren()}
                    possibleTokens={this.getAllTagNames()}
                />
            </div>

            <input type="button" value="delete" onClick={this.submitForm.bind(this, "delete")} />
            <input type="button" value="save" onClick={this.submitForm.bind(this, "save")} />
        </div>
    }

    render() {
        return <div className="edit-tag-container">
            <h3>Tag Edit Form:</h3>
            {this.renderForm()}
        </div>
    }
}
