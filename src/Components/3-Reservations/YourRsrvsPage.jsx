import React from "react";

import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";

import CreditsOnPage from "../CreditsOnPage";
import handleDenomDisplay from "../UnitDisplay";

import YourRsrvs from "./YourRsrvs";

class YourRsrvsPage extends React.Component {
  componentDidMount() {
    this.props.pullInitialTriggerRSRVS();
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
                <div className="cardCenterTitle">
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

                  {this.props.isRsrvsRefreshReady &&
                  !this.props.isLoadingRsrvs2Party &&
                  !this.props.isLoadingRsrvsRentals ? (
                    <Button
                      variant="primary"
                      onClick={() => {
                        this.props.handleRefresh_Rsrvs();
                      }}
                      style={{
                        fontSize: "larger",
                        paddingLeft: "1rem",
                        paddingRight: "1rem",
                      }}
                    >
                      <b>Refresh</b>
                    </Button>
                  ) : (
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
            <b>Reservations</b>{" "}
          </h5>
          <p></p>

          {this.props.Your2PartyPubKey === "Querying" &&
          (this.props.isLoadingRsrvs2Party ||
            this.props.isLoadingRsrvsRentals) ? (
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

          {this.props.Your2PartyPubKey === "Querying" ||
          this.props.isLoadingRsrvs2Party ||
          this.props.isLoadingRsrvsRentals ? (
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
          this.props.isLoadingRsrvsRentals ||
          this.props.isLoadingRsrvs2Party ? (
            <></>
          ) : (
            <>
              {this.props.RentalRequests.length === 0 ? (
                <div className="bodytext">
                  <p>Sorry, no requests have been made.</p>
                </div>
              ) : (
                <>
                  <YourRsrvs
                    whichNetwork={this.props.whichNetwork}
                    mode={this.props.mode}
                    identity={this.props.identity}
                    RsrvsRentalsNames={this.props.RsrvsRentalsNames}
                    uniqueName={this.props.uniqueName}
                    //
                    handleSelectedDapp={this.props.handleSelectedDapp}
                    handleSelectedRental={this.props.handleSelectedRental}
                    handleCustomerReplyModalShow={
                      this.props.handleCustomerReplyModalShow
                    }
                    handleDeleteRequestModal={
                      this.props.handleDeleteRequestModal
                    }
                    //

                    isLoadingRsrvsRentals={this.props.isLoadingRsrvsRentals}
                    isLoadingRsrvs2Party={this.props.isLoadingRsrvs2Party}
                    Rentals={this.props.Rentals}
                    RentalRequests={this.props.RentalRequests}
                    RentalConfirms={this.props.RentalConfirms}
                    //
                    //2PartyComponent - BELOW
                    //req={req}
                    mnemonic={this.props.mnemonic}
                    accountHistory={this.props.accountHistory}
                    accountBalance={this.props.accountBalance}
                    //
                    DisplayReqsOrPmts={this.props.DisplayReqsOrPmts}
                    Your2PartyPubKey={this.props.Your2PartyPubKey}
                    ReqsToYou={this.props.ReqsToYou}
                    ReqsToYouPubKeys={this.props.ReqsToYouPubKeys}
                    //ReqsToYouNames={this.props.ReqsToYouNames}
                    ReqsToYouResponses={this.props.ReqsToYouResponses}
                    show2PartyPayRequestModal={
                      this.props.show2PartyPayRequestModal
                    }
                    showReleaseFundsModal={this.props.showReleaseFundsModal}
                    showAddMessageToResponseModal={
                      this.props.showAddMessageToResponseModal
                    }
                    showWithdrawRefundModal={this.props.showWithdrawRefundModal}
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

export default YourRsrvsPage;
