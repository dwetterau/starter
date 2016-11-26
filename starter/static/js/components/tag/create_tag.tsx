import * as React from "react";
import {Tag, TagsById, User} from "../../models";
import {TokenizerComponent, Tokenizable} from "../tokenizer";

export interface CreateTagProps {
    meUser: User;
    tagsById: TagsById;
    createTag: (tag: Tag) => void;
}
export interface CreateTagState {
    tag: Tag;
}

export class CreateTagComponent extends React.Component<CreateTagProps, CreateTagState> {

    constructor(props: CreateTagProps) {
        super(props);
        this.state = {
            tag: {
                id: 0,
                name: '',
                childTagIds: [],
                ownerId: this.props.meUser.id,
            },
        }
    }

    submitForm() {
        this.props.createTag(this.state.tag);
    }

    updateName(event: any) {
        this.state.tag.name = event.target.value;
        this.setState(this.state);
    }

    getCurrentChildren(): Array<Tokenizable> {
        const childrenNames: Array<Tokenizable> = [];
        this.state.tag.childTagIds.forEach((tagId) => {
            const tag = this.props.tagsById[tagId];
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
        Object.keys(this.props.tagsById).forEach((tagId) => {
            const tag = this.props.tagsById[+tagId];
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

            <input type="button" value="create" onClick={this.submitForm.bind(this)} />
        </div>
    }

    render() {
        return <div className="create-tag-container">
            <h3>Create Tag Form:</h3>
            {this.renderForm()}
        </div>
    }
}
