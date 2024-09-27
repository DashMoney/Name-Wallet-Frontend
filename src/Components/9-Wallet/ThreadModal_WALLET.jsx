import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import CloseButton from "react-bootstrap/CloseButton";

class ThreadModal_WALLET extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commentInput: "",
      validComment: true,
      tooLongCommentError: false,
    };
  }

  handleCloseClick = () => {
    this.props.hideModal();
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

  handleSubmitClick = () => {
    this.props.submitDGMThread(this.state.commentInput);
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
                <b>Reply to Payment Message</b>
              </h3>
            </Modal.Title>
            {closeButtonColor}
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="formComment">
              {this.props.uniqueName === this.props.messageToWhomName ? (
                <Form.Label>
                  <b>Reply/Thread</b>
                </Form.Label>
              ) : (
                <Form.Label>
                  <b>Replying to {this.props.messageToWhomName}'s message</b>
                </Form.Label>
              )}

              <Form.Control
                onChange={this.onChange}
                as="textarea"
                rows={3}
                placeholder="Enter message here..."
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
              <Button
                variant="primary"
                onClick={() => this.handleSubmitClick()}
              >
                <b>Send Message</b>
              </Button>
            </Form.Group>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default ThreadModal_WALLET;
