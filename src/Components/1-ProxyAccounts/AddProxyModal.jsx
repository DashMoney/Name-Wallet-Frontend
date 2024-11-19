import React from "react";
//import Badge from "react-bootstrap/Badge";
//import Spinner from "react-bootstrap/Spinner";
import CloseButton from "react-bootstrap/CloseButton";
import Form from "react-bootstrap/Form";
//import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

class AddProxyModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      validIdentity: false,
      wrongLengthError: false,
      identityInput: "",

      validLabel: true,
      tooLongLabelError: false,
      labelInput: "",
    };
  }

  handleCloseClick = () => {
    this.props.hideModal();
  };

  onChange = (event) => {
    //console.log(event.target.id);
    //console.log(`id = ${event.target.id}`);

    if (event.target.id === "formIdentity") {
      event.preventDefault();
      event.stopPropagation();
      this.identityValidate(event.target.value);
    }

    if (event.target.id === "formLabel") {
      event.preventDefault();
      event.stopPropagation();
      this.labelValidate(event.target.value);
    }
  };

  identityValidate = (identId) => {
    let regex = /^[a-zA-Z0-9]{43,44}$/;

    let valid = regex.test(identId);

    if (valid) {
      this.setState({
        identityInput: identId,
        validIdentity: true,
        wrongLengthError: false,
      });
    } else {
      if (identId.length !== 43 || identId.length !== 44) {
        this.setState({
          identityInput: identId,
          validIdentity: false,
          wrongLengthError: true,
        });
      } else {
        this.setState({
          identityInput: identId,
          validIdentity: false,
        });
      }
    }
  };

  labelValidate = (label) => {
    let regex = /^.{0,32}$/;
    let valid = regex.test(label);

    if (valid) {
      this.setState({
        labelInput: label,
        validLabel: true,
        tooLongLabelError: false,
      });
    } else {
      if (label.length > 32) {
        this.setState({
          labelInput: label,
          validLabel: false,
          tooLongLabelError: true,
        });
      } else {
        this.setState({
          labelInput: label,
          validLabel: false,
        });
      }
    }
  };

  handleSubmitClick = (event) => {
    event.preventDefault();

    let proxyTuple = [this.state.identityInput, this.state.labelInput];

    //console.log(proxyTuple);

    this.props.addOrCreateProxyToController(proxyTuple);
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

    let isIdentityDuplicate = true;
    let isLabelDuplicate = false;

    if (this.state.identityInput !== "") {
      let identityFound = this.props.ProxyController.proxyList.find((tuple) => {
        return this.state.identityInput === tuple[0];
      });
      if (identityFound === undefined) {
        isIdentityDuplicate = false;
      }
    }

    let isProxyIdNameId = this.props.identity === this.state.identityInput;

    if (this.state.labelInput !== "") {
      let labelFound = this.props.ProxyController.proxyList.find((tuple) => {
        return this.state.labelInput === tuple[1];
      });
      if (labelFound !== undefined) {
        isLabelDuplicate = true;
      }
    }

    return (
      <>
        <Modal
          show={this.props.isModalShowing}
          contentClassName={modalBkg}
          backdropClassName={modalBackdrop}
        >
          <Modal.Header>
            <Modal.Title>
              <b>Add Proxy</b>
            </Modal.Title>
            {closeButtonColor}
          </Modal.Header>
          <Modal.Body>
            <Form
              noValidate
              onChange={this.onChange}
              onSubmit={this.handleSubmitClick}
            >
              <Form.Group className="mb-3" controlId="formIdentity">
                <p></p>
                <Form.Label>
                  <b>Proxy's IdentityId</b>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter IdentityId..."
                  required
                  isInvalid={this.state.wrongLengthError}
                  isValid={
                    this.state.validIdentity &&
                    !isProxyIdNameId &&
                    !isIdentityDuplicate
                  }
                />
                <p></p>
                {/* <Form.Control.Feedback type="invalid">
                  IdentityId is the wrong length.
                </Form.Control.Feedback>
                <Form.Control.Feedback type="valid">
                  IdentityId is acceptable!
                </Form.Control.Feedback> */}
              </Form.Group>

              {isIdentityDuplicate && this.state.identityInput !== "" ? (
                <p
                  className="smallertext"
                  style={{ color: "red", marginTop: ".2rem" }}
                >
                  <b>This IdentityId is already an added proxy.</b>
                </p>
              ) : (
                <></>
              )}
              {isProxyIdNameId ? (
                <p
                  className="smallertext"
                  style={{ color: "red", marginTop: ".2rem" }}
                >
                  <b>
                    Your Name-Wallet IdentityId should not be used as a proxy.
                  </b>
                </p>
              ) : (
                <></>
              )}

              {this.state.wrongLengthError ? (
                <p
                  className="smallertext"
                  style={{ color: "red", marginTop: ".2rem" }}
                >
                  <b>The input is the wrong length.</b>
                </p>
              ) : (
                <></>
              )}

              {/*  
    isLabelDuplicate  */}

              <Form.Group className="mb-3" controlId="formLabel">
                <Form.Label>
                  <b>Proxy's Label</b>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter label (Optional)"
                  required
                  // isInvalid={!this.state.validityCheck}
                  isValid={this.state.validLabel && !isLabelDuplicate}
                />

                {/* <Form.Control.Feedback className="floatLeft" type="valid">
                  Label looks good!
                </Form.Control.Feedback> */}

                {/* {this.state.nameAvailable ? (
                  <p
                    className="smallertext"
                    style={{ color: "green", marginTop: ".2rem" }}
                  >
                    <b>{this.state.searchedName} is available!</b>
                  </p>
                ) : (
                  <></>
                )} */}

                {/* {this.state.nameTaken ? (
                  <p
                    className="smallertext"
                    style={{ color: "red", marginTop: ".2rem" }}
                  >
                    <b>{this.state.searchedName} is not available.</b>
                  </p>
                ) : (
                  <></>
                )} */}
              </Form.Group>
              {isLabelDuplicate && this.state.labelInput !== "" ? (
                <p
                  className="smallertext"
                  style={{ color: "red", marginTop: ".2rem" }}
                >
                  <b>This label is already being used for a proxy.</b>
                </p>
              ) : (
                <></>
              )}
              <ul>
                <li>
                  You can add a proxy to your Name Wallet to interact with other
                  Dash Frontends with minimal risk.
                </li>
                <li>
                  Adding a label to your proxy helps identify it and reduce
                  confusion.
                </li>
              </ul>

              <p></p>
              <div style={{ justifyContent: "flex-end" }}>
                {this.state.validIdentity &&
                this.state.validLabel &&
                !isProxyIdNameId &&
                !isIdentityDuplicate &&
                !isLabelDuplicate ? (
                  <>
                    <Button variant="primary" type="submit">
                      <b>Add Proxy</b>
                    </Button>
                    {/* <Button
                    variant="primary"
                    onClick={() => this.handleSubmitClick()}
                  >
                    <b>Create Reply</b>
                  </Button> */}
                  </>
                ) : (
                  <>
                    <Button variant="primary" disabled>
                      <b>Add Proxy</b>
                    </Button>
                  </>
                )}
              </div>
              <p></p>
            </Form>
          </Modal.Body>

          <Modal.Footer></Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default AddProxyModal;
