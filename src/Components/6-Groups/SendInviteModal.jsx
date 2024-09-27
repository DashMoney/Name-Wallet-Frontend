import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import CloseButton from "react-bootstrap/CloseButton";

import Dash from "dash";

class SendInviteModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isError: false,
      nameTaken: false,
      nameAvailable: false,
      searchedName: "",
      validated: true,
      validityCheck: false,
    };
  }

  handleCloseClick = () => {
    this.props.hideModal();
  };

  onChange = (event) => {
    this.setState({
      isError: false,
      isLoading: false,
      nameTaken: false,
      nameAvailable: false,
    });
    if (this.formValidate(event.target.value) === true) {
      event.preventDefault();
      event.stopPropagation();
      this.setState({
        validityCheck: true,
      });
    } else {
      event.preventDefault();
      event.stopPropagation();
      this.setState({
        validityCheck: false,
      });
    }
  };

  searchName = (nameToRetrieve) => {
    let client = new Dash.Client({ network: this.props.whichNetwork });

    const retrieveName = async () => {
      // Retrieve by full name (e.g., myname.dash)

      return client.platform.names.resolve(`${nameToRetrieve}.dash`);
    };

    retrieveName()
      .then((d) => {
        if (d === null) {
          this.setState({
            nameAvailable: true,
            nameTaken: false,
            isLoading: false,
            isError: false,
          });
        } else {
          console.log("Name retrieved:\n", d.toJSON());

          this.setState({
            nameTaken: true,
            nameAvailable: false,
            isLoading: false,
            isError: false,
          });
          this.props.submitDGTinvite(d.toJSON());
          this.props.hideModal();
        }
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);

        this.setState({
          nameTaken: false,
          nameAvailable: false,
          isError: true,
          isLoading: false,
        });
      })
      .finally(() => client.disconnect());
  };

  handleSubmitClick = (event) => {
    event.preventDefault();
    //call the SearchName
    //setState to loading
    //disable button
    let nameToTry = event.target.validationCustom02.value;

    if (this.state.validityCheck) {
      this.setState({
        isLoading: true,
        searchName: event.target.value,
        isError: false,
      });

      if (this.formValidate(nameToTry)) {
        console.log(`A good one: ${nameToTry}`);
        this.searchName(nameToTry);
      } else {
        console.log(`Not a good one: ${nameToTry}`);
        this.setState({
          isLoading: false,
        });
      }
    }
  };

  formValidate = (nameInput) => {
    let regex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]$/;
    let valid = regex.test(nameInput);

    if (valid) {
      this.setState({
        searchedName: nameInput,
      });
      return true;
    } else {
      return false;
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
        <Modal contentClassName={modalBkg} show={this.props.isModalShowing}>
          <Modal.Header>
            <Modal.Title>
              <b>Send Invite</b>
            </Modal.Title>
            {closeButtonColor}
          </Modal.Header>
          <Modal.Body>
            <Form
              noValidate
              onSubmit={this.handleSubmitClick}
              onChange={this.onChange}
            >
              <Form.Group className="mb-3" controlId="validationCustom02">
                {this.state.isLoading ? (
                  <Form.Control
                    type="text"
                    placeholder={this.state.searchedName}
                    disabled
                  />
                ) : (
                  <Form.Control
                    type="text"
                    placeholder="Enter desired name here..."
                    required
                    isInvalid={!this.state.validityCheck}
                  />
                )}

                <Form.Control.Feedback className="floatLeft" type="invalid">
                  Please use proper naming format
                </Form.Control.Feedback>

                {this.state.isError ? (
                  <Alert variant="warning">
                    Testnet Platform is having difficulties...
                  </Alert>
                ) : (
                  <></>
                )}

                {this.state.nameAvailable ? (
                  <Alert variant="danger">
                    {this.state.searchedName} is not owned by anyone.
                  </Alert>
                ) : (
                  <></>
                )}

                {this.state.isLoading ? (
                  <>
                    <p></p>
                    <div id="spinner">
                      <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    </div>
                  </>
                ) : (
                  <></>
                )}
                {/* TEST */}
                {/* {this.state.validityCheck ? (
                  <>
                    <p> </p>
                    <Button variant="primary" type="submit">
                      Check Availabilty
                    </Button>
                  </>
                ) : (
                  <Button disabled variant="primary" type="submit">
                    Check Availabilty
                  </Button>
                )} */}

                <>
                  <p> </p>
                  <Button variant="primary" type="submit">
                    <b>Send Invite</b>
                  </Button>
                </>

                <p></p>

                <ul>
                  <li>
                    A name can consist of any combination of letters (UPPERCASE
                    or lowercase) and numbers with one hyphen (-) anywhere in
                    the middle.
                  </li>
                  <li>No spaces are allowed.</li>
                  <li>Length must be between 3 to 63 characters</li>
                </ul>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            {/* <Button variant="primary" onClick={this.handleCloseClick}>
              Close
            </Button> */}
            <p></p>
            <></>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default SendInviteModal;
