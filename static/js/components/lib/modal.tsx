import * as jQuery from "jquery";
import * as React from "react";

export interface ModalProps {
    cancelFunc: () => {}
}

export class ModalComponent extends React.Component<ModalProps, {}> {


    componentDidMount() {
        // Focus the first input element after the modal appears.
        let modalElements = document.getElementsByClassName("modal");
        if (modalElements.length > 0) {
            let inputElements = modalElements[0].getElementsByTagName("input");
            if (inputElements.length > 0) {
                inputElements[0].focus();
            }
        }

        // Add an escape handler to close the modal
        jQuery(document).bind("keyup.modalComponent", (e) => {
            if (e.which == 27) {
                this.props.cancelFunc();
            }
        })
    }

    componentWillUnmount() {
        jQuery(document).unbind("keyup.modalComponent");
    }

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