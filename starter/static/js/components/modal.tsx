import * as React from "react";

export interface ModalProps {
    cancelFunc: () => {}
}

export class ModalComponent extends React.Component<ModalProps, {}> {

    renderCancelButton() {
        return <div
            className="cancel-button-container"
            onClick={this.props.cancelFunc}
        >
            x
        </div>
    }

    render() {
        return <div className="modal-container">
            <div className="background">
                <div className="modal card">
                    {this.renderCancelButton()}
                    {this.props.children}
                </div>
            </div>
        </div>
    }
}