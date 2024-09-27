import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import CloseButton from "react-bootstrap/CloseButton";

class RegisterDGMModal extends React.Component {
  handleCloseClick = () => {
    this.props.hideModal();
  };

  handleRegisterDGM = () => {
    this.props.RegisterDGMAddress();
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
          <Modal.Title>Enable Pay to Name!</Modal.Title>
          {closeButtonColor}
        </Modal.Header>
        <Modal.Body>
          Enabling <b>Pay-to-Name</b> will allow others to send you Dash by
          using just your name.
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={() => this.handleRegisterDGM()}>
            <b>Enable Pay-to-Name</b>
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default RegisterDGMModal;
