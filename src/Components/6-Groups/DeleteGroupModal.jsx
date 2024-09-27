import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import CloseButton from "react-bootstrap/CloseButton";

class DeleteGroupModal extends React.Component {
  handleCloseClick = () => {
    this.props.hideModal();
  };

  handleGroupDelete = () => {
    this.props.deleteGroup(this.props.selectedGroup);
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
        <Modal show={this.props.isModalShowing} contentClassName={modalBkg}>
          <Modal.Header>
            <Modal.Title>
              <b>Leave Group</b>
            </Modal.Title>
            {closeButtonColor}
          </Modal.Header>
          <Modal.Body>Leave {this.props.selectedGroup}?</Modal.Body>

          <Modal.Footer>
            <Button variant="primary" onClick={() => this.handleGroupDelete()}>
              Leave Group
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default DeleteGroupModal;
