import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import CloseButton from "react-bootstrap/CloseButton";
import Nav from "react-bootstrap/Nav";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import SimplifiedTXs from "./WalletTXComponents/SimplifiedTXs";
import DetailedTXs from "./WalletTXComponents/DetailedTXs";

import "./WalletTXModal.css";

class WalletTXModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      whichTab: "Activity", //"Detailed"
    };
  }

  handleCloseClick = () => {
    this.props.hideModal();
  };

  handleTab = (eventKey) => {
    if (eventKey === "Detailed")
      this.setState({
        whichTab: "Detailed",
      });
    else {
      this.setState({
        whichTab: "Activity",
      });
    }
  };

  //HAVE TO CHANGE FUNCTIONALITY TO SORT THE NAMES BY THE ADDRESS AND NOT THE PLATFORM TXID DATA => NO, its just a caught and add on!

  //this.props.WALLET_addresses <= this is just for Send-To

  //this.props.WALLET_addresses
  //this.props.WALLET_addressesNames
  //this.props.isLoadingAddresses_WALLET

  // handleTxOrderName = (tx) => { //Moved further down the line
  //   //SO THIS NEEDS TO BE MODIFIED TO HANDLE THE sortedTuples OF NAME THEN DOC INSTEAD OF 2 SEPARATE ARRAYS

  //   if (
  //     tx.txId === undefined ||
  //     //this.props.DGPOrders === "No Orders"
  //     //THIS WILL CALL THE FUNCTION EVERYTIME
  //     (this.props.ByYouMsgs.length === 0 && this.props.ToYouMsgs.length === 0)
  //     //New Way -> Test ->

  //     //THIS IS WHAT WAS REPLACED => this.props.sortedTuples.length === 0

  //     //sortedTuples has to be recreated above and not pulled from props.<=***

  //     //SO THIS ^^ SECTION IS JUST TO HANDLE SIDE CASE AND NO MSGS.

  //     //AND WITH HANDLE NO ORDERS IN FUTURE
  //   ) {
  //     return "";
  //   } else {
  //     //ELSE 1

  //     let pmtMsgTuple = this.handleSortedTuplesFromPlatformMsgs().find(
  //       (msg) => {
  //         return msg[1].txId === tx.txId;
  //       }
  //     );

  //     // PUT THE SHOPPING ORDERS HERE

  //     // PUT THE YOUR STORE ORDERS HERE

  //     // ACTUALLY COMPARE HOW DGM VS DGP AND HOW THEY DO THIS. <=

  //     //Put the address Names here?

  //     if (pmtMsgTuple === undefined) {
  //       return "";
  //     } else {
  //       //ELSE 2

  //       // let orderName = this.props.sortedTuples.find(doc => {
  //       //   return doc.$ownerId === pmtMsgTuple.$ownerId;
  //       // })
  //       //I DON'T NEED BC I ALREADY HAVE THE TUPLE WHICH HAS THE NAME FOR THE MSG DOCUMENT

  //       return pmtMsgTuple[0]; //<- give the name but I want to give name and purpose if i have it.
  //     } // CLOSE ELSE 2
  //   } // CLOSE ELSE 1
  // };

  render() {
    let date = Date.now(); //Using this sorting out tx time issue

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

    /* 
      array of objects
      type: 'received' or 'sent'
      time: Sun Jun 04 2023 03:25:46 GMT-0500 (Central Daylight Time) - JS?
      satoshisBalanceImpact <- that is my solution
      
      USE from (to get the address) 
      from

      DONT USE to
      to: (ARRAY)
        to[0] amount recieved in Sats

      */

    // @@@@@   @@@@@   @@@@@   @@@@@   @@@@@   @@@@@   @@@@@

    let balance = this.props.accountBalance;
    let balanceArr = [balance];

    for (let tx of this.props.accountHistory) {
      // if(tx.type === "received"){
      balance -= tx.satoshisBalanceImpact;
      balanceArr.push(balance);
      // } else{
      //   balance += tx.satoshisBalanceImpact;
      //   balanceArr.push(balance);
      // }
    }
    balanceArr.pop();

    // @@@@@   @@@@@   @@@@@   @@@@@   @@@@@   @@@@@   @@@@@

    let theSortedTuples;

    if (!this.props.isLoadingMsgs_WALLET) {
      //console.log(this.props.accountHistory);
      //THIS MAY NOT BE THE BEST WAY TO ACHIEVE THIS.. <= ***
      let tupleByYouArray = [];

      tupleByYouArray = this.props.ByYouMsgs.map((msg) => {
        let tuple = "";

        for (let nameDoc of this.props.ByYouNames) {
          if (nameDoc.$ownerId === msg.toId) {
            tuple = [nameDoc, msg]; //THIS IS WHAT EACH TUPLE IS.
            break;
          }
        }
        if (tuple !== "") {
          return tuple;
        }
        //add a

        return ["No Name Avail..", msg];
      });
      // *** *** *** *** *** ***

      let tupleToYouArray = [];

      tupleToYouArray = this.props.ToYouMsgs.map((msg) => {
        let tuple = "";

        for (let nameDoc of this.props.ToYouNames) {
          if (nameDoc.$ownerId === msg.$ownerId) {
            tuple = [nameDoc, msg];
            break;
          }
        }
        if (tuple !== "") {
          return tuple;
        }

        return ["No Name Avail..", msg];
      });
      // *** *** *** *** *** ***

      let tupleArray = [...tupleByYouArray, ...tupleToYouArray];

      //ALL BELOW IS FOR BELOW I THINK

      //WHY AN I GETTING RID OF MSGS => wHY IS THIS DOING THIS? ****
      // -> ENSUREING UNIQUE

      //COULD YOU HAVE THE SAME MSG FROM BYYOU AND TOYOU?? HOW?
      //IS THIS TO HANDLE THE SHORT TERM STAGING VS REFRESH ?

      //ENSURE UNIQUE
      // Ensure Unique msgs*** START   ->WHY??!!!

      let arrayOfMsgIds = tupleArray.map((tuple) => {
        return tuple[1].$id;
      });

      // console.log('Combine arrayMsgId!!', arrayOfMsgIds);

      let setOfMsgIds = [...new Set(arrayOfMsgIds)];

      arrayOfMsgIds = [...setOfMsgIds];

      //  ***

      tupleArray = arrayOfMsgIds.map((msgId) => {
        let tuple = [];

        for (let tupleDoc of tupleArray) {
          if (tupleDoc[1].$id === msgId) {
            tuple = tupleDoc;
            break;
          }
        }
        return tuple;
      });
      // Ensure Unique msgs*** END

      // console.log('CombineandUnique Tuples!!', tupleArray);

      theSortedTuples = tupleArray.sort(function (a, b) {
        return b[1].$createdAt - a[1].$createdAt;
      });
    } // ISSUE IS THAT THIS VARIABLE IS LOCKED IN HERE..!!!!!!!1

    // @@@@@   @@@@@   @@@@@   @@@@@   @@@@@   @@@@@   @@@@@

    //handleTxsendbyMeBut without documents..

    //Make Tuples ????? use full doc and not nameDoc.label!!

    //LoadingOrders={this.state.isLoadingOrdersYOURSTORE}
    //DGPOrders={this.state.DGPOrders}
    // DGPOrdersNames={this.state.DGPOrdersNames}

    let myStoreTuples = [];

    if (!this.props.LoadingOrders && this.props.DGPOrders !== "No Orders") {
      //MYSTORETUPLES MUST BE PROTECTED WITH THE LOADING BECUASE IT IS POSSIBLE FOR 'No Orders to be set and that would mess it up.

      myStoreTuples = this.props.DGPOrders.map((orderDoc) => {
        let tuple = "";

        for (let nameDoc of this.props.DGPOrdersNames) {
          if (nameDoc.$ownerId === orderDoc.$ownerId) {
            tuple = [nameDoc, orderDoc]; //THIS IS WHAT EACH TUPLE IS.
            break; //Does with break out of the loop OR should I switch to find?
            // CAREFUL ^^ THIS WORKS LIKE A FIND BUT ONLY IF INSIDE A MAP!
          }
        }
        if (tuple !== "") {
          return tuple;
        }

        return [{ label: "No Name Avail..", $ownerId: msg.$ownerId }, orderDoc];
      });
    }
    //this.props.WALLET_addresses
    //this.props.WALLET_addressesNames
    //this.props.isLoadingAddresses_WALLET

    if (!this.props.isLoadingAddresses_WALLET) {
    } //THIS IS NOT BEING USED -> DELETE ?

    let addressTuples = [];

    addressTuples = this.props.WALLET_addresses.map((addrDoc) => {
      let tuple = "";

      for (let nameDoc of this.props.WALLET_addressesNames) {
        if (nameDoc.$ownerId === addrDoc.$ownerId) {
          tuple = [nameDoc, addrDoc]; //THIS IS WHAT EACH TUPLE IS.
          break; //Does with break out of the loop OR should I switch to find?
          // CAREFUL ^^ THIS WORKS LIKE A FIND BUT ONLY IF INSIDE A MAP!
        }
      }
      if (tuple !== "") {
        return tuple;
      }

      return [{ label: "No Name Avail..", $ownerId: msg.$ownerId }, addrDoc];
    });

    let SimplifiedTransactions = this.props.accountHistory.map((tx, index) => {
      return (
        <SimplifiedTXs
          tx={tx}
          index={index}
          key={index}
          d={date}
          sortedTuples={theSortedTuples}
          addressTuples={addressTuples}
          myStoreTuples={myStoreTuples}
          //shoppingTuples={shoppingTuples}
          balance={balanceArr[index]}
        />
      );
    });

    // let DetailedTransactions = this.props.accountHistory.map((tx, index) => {
    //   return (
    //     <DetailedTXs
    //       tx={tx}
    //       index={index}
    //       d={date}
    //       sortedTuples={sortedTuples}
    //       addressTuples={addressTuples}
    //       //Function to push to sending msg ->
    //     />
    //   );
    // });

    return (
      <>
        <Modal
          show={this.props.isModalShowing}
          backdropClassName={modalBackdrop}
          contentClassName={modalBkg}
        >
          <Modal.Header>
            <Modal.Title>
              <b>Wallet Transactions</b>
            </Modal.Title>
            {closeButtonColor}
          </Modal.Header>
          <Modal.Body style={{ margin: "0rem", padding: "0rem" }}>
            <Nav
              fill
              variant="pills"
              defaultActiveKey={this.state.whichTab}
              onSelect={(eventKey) => this.handleTab(eventKey)}
            >
              <Nav.Item>
                <Nav.Link eventKey="Activity">
                  <b>Activity</b>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="Detailed">
                  <b>Detailed</b>
                </Nav.Link>
              </Nav.Item>
            </Nav>

            {this.state.whichTab === "Activity" ? (
              <>
                <Container className="g-2">
                  <Row
                    className="justify-content-md-center"
                    style={{
                      marginTop: ".5rem",
                      marginBottom: "1rem",
                      marginLeft: "0.2rem",
                      marginRight: "0.2rem",
                    }}
                  >
                    <Col xs={4} style={{ marginLeft: ".2rem" }}>
                      <b>From/To</b>
                    </Col>
                    <Col>
                      <b style={{ textAlign: "start" }}>Amount</b>
                    </Col>
                    <Col style={{ textAlign: "start" }}>
                      <b>Balance</b>
                    </Col>
                    <Col>
                      <b>Date</b>
                    </Col>
                  </Row>

                  {SimplifiedTransactions}
                </Container>
              </>
            ) : (
              <></>
            )}

            {this.state.whichTab === "Detailed" ? (
              <>
                <h4 style={{ marginLeft: "2rem", marginTop: "2rem" }}>
                  Under Construction
                </h4>
                {/* <Container className="g-0">
                  <Row className="justify-content-md-center">
                    <Col>
                      <b>From/To</b>
                    </Col>
                    <Col>
                      <b>Amount</b>
                    </Col>
                    <Col>
                      <b>Balance</b>
                    </Col>
                    <Col>
                      <b>Date</b>
                    </Col>
                  </Row>
                   {DetailedTransactions} 
                </Container> */}
              </>
            ) : (
              <></>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="primary" onClick={this.handleCloseClick}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default WalletTXModal;
