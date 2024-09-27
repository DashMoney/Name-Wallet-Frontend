////rides and drives and reservation/appt is a little different because they have the original post, then request/accept, then confirm
// ACTUALLY SEE BELOW !!
//FOR PMT REQUEST THIS IS SIMPLE TO THE USER
//BUT THIS COULD BE USED FOR THE RIDES/DRIVER AND RSRVS/APPT TO THE RIDEREQ&RESERVEPOST!!!

//
//
// NEEDS ALL THE THREADS BECAUSE YOU PAY OTHER PERSON REQUEST. ->
//
//
export default function P2PSequencerDisplay(messages, threads) {
  //May need to ensure unique/ no duplicates-> should be given
  //divide threads up -> reply threads AND pmt threads
  //
  //All else start from msgs
  //
  // simple ->
  // just separate out into groups
  // start with threads -> replyThrs and the pmtThrsORpaidThrs<-
  // Then with pmtThrs -> pmtMsgs&pmtReqs and the paidPmtReqs
  // Then with
  //
  let paidThrs = []; //SO CAN YOU REPLY TO A PMTREQUEST?? WITHOUT PAYING? THIS IS THE COUNTER OFFER IDEA -> BC THEN YOU HAVE PMTREPLYTHRS AND PAIDTHRS.. -> also counter is not necessary but yeah ->
  // paid could be paid OR rejected, right ->
  let replyThrs = [];
  // paidThrs = threads.filter(thr => {}); //THESE TXIDs WILL HAVE TO BE CHECKED VS THE WALLET DATA -> WILL HAVE TAG (PAID OR FAIL) ->THIS IS SEPARATE THING ->
  //
  threads.forEach((thr) => {
    if (thr.txId !== undefined && thr.txId !== "") {
      paidThrs.push(thr);
    } else {
      replyThrs.push(thr);
    }
  });

  //separate pmt Msgs and PmtReqs(paid/reject OR not paid)
  let paymentReqs = [];
  let paymentMsgs = [];
  messages.forEach((msg) => {
    if (msg.txId !== "" && msg.txId !== undefined) {
      paymentMsgs.push(msg);
    } else {
      paymentReqs.push(msg);
    }
  });
  //then separate paid/reject AND not paid --- Msgs(thatare)-PmtReqs
  let paidOrRejPmtReqs = []; //bc this goes to messages
  let notPaidPmtReqs = []; // this goes to queue
  paymentReqs.forEach((req) => {
    //WHAT?? -> okay, okay, for this one each pmtreq must be checked against the paidthrs
    let bool = paidThrs.some(
      //.every() OR .some()  I think it doesn't matter just make the logic cooperate
      (thr) =>
        //WAS thr.toID === req.$id BUT THAT WAS WRONG!!
        thr.msgId === req.$id && thr.txId !== "" && thr.txId !== undefined //&&
      //thr.txId !== "rej" //This not needed here the display will handle warning tag with reject and paid if txId matches in wallet.
    );
    //CHECK AND MAKE SURE THAT THE TOID IS NOT HEX BUT TOJSON ->
    if (bool) {
      paidOrRejPmtReqs.push(req); //bc this goes to messages
    } else {
      notPaidPmtReqs.push(req); // this goes to queue
    }
  });

  return [paidThrs, replyThrs, paymentMsgs, paidOrRejPmtReqs, notPaidPmtReqs];
  //threads - [0] -> paid/rejected Thrs -> messages Tab
  //threads - [1] -> reply - for pmtMsgsReply AND reqReply -> msg Tab & queue
  //messages - [2] -> PmtMsgs -> this goes to messages Tab
  //messages - [3] -> PmtReqsPaidOrRej -> messages Tab
  //messages - [4] -> PmtReqsNeitherPaidOrRej ->  this goes to queue
}
//
//group together ones that belong together.. start from thread and then let over will be msgs alone
// return what? -> msgs alone(pmt msg or pmt req), msg with thread(pmt msg with reply, paid pmt request, no pay just reply to pmt req), deleted msg but still thread.

//BAD IDEAS
//put in an object.. and sequence?? -> NO
// let paidRequests = pmt threads + replyThrs + pmtReq
//
//paidThrs = threads.filter((thr) => thr.txId !== undefined && thr.txId !== "");
// ^^^ WRONG ?? replyThrs not used?
//
//
//***below is wrong because there are 3 sets of separation thrs(paid& reply), msgs(pmt&request), pmtreqs(paid&unpaid)
// messages.forEach(msg =>{
//  let bool = paidThrs.every(thr => thr.toId !== msg.$id) //CHECK AND MAKE SURE THAT THE TOID IS NOT HEX BUT TOJSON ->
//if(bool){paidPmtReqs.push(msg)}else{paymentMsgs.push(msg)}
//
//   paidThrs.find() // returns the value of the first array element that passes a test function. else returns undefined
// })
