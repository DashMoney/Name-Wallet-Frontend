import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import CloseButton from "react-bootstrap/CloseButton";

import handleDenomDisplay from "../UnitDisplay";

import "./ConfirmPaymentModal.css";

import Dash from "dash";

class RejectReqModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commentInput: "",
      validComment: true,
      tooLongCommentError: false,

      loadTime: 4, //set to 4 when successful dgm addr and call
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

  handleRejectClick = () => {
    this.props.rejectOrReplyRequestThread(this.state.commentInput, true);

    this.handleCloseClick();
  };
  handleReplyClick = () => {
    this.props.rejectOrReplyRequestThread(this.state.commentInput, false);

    this.handleCloseClick();
  };

  // handleSubmitClick = (event) => {
  //   event.preventDefault();
  //   //this.props.handleClearModalPostPmtConfirm(); <- What dat do ->
  //   // this.props.sendDashtoName();
  //   // this.props.payDashtoRequest(
  //   //   this.state.dgmDocumentsForReceipient[0].address,
  //   //   this.state.commentInput
  //   // );
  //   this.props.rejectOrReplyRequestThread(this.state.commentInput, ifReject);

  //   // WALLET_messageToSend: message,
  //   //this.props.requestDashfromName(dgmAddressDoc, this.state.commentInput);
  //   this.handleCloseClick();
  // };

  componentDidMount = () => {
    this.decrementTimer();
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
            <Modal.Title>Reply/Reject Request</Modal.Title>
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
            <div className="TwoButtons">
              {this.state.loadTime >= 1 ? (
                <Button variant="primary" disabled>
                  <b>Reply ({this.state.loadTime})</b>
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => this.handleReplyClick()}
                >
                  <b>Reply</b>
                </Button>
              )}
              {this.state.loadTime >= 1 ? (
                <Button variant="primary" disabled>
                  <b>Reject ({this.state.loadTime})</b>
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => this.handleRejectClick()}
                >
                  <b>Reject</b>
                </Button>
              )}
            </div>
          </Modal.Body>
          {/* <Modal.Footer>
            <>
              {this.state.loadTime >= 1 ? (
                <Button variant="primary" disabled>
                  <b>Pay Request ({this.state.loadTime})</b>
                </Button>
              ) : (
                <Button variant="primary" onClick={this.handleSubmitClick}>
                  <b>Pay Request</b>
                </Button>
              )}
            </>
          </Modal.Footer> */}
        </Modal>
      </>
    );
  }
}

export default RejectReqModal;
