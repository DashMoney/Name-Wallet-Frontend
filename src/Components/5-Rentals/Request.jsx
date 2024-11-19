import React from "react";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";

import handleDenomDisplay from "../UnitDisplay";
import formatDate from "../TimeDisplayLong";

import simpleDate from "../DateDisplay";

import SentRentalsReqsComp from "./SentRentalsReqsComp";

class Request extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copiedName: false,
      copiedAddress: false,
    };
  }

  handleNameClick = (nameLabel) => {
    navigator.clipboard.writeText(nameLabel);
    this.setState({
      copiedName: true,
    });
  };

  verifyRequestStatus = (theRequest, theConfirm) => {
    if (theConfirm === undefined) {
      //console.log("Awaiting Confirmation");
      return <Badge bg="warning">Awaiting Confirm</Badge>;
    }

    //if(confirm!==undefined){this will check if the request and confirm dates and amts match }
    //
    if (
      theConfirm.amt === theRequest.amt &&
      theConfirm.arriveDate === theRequest.arriveDate &&
      theConfirm.departDate === theRequest.departDate
    ) {
      //console.log("Acceptance Rejected");
      return <Badge bg="success">Confirmed</Badge>;
    }

    // if (paidThrs.length === 0) {
    //   //console.log("Requested");
    //   return <Badge bg="success">Requested</Badge>;
    // }

    // if (ride.replyId === this.props.drive.$id) {
    //console.log("Confirmed");
    return <Badge bg="warning">Confirm Error</Badge>;
    //}
  };

  // handleNameClick = () => {
  //   navigator.clipboard.writeText(`${this.props.tuple[0]}`);
  //   this.setState({
  //     copiedName: true,
  //   });
  // };

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

    // "Requests"
    // "Confirmed"
    // "Blocked Off"

    let rental = this.props.Rentals.find((rental) => {
      return rental.$id === this.props.request.rentalId;
    });

    let confirm = undefined;

    ///******* DO THIS FIX ********** */ <-

    //DO I NEED TO DO SOMETHING FOR THE CUSTOMER ALSO ? ->

    //Filter so that only the merchant send a confirm to the requester -> ***JUST DO THIS IN THE CARD ie  WAY DOWN STREAM****
    // if (returnedDoc.$ownerId === this.state.MerchantId) {
    //   docArray = [...docArray, returnedDoc];
    // }

    ///******* DO THIS FIX ********** */

    if (this.props.DisplayRequests === "Confirmed") {
      confirm = this.props.RentalConfirms.find((confirm) => {
        return this.props.request.$id === confirm.reqId;
      });
    }

    //GET Proxy and Verify

    let requestProxy = this.props.RentalRequestsProxies.find((reqProxy) => {
      return reqProxy.$ownerId === this.props.request.$ownerId;
    });

    let requestName = {
      label: "No Name Avail",
      $ownerId: this.props.request.$ownerId,
    };

    let requestController;
    let requestControllerTuple; //[IdentityId, Label]
    //let isProxyApproved = false;

    if (requestProxy !== undefined) {
      requestController = this.props.RentalRequestsControllers.find(
        (reqController) => {
          return reqController.$ownerId === requestProxy.controlId;
        }
      );

      if (requestController !== undefined) {
        // if the proxyDoc is on the ControllerList -> need to check the list ->
        // proxyList   //[IdentityId, Label]
        requestControllerTuple = requestController.proxyList.find((tuple) => {
          return requestProxy.$ownerId === tuple[0];
        });

        if (requestControllerTuple !== undefined) {
          requestName = this.props.RentalRequestsNames.find((reqName) => {
            return reqName.$ownerId === requestController.$ownerId;
          });
        }

        if (requestName === undefined) {
          requestName = {
            label: "No Name Avail",
            $ownerId: this.props.request.$ownerId,
          };
        }

        // <div className="indentStuff">
        //                         <h5 style={{ color: "#008de4" }}>
        //                           <b>{this.props.ProxyNameDoc.label}*</b>
        //                         </h5>
        //                         <p style={{ marginLeft: "1rem" }}>
        //                           {" "}
        //                           {this.props.ProxyTuple[1]}
        //                         </p>
        //                       </div>
      }
    }

    //GET THE 2PARTY STUFF

    //Need to make sure that is it verifying proxy and disable the 2Party if fails ->

    let the2Party = (
      <>
        {" "}
        <p></p>
        <div className="d-grid gap-2">
          <Button
            variant="success"
            onClick={() =>
              this.props.showRentals2PartyReqModal(
                confirm,
                requestName,
                this.props.request.amt
              )
            }
          >
            <b>Request 2-Party Pay</b>
          </Button>
        </div>
        <p></p>
      </>
    );

    if (confirm !== undefined) {
      let req2Party = this.props.ReqsFromYou.find((req) => {
        return req.forId === confirm.$id;
      });

      if (req2Party !== undefined) {
        the2Party = (
          <SentRentalsReqsComp
            mnemonic={this.props.mnemonic}
            whichNetwork={this.props.whichNetwork}
            mode={this.props.mode}
            req={req2Party}
            today={this.props.today}
            yesterday={this.props.yesterday}
            identity={this.props.identity} //For if my review so can edit
            uniqueName={this.props.uniqueName}
            accountHistory={this.props.accountHistory}
            accountBalance={this.props.accountBalance}
            //
            DisplayReqsOrPmts={this.props.DisplayReqsOrPmts}
            isLoading2Party={this.props.isLoading2Party}
            Your2PartyPubKey={this.props.Your2PartyPubKey}
            ReqsFromYou={this.props.ReqsFromYou}
            ReqsFromYouPubKeys={this.props.ReqsFromYouPubKeys}
            ReqsFromYouNames={[requestName]}
            ReqsFromYouResponses={this.props.ReqsFromYouResponses}
            showRetrieveFundsModal={this.props.showRetrieveFundsModal}
            showAddMsgToRequestModal={this.props.showAddMsgToRequestModal}
            showRefundFundsModal={this.props.showRefundFundsModal}
          />
        );
      }
    }

    return (
      <>
        <Card
          id="card"
          key={this.props.index}
          index={this.props.index}
          bg={cardBkg}
          text={cardText}
          style={{ marginBottom: ".5rem" }}
        >
          <Card.Body>
            {}
            <Card.Title className="cardTitle">
              <h5>
                {" "}
                <b //style={{ color: "#008de4" }}
                >
                  {rental.title}
                </b>
              </h5>

              <span className="textsmaller">
                {formatDate(
                  this.props.request.$updatedAt,
                  this.props.today,
                  this.props.yesterday
                )}
              </span>
            </Card.Title>
            <Card.Title style={{ display: "flex", justifyContent: "center" }}>
              {this.verifyRequestStatus(this.props.request, confirm)}
            </Card.Title>
            <p></p>
            {rental.address !== undefined && rental.address !== "" ? (
              <div
                style={{
                  display: "flex",
                  alignContent: "baseline",
                  justifyContent: "space-between",
                  marginLeft: "1rem",
                  marginRight: "2rem",
                  marginBottom: "1.2rem",
                }}
              >
                <span style={{ whiteSpace: "pre-wrap" }}>{rental.address}</span>

                {/* <Button
                  variant="outline-primary"
                  onClick={() => {
                    navigator.clipboard.writeText(rental.address);
                    this.setState({
                      copiedAddress: true,
                    });
                  }}
                >
                  {this.state.copiedAddress ? <b>Copied!</b> : <b>Copy</b>}
                </Button> */}
              </div>
            ) : (
              <></>
            )}

            <h5>
              <span
                style={{
                  marginTop: ".2rem",
                  marginBottom: "0rem",
                }}
              >
                <b>Renter:</b>
              </span>
              <span
                style={{
                  color: "#008de4",
                  marginTop: ".2rem",
                  marginBottom: "0rem",
                }}
              >
                {" "}
                <b onClick={() => this.handleNameClick(requestName.label)}>
                  {requestName.label}
                </b>
              </span>
              <span>{this.state.copiedName ? <span>✅</span> : <></>}</span>
            </h5>

            {/* ArriveDate*/}
            <p
              style={{
                marginTop: ".2rem",
                marginBottom: "0rem",
                color: "#008de4",
              }}
            >
              <b>Arrival</b>
            </p>

            <h5 style={{ textAlign: "center" }}>
              <b> {simpleDate(this.props.request.arriveDate)}</b>{" "}
            </h5>

            {/* DepartDate*/}
            <p
              style={{
                marginTop: ".2rem",
                marginBottom: "0rem",
                color: "#008de4",
              }}
            >
              <b>Departure</b>
            </p>

            <h5 style={{ textAlign: "center" }}>
              <b> {simpleDate(this.props.request.departDate)}</b>{" "}
            </h5>

            {/* Amount */}

            {/* <h5 style={{ marginTop: ".2rem", textAlign: "center" }}>
              {" "}
              <b style={{ color: "#008de4" }}>
                {handleDenomDisplay(this.props.whichNetwork,rental.rate)}
              </b>{" "}
              per day
            </h5> */}
            <h4
              style={{
                marginTop: "1.5rem",
                marginBottom: "1rem",
                textAlign: "center",
              }}
            >
              Total Cost{" "}
              <b style={{ marginLeft: "1rem", color: "#008de4" }}>
                {handleDenomDisplay(
                  this.props.whichNetwork,
                  this.props.request.amt
                )}
              </b>
            </h4>

            {requestName.label !== "No Name Avail" &&
            confirm === undefined &&
            !this.props.isLoadingRentalsMerchant ? (
              <>
                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    onClick={() =>
                      this.props.handleConfirmRequestModal(this.props.request)
                    }
                  >
                    <b>Confirm Reservation</b>
                  </Button>
                </div>
                <p></p>
              </>
            ) : (
              <></>
            )}
            {/* {confirm === undefined ? (
              <>
                <div className="TwoButtons">
                  <Button
                    variant="primary"
                    // onClick={() =>
                    //   this.props.handleDeleteRequest(this.props.index)
                    // }
                  >
                    <b>Delete Request</b>
                  </Button>
                  <Button
                    variant="primary"
                    // onClick={() =>
                    //   this.props.handleEditRequest(this.props.index)
                    // }
                  >
                    <b>Edit Request</b>
                  </Button>
                </div>
              </>
            ) : (
              <></>
            )} */}

            {confirm !== undefined ? (
              <>
                <div
                  className="BottomBorder"
                  style={{ paddingTop: ".7rem", marginBottom: ".7rem" }}
                ></div>
                <div className="cardTitle" style={{ marginBottom: ".5rem" }}>
                  <h5
                    style={{
                      color: "#008de4",
                    }}
                  >
                    2-Party Pay
                  </h5>
                  {/* {this.verifyRequestStatus(this.props.request, confirm)} */}
                </div>
              </>
            ) : (
              <></>
            )}

            {/* {confirm !== undefined ? (
              <> */}

            <p></p>
            {requestName.label !== "No Name Avail" && confirm !== undefined ? (
              <>{the2Party}</>
            ) : (
              <></>
            )}

            {/* </>
            ) : (
              <></>
            )} */}

            {/* {confirm !== undefined && rentalReplies.length === 0 ? (
              <>
                <p style={{ textAlign: "center", paddingTop: ".5rem" }}>
                  (Currently, there are no messages to this reservation.)
                </p>
              </>
            ) : (
              <></>
            )} */}

            {/* {rentalReplyMessages}
            <p></p>
            {confirm !== undefined ? (
              <>
                <div className="ButtonRightNoUnderline">
                  <Button
                    variant="primary"
                    onClick={() =>
                      this.props.handleMerchantReplyModalShow(
                        confirm,
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
            )} */}
          </Card.Body>
        </Card>
      </>
    );
  }
}

export default Request;
