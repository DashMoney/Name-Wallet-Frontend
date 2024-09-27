import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import CloseButton from "react-bootstrap/CloseButton";

import Dash from "dash";

const {
  Core: { Message },
} = Dash;

/**
 * address: 'yadAMKzCFruDYg7bsvLVFfjXuVsN4rPqzw',
   message: 'Its a me, Mario! I mean Alice lol',
   signature: 'H2KKtQ1vdvAMeGHATxCa8Scj+xwscwzbIfpGKE20Ff1+PQQ+3vYZCKOoynzZ+SP9Wkv7k7es0XjFsgt4eK/7d0g=',
 */

class CreateProofModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addressInput: "",
      validAddress: false,

      messageInput: "",
      validMessage: false,
      tooLongMessageError: false,

      signatureInput: "",
      validSignature: false,
      tooLongSignatureError: false,

      // INTERESTING -> A VALID INPUT IS NOT NECESSARILY A VALID SIGNATURE

      sigVerified: false,
    };
  }

  handleCloseClick = () => {
    this.props.hideModal();
  };

  onChange = (event) => {
    // console.log(event.target.value);

    //console.log(`id = ${event.target.id}`);

    if (event.target.id === "formAddressName") {
      event.preventDefault();
      event.stopPropagation();
      this.addressValidate(event.target.value);
    }

    if (event.target.id === "formMessageName") {
      event.preventDefault();
      event.stopPropagation();
      this.messageValidate(event.target.value);
    }

    if (event.target.id === "formSignatureName") {
      event.preventDefault();
      event.stopPropagation();
      this.signatureValidate(event.target.value);
    }
  };

  addressValidate = (address) => {
    let regex; // = /^[Xy][\S]{33}$/;

    if (this.props.whichNetwork === "testnet") {
      regex = /^[y][\S]{33}$/;
    } else {
      regex = /^[X][\S]{33}$/;
    }
    let valid = regex.test(address);

    if (valid) {
      this.setState(
        {
          addressInput: address,
          validAddress: true,
        },
        () => this.verifySignature()
      );
    } else {
      this.setState(
        {
          addressInput: address,
          validAddress: false,
        },
        () => this.verifySignature()
      );
    }
  };

  messageValidate = (message) => {
    let regex = /^.[\S\s]{0,350}$/;
    let valid = regex.test(message);

    if (valid) {
      this.setState(
        {
          messageInput: message,
          validMessage: true,
          tooLongMessageError: false,
        },
        () => this.verifySignature()
      );
    } else {
      if (message.length > 350) {
        this.setState(
          {
            messageInput: message,
            validMessage: false,
            tooLongMessageError: true,
          },
          () => this.verifySignature()
        );
      } else {
        this.setState(
          {
            messageInput: message,
            validMessage: false,
          },
          () => this.verifySignature()
        );
      }
    }
  };

  signatureValidate = (signature) => {
    let regex = /^.[\S]{0,350}$/;
    let valid = regex.test(signature);

    if (valid) {
      this.setState(
        {
          signatureInput: signature,
          validSignature: true,
          tooLongSignatureError: false,
        },
        () => this.verifySignature()
      );
    } else {
      if (signature.length > 350) {
        this.setState(
          {
            signatureInput: signature,
            validSignature: false,
            tooLongSignatureError: true,
          },
          () => this.verifySignature()
        );
      } else {
        this.setState(
          {
            signatureInput: signature,
            validSignature: false,
          },
          () => this.verifySignature()
        );
      }
    }
  };

  verifySignature() {
    const message = new Message(this.state.messageInput);

    let verify;
    try {
      verify = message.verify(
        this.state.addressInput,
        this.state.signatureInput
      );
    } catch (err) {
      this.setState({
        sigVerified: false,
      });
    }

    if (verify) {
      this.setState({
        sigVerified: true,
      });
    } else {
      this.setState({
        sigVerified: false,
      });
    }
  }

  handleSubmitClick = (event) => {
    event.preventDefault();
    //console.log(event.target.ControlTextarea1.value);

    //CHANGE TO NEWPROOF

    let newProof = {
      address: this.state.addressInput,
      message: this.state.messageInput,
      signature: this.state.signatureInput,
    };

    this.props.createYourProof(newProof);
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
          <Modal.Header style={{ paddingBottom: ".2rem" }}>
            <Modal.Title>
              <h3>
                <b>Create Proof</b>
              </h3>
            </Modal.Title>
            {closeButtonColor}
          </Modal.Header>

          {/* <div className="BottomBorder"></div> */}

          <Modal.Body>
            {/* <h4 style={{ marginBottom: ".1rem" }}>
              <b>You are Offering:</b>
            </h4> */}

            <Form
              noValidate
              onSubmit={this.handleSubmitClick}
              onChange={this.onChange}
            >
              {/* ADDRESS FORM BELOW */}
              <Form.Group className="mb-3" controlId="formAddressName">
                <h5 style={{ marginTop: ".2rem", marginBottom: ".2rem" }}>
                  Address of Your Dash
                </h5>
                <Form.Control
                  type="text"
                  placeholder="Enter address.."
                  required
                  //isInvalid={this.state.tooLongCityError}
                  isValid={this.state.validAddress}
                />
                <p></p>
                {/* <Form.Control.Feedback type="invalid">
              Address is too long.
            </Form.Control.Feedback> */}
              </Form.Group>

              {/* MESSAGE FORM BELOW */}

              <Form.Group className="mb-3" controlId="formMessageName">
                <Form.Label>
                  <h5 style={{ marginTop: ".5rem", marginBottom: ".2rem" }}>
                    Message
                  </h5>
                </Form.Label>

                <Form.Control
                  onChange={this.onChange}
                  as="textarea"
                  rows={2}
                  placeholder="Enter message.."
                  required
                  //isInvalid={this.state.tooLongMessageError}
                  isValid={this.state.validMessage}
                />

                {this.state.tooLongMessageError ? (
                  <Form.Control.Feedback className="floatLeft" type="invalid">
                    Sorry, this is too long! Please use less than 350
                    characters.
                  </Form.Control.Feedback>
                ) : (
                  <></>
                )}
              </Form.Group>

              {/* PROOF SIGNATURE FORM BELOW */}

              <Form.Group className="mb-3" controlId="formSignatureName">
                <Form.Label>
                  <h5 style={{ marginTop: ".5rem", marginBottom: ".2rem" }}>
                    Signature
                  </h5>
                </Form.Label>

                <Form.Control
                  onChange={this.onChange}
                  as="textarea"
                  rows={2}
                  placeholder="Put signature here.."
                  required
                  isInvalid={
                    this.state.validSignature && !this.state.sigVerified
                  }
                  //isValid={this.state.validSignature}
                />

                {this.state.tooLongSignatureError ? (
                  <>
                    <p></p>
                    <Form.Control.Feedback className="floatLeft" type="invalid">
                      Sorry, this is too long! Please use less than 350
                      characters.
                    </Form.Control.Feedback>
                  </>
                ) : (
                  <></>
                )}

                {this.state.validAddress &&
                this.state.validMessage &&
                this.state.validSignature &&
                !this.state.sigVerified ? (
                  <>
                    <p></p>
                    <Form.Control.Feedback className="floatLeft" type="invalid">
                      Sorry, unable to verify signature for this
                      address/message. There may have been a copy and paste
                      error.
                    </Form.Control.Feedback>
                  </>
                ) : (
                  <></>
                )}
              </Form.Group>

              <div className="ButtonRightNoUnderline">
                {this.state.validAddress &&
                this.state.validMessage &&
                this.state.validSignature &&
                this.state.sigVerified ? (
                  <Button variant="primary" type="submit">
                    Create Proof
                  </Button>
                ) : (
                  <Button variant="primary" disabled>
                    Create Proof
                  </Button>
                )}
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default CreateProofModal;
