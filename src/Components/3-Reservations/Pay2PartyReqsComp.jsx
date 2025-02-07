import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";

import Badge from "react-bootstrap/Badge";
import handleDenomDisplay from "../UnitDisplay";

import formatDate from "../TimeDisplayLong";

import getSignature from "../2-PartyPay/getSignature";

import dapiClientNoWallet from "../DapiClientNoWallet";

import Dash from "dash";

const {
  Core: {
    HDPublicKey,
    Transaction,
    Script,
    Mnemonic,
    HDPrivateKey,
    Address,
    Signature,
  },
} = Dash;

class Pay2PartyReqsComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copiedName: false,
      Loading2PartyAddress: true,
      Display2Party: "Loading..",
      TXfromDAPI: "",
      alreadySent: false,
      initialAlreadySent: false,
      withdrawCheck: false,
    };
  }

  checkAlreadySent = (theRequestPubKeyDoc) => {
    //call the .js function -> when no response to check TXhistory
    // whatever return set to state ->

    let timeStamp = this.props.req.$createdAt - 1729873000000;
    //console.log("timeStamp", timeStamp);
    let truncatedTimeStamp = new String(timeStamp).slice(0, -3);

    let YourPublicKey = new HDPublicKey(this.props.Your2PartyPubKey.xpubkey)
      .deriveChild(`m/${truncatedTimeStamp}`)
      //`m/2147483647` <- LIMIT, will hit in 68 years
      .toObject().publicKey;

    // console.log("YourPublicKey", YourPublicKey);

    let TheirPublicKey = new HDPublicKey(theRequestPubKeyDoc.xpubkey)
      .deriveChild(`m/${truncatedTimeStamp}`)
      .toObject().publicKey;

    // console.log("TheirPublicKey", TheirPublicKey);

    let redeemScript = Script.buildMultisigOut(
      [YourPublicKey, TheirPublicKey],
      2
    );

    //console.log("redeemScript: ", redeemScript);

    let scriptHashOut = redeemScript.toScriptHashOut();
    //console.log("ScriptHashOutOFALEADYSENT: ", scriptHashOut.toString());

    //console.log("whichNetwork", whichNetwork);
    let scriptAddress = Address.fromScript(
      scriptHashOut,
      this.props.whichNetwork
    );
    //console.log("scriptAddress: ", scriptAddress.toString());

    let foundTX = undefined;
    let foundtxId = undefined;

    this.props.accountHistory.find((tx) => {
      if (tx.type === "sent") {
        foundTX = tx.to.find((input) => {
          return (
            input.address === scriptAddress.toString() &&
            input.satoshis === this.props.req.amt
          );
        });
      }

      if (foundTX !== undefined) {
        foundtxId = tx.txId;
        return true;
      } else {
        return false;
      }
    });

    //console.log("FoundTX: ", foundTX);
    console.log("FoundtxId: ", foundtxId);

    return foundtxId;
  };

  checkAlreadyWithdrawn = (theRequestPubKeyDoc) => {
    let timeStamp = this.props.req.$createdAt - 1729873000000;
    //console.log("timeStamp", timeStamp);
    let truncatedTimeStamp = new String(timeStamp).slice(0, -3);

    let YourPublicKey = new HDPublicKey(this.props.Your2PartyPubKey.xpubkey)
      .deriveChild(`m/${truncatedTimeStamp}`)
      //`m/2147483647` <- LIMIT, will hit in 68 years
      .toObject().publicKey;

    // console.log("YourPublicKey", YourPublicKey);

    let TheirPublicKey = new HDPublicKey(theRequestPubKeyDoc.xpubkey)
      .deriveChild(`m/${truncatedTimeStamp}`)
      .toObject().publicKey;

    // console.log("TheirPublicKey", TheirPublicKey);

    let redeemScript = Script.buildMultisigOut(
      [YourPublicKey, TheirPublicKey],
      2
    );

    //console.log("redeemScript: ", redeemScript);

    let scriptHashOut = redeemScript.toScriptHashOut();
    //console.log("ScriptHashOutOFALEADYSENT: ", scriptHashOut.toString());

    //console.log("whichNetwork", whichNetwork);
    let scriptAddress = Address.fromScript(
      scriptHashOut,
      this.props.whichNetwork
    );
    //console.log("scriptAddress: ", scriptAddress.toString());

    let foundTX = undefined;
    let foundtxId = undefined;

    this.props.accountHistory.find((tx) => {
      if (tx.type === "received") {
        foundTX = tx.from.find((input) => {
          return (
            input.address === scriptAddress.toString()
            //&& input.satoshis === this.props.req.amt
          );
        });
      }

      if (foundTX !== undefined) {
        foundtxId = tx.txId;
        return true;
      } else {
        return false;
      }
    });

    //console.log("FoundTX: ", foundTX);
    //console.log("FoundtxId: ", foundtxId);

    return foundtxId;
  };

  callGetSignature = (
    theRequest,
    theRequestPubKeyDoc,
    theResponse,
    theResponsePubKeyDoc,
    theRequestNameDoc
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
      this.props.showReleaseFundsModal(
        result,
        theResponse,
        theRequestNameDoc,
        theRequestPubKeyDoc,
        theRequest
      );
      //signatureToAdd,
      //theResponse,
      // index,
      // toWhomNameDoc
    }
  };

  callDAPIfor2Party = (theTxId, requestPubKey) => {
    const client = new Dash.Client(dapiClientNoWallet(this.props.whichNetwork));
    async function dapiClientMethods() {
      //console.log("theTxId:", theTxId);
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

        let truncatedTimeStamp = new String(timeStamp).slice(0, -3);

        let YourPublicKey = new HDPublicKey(this.props.Your2PartyPubKey.xpubkey)
          .deriveChild(`m/${truncatedTimeStamp}`)
          //`m/2147483647` <- LIMIT, will hit in 68 years
          .toObject().publicKey;

        // console.log("YourPublicKey", YourPublicKey);

        let TheirPublicKey = new HDPublicKey(requestPubKey.xpubkey)
          .deriveChild(`m/${truncatedTimeStamp}`)
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

  verifyRequestStatus = (theResponse, ifAlreadyWithdrawnTXid) => {
    // if (theOrder.txId === "payLater") {
    //   //console.log("PayLater");
    //   return <Badge bg="warning">Pay Later</Badge>;
    // }

    if (theResponse === undefined) {
      //console.log("PayLater");
      return <Badge bg="success">Requested</Badge>;
    }

    if (theResponse.error !== "" || this.props.req.error !== "") {
      //console.log("Failed on Decrypt Error");
      return <Badge bg="danger">Fail</Badge>;
    }

    //This can be 'Requested'(unpaid), 'Rejected', 'Paid' , 'Error'

    if (theResponse.amtMatch !== this.props.req.amt) {
      return <Badge bg="warning">Amount Error</Badge>;
    }

    if (theResponse.txId === "rej") {
      return <Badge bg="secondary">Rejected</Badge>;
    }

    if (ifAlreadyWithdrawnTXid !== undefined) {
      return <Badge bg="primary">Refunded</Badge>;
    }

    if (
      theResponse.sigObject === "" &&
      theResponse.txId !== "" &&
      theResponse.refundTxId === ""
    ) {
      return <Badge bg="success">In 2-Party</Badge>;
    }

    if (theResponse.sigObject === "" && theResponse.refundTxId !== "") {
      return <Badge bg="primary">Refunded</Badge>;
    }

    if (theResponse.sigObject !== "" && theResponse.txId !== "") {
      return <Badge bg="primary">Completed</Badge>;
    }

    // if (this.props.tuple[1].amt === walletTx.satoshisBalanceImpact) {
    //   return <Badge bg="primary">Paid</Badge>;
    // } else {
    console.log("Failed on Error 4");
    return <Badge bg="danger">Fail</Badge>;
    // }
  };

  // componentDidMount() {
  // }

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

    // WHO IS THIS FOR - WHO IS USING THIS TO SEE AND WHAT ARE THEY SEEING
    // -> You the request sender, the request you sent

    // GET THE NAME
    let requestName = undefined;

    requestName = this.props.ReqsToYouNames.find((reqName) => {
      return reqName.$ownerId === this.props.req.$ownerId;
    });

    if (requestName === undefined) {
      requestName = {
        label: "No Name Avail",
        $ownerId: this.props.req.$ownerId,
      };
    }

    // GET THE RESPONSE
    let response = this.props.ReqsToYouResponses.find((resp) => {
      return resp.reqId === this.props.req.$id;
    });

    let responseError = "";
    if (response !== undefined) {
      responseError = response.error;
    }

    // GET THE PUBKEY
    let requestPubKey = undefined;
    requestPubKey = this.props.ReqsToYouPubKeys.find((pubKey) => {
      return pubKey.$ownerId === this.props.req.$ownerId;
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
            {msg.owner === this.props.identity ? (
              <b style={{ color: "#008de4" }}>{this.props.uniqueName}</b>
            ) : (
              <b style={{ color: "#008de4" }}>{requestName.label}</b>
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
    //Loading2PartyAddress: true,
    //Display2Party: 'Loading..',
    if (
      response !== undefined &&
      this.props.req.txId === "" && //so not withdraw
      response.refundTxId === "" //so not withdraw refund
    ) {
      if (this.state.Loading2PartyAddress && response.sigObject === "") {
        if (
          requestPubKey !== undefined &&
          this.props.req.error === "" &&
          response.error === ""
        ) {
          this.callDAPIfor2Party(response.txId, requestPubKey);
          console.log("calledDAPI for TX");
        } else {
          console.log("Error - No Pub Key for Response.");
        }
      }
    }

    //Only checkAlreadySent if 1)No Response Doc 2) There is RequestPubKey 3) Req.txId is not complete 4) No sigObject so not signed and released 5) and no encryption error
    let alreadySenttxId;

    if (
      response === undefined &&
      requestPubKey !== undefined &&
      this.props.req.txId === "" &&
      this.props.req.sigObject === "" &&
      this.props.req.error === ""
    ) {
      alreadySenttxId = this.checkAlreadySent(requestPubKey);
      //BECAUSE THERE IS NO ASYNC CALL..
      //I CAN JUST RETURN IT HERE AND NOT DO A STATE CALL.
    }

    //Only checkAlreadyWithdrawn if 1)is Response Doc 2) There is RequestPubKey 3) Req hasn't withdrawn 4) sigObject(refund) is signed 5) and no encryption error
    let alreadyWithdrawntxId;
    //FOR REFUND** - IMPORTANT
    if (
      response !== undefined &&
      requestPubKey !== undefined &&
      this.props.req.txId === "" &&
      this.props.req.sigObject !== "" &&
      this.props.req.error === ""
    ) {
      alreadyWithdrawntxId = this.checkAlreadyWithdrawn(requestPubKey);
    }

    return (
      <>
        {/* <Card
        id="card"
        key={this.props.index}
        bg={cardBkg}
        text={cardText}
        style={{
          marginBottom: ".5rem",
        }}
      >
        <Card.Body> */}
        {/* <Card.Title className="cardTitle"> */}
        <div className="cardTitle">
          <div>
            <b>From: </b>{" "}
            <b
              style={{ color: "#008de4" }}
              //style={{ color: "green" }}
              // onClick={() => this.handleNameClick(requestName.label)}
            >
              {requestName.label}
            </b>
          </div>
          {/* <span>{this.state.copiedName ? <span>✅</span> : <></>}</span> */}

          {this.verifyRequestStatus(response, alreadyWithdrawntxId)}

          <span className="textsmaller">
            {formatDate(
              this.props.req.$createdAt,
              this.props.today,
              this.props.yesterday
            )}
          </span>
        </div>
        {/* </Card.Title> */}

        {/* ADD TXID YET - NEEDS CHECKALREADYSENT */}

        {requestPubKey !== undefined &&
        this.props.req.error === "" &&
        responseError === "" ? (
          <>
            {response === undefined ? ( //|| response.txId === ""
              <>
                {/* Requested 1st - WORDS */}
                <div
                  style={{
                    textAlign: "center",
                    marginTop: "1.5rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <h5>
                    <b style={{ color: "#008de4" }}>{requestName.label}</b>{" "}
                    requests{" "}
                    <b style={{ color: "#008de4" }}>
                      {handleDenomDisplay(
                        this.props.whichNetwork,
                        this.props.req.amt
                      )}
                    </b>
                  </h5>
                </div>

                {/* Requested 1st - Insufficient */}
                {this.props.accountBalance <= this.props.req.amt ? (
                  <>
                    <p></p>
                    <div className="d-grid gap-2">
                      <Button variant="success" disabled>
                        <b>Pay to 2-Party</b>
                      </Button>
                    </div>
                    <p
                      className="smallertext"
                      style={{ color: "red", marginTop: ".2rem" }}
                    >
                      <b>Insufficient funds in your wallet.</b>
                    </p>
                    <p></p>
                  </>
                ) : (
                  <></>
                )}

                {/* alreadySenttxId */}
                {response === undefined &&
                alreadySenttxId !== undefined &&
                requestPubKey !== undefined ? (
                  <>
                    <Alert variant="danger">
                      <Alert.Heading>2-Party Response Failed</Alert.Heading>

                      <p>
                        Your payment to the 2-Party has already been made, but
                        the 2-Party Response Document was not created.
                      </p>
                      <p style={{ textAlign: "center" }}>
                        <b>*Please Resubmit 2-Party Response to proceed.*</b>
                      </p>
                    </Alert>

                    <p></p>
                    <div className="d-grid gap-2">
                      <Button
                        variant="success"
                        onClick={() =>
                          this.props.alreadySentCreateResponse(
                            this.props.req,
                            requestName,
                            requestPubKey,
                            alreadySenttxId
                          )
                        }
                      >
                        <b>Resubmit Response</b>
                      </Button>
                    </div>
                    <p></p>
                  </>
                ) : (
                  <></>
                )}

                {/* Requested 1st - Buttons */}
                {response === undefined &&
                alreadySenttxId === undefined &&
                this.props.accountBalance > this.props.req.amt &&
                requestPubKey !== undefined ? (
                  <>
                    <p></p>
                    <div className="d-grid gap-2">
                      <Button
                        variant="success"
                        onClick={() =>
                          this.props.show2PartyPayRequestModal(
                            this.props.req,
                            requestName,
                            requestPubKey
                          )
                        }
                      >
                        <b>Pay to 2-Party</b>
                      </Button>
                    </div>
                    <p></p>
                  </>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <>
                {/* Completed Payment- WORDS */}
                {response.sigObject !== "" && response.txId !== "" ? (
                  <>
                    <div
                      style={{
                        textAlign: "center",
                        marginTop: "1.5rem",
                        marginBottom: "1.5rem",
                      }}
                    >
                      <h5>
                        Completed payment to{" "}
                        <b style={{ color: "#008de4" }}>{requestName.label}</b>{" "}
                        for{" "}
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
                    {/*  Completed Refunded- WORDS */}
                    {response.refundTxId !== "" ||
                    alreadyWithdrawntxId !== undefined ? (
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
                                response.amtMatch
                              )}
                            </b>{" "}
                            from{" "}
                            <b style={{ color: "#008de4" }}>
                              {requestName.label}
                            </b>{" "}
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

                            {/* WithDraw - button */}
                            {response.sigObject !== "" &&
                            this.props.req.txId === "" &&
                            alreadyWithdrawntxId === undefined ? (
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
                                          this.props.showWithdrawRefundModal(
                                            response,
                                            requestPubKey, //responsePubKey
                                            requestName, //responseName
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
                            {response !== undefined &&
                            response.sigObject === "" ? (
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

                            {/* Release Button  - button */}
                            {response !== undefined &&
                            response.sigObject === "" &&
                            this.props.req.sigObject === "" ? (
                              <>
                                {this.state.Loading2PartyAddress ? (
                                  <>
                                    <p></p>
                                    <div className="d-grid gap-2">
                                      <Button variant="success" disabled>
                                        <b>Release Funds</b>
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
                                          this.callGetSignature(
                                            this.props.req,
                                            requestPubKey,
                                            response,
                                            this.props.Your2PartyPubKey,
                                            requestName
                                          )
                                        }
                                      >
                                        <b>Release Funds</b>
                                      </Button>
                                    </div>
                                    <p></p>
                                  </>
                                )}
                              </>
                            ) : (
                              <></>
                            )}

                            {/* Withdraw Refund - button */}
                            {response.sigObject === "" &&
                            this.props.req.sigObject !== "" ? (
                              <>
                                {this.state.Loading2PartyAddress ? (
                                  <>
                                    <p></p>
                                    <div className="d-grid gap-2">
                                      <Button variant="success" disabled>
                                        <b>Withdraw Refund</b>
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
                                          this.props.showWithdrawRefundModal(
                                            response,
                                            requestPubKey, //responsePubKey
                                            requestName, //responseName
                                            this.props.req,
                                            this.state.TXfromDAPI
                                          )
                                        }
                                      >
                                        <b>Withdraw Refund</b>
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
                    {/* Close of Refund Withdrawal ^^^ */}
                  </>
                )}
                {/* Close of Completed^^^ */}
              </>
            )}
            {/* Close of !Responded^^^ */}

            <div
              className="BottomBorder"
              style={{ paddingTop: ".7rem", marginBottom: ".7rem" }}
            ></div>
            <div
              className="cardTitle"
              style={{ marginTop: ".4rem", marginBottom: ".5rem" }}
            >
              <h5>Messages</h5>
              {this.verifyRequestStatus(response, alreadyWithdrawntxId)}
            </div>

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

            {response !== undefined ? (
              <>
                <div className="ButtonRightNoUnderline">
                  <Button
                    variant="primary"
                    onClick={() =>
                      this.props.showAddMessageToResponseModal(
                        response,
                        requestName,
                        requestPubKey
                      )
                    }
                  >
                    <b>Add Message</b>
                  </Button>
                </div>
              </>
            ) : (
              <></>
            )}
          </> //Close of undefinedPubKey and decrypt error
        ) : (
          <>
            <p style={{ marginLeft: "1rem" }}>2-Party Error:</p>
            {/* Error Messages */}
            {requestPubKey === undefined ? (
              <>
                <p style={{ textAlign: "center" }}>
                  Public key of other party was not found.
                </p>
              </>
            ) : (
              <></>
            )}
            {this.props.req.error !== "" || responseError !== "" ? (
              <>
                <p style={{ textAlign: "center" }}>
                  Decryption of messages failed.
                </p>
              </>
            ) : (
              <></>
            )}
          </>
        )}
      </>
    );
  }
}

export default Pay2PartyReqsComp;
