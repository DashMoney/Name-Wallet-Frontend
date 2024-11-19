import React from "react";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";

import handleDenomDisplay from "../UnitDisplay";
import formatDate from "../TimeDisplayLong";
import simpleDate from "../DateDisplay";
import Pay2PartyReqsComp from "./Pay2PartyReqsComp";

class YourRsrv extends React.Component {
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

    let rental = this.props.Rentals.find((rental) => {
      return rental.$id === this.props.request.rentalId;
    });

    let MerchantNameDoc = {
      label: "No Name Avail",
    };

    if (rental !== undefined) {
      MerchantNameDoc = this.props.RsrvsRentalsNames.find((nameDoc) => {
        return rental.$ownerId === nameDoc.$ownerId;
      });
    }

    //let confirm = undefined;

    let confirm = this.props.RentalConfirms.find((confirm) => {
      return (
        this.props.request.$id === confirm.reqId &&
        confirm.$ownerId === rental.$ownerId
      );
    });

    //GET THE 2PARTY STUFF
    let the2Party = (
      <>
        <p
          className="textsmaller"
          style={{ marginTop: "1rem", textAlign: "center" }}
        >
          <b>*2-Party Request will appear here when sent by owner*</b>{" "}
        </p>
      </>
    );

    if (confirm !== undefined) {
      let req2Party = this.props.ReqsToYou.find((req) => {
        return req.forId === confirm.$id;
      });

      if (req2Party !== undefined) {
        the2Party = (
          <Pay2PartyReqsComp
            mnemonic={this.props.mnemonic}
            whichNetwork={this.props.whichNetwork}
            //key={index}

            mode={this.props.mode}
            //index={index}
            req={req2Party}
            today={this.props.today}
            yesterday={this.props.yesterday}
            identity={this.props.identity} //For if my review so can edit
            uniqueName={this.props.uniqueName}
            accountHistory={this.props.accountHistory}
            accountBalance={this.props.accountBalance}
            //
            isLoadingRsrvsRentals={this.props.isLoadingRsrvsRentals}
            //isLoadingRsrvs2Party={this.props.isLoadingRsrvs2Party}
            isLoading2Party={this.props.isLoadingRsrvs2Party}
            Your2PartyPubKey={this.props.Your2PartyPubKey}
            ReqsToYou={this.props.ReqsToYou}
            ReqsToYouPubKeys={this.props.ReqsToYouPubKeys}
            ReqsToYouNames={[MerchantNameDoc]}
            ReqsToYouResponses={this.props.ReqsToYouResponses}
            show2PartyPayRequestModal={this.props.show2PartyPayRequestModal}
            showReleaseFundsModal={this.props.showReleaseFundsModal}
            showAddMessageToResponseModal={
              this.props.showAddMessageToResponseModal
            }
            showWithdrawRefundModal={this.props.showWithdrawRefundModal}
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

                <Button
                  variant="outline-primary"
                  onClick={() => {
                    navigator.clipboard.writeText(rental.address);
                    this.setState({
                      copiedAddress: true,
                    });
                  }}
                >
                  {this.state.copiedAddress ? <b>Copied!</b> : <b>Copy</b>}
                </Button>
              </div>
            ) : (
              <></>
            )}
            <p></p>
            <h5>
              <span
                style={{
                  marginTop: ".2rem",
                  marginBottom: "0rem",
                }}
              >
                <b>Owner:</b>
              </span>
              <span
                style={{
                  color: "#008de3",
                  marginTop: ".2rem",
                  marginBottom: "0rem",
                }}
              >
                {" "}
                <b onClick={() => this.handleNameClick(MerchantNameDoc.label)}>
                  {MerchantNameDoc.label}
                </b>
              </span>
              <span>{this.state.copiedName ? <span>✅</span> : <></>}</span>
            </h5>

            {/* <p></p>
            <div className="d-grid gap-2">
              <Button
                // size="lg"
                variant="primary"
                onClick={() => this.props.handleSelectedRental(rental)}
              >
                <b>View Rental</b>
              </Button>
            </div>
            <p></p> */}
            <p
              className="textsmaller"
              style={{ marginTop: "1rem", textAlign: "center" }}
            >
              <b> *Please visit rental site to view*</b>{" "}
            </p>

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
                marginBottom: "2rem",
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

            {confirm === undefined ? (
              <>
                <div className="ButtonRightNoUnderline">
                  <Button
                    variant="primary"
                    onClick={() =>
                      this.props.handleDeleteRequestModal(
                        this.props.request,
                        this.props.index
                      )
                    }
                  >
                    <b>Delete Request</b>
                  </Button>
                </div>
              </>
            ) : (
              <></>
            )}

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
                <p></p>
                {the2Party}
              </>
            ) : (
              <></>
            )}

            <p></p>
          </Card.Body>
        </Card>
      </>
    );
  }
}

export default YourRsrv;
