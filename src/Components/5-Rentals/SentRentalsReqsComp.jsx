import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import Badge from "react-bootstrap/Badge";
import handleDenomDisplay from "../UnitDisplay";

import formatDate from "../TimeDisplayLong";

import getSignature from "../2-PartyPay/getSignature";

import Dash from "dash";

const {
  Core: {
    //Block,
    HDPublicKey,
    Transaction,
    Script,
    //Address,
  },
} = Dash;

class SentRentalsReqsComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copiedName: false,
      Loading2PartyAddress: true,
      Display2Party: "Loading..",
      TXfromDAPI: "",
    };
  }

  // handleNameClick = (theName) => {
  //   navigator.clipboard.writeText(theName);
  //   this.setState({
  //     copiedName: true,
  //   });
  // };

  callGetSignature = (
    theRequest,
    theRequestPubKeyDoc,
    theResponse,
    theResponsePubKeyDoc,
    theResponseNameDoc //theRequestNameDoc
  ) => {
    let result = undefined;

    result = getSignature(
      theRequest,
      theRequestPubKeyDoc,
      theResponsePubKeyDoc,
      this.props.whichNetwork,
      this.state.TXfromDAPI,
      this.props.mnemonic
    );

    if (result !== undefined) {
      this.props.showRefundFundsModal(
        result,
        theRequest, //theResponse
        theResponseNameDoc, //theRequestNameDoc
        theResponsePubKeyDoc,
        theResponse
      );
    }
  };

  callDAPIfor2Party = (theTxId, responsePubKey) => {
    const client = new Dash.Client({ network: this.props.whichNetwork });
    async function dapiClientMethods() {
      let result = await client.getDAPIClient().core.getTransaction(theTxId);

      return result;
    }

    dapiClientMethods()
      .then((d) => {
        // console.log('MultiSig Tx:\n', d.transaction.toJSON());
        let txOutput = new Transaction(d.transaction).toJSON();
        // console.log("Tx:\n", txOutput);

        //console.log("Script from TX", txOutput.outputs[0].script);

        let scriptFromTX = new Script(txOutput.outputs[0].script).toString();

        // console.log("Script:\n", scriptFromTX);

        //2,147,483,648 =  2^31 is deriveChild limit
        //1,729,873,503,663 TIMENOW
        //31,536,000 secsInYear
        //68 years this is how long until repeat - no just repeat, run out of room, will need to increase truncate
        //Just truncate - 1,729,873,000,000

        let timeStamp = this.props.req.$createdAt - 1729873000000;

        //console.log("timeStamp", timeStamp);

        let YourPublicKey = new HDPublicKey(this.props.Your2PartyPubKey.xpubkey)
          .deriveChild(`m/${timeStamp}`)
          //`m/2147483647` <- LIMIT, will hit in 68 years
          .toObject().publicKey;

        // console.log("YourPublicKey", YourPublicKey);

        let TheirPublicKey = new HDPublicKey(responsePubKey.xpubkey)
          .deriveChild(`m/${timeStamp}`)
          .toObject().publicKey;

        // console.log("TheirPublicKey", TheirPublicKey);

        let redeemScript = Script.buildMultisigOut(
          [YourPublicKey, TheirPublicKey],
          2
        );

        //console.log("redeemScript: ", redeemScript);

        let scriptHashOut = redeemScript.toScriptHashOut().toString();

        // console.log("ScriptHashOut: ", scriptHashOut);

        //console.log("Do they match", scriptHashOut === scriptFromTX);

        if (scriptHashOut === scriptFromTX) {
          //  console.log(txOutput.outputs[0].satoshis);
          this.setState({
            TXfromDAPI: txOutput,
            Loading2PartyAddress: false,
            Display2Party: txOutput.outputs[0].satoshis,
          });
        } else {
          this.setState({
            Loading2PartyAddress: false,
            Display2Party: "error",
          });
        }
      })
      .catch((e) => console.error("Something went wrong:\n", e))
      .finally(() => client.disconnect());
  };

  verifyRequestStatus = (theResponse) => {
    if (theResponse === undefined) {
      //console.log("PayLater");
      return <Badge bg="success">Requested</Badge>;
    }

    //This can be 'Requested'(unpaid), 'Rejected', 'Paid' , 'Error'

    if (theResponse.amtMatch !== this.props.req.amt) {
      return <Badge bg="warning">Amount Error</Badge>;
    }

    if (theResponse.txId === "rej") {
      return <Badge bg="secondary">Rejected</Badge>;
    }

    // if (theResponse.sigObject === "" && theResponse.txId !== "") {
    //   return <Badge bg="success">In 2-Party</Badge>;
    // }
    if (
      //Not Released
      theResponse.sigObject === "" &&
      this.props.req.txId === "" &&
      this.props.req.sigObject === ""
    ) {
      return <Badge bg="success">In 2-Party</Badge>;
    }

    if (
      //Released and not Withdrawn
      theResponse.sigObject !== "" &&
      // theResponse.txId !== "" && //resp.txId IS SENDING TO 2PARTY!
      this.props.req.txId === ""
    ) {
      return <Badge bg="success">In 2-Party</Badge>;
    }

    //what if they both hit the button??

    if (
      //theResponse.sigObject === "" &&
      this.props.req.sigObject !== ""
    ) {
      return <Badge bg="primary">Refunded</Badge>;
    }

    if (
      //theResponse.sigObject !== "" &&
      this.props.req.txId !== ""
    ) {
      return <Badge bg="primary">Completed</Badge>;
    }

    console.log("Failed on Error 4");
    return <Badge bg="danger">Fail</Badge>;
  };

  render() {
    let cardBkg;
    let cardText;

    if (this.props.mode === "primary") {
      cardBkg = "white";
      cardText = "dark";
    } else {
      cardBkg = "dark";
      cardText = "white";
    }

    // GET THE NAME
    let responseName = undefined;

    responseName = this.props.ReqsFromYouNames.find((respName) => {
      return respName.$ownerId === this.props.req.toId;
    });

    if (responseName === undefined) {
      responseName = {
        label: "No Name Avail",
        $ownerId: this.props.req.toId,
      };
    }

    // GET THE RESPONSE
    let response = this.props.ReqsFromYouResponses.find((resp) => {
      return resp.reqId === this.props.req.$id;
    });

    // GET THE PUBKEY
    let responsePubKey = undefined;

    responsePubKey = this.props.ReqsFromYouPubKeys.find((pubKey) => {
      return pubKey.$ownerId === this.props.req.toId;
    });

    //  //ADD THE MSGS HERE !!

    //PULL THE MSGS FROM REQ AND RESPONSE

    let messages = [];

    //pull msgs from request -> add id and

    let requestMsgs = [];

    this.props.req.msgObject.forEach((msg) => {
      if (msg.msg !== "") {
        let newMsg = {
          msg: msg.msg,
          time: msg.time,
          owner: this.props.req.$ownerId,
        };
        requestMsgs.push(newMsg);
      }
    });

    let responseMsgs = [];

    if (response !== undefined) {
      response.msgObject.forEach((msg) => {
        if (msg.msg !== "") {
          let newMsg = {
            msg: msg.msg,
            time: msg.time,
            owner: response.$ownerId,
          };
          responseMsgs.push(newMsg);
        }
      });
    }

    // let theMsgObject = {
    //   msg: addedMessage,
    //   time: theTime,
    // };

    let combinedMsgs = [...requestMsgs, ...responseMsgs];

    //console.log(combinedMsgs);

    // //need to order the MSGS ->
    combinedMsgs = combinedMsgs.sort(function (a, b) {
      return a.time - b.time;
    });

    messages = combinedMsgs.map((msg, index) => {
      return (
        <div index={index} key={index}>
          <div
            className="ThreadBorder"
            style={{ paddingTop: ".3rem", marginBottom: ".3rem" }}
          ></div>

          <Card.Title className="cardTitle">
            {msg.owner === this.props.identity || response === undefined ? (
              <b style={{ color: "#008de4" }}>{this.props.uniqueName}</b>
            ) : (
              <b style={{ color: "#008de4" }}>{responseName.label}</b>
            )}

            <span className="textsmaller">
              {formatDate(msg.time, this.props.today, this.props.yesterday)}
            </span>
          </Card.Title>
          <Card.Text>{msg.msg}</Card.Text>
        </div>
      );
    });
    // }

    //END OF NEW THING

    if (
      this.state.Loading2PartyAddress && //so only query once
      response !== undefined
    ) {
      if (
        (this.props.req.sigObject === "" && //so not refunded
          this.props.req.txId === "") || //so not retrieved
        (response.sigObject !== "" &&
          this.props.req.sigObject !== "" &&
          response.refundTxId === "" &&
          this.props.req.txId === "") // both release but not withdraw
      ) {
        if (responsePubKey !== undefined) {
          this.callDAPIfor2Party(response.txId, responsePubKey);
          console.log("calledDAPI for TX");
        } else {
          console.log("Error - No Pub Key for Response.");
        }
      }
    }

    return (
      // <Card
      //   id="card"
      //   key={this.props.index}
      //   bg={cardBkg}
      //   text={cardText}
      //   style={{
      //     marginBottom: ".5rem",
      //   }}
      // >
      //   <Card.Body>
      //     <Card.Title className="cardTitle">
      <>
        <div className="cardTitle">
          <div>
            <b //style={{ color: "green" }}
            >
              To:{" "}
            </b>{" "}
            {/* <span style={{ color: "#008de4" }}>{this.props.tuple[0]}</span> */}
            <b
              //style={{ color: "red" }}
              style={{ color: "#008de4" }}
              // onClick={() => this.handleNameClick(responseName.label)}
            >
              {responseName.label}
            </b>
          </div>
          {/* <span>{this.state.copiedName ? <span>✅</span> : <></>}</span> */}

          {this.verifyRequestStatus(response)}

          <span className="textsmaller">
            {formatDate(
              this.props.req.$createdAt,
              this.props.today,
              this.props.yesterday
            )}
          </span>
        </div>
        {/* </Card.Title> */}

        {/* Requested 1st - WORDS */}
        {response === undefined ? ( //|| response.txId === "" I THINK THIS IS FOR IF RESPONSED WITHOUT PAYMENT <-***
          <div
            style={{
              textAlign: "center",
              marginTop: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <h5>
              You requested{" "}
              <b style={{ color: "#008de4" }}>
                {handleDenomDisplay(
                  this.props.whichNetwork,
                  this.props.req.amt
                )}
              </b>{" "}
              from <b style={{ color: "#008de4" }}>{responseName.label}</b>
            </h5>
          </div>
        ) : (
          <>
            {/* Retrieved = Completed is req.txId !== '' */}
            {/*  Completed Retrieved- WORDS */}
            {this.props.req.txId !== "" ? (
              <>
                <div
                  style={{
                    textAlign: "center",
                    marginTop: "1.5rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <h5>
                    Completed request from{" "}
                    <b style={{ color: "#008de4" }}>{responseName.label}</b> for{" "}
                    <b style={{ color: "#008de4" }}>
                      {handleDenomDisplay(
                        this.props.whichNetwork,
                        this.props.req.amt
                      )}
                    </b>
                  </h5>
                </div>
              </>
            ) : (
              <>
                {/* Completed  Refunded- WORDS */}
                {response.refundTxId !== "" ||
                (response.sigObject === "" &&
                  this.props.req.sigObject !== "") ? (
                  <>
                    <div
                      style={{
                        textAlign: "center",
                        marginTop: "1.5rem",
                        marginBottom: "1.5rem",
                      }}
                    >
                      <h5>
                        Refunded{" "}
                        <b style={{ color: "#008de4" }}>
                          {handleDenomDisplay(
                            this.props.whichNetwork,
                            this.props.req.amt
                          )}
                        </b>{" "}
                        to{" "}
                        <b style={{ color: "#008de4" }}>{responseName.label}</b>
                      </h5>
                    </div>
                  </>
                ) : (
                  <>
                    {/* ADD BOTH AVAIL FOR WITHDRAWAL AND WITHDRAW? BUT THEN THIS ALSO NEED THE CHECKWITHDRAWAL -> NEED A CORRECT MISMATCH BUTTON */}
                    {/* ADD IF BOTH ALLOW RETRIEVE BUT NEITHER TXID YET - NEEDS CHECKTX */}

                    {response.sigObject !== "" &&
                    this.props.req.sigObject !== "" &&
                    response.refundTxId === "" &&
                    this.props.req.txId === "" ? (
                      <>
                        {/*  In2Party 2nd - 2Party */}
                        {/*  */}
                        <p></p>
                        {!this.state.Loading2PartyAddress ? (
                          <>
                            <div
                              style={{
                                textAlign: "center",
                                marginTop: "1.5rem",
                                marginBottom: "1.5rem",
                              }}
                            >
                              <h3>
                                <Badge bg="primary">
                                  <b //style={{ color: "#008de4" }}
                                  >
                                    {handleDenomDisplay(
                                      this.props.whichNetwork,
                                      this.state.Display2Party
                                    )}
                                  </b>{" "}
                                  in{" "}
                                  <b //style={{ color: "#008de4" }}
                                  >
                                    2-Party
                                  </b>
                                </Badge>
                              </h3>
                            </div>
                          </>
                        ) : (
                          <>
                            <div
                              style={{
                                textAlign: "center",
                                marginTop: "1.5rem",
                                marginBottom: "1.5rem",
                              }}
                            >
                              <h3>
                                <Badge bg="primary">
                                  <b //style={{ color: "#008de4" }}
                                  >
                                    Loading 2-Party..
                                  </b>
                                </Badge>
                              </h3>
                            </div>
                          </>
                        )}
                        <p></p>

                        {/* Retrieve Button 4rd - button */}
                        {response.sigObject !== "" &&
                        this.props.req.txId === "" ? (
                          <>
                            {this.state.Loading2PartyAddress ? (
                              <>
                                <p></p>
                                <div className="d-grid gap-2">
                                  <Button variant="success" disabled>
                                    <b>Withdraw Amount</b>
                                  </Button>
                                </div>
                                <p></p>
                              </>
                            ) : (
                              <>
                                <p></p>
                                <div className="d-grid gap-2">
                                  <Button
                                    variant="success"
                                    onClick={() =>
                                      this.props.showRetrieveFundsModal(
                                        response,
                                        responsePubKey,
                                        responseName,
                                        this.props.req,
                                        this.state.TXfromDAPI
                                      )
                                    }
                                  >
                                    <b>Withdraw Amount</b>
                                  </Button>
                                </div>
                                <p></p>
                              </>
                            )}
                          </>
                        ) : (
                          <></>
                        )}
                      </>
                    ) : (
                      <>
                        {/*  In2Party 2nd - 2Party */}
                        {/*  */}
                        {response.sigObject === "" || // Not Released
                        (this.props.req.txId === "" && // Not Returned
                          this.props.req.sigObject === "") ? (
                          <>
                            <p></p>
                            {!this.state.Loading2PartyAddress ? (
                              <>
                                <div
                                  style={{
                                    textAlign: "center",
                                    marginTop: "1.5rem",
                                    marginBottom: "1.5rem",
                                  }}
                                >
                                  <h3>
                                    <Badge bg="primary">
                                      <b //style={{ color: "#008de4" }}
                                      >
                                        {handleDenomDisplay(
                                          this.props.whichNetwork,
                                          this.state.Display2Party
                                        )}
                                      </b>{" "}
                                      in{" "}
                                      <b //style={{ color: "#008de4" }}
                                      >
                                        2-Party
                                      </b>
                                    </Badge>
                                  </h3>
                                </div>
                              </>
                            ) : (
                              <>
                                <div
                                  style={{
                                    textAlign: "center",
                                    marginTop: "1.5rem",
                                    marginBottom: "1.5rem",
                                  }}
                                >
                                  <h3>
                                    <Badge bg="primary">
                                      <b //style={{ color: "#008de4" }}
                                      >
                                        Loading 2-Party..
                                      </b>
                                    </Badge>
                                  </h3>
                                </div>
                              </>
                            )}
                            <p></p>
                          </>
                        ) : (
                          <></>
                        )}

                        {/* Refund Button 3rd - button */}
                        {response.sigObject === "" &&
                        this.props.req.sigObject === "" ? (
                          <>
                            {this.state.Loading2PartyAddress ? (
                              <>
                                <p></p>

                                <Button variant="primary" disabled>
                                  <b>Refund 2-Party</b>
                                </Button>

                                <p></p>
                              </>
                            ) : (
                              <>
                                <p></p>

                                <Button
                                  variant="primary"
                                  onClick={() =>
                                    this.callGetSignature(
                                      this.props.req,
                                      this.props.Your2PartyPubKey, //requestPubKey,
                                      response,
                                      responsePubKey, //this.props.Your2PartyPubKey,
                                      responseName //requestName
                                    )
                                  }
                                >
                                  <b>Refund 2-Party</b>
                                </Button>

                                <p></p>
                              </>
                            )}
                          </>
                        ) : (
                          <></>
                        )}

                        {/* ADD IF BOTH ALLOW RETRIEVE BUT NEITHER TXID YET - NEEDS CHECKTX */}

                        {/* Retrieve Button 4rd - button */}
                        {response.sigObject !== "" &&
                        this.props.req.txId === "" ? (
                          <>
                            {this.state.Loading2PartyAddress ? (
                              <>
                                <p></p>
                                <div className="d-grid gap-2">
                                  <Button variant="success" disabled>
                                    <b>Withdraw Amount</b>
                                  </Button>
                                </div>
                                <p></p>
                              </>
                            ) : (
                              <>
                                <p></p>
                                <div className="d-grid gap-2">
                                  <Button
                                    variant="success"
                                    onClick={() =>
                                      this.props.showRetrieveFundsModal(
                                        response,
                                        responsePubKey,
                                        responseName,
                                        this.props.req,
                                        this.state.TXfromDAPI
                                      )
                                    }
                                  >
                                    <b>Withdraw Amount</b>
                                  </Button>
                                </div>
                                <p></p>
                              </>
                            )}
                          </>
                        ) : (
                          <></>
                        )}
                        {/* Close of Normal Part ^^^ */}
                      </>
                    )}
                    {/* Close of Double Sigs ^^^ */}
                  </>
                )}
                {/* Close of Refunded ^^^ */}
              </>
            )}
            {/* Close of Completed^^^ */}
          </>
        )}
        {/* Close of !Responded^^^ */}

        <>
          <div
            className="BottomBorder"
            style={{ paddingTop: ".7rem", marginBottom: ".7rem" }}
          ></div>
          <div
            className="cardTitle"
            style={{ marginTop: ".4rem", marginBottom: ".5rem" }}
          >
            <h5>Messages</h5>
            {this.verifyRequestStatus(response)}
          </div>
        </>

        {messages.length === 0 ? (
          <>
            <p style={{ textAlign: "center", paddingTop: ".5rem" }}>
              (Currently, there are no messages.)
            </p>
          </>
        ) : (
          <></>
        )}

        {messages}
        <p></p>

        <>
          <div className="ButtonRightNoUnderline">
            <Button
              variant="primary"
              onClick={() =>
                this.props.showAddMsgToRequestModal(
                  this.props.req,
                  responseName,
                  responsePubKey
                )
              }
            >
              <b>Add Message</b>
            </Button>
          </div>
        </>
      </>
      //   </Card.Body>
      // </Card>
    );
  }
}

export default SentRentalsReqsComp;
