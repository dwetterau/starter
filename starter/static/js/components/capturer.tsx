import * as jQuery from "jquery";
import * as React from "react";

import {Capture, User} from "../models";
import {CreateCaptureComponent} from "./capture/create_capture";

export interface CapturerProps {
    meUser: User,
}

interface CapturerState {
    lastSaved?: Capture,
}

export class Capturer extends React.Component<CapturerProps, CapturerState> {

    constructor(props: CapturerProps) {
        super(props);
        this.state = {
            lastSaved: null,
        }
    }

    createCapture(capture: Capture) {
        delete capture["id"];
        jQuery.post('/api/1/capture/create', capture, (newCaptureJSON: string) => {
            this.setState({lastSaved: JSON.parse(newCaptureJSON)});
        });
    }

    render() {
        return <div className="capturer-container">
            <CreateCaptureComponent
                meUser={this.props.meUser}
                createCapture={this.createCapture.bind(this)}
                lastSaved={this.state.lastSaved}
            />
        </div>
    }
}
