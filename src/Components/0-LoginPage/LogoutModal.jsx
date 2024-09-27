import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import CloseButton from "react-bootstrap/CloseButton";

class LogoutModal extends React.Component {
  handleCloseClick = () => {
    this.props.hideModal();
  };

  handleDisconnect = () => {
    this.props.handleLogout();
    this.props.closeTopNav();
    this.handleCloseClick();
  };

  render() {
    let modalBkg = "";
    let closeButtonColor;

    if (this.props.mode === "primary") {
      modalBkg = "modal-backcolor-primary";
      closeButtonColor = <CloseButton onClick={this.handleCloseClick} />;
    } else {
      modalBkg = "text-bg-dark";
      closeButtonColor = (
        <CloseButton onClick={this.handleCloseClick} variant="white" />
      );
    }
    return (
      <>
        <Modal show={this.props.isModalShowing} contentClassName={modalBkg}>
          <Modal.Header>
            <Modal.Title>
              <b>Log out</b>
            </Modal.Title>
            {closeButtonColor}
          </Modal.Header>
          <Modal.Body>
            <p>
              <b>Are you sure you want to log out?</b>
            </p>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="primary" onClick={this.handleDisconnect}>
              <b>Log Out</b>
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default LogoutModal;
