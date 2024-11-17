import React from "react";
import LocalForage from "localforage";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";

import { IoMdArrowRoundBack } from "react-icons/io";

//import Nav from "react-bootstrap/Nav";

//import PaymentsTabNEW from "./PaymentsTabNEW";
//import PaymentRequestsComp from "./PaymentRequestsComp";

import CreditsOnPage from "../CreditsOnPage";
import handleDenomDisplay from "../UnitDisplay";

import "./ConnectedWalletPage.css";
import dapiClientNoWallet from "../DapiClientNoWallet";
import Dash from "dash";

class RequestPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalShowing: false,
      presentModal: "",

      nameFormat: false,
      numberQuantity: false,
      amountToSend: "", //changed from 0 for placeholder to appear
      sendToName: "",

      messageToAdd: "",
      validMessage: true,
      tooLongMessageError: false,

      identityIdReceipient: "",

      //dgmDocumentsForReceipient: [],
      receipient2PartyPubKeyDoc: [],
      formEventTarget: "",
      isLoadingVerify: false,
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

  onChange = (event) => {
    // console.log(event.target.value);

    event.preventDefault();
    event.stopPropagation();

    this.setState({
      nameAvail: false,
      isLoadingVerify: false,
      identityIdReceipient: "",
      // dgmDocumentsForReceipient: [],
      receipient2PartyPubKeyDoc: [],
    });

    //console.log(`id = ${event.target.id}`);

    if (event.target.id === "validationCustomName") {
      this.nameValidate(event.target.value);
    }

    if (event.target.id === "validationCustomNumber") {
      this.numberValidate(event.target.value);
    }

    if (event.target.id === "validationCustomMessage") {
      this.messageValidate(event.target.value);
    }
  };

  nameValidate = (nameInput) => {
    let regex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]$/;
    let valid = regex.test(nameInput);

    if (valid) {
      this.setState({
        sendToName: nameInput,
        nameFormat: true,
      });
    } else {
      this.setState({
        sendToName: nameInput,
        nameFormat: false,
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

  messageValidate = (messageInput) => {
    let regex = /^.[\S\s]{0,250}$/;

    let valid = regex.test(messageInput);

    if (valid) {
      this.setState({
        messageToAdd: messageInput,
        validMessage: true,
        tooLongMessageError: false,
      });
    } else {
      if (messageInput.length > 250) {
        this.setState({
          messageToAdd: messageInput,
          validMessage: false,
          tooLongMessageError: true,
        });
      } else {
        this.setState({
          messageToAdd: messageInput,
          validMessage: false,
        });
      }
    }
  };

  //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

  //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&777

  searchName = (nameToRetrieve) => {
    const client = new Dash.Client(dapiClientNoWallet(this.props.whichNetwork));

    const retrieveName = async () => {
      // Retrieve by full name (e.g., myname.dash)

      return client.platform.names.resolve(`${nameToRetrieve}.dash`);
    };

    retrieveName()
      .then((d) => {
        if (d === null) {
          console.log("No DPNS Document for this Name.");
          this.setState({
            identityIdReceipient: "No Name",
            isLoadingVerify: false,
          });
        } else {
          let nameDoc = d.toJSON();
          console.log("NameDoc retrieved:\n", nameDoc);
          //THIS IS WHERE THE PAYMENT REQUEST -> YES
          if (this.props.identity !== nameDoc.$ownerId) {
            this.query2PartyPubKey(nameDoc);
          } else {
            this.setState({
              identityIdReceipient: nameDoc.$ownerId,
              isLoadingVerify: false,
            });
          }
          // this.setState(
          //   {
          //     identityIdReceipient: nameDoc.$ownerId,
          //   },
          //   () => this.query2PartyPubKey(nameDoc)
          // );
        }
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
      })
      .finally(() => client.disconnect());
  };

  query2PartyPubKey = (theNameDoc) => {
    const client = new Dash.Client(dapiClientNoWallet(this.props.whichNetwork));

    const getDocuments = async () => {
      // console.log("Called query 2 Party Pub Key");

      return client.platform.documents.get("TwoPartyContract.xPubKeyDoc", {
        where: [["$ownerId", "==", theNameDoc.$ownerId]],
      });
    };

    getDocuments()
      .then((d) => {
        if (d.length === 0) {
          this.setState({
            //dgmDocumentsForReceipient: "No DGM Doc for Receipient.",
            receipient2PartyPubKeyDoc: "No 2-Party PubKey",
            isLoadingVerify: false,
          });
        } else {
          // this.props.showConfirm2PartyModal(
          //   theNameDoc.label, //this.state.sendToName,
          //   this.state.amountToSend,
          //   //docArray[0],
          //   d[0].toJSON(),
          //   this.state.messageToAdd
          // );

          this.props.show2PartyRequestModal(
            theNameDoc, //Needs both name and OwnerId for doc creation
            this.state.amountToSend
            //this.state.messageToAdd
          );

          this.setState({
            //dgmDocumentsForReceipient: docArray,
            identityIdReceipient: theNameDoc.$ownerId,
            receipient2PartyPubKeyDoc: d[0].toJSON(),
            isLoadingVerify: false,
          });
        }
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
      })
      .finally(() => client.disconnect());
  };

  handleVerifyClick = (event) => {
    event.preventDefault();

    this.setState({
      receipient2PartyPubKeyDoc: [],
      identityIdReceipient: "Verifying Name..",
      isLoadingVerify: true,
      formEventTarget: event.target,
    });
    //
    //if(this.props.whichPayType==="Pay"){
    if (this.state.nameFormat) {
      this.searchName(this.state.sendToName);
    } else {
      //   this.setState({
      //     //No loading of name or DGM doc with Addr Payment
      //     isLoadingVerify: false,
      //   });
    }
    // else if (this.state.addrFormat) {
    //   this.props.showAddrConfirmModal(
    //     //Create this function and modal ->
    //     this.state.sendToAddr,
    //     this.state.amountToSend
    //   );
    //   this.setState({
    //     //No loading of name or DGM doc with Addr Payment
    //     isLoadingVerify: false,
    //   });
    // }
  };

  // componentDidMount() {
  //   this.props.pullInitialTrigger2Party();
  // }

  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  render() {
    let isRequestToSelf =
      this.props.identity === this.state.identityIdReceipient;

    return (
      <>
        <Navbar bg={this.props.mode} variant={this.props.mode} fixed="top">
          <Container>
            <Button
              variant="primary"
              onClick={() => this.props.handleSelectedDapp("2-Party Pay")}
            >
              <IoMdArrowRoundBack size={28} />
            </Button>

            <h3 style={{ textAlign: "center" }}>
              {this.props.mode === "primary" ? (
                <b className="lightMode">Payment Request</b>
              ) : (
                <b>Payment Request</b>
              )}
            </h3>
            <div style={{ marginRight: "4rem" }}></div>
          </Container>
        </Navbar>

        <div className="bodytext">
          <CreditsOnPage
            identityInfo={this.props.identityInfo}
            uniqueName={this.props.uniqueName}
            showModal={this.props.showModal}
          />

          {/* {this.props.isLoadingRefresh_WALLET &&
              !this.props.isLoadingWallet &&
              this.props.WALLET_whichTab === "Payments" ? (
                <div id="spinner">
                  <p></p>
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                  <p></p>
                </div>
              ) : (
                <></>
              )} */}

          <Form
            id="Pay-to-Name-form"
            noValidate
            onSubmit={this.handleVerifyClick}
            onChange={this.onChange}
          >
            <Form.Group className="mb-3" controlId="validationCustomName">
              <Form.Label>
                <b>Request Dash from:</b>
              </Form.Label>

              {/* <Form.Label>Send Dash to:</Form.Label> */}

              {this.state.isLoadingVerify || this.props.isLoadingForm_WALLET ? (
                <Form.Control
                  type="text"
                  placeholder={this.state.sendToName}
                  readOnly
                />
              ) : (
                <Form.Control
                  type="text"
                  //placeholder={formPlaceholder}
                  placeholder="Enter name here..."
                  defaultValue={this.state.sendToName}
                  required
                  isValid={this.state.nameFormat || this.state.addrFormat}
                />
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="validationCustomNumber">
              <Form.Label>
                <b>Amount Requested (in Dash)</b>
              </Form.Label>

              {this.state.isLoadingVerify || this.props.isLoadingForm_WALLET ? (
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

            {this.state.isLoadingVerify ? (
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
              <></>
            )}

            {this.state.nameFormat &&
            this.state.numberQuantity &&
            !this.state.isLoadingVerify &&
            !isRequestToSelf ? (
              <div className="ButtonRightNoUnderline">
                <p> </p>
                <Button variant="primary" type="submit">
                  <b>Request Dash</b>
                </Button>
              </div>
            ) : (
              <></>
            )}

            {((!this.state.nameFormat || !this.state.numberQuantity) &&
              !this.state.isLoadingVerify) ||
            isRequestToSelf ? (
              <div className="ButtonRightNoUnderline">
                <p></p>
                <Button disabled variant="primary">
                  <b>Request Dash</b>
                </Button>
              </div>
            ) : (
              <></>
            )}

            {/* Add the message form input here */}

            {/* <p></p>
            <Form.Group className="mb-3" controlId="validationCustomMessage">
              <Form.Label>
                <b>Request Message</b>
              </Form.Label>

              {this.state.isLoadingVerify || this.props.isLoadingForm_WALLET ? (
                <Form.Control
                  onChange={this.onChange}
                  as="textarea"
                  rows={2}
                  placeholder={this.state.messageToAdd}
                  readOnly
                />
              ) : (
                <Form.Control
                  onChange={this.onChange}
                  as="textarea"
                  rows={2}
                  placeholder="Optional.."
                  //defaultValue={this.state.messageToAdd}
                  //defaultValue="Optional.."
                  //required
                  isInvalid={this.state.tooLongMessageError}
                  //isValid={this.state.validMessage}
                />
              )}

              {this.state.tooLongError ? (
                <Form.Control.Feedback className="floatLeft" type="invalid">
                  Sorry, this is too long! Please use less than 250 characters.
                </Form.Control.Feedback>
              ) : (
                <></>
              )}
            </Form.Group> */}
          </Form>
          {/* **** ^^^^ FORMS AND INFO ^^^^ **** */}
          {/* MY SERIES OF ALERTS FOR ERRORS AND NO NAME AND NOT DGM DOC */}

          {isRequestToSelf ? (
            <>
              <p></p>
              <Alert variant="danger" dismissible>
                <Alert.Heading>Request from Self - Alert</Alert.Heading>
                <p>You cannot send a "2-Party" Request to yourself.</p>
              </Alert>
            </>
          ) : (
            <></>
            //   <p
            //     className="smallertext"
            //     style={{ color: "red", marginTop: ".2rem" }}
            //   >
            //     <b>
            //       Your Name-Wallet IdentityId should not be used as a proxy.
            //     </b>
            //   </p>
            // ) : (
            //   <></>
          )}

          {this.state.identityIdReceipient === "No Name" ? (
            <>
              <p></p>
              <Alert variant="danger" dismissible>
                <Alert.Heading>Name Alert</Alert.Heading>
                <p>The name {this.state.sendToName} is not owned by anyone.</p>
              </Alert>
            </>
          ) : (
            <></>
          )}

          {this.state.receipient2PartyPubKeyDoc === "No 2-Party PubKey" ? (
            <>
              <p></p>
              <Alert variant="danger" dismissible>
                <Alert.Heading>2-Party Alert</Alert.Heading>
                <p>
                  <b>{this.state.sendToName}</b> has not yet enabled{" "}
                  <b>"2-Party" Pay</b> in their Name-Wallet.
                </p>
              </Alert>
              <p></p>
            </>
          ) : (
            <></>
          )}
        </div>
      </>
    );
  }
}

export default RequestPage;
