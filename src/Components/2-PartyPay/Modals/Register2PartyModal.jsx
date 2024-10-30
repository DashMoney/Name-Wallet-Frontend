import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import CloseButton from "react-bootstrap/CloseButton";

class Register2PartyModal extends React.Component {
  handleCloseClick = () => {
    this.props.hideModal();
  };

  handleRegister2Party = () => {
    this.props.RegisterYour2PartyPubKey();
    this.props.closeTopNav();
    this.props.hideModal();
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
      <Modal show={this.props.isModalShowing} contentClassName={modalBkg}>
        <Modal.Header>
          <Modal.Title>Enable "2-Party" Pay!</Modal.Title>
          {closeButtonColor}
        </Modal.Header>
        <Modal.Body>
          Enabling <b>"2-Party" Pay</b> will allow others to send and receive
          Dash via a 2 of 2 multisig with you.
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={() => this.handleRegister2Party()}>
            <b>Enable "2-Party" Pay</b>
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default Register2PartyModal;
