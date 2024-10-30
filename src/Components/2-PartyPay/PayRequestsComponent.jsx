import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import Badge from "react-bootstrap/Badge";
import handleDenomDisplay from "../UnitDisplay";

import formatDate from "../TimeDisplayLong";

import getSignature from "./getSignature";

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

class PayRequestsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copiedName: false,
      Loading2PartyAddress: true,
      Display2Party: "Loading..",
      TXfromDAPI: "",
    };
  }

  handleNameClick = (theName) => {
    navigator.clipboard.writeText(theName);
    this.setState({
      copiedName: true,
    });
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
        this.props.index,
        theRequestNameDoc
      );
      //signatureToAdd,
      //theResponse,
      // index,
      // toWhomNameDoc
    }
  };

  callDAPIfor2Party = (theTxId, requestPubKey) => {
    const client = new Dash.Client({ network: this.props.whichNetwork });
    async function dapiClientMethods() {
      console.log("theTxId:", theTxId);
      let result = await client.getDAPIClient().core.getTransaction(theTxId);

      return result;
    }

    dapiClientMethods()
      .then((d) => {
        // console.log('MultiSig Tx:\n', d.transaction.toJSON());
        let txOutput = new Transaction(d.transaction).toJSON();
        console.log("Tx:\n", txOutput);

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

        let TheirPublicKey = new HDPublicKey(requestPubKey.xpubkey)
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
    // if (theOrder.txId === "payLater") {
    //   //console.log("PayLater");
    //   return <Badge bg="warning">Pay Later</Badge>;
    // }

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

    if (theResponse.sigObject === "" && theResponse.txId !== "") {
      return <Badge bg="success">In 2-Party</Badge>;
    }

    if (theResponse.sigObject !== "" && theResponse.txId !== "") {
      return <Badge bg="primary">Completed</Badge>;
    }

    // if (paidThrs[0].txId !== "") {
    //   //CALL Verify Function -> if fails return Fail, or Paid if paid ->
    // }
    //
    //8) DID i handle the Self Pay or Self Order?? -> if toId and OwnerId of order match
    // if (theOrder.toId === theOrder.$ownerId) {
    //   return <Badge bg="warning">Self Order</Badge>;
    // }

    // 2)Check for duplicated do a count on the order.txIds for all the orders -> NOT NEEDED FOR 2 PARTY

    //3) Make sure there is a wallet TX that matches  txId

    //IS THIS WHERE I CALL DAPI TO CHECK THE TX IF THE RESPONSE HAS A TX ID BUT NOT A RELEASE OBJECT?

    //accountHistory={this.props.accountHistory}

    // let walletTx = this.props.accountHistory.find((tx) => {
    //   // console.log("Wallet TX: ", tx);
    //   return tx.txId === paidThrs[0].txId;
    // });
    // if (walletTx === undefined) {
    //   //This may be the issue that cause early fail ->
    //   // Can I check instasend?
    //   console.log("Failed on Error 2");
    //   return <Badge bg="danger">Fail</Badge>;
    // }

    //ADDED TO CHECK BC TIME DEFAULTS TO FUTURE IF NO INSTALOCK 9999999999000
    //CURRENTLY THE INSTASEND LOCK IS NOT WORKING ON TESTNET
    // if(!walletTx.isInstantLocked  ){
    //   return <Badge bg="warning">Verifying..</Badge>;
    // }
    //

    // 4) check that the order createAT and tx time are within a few minutes

    // let walletTxTime = new Date(walletTx.time);
    // //console.log('Wallet TX Time valueOf: ', walletTxTime.valueOf());

    // if (walletTxTime.valueOf() - theOrder.$updatedAt > 350000) {
    //   //***This is added due to testnet lack of instasend lock */
    //   if (walletTxTime.valueOf() > theOrder.$updatedAt) {
    //     return <Badge bg="primary">Paid</Badge>;
    //   }

    //   //console.log(walletTxTime.valueOf() - theOrder.$createdAt)
    //   console.log("Failed on Error 3"); //!!!!!!!!!!!!
    //   console.log(this.props.accountHistory);
    //   console.log(walletTxTime.valueOf());
    //   return <Badge bg="danger">Fail</Badge>;
    // }

    //5) make sure the tx amt === request amt

    // if (this.props.tuple[1].$ownerId === this.props.identity) {
    //   if (this.props.tuple[1].amt === walletTx.satoshisBalanceImpact) {
    //     return <Badge bg="primary">Paid</Badge>;
    //   }
    // }
    // if (this.props.tuple[1].$ownerId !== this.props.identity) {
    //   if (this.props.tuple[1].amt === -walletTx.satoshisBalanceImpact) {
    //     return <Badge bg="primary">Paid</Badge>;
    //   }
    // }

    //   ----   ----

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

    //if response then pull msg -> add

    // order them together and create below

    // if (
    //   //confirm !== undefined &&
    //   orderReplies.length !== 0
    // ) {
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
    if (response !== undefined && this.props.req.txId === "") {
      if (this.state.Loading2PartyAddress && response.sigObject === "") {
        this.callDAPIfor2Party(response.txId, requestPubKey);
      }
    }
    return (
      <Card id="card" key={this.props.index} bg={cardBkg} text={cardText}>
        <Card.Body>
          <Card.Title className="cardTitle">
            <div>
              <b //style={{ color: "red" }}
              >
                From:{" "}
              </b>{" "}
              <b
                style={{ color: "#008de4" }}
                //style={{ color: "green" }}
                onClick={() => this.handleNameClick(requestName.label)}
              >
                {requestName.label}
              </b>
            </div>
            <span>{this.state.copiedName ? <span>✅</span> : <></>}</span>

            {this.verifyRequestStatus(response)}

            {/* 
          
          <Button variant="outline-primary" 
          onClick={()=> this.handleNameClick(requestName.label)          
          }
          >Copy</Button>
          {this.state.copiedName?<span>✅</span>:<></>} */}

            <span className="textsmaller">
              {formatDate(
                this.props.req.$createdAt,
                this.props.today,
                this.props.yesterday
              )}
            </span>
          </Card.Title>
          {response !== undefined ? (
            <>
              {response.sigObject !== "" && response.txId !== "" ? (
                <>
                  <div
                    style={{
                      textAlign: "center",
                      marginTop: "1.5rem",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <h5
                    //style={{ color: "green" }}
                    //onClick={() => this.handleNameClick(requestName.label)}
                    >
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
                <></>
              )}
            </>
          ) : (
            <></>
          )}

          {response === undefined || response.txId === "" ? (
            <>
              <div
                style={{
                  textAlign: "center",
                  marginTop: "1.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <h5
                //style={{ color: "green" }}
                //onClick={() => this.handleNameClick(requestName.label)}
                >
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
            </>
          ) : (
            <></>
          )}

          {response !== undefined && response.sigObject === "" ? (
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

          {response === undefined &&
          this.props.accountBalance <= this.props.req.amt ? (
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

          {response === undefined &&
          this.props.accountBalance > this.props.req.amt ? (
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

          {response !== undefined && response.sigObject === "" ? (
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
                      this.props.index,
                      requestName
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

          <Card.Text></Card.Text>
          {/*  {threadsToDisplay} */}
        </Card.Body>
      </Card>
    );
  }
}

export default PayRequestsComponent;
