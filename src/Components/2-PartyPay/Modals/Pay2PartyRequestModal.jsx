import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import CloseButton from "react-bootstrap/CloseButton";

import handleDenomDisplay from "../../UnitDisplay";

import "../ConnectedWalletPage.css";

class Pay2PartyRequestModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commentInput: "",
      validComment: true,
      tooLongCommentError: false,

      isLoadingVerify: true,

      loadTime: 3, //set to 4 when successful dgm addr and call
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

  handleSubmitClick = (event) => {
    event.preventDefault();

    this.props.payDash2PartyRequest(this.state.commentInput);

    this.handleCloseClick();
  };

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
            <Modal.Title>Pay To 2-Party</Modal.Title>
            {closeButtonColor}
          </Modal.Header>
          <Modal.Body>
            {/* <h6>
              Pay <b>{handleDenomDisplay(this.props.whichNetwork,this.props.amountToSend)}</b> to{" "}
              <b>{this.props.requestPmtNameDoc.label}</b>?
            </h6> */}
            <p className="textsmaller">
              This will send funds from your Wallet to the 2-Party.
            </p>
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
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default Pay2PartyRequestModal;
