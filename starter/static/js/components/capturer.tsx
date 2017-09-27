import * as jQuery from "jquery";
import * as React from "react";

import {Capture, User, CapturesById} from "../models";
import {CaptureListComponent} from "./capture/capture_list";

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
            capturesById: {}
        };

        Capturer.updateCapturesById(this.state);
    }

    componentWillReceiveProps(props: CapturerProps) {
        this.state.captures = props.captures;
        Capturer.updateCapturesById(this.state);
    }

    // TODO(david): Figure out how to not duplicate this across App
    static updateCapturesById(state: CapturerState) {
        const capturesById:  CapturesById = {};
        for (let capture of state.captures) {
            capturesById[capture.id] = capture;
        }
        state.capturesById = capturesById;
    }

    createCapture(capture: Capture) {
        delete capture["id"];
        jQuery.post('/api/1/capture/create', capture, (newCaptureJson: string) => {
            this.state.captures.push(JSON.parse(newCaptureJson));
            Capturer.updateCapturesById(this.state);
            this.setState(this.state)
        });
    }

    deleteCapture(capture: Capture) {
        jQuery.post('/api/1/capture/delete', {id: capture.id}, (deletedCaptureJson: string) => {
            const deletedCaptureId = JSON.parse(deletedCaptureJson).id;
            this.state.captures = this.state.captures.filter((capture: Capture) => {
                return capture.id != deletedCaptureId;
            });
            Capturer.updateCapturesById(this.state);
            this.setState(this.state);
        })
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
