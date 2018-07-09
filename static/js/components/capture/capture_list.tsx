import * as React from "react";
import {User, CapturesById, Capture} from "../../models";
import {CreateCaptureComponent} from "./create_capture";

interface CaptureListProps {
    meUser: User
    capturesById: CapturesById
    createCapture: (capture: Capture) => void
    deleteCapture: (capture: Capture) => void
}

interface CaptureListState {
    lastSaved?: Capture
}

export class CaptureListComponent extends React.Component<CaptureListProps, CaptureListState> {

    constructor(props: CaptureListProps) {
        super(props);
        this.state = {
            lastSaved: null
        }
    }

    componentWillReceiveProps(newProps: CaptureListProps) {
        // Go through and see if there are new captures
        let newCapture: Capture | null = null;
        for (let captureId in newProps.capturesById) {
            if (!this.props.capturesById[captureId]) {
                newCapture = newProps.capturesById[captureId]
            }
        }
        this.setState({lastSaved: newCapture});
    }

    deleteCaptureById(captureId: number) {
        this.props.deleteCapture(this.props.capturesById[captureId])
    }

    renderOptions() {
        return <div className="capture-list-options"></div>
    }

    renderCreateCapture() {
        return <div className="card">
            <CreateCaptureComponent
                meUser={this.props.meUser}
                createCapture={this.props.createCapture}
                lastSaved={this.state.lastSaved}
            />
        </div>
    }

    renderDeleteButton(captureId: number) {
        return <div
            className="capture-delete"
            onClick={this.deleteCaptureById.bind(this, captureId)}
        >
            Delete
        </div>
    }

    renderCapture(capture: Capture) {
        return <div className="capture-container card" key={capture.id}>
            <div className="capture-content">
                {capture.content}
            </div>
            <div className="capture-options-container">
                {this.renderDeleteButton(capture.id)}
            </div>
        </div>
    }

    renderNoCaptures() {
        return <div className="captured-everything">
            You've captured everything! :)
        </div>
    }

    renderCaptures() {
        // Sort all the captures by creation time desc.
        let captures: Array<Capture> = Object.keys(this.props.capturesById).map((captureId) => {
            return this.props.capturesById[captureId]
        });
        captures.sort((capture1, capture2) => {
            return capture2.creationTime - capture1.creationTime
        });

        if (captures.length == 0) {
            return this.renderNoCaptures()
        }
        return <div className="capture-list-scroll-container">
            {captures.map(this.renderCapture.bind(this))}
        </div>
    }

    render() {
        return <div className="capture-list-container">
            {this.renderOptions()}
            {this.renderCreateCapture()}
            {this.renderCaptures()}
        </div>
    }
}