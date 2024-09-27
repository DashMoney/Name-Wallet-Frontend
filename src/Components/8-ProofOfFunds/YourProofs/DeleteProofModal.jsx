import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import CloseButton from "react-bootstrap/CloseButton";

import Dash from "dash";

const {
  Core: { Message },
} = Dash;

class DeleteProofModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copiedName: false,
      copiedAddr: false,
    };
  }

  formatDate(theCreatedAt) {
    let CreatedAt = new Date(theCreatedAt);

    let dateReturn = CreatedAt.toLocaleDateString();

    return dateReturn;
  }

  handleCloseClick = () => {
    this.props.hideModal();
  };

  handleDeleteProof = () => {
    this.props.deleteYourProof();
    this.props.hideModal();
  };

  proveMessage() {
    const message = new Message(this.props.selectedYourProof.message);

    let verify;
    try {
      verify = message.verify(
        this.props.selectedYourProof.address,
        this.props.selectedYourProof.signature
      );
    } catch (err) {
      return false;
    }

    if (verify) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    let date = Date.now();

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

    let cardBkg;
    let cardText;

    if (this.props.mode === "primary") {
      cardBkg = "white";
      cardText = "dark";
    } else {
      cardBkg = "dark";
      cardText = "white";
    }

    return (
      <>
        <Modal
          show={this.props.isModalShowing}
          backdropClassName={modalBackdrop}
          contentClassName={modalBkg}
        >
          <Modal.Header style={{ paddingBottom: ".2rem" }}>
            <Modal.Title>
              <h3>
                <b>Delete Proof</b>
              </h3>
            </Modal.Title>
            {closeButtonColor}
          </Modal.Header>

          {/* <div className="BottomBorder"></div> */}

          <Modal.Body>
            <Card id="card" key={this.props.index} bg={cardBkg} text={cardText}>
              <Card.Body>
                <Card.Title className="cardTitle">
                  <h3 style={{ color: "#008de3" }}>
                    <b>{this.props.uniqueName}</b>
                  </h3>

                  <span className="textsmaller">
                    {this.formatDate(this.props.selectedYourProof.$createdAt)}
                  </span>
                </Card.Title>

                <h5>
                  <b>Address of Funds</b>
                </h5>

                <p>
                  <b>{this.props.selectedYourProof.address}</b>{" "}
                </p>

                <div className="ProofBorder"></div>

                <h5>
                  <b>Signed Message</b>
                </h5>

                {/* if signature for message and addr is true display message else display error message */}
                {this.proveMessage() ? (
                  <>
                    <p style={{ color: "#008de4" }} className="indentStuff">
                      <b>{this.props.selectedYourProof.message}</b>
                    </p>
                    <p></p>
                  </>
                ) : (
                  <>
                    <Alert variant="danger">
                      <Alert.Heading>Failure</Alert.Heading>
                      <p>Signature Failed - Proof is not authentic!</p>
                    </Alert>
                  </>
                )}

                <p></p>
              </Card.Body>
            </Card>
            <p></p>
            <div className="ButtonRightNoUnderline">
              <Button
                variant="primary"
                onClick={() => this.handleDeleteProof()}
              >
                <b>Delete Proof</b>
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default DeleteProofModal;
