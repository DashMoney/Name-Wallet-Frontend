import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import CloseButton from "react-bootstrap/CloseButton";

import handleDenomDisplay from "../UnitDisplay";

import "./ConfirmPaymentModal.css";

class ConfirmRequestModal extends React.Component {
  handleCloseClick = () => {
    this.props.hideModal();
  };

  handleSubmitClick = (event) => {
    event.preventDefault();
    this.props.handleClearModalPostPmtConfirm();
    // this.props.sendDashtoName();
    this.props.requestDashfromName();
    this.handleCloseClick();
  };

  render() {
    let modalBkg = "";
    let closeButtonColor;
    let modalBackdrop;

    if (this.props.mode === "primary") {
      modalBackdrop = "modal-backdrop-nochange";
      modalBkg = "modal-backcolor-primary";
      closeButtonColor = <CloseButton onClick={this.handleCloseClick} />;
    } else {
      modalBackdrop = "modal-backdrop-dark";
      modalBkg = "text-bg-dark";
      closeButtonColor = (
        <CloseButton onClick={this.handleCloseClick} variant="white" />
      );
    }

    return (
      <>
        <Modal
          contentClassName={modalBkg}
          backdropClassName={modalBackdrop}
          show={this.props.isModalShowing}
        >
          <Modal.Header>
            <Modal.Title>Confirm Payment Request</Modal.Title>
            {closeButtonColor}
          </Modal.Header>
          <Modal.Body>
            <h6>
              Request{" "}
              <b>
                {handleDenomDisplay(
                  this.props.whichNetwork,
                  this.props.amountToSend
                )}
              </b>{" "}
              from <b>{this.props.requestPmtNameDoc.label}</b>?
            </h6>
            <h6>
              Message:
              {this.props.messageToSend !== "" ? (
                <span>{this.props.messageToSend}</span>
              ) : (
                <span>(No Message)</span>
              )}
            </h6>
            <p></p>
          </Modal.Body>
          <Modal.Footer>
            <>
              <Button variant="primary" onClick={this.handleSubmitClick}>
                Confirm Request
              </Button>
            </>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default ConfirmRequestModal;
