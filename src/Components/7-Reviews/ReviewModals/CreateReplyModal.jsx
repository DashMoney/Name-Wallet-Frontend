import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import CloseButton from "react-bootstrap/CloseButton";

class CreateReplyModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      replyInput: "",
      validReply: false,
      tooLongReplyError: false,
    };
  }

  handleCloseClick = () => {
    this.props.hideModal();
  };

  onChange = (event) => {
    //console.log(event.target.id);
    //console.log(`id = ${event.target.id}`);

    if (event.target.id === "formReply") {
      event.preventDefault();
      event.stopPropagation();
      this.replyValidate(event.target.value);
    }
  };

  replyValidate = (reply) => {
    let regex = /^.[\S\s]{1,350}$/;

    let valid = regex.test(reply);

    if (valid) {
      this.setState({
        replyInput: reply,
        validReply: true,
        tooLongReplyError: false,
      });
    } else {
      if (reply.length > 350) {
        this.setState({
          replyInput: reply,
          validReply: false,
          tooLongReplyError: true,
        });
      } else {
        this.setState({
          replyInput: reply,
          validReply: false,
        });
      }
    }
  };

  handleSubmitClick = () => {
    let reply = {
      reply: this.state.replyInput,
      //reviewId: //DONT NEED TO PASS IT HERE JUST HANDLE AND ADD BACK IN APP.JS
    };

    this.props.createReply(reply);
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
        <Modal
          show={this.props.isModalShowing}
          backdropClassName={modalBackdrop}
          contentClassName={modalBkg}
        >
          <Modal.Header>
            <Modal.Title>
              <h3>
                <b>Reply to {this.props.replyingToName}</b>
              </h3>
            </Modal.Title>
            {closeButtonColor}
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="formReply">
              {/* <Form.Label><b>Reply to Review</b></Form.Label> */}

              {/* <Form.Label><b>Review for {' '}{this.props.SearchedLabel}</b></Form.Label> */}

              <Form.Control
                onChange={this.onChange}
                as="textarea"
                rows={3}
                placeholder="Enter reply here..."
                required
                isInvalid={this.state.tooLongReplyError}
                isValid={this.state.validReply}
              />

              {this.state.tooLongReplyError ? (
                <Form.Control.Feedback className="floatLeft" type="invalid">
                  Sorry, this is too long! Please use less than 350 characters.
                </Form.Control.Feedback>
              ) : (
                <></>
              )}
              <p></p>
              {this.state.validReply ? (
                <>
                  <Button
                    variant="primary"
                    onClick={() => this.handleSubmitClick()}
                  >
                    <b>Create Reply</b>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="primary" disabled>
                    <b>Create Reply</b>
                  </Button>
                </>
              )}
            </Form.Group>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default CreateReplyModal;
