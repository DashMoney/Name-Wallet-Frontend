// To: Chronic <badge green>Requested<badge> Amt Date
//This is the By you sentRequest so in Messages tab

// this need to handle reqs you sent -> unpaid, paid, and rejected.
//This is a lot like the My Store Orders! Will use tags!! ->

//OKAY I think SentRequestMsgs and PaymentMsgs will be separate lists called by the PaymentsTabNew ->
//SentRequestMsgs -> NEED SEPARATE -> BYYOU AND TOYOU
//Then they will be combined and ordered together.

import React from "react";
//import Button from 'react-bootstrap/Button';
import Card from "react-bootstrap/Card";

import Badge from "react-bootstrap/Badge";
import handleDenomDisplay from "../UnitDisplay";

import Threads from "./Threads";

class SentRequestMsgs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copiedName: false,
    };
  }

  handleNameClick = () => {
    navigator.clipboard.writeText(this.props.tuple[0]);
    this.setState({
      copiedName: true,
    });
  };

  formatDate(theCreatedAt, today, yesterday) {
    let CreatedAt = new Date(theCreatedAt);

    const timeOptions = {
      hour: "numeric",
      minute: "2-digit", //numeric?
    };

    function isSameDay(date1, date2) {
      return (
        date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
      );
    }

    if (isSameDay(CreatedAt, today)) {
      // it's today
      return `Today at ${CreatedAt.toLocaleTimeString(undefined, timeOptions)}`;
    }

    if (isSameDay(CreatedAt, yesterday)) {
      // it was yesterday
      return `Yesterday at ${CreatedAt.toLocaleTimeString(
        undefined,
        timeOptions
      )}`;
    }
    let dateReturn = CreatedAt.toLocaleDateString().concat(
      "  ",
      CreatedAt.toLocaleTimeString(undefined, timeOptions)
    );
    return dateReturn;
  }

  verifyRequestStatus = (paidThrs) => {
    // if (theOrder.txId === "payLater") {
    //   //console.log("PayLater");
    //   return <Badge bg="warning">Pay Later</Badge>;
    // }

    if (paidThrs.length === 0) {
      //console.log("PayLater");
      return <Badge bg="success">Requested</Badge>;
    }

    //This can be 'Requested'(unpaid), 'Rejected', 'Paid' , 'Error'

    if (paidThrs > 1) {
      return <Badge bg="warning">Error</Badge>;
    }

    if (paidThrs[0].txId === "rej") {
      return <Badge bg="secondary">Rejected</Badge>;
    }

    // if (paidThrs[0].txId !== "") {
    //   //CALL Verify Function -> if fails return Fail, or Paid if paid ->
    // }
    //
    //8) DID i handle the Self Pay or Self Order?? -> if toId and OwnerId of order match
    // if (theOrder.toId === theOrder.$ownerId) {
    //   return <Badge bg="warning">Self Order</Badge>;
    // }

    // 2)Check for duplicated do a count on the order.txIds for all the orders

    // paidThrs ={paidThrs_BYYOU}
    // replyThrs ={replyThrs_BYYOU}

    let numOfPaidThrWithTxId = this.props.paidThrs.filter((thr) => {
      return thr.txId === paidThrs[0].txId; //because only paidThrs of length 1 should reach this point
    });

    if (numOfPaidThrWithTxId.length !== 1) {
      console.log("Failed on Error 1");
      return <Badge bg="danger">Fail</Badge>;
    }

    //3) Make sure there is a wallet TX that matches  txId

    //accountHistory={this.props.accountHistory}

    let walletTx = this.props.accountHistory.find((tx) => {
      // console.log("Wallet TX: ", tx);
      return tx.txId === paidThrs[0].txId;
    });
    if (walletTx === undefined) {
      //This may be the issue that cause early fail ->
      // Can I check instasend?
      console.log("Failed on Error 2");
      return <Badge bg="danger">Fail</Badge>;
    }
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

    if (this.props.tuple[1].$ownerId === this.props.identity) {
      if (this.props.tuple[1].amt === walletTx.satoshisBalanceImpact) {
        return <Badge bg="primary">Paid</Badge>;
      }
    }
    if (this.props.tuple[1].$ownerId !== this.props.identity) {
      if (this.props.tuple[1].amt === -walletTx.satoshisBalanceImpact) {
        return <Badge bg="primary">Paid</Badge>;
      }
    }

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

    //NEW THING BELOW -> Adding replyThrs and paidThrs but separately because logic stuff and then combine
    //So pass the threads here separately

    // paidThrs ={paidThrs_BYYOU}
    // replyThrs ={replyThrs_BYYOU}

    let paidThrDocs = this.props.paidThrs.filter((doc) => {
      return doc.msgId === this.props.tuple[1].$id;
    }); //This ^^^ makes sure threads are for the intended msg

    //let verifiedRequestStatus = this.verifyRequestStatus(paidThrDocs);
    //OKAY AFTER MORE THINKING -> ABOVE HANDLE STATUS/TAG BASED ON PAID THREADS
    //**** */
    //THEN BELOW JUST HANDLES ALL THE THREADS TOGETHER JUST AS REPLIES.
    //BUT FIRST NEED TO MAKE SURE THE THREADS ARE RELATED TO THIS MSG. -> TODO ->

    //so get the replyDocs THEN COMBINE WITH THE paidThr. ->

    let replyThrDocs = this.props.replyThrs.filter((doc) => {
      return doc.msgId === this.props.tuple[1].$id;
    }); //This ^^^ makes sure threads are for the intended msg

    let combinedThrs = [...paidThrDocs, ...replyThrDocs];

    let threadDocs = combinedThrs.filter((doc) => {
      return (
        doc.$ownerId === this.props.tuple[1].$ownerId ||
        doc.$ownerId === this.props.tuple[1].toId
      );
    }); //This ^^^ makes sure threads are from the sender or recipient

    // //need to order the docs ->
    threadDocs = threadDocs.sort(function (a, b) {
      return a.$createdAt - b.$createdAt;
    });

    let threadsToDisplay = [];

    if (threadDocs.length > 0) {
      threadsToDisplay = threadDocs.map((thr, index) => {
        return (
          <Threads
            key={index}
            mode={this.props.mode}
            index={index}
            thr={thr}
            //msg = {this.props.tuple[1]}//need the tuple bc has the name
            tuple={this.props.tuple}
            today={this.props.today}
            yesterday={this.props.yesterday}
            identity={this.props.identity}
            uniqueName={this.props.uniqueName}
            // showModal={this.props.showModal}
            handleThread={this.props.handleThread}

            //ThreadsNames={this.props.ForYouThreadsNames}
            //Change ^^ to
          />
        );
      });
    }

    //

    //BELOW -> ADDING THREADS TO MSGS

    // let threadDocs = this.props.tupleThreads.filter((doc) => {
    //   return doc.msgId === this.props.tuple[1].$id;
    // }); //This ^^^ makes sure threads are for the intended msg

    // threadDocs = threadDocs.filter((doc) => {
    //   return (
    //     doc.$ownerId === this.props.tuple[1].$ownerId ||
    //     doc.$ownerId === this.props.tuple[1].toId
    //   );
    // }); //This ^^^ makes sure threads are from the sender or recipient

    // //need to order the docs ->
    // threadDocs = threadDocs.sort(function (a, b) {
    //   return a.$createdAt - b.$createdAt;
    // });

    // let threadsToDisplay = [];

    // if (threadDocs.length > 0) {
    //   threadsToDisplay = threadDocs.map((thr, index) => {
    //     return (
    //       <Threads
    //         key={index}
    //         mode={this.props.mode}
    //         index={index}
    //         thr={thr}
    //         //msg = {this.props.tuple[1]}//need the tuple bc has the name
    //         tuple={this.props.tuple}
    //         today={this.props.today}
    //         yesterday={this.props.yesterday}
    //         identity={this.props.identity}
    //         uniqueName={this.props.uniqueName}
    //         // showModal={this.props.showModal}
    //         handleThread={this.props.handleThread}

    //         //ThreadsNames={this.props.ForYouThreadsNames}
    //         //Change ^^ to
    //       />
    //     );
    //   });
    // }

    //END OF NEW THING

    return (
      <Card id="card" key={this.props.index} bg={cardBkg} text={cardText}>
        <Card.Body>
          <Card.Title className="cardTitle">
            {this.props.identity === this.props.tuple[1].$ownerId ? (
              <>
                <div>
                  <b style={{ color: "green" }}>To: </b>{" "}
                  {/* <span style={{ color: "#008de4" }}>{this.props.tuple[0]}</span> */}
                  <b
                    //style={{ color: "red" }}
                    style={{ color: "#008de4" }}
                    onClick={() => this.handleNameClick()}
                  >
                    {this.props.tuple[0]}
                  </b>
                </div>
                <span>{this.state.copiedName ? <span>✅</span> : <></>}</span>
              </>
            ) : (
              <>
                <div>
                  <b style={{ color: "red" }}>From: </b>{" "}
                  <b
                    style={{ color: "#008de4" }}
                    //style={{ color: "green" }}
                    onClick={() => this.handleNameClick()}
                  >
                    {this.props.tuple[0]}
                  </b>
                  {/* {" "} */}
                  {/* <span> Paid You</span> */}
                </div>
                <span>{this.state.copiedName ? <span>✅</span> : <></>}</span>
              </>
            )}

            {this.verifyRequestStatus(paidThrDocs)}

            {/* 
          
          <Button variant="outline-primary" 
          onClick={()=> this.handleNameClick()          
          }
          >Copy</Button>
          {this.state.copiedName?<span>✅</span>:<></>} */}

            <span className="textsmaller">
              {this.formatDate(
                this.props.tuple[1].$createdAt,
                this.props.today,
                this.props.yesterday
              )}
            </span>
          </Card.Title>
          <div
            style={{
              textAlign: "center",
              marginTop: "1.5rem",
              marginBottom: "1.5rem",
            }}
            onClick={() =>
              this.props.handleThread(
                this.props.tuple[1].$id,
                this.props.tuple[0]
              )
            }
          >
            {/* THIS NEED TO SEPARATE BETWEEN REQUEST SENT TO YOU AND REQUESTS YOU SENT TO OTHER - JUST USE IF THE OWNERID OF THE TUPLE[1] IS === IDENTITY*/}
            {this.props.tuple[1].$ownerId === this.props.identity ? (
              <h5
              //style={{ color: "green" }}
              //onClick={() => this.handleNameClick()}
              >
                You requested{" "}
                <b style={{ color: "#008de4" }}>
                  {handleDenomDisplay(
                    this.props.whichNetwork,
                    this.props.tuple[1].amt
                  )}
                </b>{" "}
                from <b style={{ color: "#008de4" }}>{this.props.tuple[0]}</b>
              </h5>
            ) : (
              <h5
              //style={{ color: "green" }}
              //onClick={() => this.handleNameClick()}
              >
                <b style={{ color: "#008de4" }}>{this.props.tuple[0]}</b>{" "}
                requests{" "}
                <b style={{ color: "#008de4" }}>
                  {handleDenomDisplay(
                    this.props.whichNetwork,
                    this.props.tuple[1].amt
                  )}
                </b>
              </h5>
            )}
          </div>

          <Card.Text
            onClick={() =>
              this.props.handleThread(
                this.props.tuple[1].$id,
                this.props.tuple[0]
              )
            }
          >
            {this.props.tuple[1].msg}
          </Card.Text>
          {threadsToDisplay}
        </Card.Body>
      </Card>
    );
  }
}

export default SentRequestMsgs;
