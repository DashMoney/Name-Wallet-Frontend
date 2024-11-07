import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import CloseButton from "react-bootstrap/CloseButton";

class HowProxyModal extends React.Component {
  handleCloseClick = () => {
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
        <Modal show={this.props.isModalShowing} contentClassName={modalBkg}>
          <Modal.Header>
            <Modal.Title>
              <b>How to make Proxy Accounts</b>
            </Modal.Title>
            {closeButtonColor}
          </Modal.Header>
          <Modal.Body>
            <h3 style={{ color: "#008de4" }}>First Step</h3>
            <p>
              You must begin the process of creating a Proxy Account on
              DashGetPaid.com or on DashPayRentals.com.
            </p>
            <p>
              Login with a 12-word mnemonic that will be used as the Proxy
              Account Login. (Do not use your Name-Wallet 12-word mnemonic) It
              must be a different mnemonic than your Name-Wallet.
            </p>
            <h3 style={{ color: "#008de4" }}>Second Step</h3>
            <p>
              After funding the wallet, registering an identity, and creating a
              proxy on DashGetPaid.com or on DashPayRentals.com. Copy the
              IdentityId from there.
            </p>
            <p>
              Then come here and paste the IdentityId into the <b>Add Proxy</b>.
            </p>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="primary" onClick={this.props.hideModal}>
              <b>Close</b>
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default HowProxyModal;
