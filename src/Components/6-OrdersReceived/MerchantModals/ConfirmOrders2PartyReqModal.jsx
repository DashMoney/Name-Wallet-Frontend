import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import CloseButton from "react-bootstrap/CloseButton";

import Alert from "react-bootstrap/Alert";

import handleDenomDisplay from "../../UnitDisplay";

//import "./ConfirmPaymentModal.css";

class ConfirmOrders2PartyReqModal extends React.Component {
  handleCloseClick = () => {
    this.props.hideModal();
  };

  handleSubmitClick = (event) => {
    event.preventDefault();

    this.props.requestOrders2PartyPayment();
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
            <Modal.Title>Confirm 2-Party Request</Modal.Title>
            {closeButtonColor}
          </Modal.Header>
          <Modal.Body>
            <div
              style={{
                textAlign: "center",
                marginTop: ".5rem",
                marginBottom: "1.5rem",
              }}
            >
              <h5
              //style={{ color: "green" }}
              //onClick={() => this.handleNameClick()}
              >
                Request{" "}
                <b style={{ color: "#008de4" }}>
                  {handleDenomDisplay(
                    this.props.whichNetwork,
                    this.props.amountToSend
                  )}
                </b>{" "}
                from{" "}
                <b style={{ color: "#008de4" }}>
                  {this.props.requestPmtNameDoc.label}
                </b>
              </h5>
            </div>

            {this.props.SelectedOrderCalcAmt !== this.props.amountToSend ? (
              <>
                <Alert variant="danger">
                  <Alert.Heading>Order Amount (Warning)</Alert.Heading>
                  <p>
                    The <b>Total Amount</b> from the <b>Order does Not</b> match
                    the <b>current Total Cost</b>.
                  </p>

                  <p style={{ textAlign: "center" }}>
                    <b>*Confirm Only after You have Verified.*</b>
                  </p>
                </Alert>

                <p></p>
              </>
            ) : (
              <></>
            )}

            {/* <h6>
              <b>Message:</b>
              {this.props.messageToSend !== "" ? (
                <span>{this.props.messageToSend}</span>
              ) : (
                <span>(No Message)</span>
              )}
            </h6> */}
            <p></p>
          </Modal.Body>
          <Modal.Footer>
            <>
              <Button variant="primary" onClick={this.handleSubmitClick}>
                <b>Send Request</b>
              </Button>
            </>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default ConfirmOrders2PartyReqModal;
