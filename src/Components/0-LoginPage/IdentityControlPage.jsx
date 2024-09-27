import React from "react";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
//import Card from "react-bootstrap/Card";

import Navbar from "react-bootstrap/Navbar";

import Container from "react-bootstrap/Container";

import { IoMdArrowRoundBack } from "react-icons/io";

import "../../App.css";

import Dash from "dash";

class IdentityControlPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copiedIdentity: false,
      breakItInput: "",
      validBreakIt: false,
      isLoadingIdentity: false,
    };
  }

  // hideModal = () => {
  //   this.setState({
  //     isModalShowing: false,
  //   });
  // };

  // showModal = (modalName) => {
  //   this.setState({
  //     presentModal: modalName,
  //     isModalShowing: true,
  //   });
  // };

  onChange = (event) => {
    //console.log(event.target.id);
    //console.log(`id = ${event.target.id}`);

    if (event.target.id === "formBreakIt") {
      event.preventDefault();
      event.stopPropagation();
      this.breakItValidate(event.target.value);
    }
  };

  breakItValidate = (breakIt) => {
    let regex = /^[Bb][r][e][a][k][ ][Ii][d][e][n][t][i][t][y]$/;

    let valid = regex.test(breakIt);

    if (valid) {
      this.setState({
        breakItInput: breakIt,
        validBreakIt: true,
      });
    } else {
      this.setState({
        breakItInput: breakIt,
        validBreakIt: false,
      });
    }
  };

  handleSubmitClick = () => {
    //console.log("Break Identity");
    this.setState({
      isLoadingIdentity: true,
    });
    this.props.disableIdentityMasterKey();
    //LOGOUT? -> yes

    //Let the function^^ logout
    //this.props.hideModal();
  };

  componentDidMount() {}

  render() {
    return (
      <>
        <Navbar
          //className="sticky top-0"
          //style={{ paddingLeft: "2%", paddingRight: "2%", zIndex: 10 }}
          //style={{ position: "sticky", top: "0" }}
          bg={this.props.mode}
          variant={this.props.mode}
          fixed="top"
        >
          <Container>
            <Button
              variant="primary"
              onClick={() => this.props.hideIdentityControlPage()}
            >
              <IoMdArrowRoundBack size={28} />
            </Button>

            <h3
              style={{
                paddingRight: "3rem",
              }}
            >
              {this.props.mode === "primary" ? (
                <b className="lightMode">Identity Controls</b>
              ) : (
                <b>Identity Controls</b>
              )}
            </h3>
            <span> </span>
          </Container>
        </Navbar>

        <div className="bodytext">
          {/* <div className="footer">{tuples}</div> */}
          <Alert variant="primary">
            <Alert.Heading>IdentityID</Alert.Heading>
            <p>{this.props.identity}</p>
            <Button
              variant="outline-primary"
              onClick={() => {
                navigator.clipboard.writeText(this.props.identity);
                this.setState({
                  copiedIdentity: true,
                });
              }}
            >
              <b>Copy</b>
            </Button>
            {this.state.copiedIdentity ? <span>Copied!</span> : <></>}
          </Alert>
          <p>
            Your IdentityID can be used for setting up your own Decentralized
            Frontend, or for future dapps that allow usage of separate,
            independent identities.
          </p>
          <p></p>
          <Alert variant="primary">
            <Alert.Heading>Credit Withdrawal</Alert.Heading>

            {/* <Button
              variant="outline-primary"
              onClick={() => {
                navigator.clipboard.writeText(this.props.identity);
                this.setState({
                  copiedIdentity: true,
                });
              }}
            >
              <b>Copy</b>
            </Button> */}
            {/* this.props.withdrawalCredits
            NEED TO ADD FORM FOR THIS
            */}
            <p>
              This will be where a user will be able to change their Platform
              credits to Dash in their wallet.
            </p>
          </Alert>
          <p></p>
          <Alert variant="primary">
            <Alert.Heading>Disable/Break Identity</Alert.Heading>

            {/* <Button
              variant="outline-primary"
              onClick={() => {
                navigator.clipboard.writeText(this.props.identity);
                this.setState({
                  copiedIdentity: true,
                });
              }}
            >
              <b>Copy</b>
            </Button> */}
            <p>
              This will be where a user will be able to disable their Identity.
              This operation will render all Identity, Data Contracts, and
              Documents unusable. Enter <b>Break Identity</b> below to conduct.
            </p>
            <Form.Group className="mb-3" controlId="formBreakIt">
              {/* <Form.Label><b>Reply to Review</b></Form.Label> */}

              {/* <Form.Label><b>Review for {' '}{this.props.SearchedLabel}</b></Form.Label> */}

              <Form.Control
                onChange={this.onChange}
                placeholder="Break Identity"
                //required
                isValid={this.state.validReply}
              />

              {this.state.validBreakIt && !this.state.isLoadingIdentity ? (
                <>
                  <p></p>
                  <Button
                    variant="primary"
                    disabled
                    //onClick={() => this.handleSubmitClick()}
                  >
                    {/* <b>Break Identity</b> */}
                    <b>Currently Disabled</b>
                  </Button>
                </>
              ) : (
                <></>
              )}
            </Form.Group>
            {this.state.isLoadingIdentity ? (
              <>
                <p></p>
                <div id="spinner">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
                <p></p>
              </>
            ) : (
              <></>
            )}
          </Alert>
        </div>
      </>
    );
  }
}

export default IdentityControlPage;
