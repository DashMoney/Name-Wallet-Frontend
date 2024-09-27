import React from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

class SimplifiedTXs extends React.Component {
  handleSatsToDash = (sats) => {
    let dashAmt = sats / 100000000;
    let dashAmt2Display = dashAmt.toFixed(3);
    return dashAmt2Display;
  };

  handleTimeToDate = (timeObject, timeNow) => {
    //TEST Far Future Bug-> Sat.
    let date = new Date(timeObject);

    //let longFormDate= setTime(date);
    if (timeObject > timeNow) {
      return "Sending..";
    }

    return date.toLocaleDateString();
  };

  handleTxOrderName = (tx) => {
    //SO THIS NEEDS TO BE MODIFIED TO HANDLE THE sortedTuples OF NAME THEN DOC INSTEAD OF 2 SEPARATE ARRAYS

    //Add the sortedTuples length and the orders and mystoreorders together

    if (
      tx.txId === undefined ||
      //this.props.DGPOrders === "No Orders"

      this.props.sortedTuples.length === 0

      //SO THIS ^^ SECTION IS JUST TO HANDLE SIDE CASE AND NO MSGS.

      //AND WITH HANDLE NO ORDERS IN FUTURE ->
    ) {
      return "";
    } else {
      //ELSE 1

      let pmtTuple = this.props.sortedTuples.find((msg) => {
        return msg[1].txId === tx.txId;
      });

      // PUT THE MY STORE ORDERS HERE

      //ADD TO THE pmtTuple array with the this.props.sortedMyStoreTuples -> right ? -> Yes because this is using the TXs BELOW IS USING THE ADDRESS -> !!!!
      if (pmtTuple === undefined) {
        pmtTuple = this.props.myStoreTuples.find((order) => {
          return order[1].txId === tx.txId;
        });
      }

      // PUT THE SHOPPING ORDERS HERE
      // if (pmtTuple === undefined) {
      //   pmtTuple = this.props.shoppingTuples.find((order) => {
      //     return order[1].txId === tx.txId;
      //   });
      // }

      //Put the address Names here?
      if (pmtTuple === undefined) {
        let pmtAddress = "";
        if (tx.type === "sent") {
          //get the address from the TX ->

          for (const addr of tx.to) {
            //ALSO USE const, must define as a variable !!!
            //NOT in
            //change this to find because i am only sending to one address =>DONE is it?? ->
            if (addr.addressType === "unknown") {
              // NOT "otherAccount"
              pmtAddress = addr.address;
              break;
            }
          }
        }

        pmtTuple = this.props.addressTuples.find((addrTuple) => {
          return addrTuple[1].address === pmtAddress;
        });
      }

      if (pmtTuple === undefined) {
        return "";
      } else {
        //ELSE 2

        // let orderName = this.props.sortedTuples.find(doc => {
        //   return doc.$ownerId === pmtMsgTuple.$ownerId;
        // })
        //I DON'T NEED BC I ALREADY HAVE THE TUPLE WHICH HAS THE NAME FOR THE MSG DOCUMENT

        return pmtTuple[0].label; //<- give the name but I want to give name and purpose if i have it.
      } // CLOSE ELSE 2
    } // CLOSE ELSE 1
  };

  render() {
    //Name amt balance date

    //detailed -> Name  amt  date
    //    -> msg or order (display??) or button to
    //
    // let balance = this.props.accountBalance;
    // let balanceArr = [balance];

    // for (let tx of this.props.accountHistory) {
    //   // if(tx.type === "received"){
    //   balance -= tx.satoshisBalanceImpact;
    //   balanceArr.push(balance);
    //   // } else{
    //   //   balance += tx.satoshisBalanceImpact;
    //   //   balanceArr.push(balance);
    //   // }
    // }
    // balanceArr.pop();

    //  ^^^^ THIS WOULD HAVE TO CALCULATE FOR EVERY TX... WHICH IS SLOW JUST NEED TO PASS IN THE SPECIFIC.
    return (
      <>
        <Row
          key={this.props.index} //className="justify-content-md-center"
        >
          <Col xs={4} style={{ textAlign: "center" }}>
            <b>{this.handleTxOrderName(this.props.tx)}</b>
          </Col>
          <Col>
            {this.props.tx.type === "received" ? (
              <b
                className="satBalImpactreceived"
                //style={{ textAlign: "center" }}
              >
                {" "}
                {this.handleSatsToDash(this.props.tx.satoshisBalanceImpact)}
              </b>
            ) : (
              <span
                className="satBalImpactsent"
                //style={{ textAlign: "center" }}
              >
                {this.handleSatsToDash(this.props.tx.satoshisBalanceImpact)}
              </span>
            )}
          </Col>
          <Col>
            {this.props.tx.type === "received" ? (
              //<b>{this.handleSatsToDash(balanceArr[this.props.index])}</b>
              <b //style={{ textAlign: "end" }}
              >
                {this.handleSatsToDash(this.props.balance)}
              </b>
            ) : (
              <span //style={{ textAlign: "end" }}
              >
                {this.handleSatsToDash(this.props.balance)}
              </span>
            )}
          </Col>
          <Col>
            <span style={{ margin: "0rem", padding: "0rem" }}>
              {this.handleTimeToDate(this.props.tx.time, this.props.d)}
            </span>
          </Col>
        </Row>
        {/* <tr key={index}>
          <td>
            <b>{this.handleTxOrderName(tx)}</b>
          </td>

          {tx.type === "received" ? (
            <td className="satBalImpactreceived">
              <b> {this.handleSatsToDash(tx.satoshisBalanceImpact)}</b>
            </td>
          ) : (
            <td className="satBalImpactsent">
              {this.handleSatsToDash(tx.satoshisBalanceImpact)}
            </td>
          )}
          {tx.type === "received" ? (
            <td>
              <b>{this.handleSatsToDash(balanceArr[index])}</b>
            </td>
          ) : (
            <td>{this.handleSatsToDash(balanceArr[index])}</td>
          )}

          <td>{this.handleTimeToDate(tx.time, d)}</td>
        </tr> */}
      </>
    );
  }
}

export default SimplifiedTXs;
