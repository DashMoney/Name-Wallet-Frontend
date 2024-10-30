import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import Badge from "react-bootstrap/Badge";
import handleDenomDisplay from "../UnitDisplay";

import formatDate from "../TimeDisplayLong";

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

class SentRequestsComponent extends React.Component {
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

    if (
      theResponse.sigObject !== "" &&
      theResponse.txId !== "" &&
      this.props.req.txId === ""
    ) {
      return <Badge bg="success">In 2-Party</Badge>;
    }

    if (theResponse.sigObject !== "" && this.props.req.txId !== "") {
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

    if (response !== undefined) {
      responsePubKey = this.props.ReqsFromYouPubKeys.find((pubKey) => {
        return pubKey.$ownerId === response.$ownerId;
      });
    }

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

    //Loading2PartyAddress: true,
    //Display2Party: 'Loading..',

    if (
      this.state.Loading2PartyAddress &&
      response !== undefined &&
      this.props.req.txId === ""
    ) {
      this.callDAPIfor2Party(response.txId, responsePubKey);
    }

    return (
      <Card id="card" key={this.props.index} bg={cardBkg} text={cardText}>
        <Card.Body>
          <Card.Title className="cardTitle">
            <div>
              <b //style={{ color: "green" }}
              >
                To:{" "}
              </b>{" "}
              {/* <span style={{ color: "#008de4" }}>{this.props.tuple[0]}</span> */}
              <b
                //style={{ color: "red" }}
                style={{ color: "#008de4" }}
                onClick={() => this.handleNameClick(responseName.label)}
              >
                {responseName.label}
              </b>
            </div>
            <span>{this.state.copiedName ? <span>✅</span> : <></>}</span>

            {this.verifyRequestStatus(response, responsePubKey)}

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
              {response.sigObject !== "" && this.props.req.txId !== "" ? (
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
                    //onClick={() => this.handleNameClick(responseName.label)}
                    >
                      Completed request from{" "}
                      <b style={{ color: "#008de4" }}>{responseName.label}</b>{" "}
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
            <div
              style={{
                textAlign: "center",
                marginTop: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              <h5
              //style={{ color: "green" }}
              //onClick={() => this.handleNameClick(responseName.label)}
              >
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
            <></>
          )}

          {response !== undefined &&
          (response.sigObject === "" || this.props.req.txId === "") ? (
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

          {response !== undefined &&
          response.sigObject !== "" &&
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
                          this.props.index,
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
                    this.props.index,
                    responseName
                  )
                }
              >
                <b>Add Message</b>
              </Button>
            </div>
          </>

          <Card.Text></Card.Text>
        </Card.Body>
      </Card>
    );
  }
}

export default SentRequestsComponent;
