import React from "react";
//import Badge from "react-bootstrap/Badge";
//import Spinner from "react-bootstrap/Spinner";
import CloseButton from "react-bootstrap/CloseButton";
import Form from "react-bootstrap/Form";
//import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

class CreateGroupModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      validGroupName: false,
      tooLongError: false,
      groupNameInput: "",
    };
  }

  createNewGroup = () => {
    //put code here that will create the new Group Document and close out the modals and the navs! ****
    this.props.hideModal();
  };

  handleCloseClick = () => {
    this.props.hideModal();
  };

  onChangeForm = (event) => {
    //console.log(event.target.value);

    if (this.formValidate(event.target.value) === true) {
      event.preventDefault();
      event.stopPropagation();
      this.setState({
        validGroupName: true,
      });
    } else {
      event.preventDefault();
      event.stopPropagation();
      this.setState({
        validGroupName: false,
      });
    }
  };

  formValidate = (formInput) => {
    let regex = /^.{1,32}$/;
    let valid = regex.test(formInput);

    if (valid) {
      this.setState({
        groupNameInput: formInput,
        tooLongError: false,
      });
      return true;
    } else {
      if (formInput.length > 32) {
        this.setState({
          tooLongError: true,
        });
      }
      return false;
    }
  };

  handleSubmitClick = (event) => {
    event.preventDefault();

    let newGroup = event.target.formGroupName.value;

    //console.log(newGroup);

    if (this.formValidate(newGroup)) {
      console.log(newGroup);
      this.props.submitCreateGroup(newGroup);
      this.props.hideModal();
    } else {
      console.log("Invalid Group");
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
        <Modal show={this.props.isModalShowing} contentClassName={modalBkg}>
          <Modal.Header>
            <Modal.Title>
              <b>Create New Group</b>
            </Modal.Title>
            {closeButtonColor}
          </Modal.Header>
          <Modal.Body>
            <Form
              noValidate
              onChange={this.onChangeForm}
              onSubmit={this.handleSubmitClick}
            >
              <Form.Group className="mb-3" controlId="formGroupName">
                <p></p>
                {/* <Form.Label>Group Name</Form.Label> */}
                <Form.Control
                  type="text"
                  placeholder="Enter name for new group!"
                  required
                  isInvalid={this.state.tooLongError}
                  isValid={this.state.validGroupName}
                />
                <p></p>
                <Form.Control.Feedback type="invalid">
                  Group name is too long.
                </Form.Control.Feedback>
                <Form.Control.Feedback type="valid">
                  Group name is acceptable!
                </Form.Control.Feedback>

                <ul>
                  <li>
                    You can create a group name of any alphanumberic or spaces
                    that you like.
                  </li>
                  <li>
                    What you will find interesting is that if a group already
                    exists with that name then you will simply join it!
                  </li>
                </ul>
                <Button variant="primary" type="submit">
                  Create Group
                </Button>
              </Form.Group>
              <p></p>
            </Form>
          </Modal.Body>

          <Modal.Footer></Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default CreateGroupModal;
