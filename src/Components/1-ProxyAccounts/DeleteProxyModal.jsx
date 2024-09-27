//NEED THE QUERY here and its a simple query because it should return empty!
import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import Spinner from "react-bootstrap/Spinner";
import CloseButton from "react-bootstrap/CloseButton";

import formatDate from "../TimeDisplayShort";

class DeleteProxyModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //copiedName: false,

      loadTime: 4,
    };
  }

  // handleNameClick = (nameLabel) => {
  //   navigator.clipboard.writeText(nameLabel);
  //   this.setState({
  //     copiedName: true,
  //   });
  // };

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

  handleSubmitClick = (event) => {
    event.preventDefault();

    this.props.removeProxyFromController();

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

    //this.props.selectedProxyTuple

    let proxyVerified = this.props.ProxyDocs.find((proxyDoc) => {
      return proxyDoc.$ownerId === this.props.selectedProxyTuple[0];
    });

    return (
      <>
        <Modal
          contentClassName={modalBkg}
          backdropClassName={modalBackdrop}
          show={this.props.isModalShowing}
        >
          <Modal.Header>
            <Modal.Title>Delete Proxy</Modal.Title>
            {closeButtonColor}
          </Modal.Header>
          <Modal.Body>
            <div>
              {proxyVerified !== undefined ? (
                <>
                  <h5>
                    <b style={{ color: "#008de4" }}>{this.props.uniqueName}</b>
                  </h5>
                </>
              ) : (
                <>
                  <h5>
                    <b style={{ color: "red" }}>No Connected Proxy</b>
                  </h5>
                </>
              )}

              {this.props.selectedProxyTuple[1] !== undefined &&
              this.props.selectedProxyTuple[1] !== "" ? (
                <>
                  <p>{this.props.selectedProxyTuple[1]}</p>
                </>
              ) : (
                <>
                  <p style={{ color: "red" }}>No Label</p>
                </>
              )}
            </div>

            <div
              style={{
                textAlign: "center",
                marginTop: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              <p>{this.props.selectedProxyTuple[0]}</p>
              {proxyVerified !== undefined ? (
                <>
                  <p style={{ fontSize: "small", opacity: "0.8" }}>
                    Created:
                    {formatDate(proxyVerified.$createdAt)}
                  </p>
                </>
              ) : (
                <></>
              )}

              {/* <h5>
                <b>the credits in Topups</b>
              </h5> */}
            </div>
          </Modal.Body>
          <Modal.Footer>
            {this.state.loadTime >= 1 ? (
              <Button variant="primary" disabled>
                <b>Delete Proxy ({this.state.loadTime})</b>
              </Button>
            ) : (
              <Button variant="primary" onClick={this.handleSubmitClick}>
                <b>Delete Proxy</b>
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default DeleteProxyModal;
