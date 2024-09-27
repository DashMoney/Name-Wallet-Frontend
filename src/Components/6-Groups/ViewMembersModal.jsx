import Spinner from "react-bootstrap/Spinner";
import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import CloseButton from "react-bootstrap/CloseButton";

import MemberComponent from "./MemberComponent";

class ViewMembersModal extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     copiedName: false,
  //   };
  // }
  handleCloseClick = () => {
    this.props.hideModal();
  };

  handleDeleteGroupClick = () => {
    this.props.showDeleteModal("DeleteGroupModal");
    this.props.hideModal();
  };

  // handleNameClick = (nameToPass) => {
  //   navigator.clipboard.writeText(nameToPass);
  //   this.setState({
  //     copiedName: true,
  //   });
  // };

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

    let members = this.props.groupMembers.map((tuple, index) => {
      return <MemberComponent index={index} key={index} member={tuple} />;
    });

    return (
      <>
        <Modal show={this.props.isModalShowing} contentClassName={modalBkg}>
          <Modal.Header>
            <Modal.Title>Members</Modal.Title>
            {closeButtonColor}
          </Modal.Header>
          <Modal.Body>
            <p></p>
            {this.props.LoadingMembers ? (
              <div id="spinner">
                <Spinner animation="border">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p></p>
              </div>
            ) : (
              <>
                <p></p>
                {members}
                <p></p>
              </>
            )}
            <div style={{ margin: "1rem" }}></div>
            <div className="d-grid gap-2">
              <Button
                variant="primary"
                onClick={() => {
                  this.handleDeleteGroupClick();
                }}
              >
                <b>Leave Group</b>
              </Button>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="primary" onClick={this.handleCloseClick}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default ViewMembersModal;
