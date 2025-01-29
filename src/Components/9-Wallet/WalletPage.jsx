import React from "react";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

//import Nav from "react-bootstrap/Nav";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import PaymentAddrComponent from "./PaymentAddrComponent";
import ConfirmPaymentModal from "./ConfirmPaymentModal";
import CreditsOnPage from "../CreditsOnPage";

import handleDenomDisplay from "../UnitDisplay";

class WalletPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalShowing: false,
      presentModal: "",

      numberQuantity: false,
      amountToSend: "", //changed from 0 for placeholder to appear

      sendToAddr: "",
      addrFormat: false,

      displayAddress: false,
      copiedAddress: false,
    };
  }

  hideModal = () => {
    this.setState({
      isModalShowing: false,
    });
  };

  showModal = (modalName) => {
    this.setState({
      presentModal: modalName,
      isModalShowing: true,
    });
  };

  handleDisplayAddress = () => {
    if (this.state.displayAddress === false)
      this.setState({
        displayAddress: true,
      });
    else {
      this.setState({
        displayAddress: false,
      });
    }
  };

  handleClearModalPostPmtConfirm = () => {
    this.setState({
      numberQuantity: false,
      amountToSend: "", //changed from 0 for placeholder to appear

      sendToAddr: "",
      addrFormat: false,
    });
  };

  onChange = (event) => {
    // console.log(event.target.value);

    event.preventDefault();
    event.stopPropagation();

    //console.log(`id = ${event.target.id}`);

    if (event.target.id === "validationCustomAddr") {
      this.addrValidate(event.target.value);
    }

    if (event.target.id === "validationCustomNumber") {
      this.numberValidate(event.target.value);
    }
  };

  addrValidate = (addrInput) => {
    //starts with X (mainnet) or Y (Testnet) and is 34 characters in length
    let addrRegex;
    if (this.props.whichNetwork === "testnet") {
      addrRegex = /^[y][\S]{33}$/;
    } else {
      addrRegex = /^[X][\S]{33}$/;
    }

    let validAddr = addrRegex.test(addrInput);

    if (validAddr) {
      this.setState({
        sendToAddr: addrInput,
        addrFormat: true,
      });
    } else {
      this.setState({
        sendToAddr: addrInput,

        addrFormat: false,
      });
    }
  };

  numberValidate = (numberInput) => {
    //console.log(this.props.accountBalance);

    //let regex = /(^[0-9]+[.,]{0,1}[0-9]*$)|(^[.,][0-9]+$)/;

    let regex = /(^[0-9]+[.,]{0,1}[0-9]{0,5}$)|(^[.,][0-9]{1,5}$)/;
    //CHANGED TO LIMIT TO minimum mDash possible

    let valid = regex.test(numberInput);

    //let result = this.props.accountBalance - numberInput * 100000000;
    //console.log(result);

    //if (result >= 0 && valid && numberInput > 0) {
    if (valid && numberInput > 0) {
      this.setState({
        amountToSend: numberInput,
        numberQuantity: true,
      });
    } else {
      this.setState({
        amountToSend: numberInput,
        numberQuantity: false,
      });
    }
  };

  //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

  //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&777

  handleVerifyClick = (event) => {
    event.preventDefault();

    if (this.state.addrFormat) {
      this.props.showAddrConfirmModal(
        //Create this function and modal ->
        this.state.sendToAddr,
        this.state.amountToSend
      );
    }
  };

  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  render() {
    let formPlaceholder = "";

    formPlaceholder = "Enter address here...";

    let exceedsWalletAmt = false;

    let result =
      this.props.accountBalance - this.state.amountToSend * 100000000;
    // console.log(result);
    if (result <= 0 && this.state.amountToSend > 0) {
      exceedsWalletAmt = true;
    }

    return (
      <>
        <Row className="justify-content-md-center">
          <Col md={9} lg={8} xl={7} xxl={6}>
            <div
              className="bodytext" //id="sidetextonlysides"
            >
              {/* ********** LOADING SPINNERS ********** */}

              {this.props.isLoadingWallet ? (
                <>
                  <div className="paddingBadge">
                    <b>Wallet Balance</b>

                    <h4>Loading..</h4>
                  </div>
                </>
              ) : (
                <>
                  <div className="paddingBadge">
                    <div className="cardTitle">
                      <div>
                        <b>Wallet Balance</b>
                        <h4 style={{ color: "#008de4" }}>
                          <b>
                            {handleDenomDisplay(
                              this.props.whichNetwork,
                              this.props.accountBalance
                            )}
                          </b>
                        </h4>
                      </div>

                      <Button
                        style={{ marginRight: "1rem" }}
                        variant="primary"
                        onClick={() => this.props.handleRefresh_WALLET()}
                      >
                        <b>Refresh</b>
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
            {/* **** ^^^^ LOADING SPINNERS ^^^^ **** */}

            {/* ********** FORMS AND INFO ********** */}

            {this.props.accountBalance !== 0 ? (
              <>
                <div id="sidetextonlytop">
                  <CreditsOnPage
                    identityInfo={this.props.identityInfo}
                    uniqueName={this.props.uniqueName}
                    showModal={this.props.showModal}
                  />
                </div>

                <div id="sidetextonlysides">
                  {/* BELOW IS EXCHANGE FORM TABS -> CHANGE TO PAY AND REQUEST */}

                  {/* Below is the Pay to a Name Stuff */}
                  {/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/}
                  <Form
                    id="Pay-to-Addr-form"
                    noValidate
                    onSubmit={this.handleVerifyClick}
                    onChange={this.onChange}
                  >
                    <Form.Group
                      className="mb-3"
                      controlId="validationCustomAddr"
                    >
                      <Form.Label>Send Dash to Address:</Form.Label>

                      {/* <Form.Label>Send Dash to:</Form.Label> */}

                      {this.props.isLoadingForm_WALLET ? (
                        <Form.Control
                          type="text"
                          placeholder={this.state.sendToAddr}
                          readOnly
                        />
                      ) : (
                        <Form.Control
                          type="text"
                          placeholder={formPlaceholder}
                          defaultValue={this.state.sendToAddr}
                          required
                          isValid={this.state.addrFormat}
                        />
                      )}
                    </Form.Group>

                    <Form.Group
                      className="mb-3"
                      controlId="validationCustomNumber"
                    >
                      <Form.Label>Amount to Send (in Dash)</Form.Label>

                      {this.props.isLoadingForm_WALLET ? (
                        <Form.Control
                          type="number"
                          placeholder={this.state.amountToSend}
                          readOnly
                        />
                      ) : (
                        <Form.Control
                          type="number"
                          placeholder="0.01 for example.."
                          defaultValue={this.state.amountToSend}
                          required
                        />
                      )}
                    </Form.Group>

                    {this.props.isLoadingForm_WALLET ? (
                      <>
                        <p> </p>
                        <div id="spinner">
                          <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </Spinner>
                        </div>
                        <p> </p>
                      </>
                    ) : (
                      <>
                        {(this.state.nameFormat || this.state.addrFormat) &&
                        this.state.numberQuantity &&
                        !exceedsWalletAmt ? ( //&&
                          //!this.props.isLoadingForm_WALLET
                          <>
                            <p> </p>
                            <Button variant="primary" type="submit">
                              Send Dash
                            </Button>
                          </>
                        ) : (
                          <>
                            {exceedsWalletAmt ? (
                              <>
                                <p
                                  style={{
                                    color: "red",
                                    textAlign: "center",
                                  }}
                                >
                                  Insufficient Wallet Funds
                                </p>
                              </>
                            ) : (
                              <></>
                            )}
                            <Button disabled variant="primary" type="submit">
                              Send Dash
                            </Button>
                          </>
                        )}
                      </>
                    )}
                  </Form>
                  {/* **** ^^^^ FORMS AND INFO ^^^^ **** */}

                  {this.props.WALLET_sendSuccess ? (
                    <>
                      <p></p>
                      <Alert
                        variant="success"
                        onClose={() => this.props.handleSuccessAlert_WALLET()}
                        dismissible
                      >
                        <Alert.Heading>Payment Successful!</Alert.Heading>
                        <p>
                          You have successfully sent{" "}
                          <b>
                            {handleDenomDisplay(
                              this.props.whichNetwork,
                              this.props.WALLET_amountToSend
                            )}
                          </b>{" "}
                          to <b>{this.props.WALLET_sendToAddress}</b>
                        </p>
                      </Alert>
                    </>
                  ) : (
                    <></>
                  )}

                  {this.props.WALLET_sendFailure ? (
                    <>
                      <p></p>
                      <Alert
                        variant="danger"
                        onClose={() => this.props.handleFailureAlert_WALLET()}
                        dismissible
                      >
                        <Alert.Heading>Payment Failed</Alert.Heading>
                        <p>
                          Payment was not sent. If everything seems correct,
                          please retry <b>Send Dash</b> to try again.
                        </p>
                      </Alert>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </>
            ) : (
              <></>
            )}

            <div style={{ marginLeft: "1rem", marginTop: "1rem" }}>
              <PaymentAddrComponent
                mode={this.props.mode}
                accountAddress={this.props.accountAddress}
              />
            </div>

            {this.props.isModalShowing &&
            this.props.presentModal === "ConfirmPaymentModal" ? (
              <ConfirmPaymentModal
                whichNetwork={this.props.whichNetwork}
                sendToName={this.props.WALLET_sendToName}
                amountToSend={this.props.WALLET_amountToSend}
                messageToSend={this.props.WALLET_messageToSend}
                sendDashtoName={this.props.sendDashtoName}
                handleClearModalPostPmtConfirm={
                  this.handleClearModalPostPmtConfirm
                }
                isModalShowing={this.props.isModalShowing}
                hideModal={this.props.hideModal}
                mode={this.props.mode}
                closeTopNav={this.props.closeTopNav}
              />
            ) : (
              <></>
            )}
          </Col>
        </Row>
      </>
    );
  }
}

export default WalletPage;
