import React from "react";
//import Badge from "react-bootstrap/Badge";
//import Button from "react-bootstrap/Button";

import RequestMsgs from "./RequestMsgs";
import P2PSequencerDisplay from "../P2PSequencerDisplay";

class PaymentRequestsComp extends React.Component {
  render() {
    // NAMEDOC HAS BEEN CHANGED TO PASS THE WHOLE DOC INSTEAD OF THE JUST LABEL SO CAN USE TO GET THE DGMADDR
    // *** *** *** *** *** ***

    // let thrsAndMsgsArr_BYYOU = [];
    // let paidThrs_BYYOU = [];
    // let replyThrs_BYYOU = [];
    // let paymentMsgs_BYYOU = [];
    // let paidOrRejPmtReqs_BYYOU = [];
    // let notPaidPmtReqs_BYYOU = [];

    let thrsAndMsgsArr_TOYOU = [];
    let paidThrs_TOYOU = [];
    let replyThrs_TOYOU = [];
    let paymentMsgs_TOYOU = [];
    let paidOrRejPmtReqs_TOYOU = [];
    let notPaidPmtReqs_TOYOU = [];

    // thrsAndMsgsArr_BYYOU = P2PSequencerDisplay(
    //   this.props.ByYouMsgs,
    //   this.props.ByYouThreads
    // );
    // paidThrs_BYYOU = thrsAndMsgsArr_BYYOU[0];
    // replyThrs_BYYOU = thrsAndMsgsArr_BYYOU[1];
    // paymentMsgs_BYYOU = thrsAndMsgsArr_BYYOU[2];
    // paidOrRejPmtReqs_BYYOU = thrsAndMsgsArr_BYYOU[3];
    // notPaidPmtReqs_BYYOU = thrsAndMsgsArr_BYYOU[4];

    thrsAndMsgsArr_TOYOU = P2PSequencerDisplay(this.props.ToYouMsgs, [
      ...this.props.ToYouThreads,
      ...this.props.ByYouThreads,
    ]);
    paidThrs_TOYOU = thrsAndMsgsArr_TOYOU[0]; //DONT NEED HERE
    replyThrs_TOYOU = thrsAndMsgsArr_TOYOU[1];
    paymentMsgs_TOYOU = thrsAndMsgsArr_TOYOU[2]; //DONT NEED HERE
    paidOrRejPmtReqs_TOYOU = thrsAndMsgsArr_TOYOU[3]; //DONT NEED HERE
    notPaidPmtReqs_TOYOU = thrsAndMsgsArr_TOYOU[4];
    //
    //threads - [0] -> paid/rejected Thrs -> messages Tab
    //threads - [1] -> reply - for pmtMsgsReply AND reqReply ->Both
    //messages - [2] -> PmtMsgs -> this goes to messages Tab
    //messages - [3] -> PmtReqsPaidOrRej -> messages Tab
    //messages - [4] -> PmtReqsNeitherPaidOrRej ->  this goes to queue
    //
    //ONLY THE BELOW FOR PAYMENTS TAB:
    //paidThrs={paidThrs} //-> messages Tab
    //replyThrs={replyThrs}//-> msg Tab & queue
    //paymentMsgs={paymentMsgs} //-> this goes to messages Tab
    //paidOrRejPmtReqs={paidOrRejPmtReqs} //-> messages Tab

    // let tupleByYouArray = [];

    // let ByYouMsgsPostSeq = [...paidOrRejPmtReqs_BYYOU, ...paymentMsgs_BYYOU];

    // tupleByYouArray = ByYouMsgsPostSeq.map((msg) => {
    //   let tuple = "";

    //   for (let nameDoc of this.props.ByYouNames) {
    //     if (nameDoc.$ownerId === msg.toId) {
    //       tuple = [nameDoc.label, msg];
    //       break;
    //     }
    //   }
    //   if (tuple !== "") {
    //     return tuple;
    //   }

    //   return ["No Name Avail..", msg];
    // });
    // *** *** *** *** *** ***

    let tupleToYouArray = [];

    let ToYouMsgsPostSeq = [...notPaidPmtReqs_TOYOU];

    tupleToYouArray = ToYouMsgsPostSeq.map((msg) => {
      let tuple = "";

      for (let nameDoc of this.props.ToYouNames) {
        if (nameDoc.$ownerId === msg.$ownerId) {
          tuple = [nameDoc, msg]; //CHANGED nameDoc.label
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

    //let tupleThreads = [...this.props.replyThrs]; <-NO
    let tupleThreads = [...this.props.ByYouThreads, ...this.props.ToYouThreads];

    // ### ### ### ### ### ###

    let tupleArray = [...tupleToYouArray];

    // Ensure Unique msgs*** START
    let arrayOfMsgIds = tupleArray.map((tuple) => {
      return tuple[1].$id;
    });

    // console.log('Combine arrayMsgId!!', arrayOfMsgIds);

    let setOfMsgIds = [...new Set(arrayOfMsgIds)];

    arrayOfMsgIds = [...setOfMsgIds];

    // //       ***

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
        <RequestMsgs
          whichNetwork={this.props.whichNetwork}
          key={index}
          mode={this.props.mode}
          index={index}
          tuple={tuple} //[nameLabel, reqMsg] -> [NameDoc, reqMsg]
          today={today}
          yesterday={yesterday}
          identity={this.props.identity}
          uniqueName={this.props.uniqueName}
          //showModal={this.props.showModal}
          handleThread={this.props.handleThread}
          showPayRequestModal={this.props.showPayRequestModal}
          showRejectReplyReqModal={this.props.showRejectReplyReqModal}
          //payRequest
          //rejectRequest
          tupleThreads={tupleThreads}
        />
      );
    });

    return (
      <>
        {sortedTuples.length < 1 ? (
          <p className="bodytext" style={{ textAlign: "center" }}>
            Payment requests sent to you, will appear here.
          </p>
        ) : (
          <></>
        )}

        <div>
          <p></p>
          {tuples}
        </div>
      </>
    );
  }
}

export default PaymentRequestsComp;
