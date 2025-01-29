import React from "react";

import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import CloseButton from "react-bootstrap/CloseButton";
import Spinner from "react-bootstrap/Spinner";

import JoinEventComponent from "./JoinEventComponent";

class EventModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copiedName: false,
      copiedAddress: false,
    };
  }

  handleCloseClick = () => {
    this.props.hideModal();
  };

  handleNameClick = (nameLabel) => {
    navigator.clipboard.writeText(nameLabel);
    this.setState({
      copiedName: true,
    });
  };

  formatDate(theCreatedAt, today, yesterday) {
    let CreatedAt = new Date(theCreatedAt);

    let dateReturn = CreatedAt.toLocaleDateString();

    return dateReturn;
  }

  // componentDidMount() {

  // }

  render() {
    let today = new Date();
    let yesterday = new Date(today);

    yesterday.setDate(yesterday.getDate() - 1);

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
      <Modal
        show={this.props.isModalShowing}
        backdropClassName={modalBackdrop}
        contentClassName={modalBkg}
      >
        {/* <Modal.Header> */}

        {/* <Modal.Title>
          <h3>
               <b>Selected Event</b>
               </h3>
               </Modal.Title>  */}

        {/* </Modal.Header> */}
        <Modal.Body>
          <div className="postModalCloseButton">
            <Modal.Title>{closeButtonColor}</Modal.Title>
          </div>

          <div className="locationTitle">
            <h5>
              <Badge bg="primary" style={{ marginRight: ".2rem" }}>
                {this.props.selectedSearchedEvent.city}
              </Badge>
            </h5>

            <h5>
              <Badge bg="primary" style={{ marginRight: ".2rem" }}>
                {this.props.selectedSearchedEvent.region}
              </Badge>
            </h5>

            <h5>
              <Badge bg="primary">
                {this.props.selectedSearchedEvent.country}
              </Badge>
            </h5>
          </div>
          <p></p>
          <h4 style={{ color: "#008de4" }}>
            {this.props.selectedSearchedEvent.group}
          </h4>
          {/* <div className="cardTitle">
            <h4
              style={{ color: "#008de4" }}
              onClick={() =>
                this.handleNameClick(
                  this.props.selectedSearchedEventNameDoc.label
                  
                )
              }
            >
              {this.props.selectedSearchedEventNameDoc.label}
            </h4>

            <span>{this.state.copiedName ? <span>✅</span> : <></>}</span>

            
          </div> */}

          <div style={{ marginTop: "1rem", marginBottom: "1.6rem" }}>
            <JoinEventComponent
              mode={this.props.mode}
              event={this.props.selectedSearchedEvent}
              isLoginComplete={this.props.isLoginComplete}
              dgtInvitesForEvents={this.props.dgtInvitesForEvents}
              isLoadingGroupEvents={this.props.isLoadingGroupEvents}
              isLoadingGroups={this.props.isLoadingGroups}
              handleSelectedJoinGroup={this.props.handleSelectedJoinGroup}
              showGroupPage={this.props.showGroupPage}
            />
          </div>

          <p style={{ whiteSpace: "pre-wrap" }}>
            {this.props.selectedSearchedEvent.description}
          </p>

          {this.props.selectedSearchedEvent.date !== undefined &&
          this.props.selectedSearchedEvent.date !== "" ? (
            <p>
              Date: <b>{this.props.selectedSearchedEvent.date}</b>
            </p>
          ) : (
            <></>
          )}
          {this.props.selectedSearchedEvent.time !== undefined &&
          this.props.selectedSearchedEvent.time !== "" ? (
            <p>
              Time: <b>{this.props.selectedSearchedEvent.time}</b>
            </p>
          ) : (
            <></>
          )}

          <p></p>
          {this.props.selectedSearchedEvent.address !== undefined &&
          this.props.selectedSearchedEvent.address !== "" ? (
            <>
              <p style={{ whiteSpace: "pre-wrap" }}>
                {this.props.selectedSearchedEvent.address}
              </p>
              {/* ADD COPY HERE */}
              <Button
                variant="outline-primary"
                onClick={() => {
                  navigator.clipboard.writeText(
                    this.props.selectedSearchedEvent.address
                  );
                  this.setState({
                    copiedAddress: true,
                  });
                }}
              >
                <b>Copy</b>
              </Button>
              {this.state.copiedAddress ? <span>Copied!</span> : <></>}
            </>
          ) : (
            <></>
          )}

          {this.props.selectedSearchedEvent.link !== undefined &&
          this.props.selectedSearchedEvent.link !== "" ? (
            <>
              <a
                rel="noopener noreferrer"
                target="_blank"
                href={this.props.selectedSearchedEvent.link}
              >
                <b>{this.props.selectedSearchedEvent.link}</b>
              </a>
            </>
          ) : (
            <></>
          )}
          
          <p className="textsmaller" style={{ textAlign: "right" }}>
            Created by: {this.props.selectedSearchedEventNameDoc.label}
          </p>
        </Modal.Body>
      </Modal>
    );
  }
}

export default EventModal;
