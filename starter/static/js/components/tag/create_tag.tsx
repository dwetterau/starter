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
