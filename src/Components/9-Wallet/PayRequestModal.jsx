import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import CloseButton from "react-bootstrap/CloseButton";

import handleDenomDisplay from "../UnitDisplay";

import "./ConfirmPaymentModal.css";

import dapiClientNoWallet from "../DapiClientNoWallet";

import Dash from "dash";

class PayRequestModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commentInput: "",
      validComment: true,
      tooLongCommentError: false,

      isLoadingVerify: true,

      loadTime: 3, //set to 4 when successful dgm addr and call

      dgmDocumentsForReceipient: [],
    };
  }

  handleCloseClick = () => {
    this.props.hideModal();
  };

  decrementTimer = () => {
    this.setState({
      loadTime: this.state.loadTime - 1,
    });
    if (this.state.loadTime >= 1) {
      const myTimeout = setTimeout(this.decrementTimer, 1000);
    }
  };

  onChange = (event) => {
    //console.log(event.target.id);
    //console.log(`id = ${event.target.id}`);

    if (event.target.id === "formComment") {
      event.preventDefault();
      event.stopPropagation();
      this.commentValidate(event.target.value);
    }
  };

  commentValidate = (comment) => {
    let regex = /^.[\S\s]{0,200}$/;

    let valid = regex.test(comment);

    if (valid) {
      this.setState({
        commentInput: comment,
        validComment: true,
        tooLongCommentError: false,
      });
    } else {
      if (comment.length > 200) {
        this.setState({
          commentInput: comment,
          validComment: false,
          tooLongCommentError: true,
        });
      } else {
        this.setState({
          commentInput: comment,
          validComment: false,
        });
      }
    }
  };

  queryDGMDocument = (rqstrID) => {
    const client = new Dash.Client(dapiClientNoWallet(this.props.whichNetwork));

    const getDocuments = async () => {
      // console.log("Querying Receipient's DGM Documents.");

      return client.platform.documents.get("DGMContract.dgmaddress", {
        where: [["$ownerId", "==", rqstrID]],
      });
    };

    getDocuments()
      .then((d) => {
        let docArray = [];
        for (const n of d) {
          console.log("Document:\n", n.toJSON());
          docArray = [...docArray, n.toJSON()];
        }

        if (docArray.length === 0) {
          this.setState({
            dgmDocumentsForReceipient: "No DGM Doc for Receipient.",
            isLoadingVerify: false,
          });
        } else {
          this.setState(
            {
              dgmDocumentsForReceipient: docArray,
              isLoadingVerify: false,
              loadTime: 4,
            },
            () => this.decrementTimer()
          );
        }
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
        this.setState({
          dgmDocumentsForReceipient: "Document Error",
          isLoadingVerify: false,
        });
      })
      .finally(() => client.disconnect());
  };

  handleSubmitClick = (event) => {
    event.preventDefault();
    //this.props.handleClearModalPostPmtConfirm(); <- What dat do ->
    // this.props.sendDashtoName();
    this.props.payDashtoRequest(
      this.state.dgmDocumentsForReceipient[0].address,
      this.state.commentInput
    );
    // WALLET_sendToAddress: dgmAddressDoc.address, this is for the addrSendRight? ->
    // WALLET_sendToDGMAddressDoc: dgmAddressDoc,
    // WALLET_messageToSend: message,
    //this.props.requestDashfromName(dgmAddressDoc, this.state.commentInput);
    this.handleCloseClick();
  };

  componentDidMount = () => {
    this.queryDGMDocument(this.props.requestPmtNameDoc.$ownerId);
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
            <Modal.Title>Pay Request</Modal.Title>
            {closeButtonColor}
          </Modal.Header>
          <Modal.Body>
            {/* <h6>
              Pay <b>{handleDenomDisplay(this.props.whichNetwork,this.props.amountToSend)}</b> to{" "}
              <b>{this.props.requestPmtNameDoc.label}</b>?
            </h6> */}
            <div
              style={{
                textAlign: "center",
                marginTop: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              <h5
              //style={{ color: "green" }}
              //onClick={() => this.handleNameClick()}
              >
                <b style={{ color: "#008de4" }}>
                  {this.props.requestPmtNameDoc.label}
                </b>{" "}
                requests{" "}
                <b style={{ color: "#008de4" }}>
                  {handleDenomDisplay(
                    this.props.whichNetwork,
                    this.props.amountToSend
                  )}
                </b>
              </h5>
            </div>
            {/* <h6>
              Message:
              {this.props.messageToSend !== "" ? (
                <span>{this.props.messageToSend}</span>
              ) : (
                <span>(No Message)</span>
              )}
            </h6> */}
            {this.state.dgmDocumentsForReceipient ===
            "No DGM Doc for Receipient." ? (
              <>
                <p></p>
                <Alert variant="danger" dismissible>
                  <Alert.Heading>Alert!</Alert.Heading>
                  <p>
                    <b>{this.props.nameDoc.label}</b> has not yet enabled{" "}
                    <b>Pay-to-Name</b> in <b>Wallet</b>. Let them know on{" "}
                    <b>Messages</b>.
                  </p>
                </Alert>
                <p></p>
              </>
            ) : (
              <></>
            )}
            {this.state.dgmDocumentsForReceipient === "Document Error" ? (
              <>
                <p></p>
                <Alert variant="danger" dismissible>
                  <Alert.Heading>Alert!</Alert.Heading>
                  <p>
                    You have run into a platform error relating to recipient's{" "}
                    <b>Pay-to-Name</b>.
                  </p>
                </Alert>
                <p></p>
              </>
            ) : (
              <></>
            )}
            <p></p>
            <Form.Group className="mb-3" controlId="formComment">
              {/* {this.props.uniqueName === this.props.messageToWhomName ? (
                <Form.Label>
                  <b>Reply/Thread</b>
                </Form.Label>
              ) : (
                <Form.Label>
                  <b>Replying to {this.props.messageToWhomName}'s message</b>
                </Form.Label>
              )} */}
              <Form.Label>
                <b>Add Message:</b>
              </Form.Label>

              <Form.Control
                onChange={this.onChange}
                as="textarea"
                rows={2}
                placeholder="(Optional)"
                required
                isInvalid={this.state.tooLongCommentError}
                isValid={this.state.validComment}
              />

              {this.state.tooLongError ? (
                <Form.Control.Feedback className="floatLeft" type="invalid">
                  Sorry, this is too long! Please use less than 250 characters.
                </Form.Control.Feedback>
              ) : (
                <></>
              )}
              <p></p>
              {/* <Button
                variant="primary"
                onClick={() => this.handleSubmitClick()}
              >
                <b>Send Message</b>
              </Button> */}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <>
              {this.state.isLoadingVerify || this.state.loadTime >= 1 ? (
                <Button variant="primary" disabled>
                  <b>Pay Request ({this.state.loadTime})</b>
                </Button>
              ) : (
                <Button variant="primary" onClick={this.handleSubmitClick}>
                  <b>Pay Request</b>
                </Button>
              )}
            </>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default PayRequestModal;
