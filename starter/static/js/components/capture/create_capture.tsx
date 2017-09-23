import * as moment from "moment";
import * as React from "react";
import {Capture, User} from "../../models";

export interface CreateCaptureProps {
    meUser: User
    createCapture: (capture: Capture) => void
    lastSaved?: Capture
}

interface CreateCaptureState {
    capture: Capture
}

export class CreateCaptureComponent extends React.Component<CreateCaptureProps, CreateCaptureState> {

    constructor(props: CreateCaptureProps) {
        super(props);
        this.state = {
            capture: this._getEmptyCapture(props)
        }
    }

    componentWillReceiveProps(newProps: CreateCaptureProps) {
        // Only clear out our message if we just saved a capture with the same
        // content.
        if (newProps.lastSaved != null
            && newProps.lastSaved.content == this.state.capture.content) {

            this.setState({
                capture: this._getEmptyCapture(newProps)
            })
        }
    }

    _getEmptyCapture(props: CreateCaptureProps): Capture {
        let capture: Capture = {
            id: 0,
            content: '',
            authorId: props.meUser.id,
            creationTime: moment().unix() * 1000,
        };
        // TODO(davidw): Initial tags?
        return capture
    }

    submitForm(eventType: string) {
        if (eventType == "create") {
            this.props.createCapture(this.state.capture);
        } else {
            throw Error("Unknown submit type!");
        }
    }

    updateAttr(attrName: string, event: any) {
        this.state.capture[attrName] = event.target.value;
        this.setState(this.state);
    }

    renderButtons() {
        return (
            <div className="create-capture-button-container">
                <input type="button" value="create"
                       onClick={this.submitForm.bind(this, "create")} />
            </div>
        )
    }
    
    renderForm() {
        return <div>
            <div className="content-container">
                <textarea
                    name="content"
                    value={this.state.capture.content}
                    onChange={this.updateAttr.bind(this, "content")}
                />
            </div>

            {this.renderButtons()}
        </div>
    }

    render() {
        return <div className="create-capture-container">
            <h1>Capture Something...</h1>
            {this.renderForm()}
        </div>
    }
}
