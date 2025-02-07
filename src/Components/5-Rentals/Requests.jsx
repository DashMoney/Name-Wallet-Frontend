import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Form from "react-bootstrap/Form";

import Request from "./Request";
import BlockedOff from "./BlockedOff";

class Requests extends React.Component {
  // constructor(props) {  //MOVED TO APP STATE
  //   super(props);
  //   this.state = {
  //     DisplayRequests: "Requests", //Payment Schedule
  //   };
  // }

  handleRequestFilter = (selected) => {
    this.props.handleMerchantRequestFilter(selected);
  };

  onChange = (event) => {
    //Payment Schedule
    if (event.target.id === "formRequestFilter") {
      event.stopPropagation();
      this.handleRequestFilter(event.target.value);
    }
  };

  render() {
    let today = new Date();
    let yesterday = new Date(today);

    yesterday.setDate(yesterday.getDate() - 1);

    //Put the filter here <- NO otherwise will have to filter here

    let rsrvConfirms = [];
    let blockedConfirms = [];
    this.props.RentalConfirms.forEach((confirm) => {
      if (confirm.amt === 0) {
        blockedConfirms.push(confirm);
      } else {
        rsrvConfirms.push(confirm);
      }
    });

    let unconfirmedReqs = [];
    let confirmedReqs = [];

    this.props.RentalRequests.forEach((request) => {
      let bool = rsrvConfirms.some((confirm) => confirm.reqId === request.$id);
      if (bool) {
        confirmedReqs.push(request);
      } else {
        unconfirmedReqs.push(request);
      }
    });
    let requests = [];

    if (this.props.DisplayRequests === "Requests") {
      requests = unconfirmedReqs.map((request, index) => {
        //console.log(post);
        return (
          <Col key={index} lg={4}>
            <div style={{ marginBottom: ".5rem" }}>
              <Request
                whichNetwork={this.props.whichNetwork}
                //key={index}

                mode={this.props.mode}
                index={index}
                request={request}
                today={today}
                yesterday={yesterday}
                identity={this.props.identity} //For if my review so can edit
                uniqueName={this.props.uniqueName}
                handleConfirmRequestModal={this.props.handleConfirmRequestModal}
                //
                DisplayRequests={this.props.DisplayRequests}
                handleSelectedYourRsrv={this.props.handleSelectedYourRsrv}
                handleSelectedDapp={this.props.handleSelectedDapp}
                handleSelectedRental={this.props.handleSelectedRental}
                isLoadingRentals2Party={this.props.isLoadingRentals2Party}
                isLoadingRequests={this.props.isLoadingRentalsMerchant}
                Rentals={this.props.Rentals}
                // RentalRequests={this.props.RentalRequests}
                RentalConfirms={rsrvConfirms}
                RentalRequestsProxies={this.props.RentalRequestsProxies}
                RentalRequestsControllers={this.props.RentalRequestsControllers}
                RentalRequestsNames={this.props.RentalRequestsNames}
              />
            </div>
          </Col>
        );
      });
    }

    if (this.props.DisplayRequests === "Confirmed") {
      requests = confirmedReqs.map((request, index) => {
        //console.log(post);
        return (
          <Col key={index} lg={4}>
            <div style={{ marginBottom: ".5rem" }}>
              <Request
                whichNetwork={this.props.whichNetwork}
                //key={index}
                mode={this.props.mode}
                index={index}
                request={request}
                today={today}
                yesterday={yesterday}
                identity={this.props.identity} //For if my review so can edit
                uniqueName={this.props.uniqueName}
                handleMerchantReplyModalShow={
                  this.props.handleMerchantReplyModalShow
                }
                //
                DisplayRequests={this.props.DisplayRequests}
                handleSelectedYourRsrv={this.props.handleSelectedYourRsrv}
                handleSelectedDapp={this.props.handleSelectedDapp}
                handleSelectedRental={this.props.handleSelectedRental}
                isLoadingRentals2Party={this.props.isLoadingRentals2Party}
                isLoadingRequests={this.props.isLoadingRentalsMerchant}
                Rentals={this.props.Rentals}
                //RentalRequests={this.props.RentalRequests}
                RentalConfirms={rsrvConfirms}
                RentalRequestsProxies={this.props.RentalRequestsProxies}
                RentalRequestsControllers={this.props.RentalRequestsControllers}
                RentalRequestsNames={this.props.RentalRequestsNames}
                //
                //2PartyComponent - BELOW
                //
                mnemonic={this.props.mnemonic}
                accountHistory={this.props.accountHistory}
                accountBalance={this.props.accountBalance}
                //

                isLoading2Party={this.props.isLoading2Party}
                Your2PartyPubKey={this.props.Your2PartyPubKey}
                ReqsFromYou={this.props.ReqsFromYou}
                ReqsFromYouPubKeys={this.props.ReqsFromYouPubKeys}
                // ReqsFromYouNames={this.props.ReqsFromYouNames}
                ReqsFromYouResponses={this.props.ReqsFromYouResponses}
                showRentals2PartyReqModal={this.props.showRentals2PartyReqModal}
                showRetrieveFundsModal={this.props.showRetrieveFundsModal}
                showAddMsgToRequestModal={this.props.showAddMsgToRequestModal}
                showRefundFundsModal={this.props.showRefundFundsModal}
              />
            </div>
          </Col>
        );
      });
    }

    let blocks = [];

    if (this.props.DisplayRequests === "Blocked Off") {
      blocks = blockedConfirms.map((confirmBlock, index) => {
        //console.log(post);
        return (
          <Col key={index} lg={4}>
            <div style={{ marginBottom: ".5rem" }}>
              <BlockedOff
                //key={index}
                mode={this.props.mode}
                index={index}
                confirmBlock={confirmBlock}
                today={today}
                yesterday={yesterday}
                identity={this.props.identity} //For if my review so can edit
                //uniqueName={this.props.uniqueName}

                DisplayRequests={this.props.DisplayRequests}
                handleSelectedYourRsrv={this.props.handleSelectedYourRsrv}
                handleSelectedDapp={this.props.handleSelectedDapp}
                handleSelectedRental={this.props.handleSelectedRental}
                handleDeleteBlockConfirmModal={
                  this.props.handleDeleteBlockConfirmModal
                }
                //
                // isLoadingRentals={this.props.isLoadingRentals}
                isLoadingRequests={this.props.isLoadingRequests}
                Rentals={this.props.Rentals}
                //RentalConfirms={this.props.RentalConfirms}
              />
            </div>
          </Col>
        );
      });
    }

    let formBkg;
    let formText;

    if (this.props.mode === "primary") {
      formBkg = "light";
      formText = "dark";
    } else {
      formBkg = "dark";
      formText = "light";
    }

    return (
      <>
        <Row className="justify-content-md-center">
          <Col md={9} lg={8} xl={7} xxl={6}>
            <Form
              noValidate
              // onSubmit={this.handleSubmitClick}
              onChange={this.onChange}
            >
              {/* REQUEST FILTER FORM BELOW */}

              <Form.Group className="mb-3" controlId="formRequestFilter">
                {/* <Form.Label>
            <h5 style={{ marginTop: ".5rem", marginBottom: ".2rem" }}>
              Payment Schedule
            </h5>
          </Form.Label> */}

                <Form.Select
                  style={{ fontWeight: "bold" }}
                  // bg={formBkg}
                  //text={formText}
                  data-bs-theme={formBkg}
                  defaultValue={this.props.DisplayRequests}
                >
                  <option value="Requests" style={{ fontWeight: "bold" }}>
                    Requests
                  </option>
                  <option value="Confirmed" style={{ fontWeight: "bold" }}>
                    Confirmed
                  </option>
                  <option value="Blocked Off" style={{ fontWeight: "bold" }}>
                    Blocked Off
                  </option>
                </Form.Select>
              </Form.Group>
            </Form>

            <p></p>
          </Col>
        </Row>
        {this.props.DisplayRequests === "Requests" ? (
          <>
            <Row className="justify-content-md-center">{requests}</Row>
          </>
        ) : (
          <></>
        )}
        {this.props.DisplayRequests === "Requests" &&
        unconfirmedReqs.length === 0 ? (
          <>
            <p style={{ textAlign: "center" }}>
              There are no unconfirmed requests presently.
            </p>
          </>
        ) : (
          <></>
        )}
        {this.props.DisplayRequests === "Confirmed" ? (
          <>
            <Row className="justify-content-md-center">{requests}</Row>
          </>
        ) : (
          <></>
        )}
        {this.props.DisplayRequests === "Confirmed" &&
        confirmedReqs.length === 0 ? (
          <>
            <p style={{ textAlign: "center" }}>
              There are no confirmations presently.
            </p>
          </>
        ) : (
          <></>
        )}
        {this.props.DisplayRequests === "Blocked Off" ? (
          <>
            <Row className="justify-content-md-center">{blocks}</Row>
          </>
        ) : (
          <></>
        )}
        {this.props.DisplayRequests === "Blocked Off" &&
        blockedConfirms.length === 0 ? (
          <>
            <p style={{ textAlign: "center" }}>
              There are no blocked off dates presently.
            </p>
          </>
        ) : (
          <></>
        )}
      </>
    );
  }
}

export default Requests;
