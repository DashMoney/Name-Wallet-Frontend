import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";
import CloseButton from "react-bootstrap/CloseButton";

class RegisterIdentityModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isError: false,
    };
  }

  handleCloseClick = () => {
    this.props.hideModal();
  };

  handleClick = (event) => {
    this.props.registerIdentity();
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
      <>
        <Modal
          show={this.props.isModalShowing}
          contentClassName={modalBkg}
          backdropClassName={modalBackdrop}
        >
          <Modal.Header>
            <Modal.Title>Register Identity</Modal.Title>
            {closeButtonColor}
          </Modal.Header>
          <Modal.Body>
            <p>
              Registering an Identity from Dash Platform will cost around{" "}
              <b>0.015 Dash</b> from your wallet's funds.{" "}
            </p>
            <p>
              This is for an Identity and Platform Credits which will connect
              your account to Platform and allow you to perform actions like
              purchasing a name.
            </p>
            {this.state.isError ? (
              <Alert variant="warning">
                Testnet Platform is having difficulties...
              </Alert>
            ) : (
              <></>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="primary" onClick={this.handleClick}>
              <b>Register New Identity</b>
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default RegisterIdentityModal;
