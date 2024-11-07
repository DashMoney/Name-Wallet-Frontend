import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import CloseButton from "react-bootstrap/CloseButton";

class AddMsgToRequestModal extends React.Component {
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
    let regex1 = /^.[\S\s]{0,450}$/;

    let valid1 = regex1.test(comment);

    let regex2 = /^(?:[^\r\n]*(?:\r\n?|\n)){0,4}[^\r\n]*$/;

    let valid2 = regex2.test(comment);

    let valid = false;

    if (valid1 && valid2) {
      valid = true;
    }

    if (valid) {
      this.setState({
        commentInput: comment,
        validComment: true,
        tooLongCommentError: false,
      });
    } else {
      if (comment.length > 450 || !valid2) {
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
    this.props.editRequestAddMessage(this.state.commentInput);
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
                <b>Add Message</b>
              </h3>
            </Modal.Title>
            {closeButtonColor}
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="formComment">
              <Form.Label>
                <b>Message for {this.props.SelectedReplyNameDoc.label}</b>
              </Form.Label>

              <Form.Control
                onChange={this.onChange}
                as="textarea"
                rows={3}
                placeholder="Enter message here..."
                required
                isInvalid={this.state.tooLongDescriptionError}
                isValid={this.state.validDescription}
              />

              {this.state.tooLongError ? (
                <Form.Control.Feedback className="floatLeft" type="invalid">
                  Sorry, this is too long! Please use less than 450 characters.
                </Form.Control.Feedback>
              ) : (
                <></>
              )}
              <p></p>
              {this.state.commentInput !== "" &&
              !this.state.tooLongCommentError ? (
                <Button
                  variant="primary"
                  onClick={() => this.handleSubmitClick()}
                >
                  <b>Send Message</b>
                </Button>
              ) : (
                <Button variant="primary" disabled>
                  <b>Send Message</b>
                </Button>
              )}
            </Form.Group>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default AddMsgToRequestModal;
