import * as React from "react";

import {Capture, User, CapturesById} from "../models";
import {CaptureListComponent} from "./capture/capture_list";
import {API} from "../api";

export interface CapturerProps {
    meUser: User
    captures: Array<Capture>
}

interface CapturerState {
    captures: Array<Capture>
    capturesById: CapturesById
}

export class Capturer extends React.Component<CapturerProps, CapturerState> {

    constructor(props: CapturerProps) {
        super(props);
        this.state = {
            captures: props.captures,
            capturesById: API.getCapturesById(props.captures)
        };
    }

    updateStateWithCaptures(captures: Array<Capture>) {
        this.setState({
            captures: captures,
            capturesById: API.getCapturesById(captures),
        })
    }

    componentWillReceiveProps(props: CapturerProps) {
        this.updateStateWithCaptures(props.captures);
    }

    createCapture(capture: Capture) {
        API.createCapture(capture, (capture) => {
            const newCaptures = this.state.captures.concat(capture);
            this.updateStateWithCaptures(newCaptures);
        });
    }

    deleteCapture(capture: Capture) {
        API.deleteCapture(capture, (deletedCapture) => {
            const filteredCaptures = this.state.captures.filter((capture: Capture) => {
                return capture.id != deletedCapture.id;
            });
            this.updateStateWithCaptures(filteredCaptures);
        });
    }

    render() {
        return <div className="capturer-container">
            <CaptureListComponent
                meUser={this.props.meUser}
                capturesById={this.state.capturesById}
                createCapture={this.createCapture.bind(this)}
                deleteCapture={this.deleteCapture.bind(this)}
            />
        </div>
    }
}
