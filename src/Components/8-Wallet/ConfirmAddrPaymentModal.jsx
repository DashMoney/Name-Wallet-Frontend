import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import CloseButton from "react-bootstrap/CloseButton";
import handleDenomDisplay from "../UnitDisplay";

import "./ConfirmPaymentModal.css";

class ConfirmAddrPaymentModal extends React.Component {
  /**
   * sendToAddress={this.state.sendToAddress}
      amountToSend={this.state.amountToSend}

      sendDashtoAddress={this.sendDashtoAddress}
   */

  handleCloseClick = () => {
    this.props.hideModal();
  };

  handleSubmitClick = (event) => {
    event.preventDefault();
    this.props.sendDashtoAddress();
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
            <Modal.Title>Confirm Payment</Modal.Title>
            {closeButtonColor}
          </Modal.Header>
          <Modal.Body>
            <p>
              Send{" "}
              <b>
                {handleDenomDisplay(
                  this.props.whichNetwork,
                  this.props.amountToSend
                )}
              </b>{" "}
              to <b>{this.props.sendToAddress}</b>?
            </p>
          </Modal.Body>
          <Modal.Footer>
            <>
              <Button variant="primary" onClick={this.handleSubmitClick}>
                Confirm Payment
              </Button>
            </>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default ConfirmAddrPaymentModal;
