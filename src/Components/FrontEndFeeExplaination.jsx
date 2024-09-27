import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import CloseButton from "react-bootstrap/CloseButton";
import Spinner from "react-bootstrap/Spinner";
import CreditsOnPage from "./CreditsOnPage";

class FrontEndFeeExplaination extends React.Component {
  handleCloseClick = () => {
    this.props.hideModal();
  };
  handleFrontendFee = () => {
    // return unit for display or no fee
    if (this.props.validFrontendFee) {
      //Need to add a decimal or comma on the second from last
      return (this.props.FrontendFee / 100).toFixed(2);
    } else {
      return '0';//"No Frontend Fee";
    }
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
              <b>Decentralized Frontends</b>
            </Modal.Title>
            {closeButtonColor}
          </Modal.Header>
          <Modal.Body>
            <h3>
              What does <b>{this.handleFrontendFee()}% of TopUp</b> mean?
              {/* VITE_FEE_AMOUNT_AS_PERCENT_OF_A_TOPUP
              {import.meta.env.VITE_FRONTEND_NAME} */}
            </h3>
            <p>
              This is the amount of the fee you pay in Dash Platform credits to
              the frontend operator/host, when you write data to Dash Platform.
              This fee is in addition to the Dash Platform operation cost.
              {/* Reading from platform is free, but it costs to write to it,
              because Platform saves your data. */}
            </p>
            <h3>Why is there a fee?</h3>
            <p>
              The fee is for paying the frontend operator/host. This is to allow
              the frontend (what you are currently using) to be decentralized
              just like the backend(Dash Platform).
            </p>
            <h3>Do I have to pay a fee?</h3>
            <p>
              Nope, you can find the source code{" "}
              <b>
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://github.com/DashMoney/DashMoney-Decentralized-Frontend"
                >
                  https://github.com/DashMoney/DashMoney-Decentralized-Frontend
                </a>
              </b>
              , and run the frontend yourself. Or you can host the frontend so
              that others can use it, and you can earn Dash!
            </p>

            {this.props.isLoginComplete &&
            !this.props.isLoadingCreditTransfer ? (
              <>
                <CreditsOnPage
                  identityInfo={this.props.identityInfo}
                  uniqueName={this.props.uniqueName}
                  showModal={this.props.showModal}
                />
                <p>
                  If you want to see just click below and sent some credits to{" "}
                  {import.meta.env.VITE_FRONTEND_NAME}!
                </p>
                <p></p>
                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    onClick={() => this.props.sendFrontendFee()}
                  >
                    <b>Identity Credit Transfer</b>
                  </Button>
                </div>
              </>
            ) : (
              <></>
            )}

            {this.props.isLoginComplete &&
            this.props.isLoadingCreditTransfer ? (
              <>
                <CreditsOnPage
                  identityInfo={this.props.identityInfo}
                  uniqueName={this.props.uniqueName}
                  showModal={this.props.showModal}
                />
                {/* <p></p>
                <div id="spinner">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
                <p></p> */}
                <p>
                  If you want to see just click below and sent some credits to{" "}
                  {import.meta.env.VITE_FRONTEND_NAME}!
                </p>
                <p></p>
                <div className="d-grid gap-2">
                  <Button variant="primary" disabled>
                    <b>Identity Credit Transfer</b>
                  </Button>
                </div>
              </>
            ) : (
              <></>
            )}
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

export default FrontEndFeeExplaination;
