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
            capturesById: Capturer.getCapturesById(props.captures)
        };
    }

    static getCapturesById(captures: Array<Capture>): CapturesById {
        const capturesById:  CapturesById = {};
        for (let capture of captures) {
            capturesById[capture.id] = capture;
        }
        return capturesById;
    }

    updateStateWithCaptures(captures: Array<Capture>) {
        this.setState({
            captures: captures,
            capturesById: Capturer.getCapturesById(captures),
        })
    }

    componentWillReceiveProps(props: CapturerProps) {
        this.updateStateWithCaptures(props.captures);
    }

    createCapture(capture: Capture) {
        const requestedCapture = {
            content: capture.content,
            creationTime: capture.creationTime,
            authorId: capture.authorId,
        };
        jQuery.post('/api/1/capture/create', requestedCapture, (newCaptureJson: string) => {
            const newCaptures = this.state.captures.concat([JSON.parse(newCaptureJson)]);
            this.updateStateWithCaptures(newCaptures);
        });
    }

    deleteCapture(capture: Capture) {
        jQuery.post('/api/1/capture/delete', {id: capture.id}, (deletedCaptureJson: string) => {
            const deletedCaptureId = JSON.parse(deletedCaptureJson).id;
            const filteredCaptures = this.state.captures.filter((capture: Capture) => {
                return capture.id != deletedCaptureId;
            });
            this.updateStateWithCaptures(filteredCaptures);
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
