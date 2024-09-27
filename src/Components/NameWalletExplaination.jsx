import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import CloseButton from "react-bootstrap/CloseButton";
import Spinner from "react-bootstrap/Spinner";
import CreditsOnPage from "./CreditsOnPage";

class NameWalletExplaination extends React.Component {
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
              <b>Name Wallet and Proxy Accounts</b>
            </Modal.Title>
            {closeButtonColor}
          </Modal.Header>
          <Modal.Body>
            <h3 style={{ color: "#008de4" }}>What is a Name-Wallet?</h3>
            <p>
              A Name-Wallet is a more secure application that should run as a
              native mobile application or a desktop application.
            </p>
            <p>
              Name-Wallets contain access to Dash Platform (DPNS) names, Proxy
              Accounts, Pay Contracts(2-PartyPay and QuickPay). As well as
              integrating orders placed on other Dash Merchant Frontend's with
              Proxy Accounts. (DashGetPaid.com & DashPayRentals.com)
            </p>
            <h3 style={{ color: "#008de4" }}>What are Proxy Accounts?</h3>
            <p>
              Proxy Accounts are 'Crypto Wallets' that have very small amounts
              on them, so that you can place orders on other Dash Merchant
              Frontends with little risk.
            </p>
            <p>
              Proxy Accounts are used with other Dash Merchant Frontends
              (DashGetPaid.com & DashPayRentals.com)
            </p>
            <h3 style={{ color: "#008de4" }}>
              Where can I find the code for this frontend?
            </h3>
            <p>
              You can find the source code{" "}
              <b>
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://github.com/DashMoney/Name-Wallet-Frontend"
                >
                  https://github.com/DashMoney/Name-Wallet-Frontend
                </a>
              </b>
              , and run the frontend yourself.
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

export default NameWalletExplaination;
