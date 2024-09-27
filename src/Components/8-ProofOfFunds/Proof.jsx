import React from "react";
//import Badge from 'react-bootstrap/Badge';
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";

import Dash from "dash";

// const {
//   Essentials: { Buffer },
//   PlatformProtocol: { Identifier },
// } = Dash;

const {
  Core: { Message },
} = Dash;

class Proof extends React.Component {
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

  // handleName = (msgDoc) =>{
  //   if(msgDoc.$ownerId === this.props.identity){
  //   return <span style={{ color: "#008de4" }}>{this.props.uniqueName}</span>
  //   }

  //   //*** *** */
  //     let nameDoc = this.props.PostNames.find(doc => {
  //       return msgDoc.$ownerId === doc.$ownerId
  //     })

  //     if(nameDoc === undefined){
  //       return 'Not Found'
  //     }

  //     return <span style={{ color: "#008de4" }} onClick={() => this.handleNameClick(nameDoc.label)}>
  //       {nameDoc.label}
  //       </span>

  // }

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
              {/* {this.handleName(this.props.post)} */}

              <h3
                style={{ color: "#008de3" }}
                // onClick={() => this.handleNameClick(nameToPass)}
              >
                {/* {nameToPass} */}
                <b>{this.props.SearchedNameDoc.label}</b>
              </h3>

              {/* <span>
    {this.state.copiedName?<span>✅  👍</span>:<></>}
    </span> */}

              <span className="textsmaller">
                {this.formatDate(this.props.proof.$createdAt)}
              </span>
            </Card.Title>

            {/* <Card.Text
          // onClick={()=>this.props.handleSearchedPost(this.props.post, nameToPass)}
          
          > */}

            <h5>
              <b>1) Address of Funds</b>
            </h5>
            {/* style={{ color: "#008de4" }} */}
            <p>{this.props.proof.address}</p>

            {/* className="ButtonRightNoUnderline" */}
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
                <p style={{ color: "#008de4" }} className="indentStuff">
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
          </Card.Body>
        </Card>
      </>
    );
  }
}

export default Proof;
