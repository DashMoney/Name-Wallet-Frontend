import React from "react";

import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";

import Dash from "dash";

const {
  Core: { Message },
} = Dash;

class YourProof extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copiedName: false,
      copiedAddr: false,
    };
  }

  handleNameClick = (nameLabel) => {
    navigator.clipboard.writeText(nameLabel);
    this.setState({
      copiedName: true,
    });
  };

  handleAddrClick = (nameLabel) => {
    navigator.clipboard.writeText(nameLabel);
    this.setState({
      copiedName: true,
    });
  };

  formatDate(theCreatedAt) {
    let CreatedAt = new Date(theCreatedAt);

    let dateReturn = CreatedAt.toLocaleDateString();

    return dateReturn;
  }

  proveMessage() {
    const message = new Message(this.props.proof.message);

    let verify;
    try {
      verify = message.verify(
        this.props.proof.address,
        this.props.proof.signature
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
    //let date = Date.now();

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
        <Card id="card" key={this.props.index} bg={cardBkg} text={cardText}>
          <Card.Body>
            <Card.Title className="cardTitle">
              <h3>
                <b>{this.props.uniqueName}</b>
              </h3>

              <span className="textsmaller">
                {this.formatDate(this.props.proof.$createdAt)}
              </span>
            </Card.Title>

            <h5>
              <b>1) Address of Funds</b>
            </h5>

            <p>{this.props.proof.address}</p>

            <Button
              variant="primary"
              onClick={() => {
                navigator.clipboard.writeText(this.props.proof.address);
                this.setState({
                  copiedAddr: true,
                });
              }}
            >
              <b>Copy Address</b>
            </Button>
            {this.state.copiedAddr ? <span> Copied! </span> : <></>}
            <p></p>
            <div className="ProofBorder"></div>
            <h5>
              <b>2) Verify Funds with Block Explorer</b>
            </h5>

            <p>
              <b>
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://testnet-insight.dashevo.org/insight/"
                >
                  https://testnet-insight.dashevo.org/insight/
                </a>
              </b>
            </p>
            <div className="ProofBorder"></div>
            <h5>
              <b>3) Signed Message</b>
            </h5>

            {/* if signature for message and addr is true display message else display error message */}
            {this.proveMessage() ? (
              <>
                <p className="indentStuff">
                  <b>{this.props.proof.message}</b>
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

            <div className="ButtonRightNoUnderline">
              <Button
                variant="primary"
                onClick={() =>
                  this.props.handleDeleteYourProof(this.props.index)
                }
              >
                Delete Proof
              </Button>
            </div>
          </Card.Body>
        </Card>
      </>
    );
  }
}

export default YourProof;
