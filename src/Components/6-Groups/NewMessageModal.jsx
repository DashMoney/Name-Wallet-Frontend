import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
//import Badge from "react-bootstrap/Badge";
import CloseButton from "react-bootstrap/CloseButton";
//import { FormText } from "react-bootstrap";

class NewMessageModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messageInput: "",
      tooLongError: false,
      validityCheck: false,
    };
  }

  handleCloseClick = () => {
    this.props.hideModal();
  };

  formValidate = (messageText) => {
    let regex = /^.[\S\s]{0,450}$/;

    let valid = regex.test(messageText);

    let regex2 = /^(?:[^\r\n]*(?:\r\n?|\n)){0,4}[^\r\n]*$/;

    let valid2 = regex2.test(messageText);

    if (valid && valid2) {
      this.setState({
        messageInput: messageText,
        tooLongError: false,
      });
      return true;
    } else {
      if (messageText.length > 450 || !valid2) {
        this.setState({
          tooLongError: true,
        });
      }
      return false;
    }
  };

  onChange = (event) => {
    event.preventDefault();
    event.stopPropagation();

    //console.log(event.target.value);
    //this is the message body

    if (this.formValidate(event.target.value) === true) {
      this.setState({
        validityCheck: true,
      });
    } else {
      this.setState({
        validityCheck: false,
      });
    }
  };

  handleSubmitClick = (event) => {
    event.preventDefault();
    console.log(event.target.ControlTextarea1.value);

    if (this.formValidate(event.target.ControlTextarea1.value)) {
      let newMessage = event.target.ControlTextarea1.value;

      this.props.submitDGTmessage(this.props.selectedGroup, newMessage);
      this.props.hideModal();
    } else {
      console.log("Invalid Message");
    }
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
          backdrop={true}
          show={this.props.isModalShowing}
          contentClassName={modalBkg}
        >
          <Modal.Header>
            <Modal.Title>
              <h3>
                <b>New Message</b>
              </h3>
            </Modal.Title>
            {closeButtonColor}
          </Modal.Header>
          <Modal.Body>
            <Form
              noValidate
              onChange={this.onChange}
              onSubmit={this.handleSubmitClick}
            >
              <Form.Group className="mb-3" controlId="ControlTextarea1">
                {/* <Form.Label>Example textarea</Form.Label> */}

                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Write message here.."
                  required
                  isInvalid={this.state.tooLongError}
                  isValid={this.state.validityCheck}
                />

                {this.state.tooLongError ? (
                  <Form.Control.Feedback className="floatLeft" type="invalid">
                    Sorry, this is too long! Please use less than 450
                    characters.
                  </Form.Control.Feedback>
                ) : (
                  // <Alert key="warning" variant="warning">
                  //   Sorry, this is too long! Please use less than 450 characters.
                  // </Alert>
                  <></>
                )}
              </Form.Group>

              {this.state.validityCheck ? (
                <Button variant="primary" type="submit">
                  Create Message
                </Button>
              ) : (
                <Button variant="primary" disabled type="submit">
                  Create Message
                </Button>
              )}
            </Form>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default NewMessageModal;
