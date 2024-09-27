import React from "react";
//import Badge from "react-bootstrap/Badge";
//import Button from "react-bootstrap/Button";

import PaymentsMsgs from "./PaymentsMsgs";

class PaymentsTab extends React.Component {
  render() {
    // *** *** *** *** *** ***

    //  console.log('This is the TOYOU', this.props.ToYouMsgs);

    let tupleByYouArray = [];

    tupleByYouArray = this.props.ByYouMsgs.map((msg) => {
      let tuple = "";

      for (let nameDoc of this.props.ByYouNames) {
        if (nameDoc.$ownerId === msg.toId) {
          tuple = [nameDoc.label, msg];
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
          tuple = [nameDoc.label, msg];
          break;
        }
      }
      if (tuple !== "") {
        return tuple;
      }

      return ["No Name Avail..", msg];
    });
    // *** *** *** *** *** ***

    // ### ### ### ### ### ###

    let tupleThreads = [...this.props.ByYouThreads, ...this.props.ToYouThreads];

    //let ForYouThreadsNames = [...this.props.ByYouThreadsNames, ...this.props.FromTagsThreadsNames];

    // ### ### ### ### ### ###

    let tupleArray = [...tupleByYouArray, ...tupleToYouArray];

    // Ensure Unique msgs*** START
    let arrayOfMsgIds = tupleArray.map((tuple) => {
      return tuple[1].$id;
    });

    // console.log('Combine arrayMsgId!!', arrayOfMsgIds);

    let setOfMsgIds = [...new Set(arrayOfMsgIds)];

    arrayOfMsgIds = [...setOfMsgIds];

    //       ***

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

    let sortedTuples = tupleArray.sort(function (a, b) {
      return b[1].$createdAt - a[1].$createdAt;
    });

    // console.log('Final Tuples!!', sortedTuples);

    let today = new Date();
    let yesterday = new Date(today);

    yesterday.setDate(yesterday.getDate() - 1);

    let tuples = sortedTuples.map((tuple, index) => {
      return (
        <PaymentsMsgs
          key={index}
          mode={this.props.mode}
          index={index}
          tuple={tuple}
          today={today}
          yesterday={yesterday}
          identity={this.props.identity}
          uniqueName={this.props.uniqueName}
          showModal={this.props.showModal}
          handleThread={this.props.handleThread}
          // ForYouThreads={ForYouThreads}
          // ForYouThreadsNames={ForYouThreadsNames}
          tupleThreads={tupleThreads}
        />
      );
    });

    return (
      <>
        {sortedTuples.length < 1 ? (
          <p className="paddingBadge">
            Payment messages, you send or ones sent to you, will appear here.
          </p>
        ) : (
          <></>
        )}

        <div className="footer">{tuples}</div>
      </>
    );
  }
}

export default PaymentsTab;
