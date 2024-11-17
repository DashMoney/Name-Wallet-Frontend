import React from "react";

import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import CreditsOnPage from "../CreditsOnPage";

import handleDenomDisplay from "../UnitDisplay";

import Requests from "./Requests";

class RequestsPage extends React.Component {
  componentDidMount() {
    this.props.pullInitialTriggerRENTALS();
  }

  render() {
    return (
      <>
        <div className="bodytext">
          {this.props.isLoadingWallet ? (
            <>
              <div className="paddingBadge">
                <b>Wallet Balance</b>

                <h4>Loading..</h4>
              </div>
            </>
          ) : (
            <>
              <div className="paddingBadge">
                <div className="cardTitle">
                  <div>
                    <b>Wallet Balance</b>
                    <h4 style={{ color: "#008de4" }}>
                      <b>
                        {handleDenomDisplay(
                          this.props.whichNetwork,
                          this.props.accountBalance
                        )}
                      </b>
                    </h4>
                  </div>

                  {this.props.isRentalsRefreshReady &&
                  !this.props.isLoadingRentalsMerchant &&
                  !this.props.isLoadingRentals2Party ? (
                    <>
                      <div className="d-grid gap-2" id="button-edge-noTop">
                        <Button
                          variant="primary"
                          onClick={() => {
                            this.props.handleRefresh_Rentals();
                          }}
                          style={{
                            fontSize: "larger",
                            paddingLeft: "1rem",
                            paddingRight: "1rem",
                          }}
                        >
                          <b>Refresh</b>
                        </Button>
                      </div>
                      <p></p>
                    </>
                  ) : (
                    <>
                      <div className="d-grid gap-2" id="button-edge-noTop">
                        <Button
                          variant="primary"
                          disabled
                          style={{
                            fontSize: "larger",
                            paddingLeft: "1rem",
                            paddingRight: "1rem",
                          }}
                        >
                          <b>Refresh</b>
                        </Button>
                      </div>
                      <p></p>
                    </>
                  )}
                </div>
              </div>
            </>
          )}

          <div id="sidetextonlytop">
            <CreditsOnPage
              identityInfo={this.props.identityInfo}
              uniqueName={this.props.uniqueName}
              showModal={this.props.showModal}
            />
          </div>

          <h5 style={{ marginTop: ".2rem" }}>
            <b>Rentals</b>{" "}
          </h5>
          <p></p>

          {this.props.Your2PartyPubKey === "Querying" &&
          (this.props.isLoadingRentalsMerchant ||
            this.props.isLoadingRentals2Party) ? (
            <>
              <div className="d-grid gap-2" style={{ margin: "1rem" }}>
                <Button variant="success" size="lg" disabled>
                  <b>Enable "2-Party" Pay</b>
                </Button>
              </div>
            </>
          ) : (
            <></>
          )}

          {this.props.Your2PartyPubKey === "No Pub Key" ? (
            <>
              <div className="d-grid gap-2" style={{ margin: "1rem" }}>
                <Button
                  variant="success"
                  size="lg"
                  onClick={() => this.props.showModal("Register2PartyModal")}
                >
                  <b>Enable "2-Party" Pay</b>
                </Button>
              </div>
            </>
          ) : (
            <></>
          )}

          {/* isLoadingRentalsMerchant={this.props.isLoadingRentalsMerchant}
             isLoadingRentals2Party={this.props.isLoadingRentals2Party} */}
          {this.props.Your2PartyPubKey === "Querying" ||
          this.props.isLoadingRentalsMerchant ||
          this.props.isLoadingRentals2Party ? (
            <>
              <div id="spinner">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
              <p></p>
            </>
          ) : (
            <></>
          )}

          {this.props.Your2PartyPubKey === "Querying" ||
          this.props.Your2PartyPubKey === "No Pub Key" ||
          this.props.isLoadingRentalsMerchant ||
          this.props.isLoadingRentals2Party ? (
            <></>
          ) : (
            <>
              {this.props.RentalRequests.length === 0 ? (
                <div className="bodytext">
                  <p>Sorry, no requests have been made.</p>
                </div>
              ) : (
                <>
                  <Requests
                    whichNetwork={this.props.whichNetwork}
                    Rentals={this.props.Rentals}
                    RentalRequests={this.props.RentalRequests}
                    RentalConfirms={this.props.RentalConfirms}
                    //
                    RentalRequestsProxies={this.props.RentalRequestsProxies}
                    RentalRequestsControllers={
                      this.props.RentalRequestsControllers
                    }
                    //
                    RentalRequestsNames={this.props.RentalRequestsNames}
                    //
                    handleSelectedRental={this.props.handleSelectedRental}
                    handleConfirmRequestModal={
                      this.props.handleConfirmRequestModal
                    }
                    handleMerchantReplyModalShow={
                      this.props.handleMerchantReplyModalShow
                    }
                    handleMerchantRequestFilter={
                      this.props.handleMerchantRequestFilter
                    }
                    handleDeleteBlockConfirmModal={
                      this.props.handleDeleteBlockConfirmModal
                    }
                    //
                    identity={this.props.identity}
                    uniqueName={this.props.uniqueName}
                    isLoadingWallet={this.props.isLoadingWallet}
                    accountHistory={this.props.accountHistory}
                    mode={this.props.mode}
                    DisplayRequests={this.props.DisplayRequests}
                    //
                    //isLoadingRequests={this.props.isLoadingRequests}
                    isLoadingRentalsMerchant={
                      this.props.isLoadingRentalsMerchant
                    }
                    isLoadingRentals2Party={this.props.isLoadingRentals2Party}
                    isRequestsRefreshReady={this.props.isRequestsRefreshReady}
                    refreshRequests={this.props.refreshRequests}
                    //
                    //2PartyComponent - BELOW
                    //
                    mnemonic={this.props.mnemonic}
                    accountBalance={this.props.accountBalance}
                    //
                    DisplayReqsOrPmts={this.props.DisplayReqsOrPmts}
                    isLoading2Party={this.props.isLoading2Party}
                    Your2PartyPubKey={this.props.Your2PartyPubKey}
                    ReqsFromYou={this.props.ReqsFromYou}
                    ReqsFromYouPubKeys={this.props.ReqsFromYouPubKeys}
                    // ReqsFromYouNames={this.props.ReqsFromYouNames}
                    ReqsFromYouResponses={this.props.ReqsFromYouResponses}
                    showRentals2PartyReqModal={
                      this.props.showRentals2PartyReqModal
                    }
                    showRetrieveFundsModal={this.props.showRetrieveFundsModal}
                    showAddMsgToRequestModal={
                      this.props.showAddMsgToRequestModal
                    }
                    showRefundFundsModal={this.props.showRefundFundsModal}
                  />
                </>
              )}
            </>
          )}
        </div>
      </>
    );
  }
}

export default RequestsPage;
