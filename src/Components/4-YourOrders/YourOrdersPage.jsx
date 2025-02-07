import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";

//import LowCreditsOnPage from "../LowCreditsOnPage";
import CreditsOnPage from "../CreditsOnPage";
import handleDenomDisplay from "../UnitDisplay";

import YourOrders from "./YourOrders";

class YourOrdersPage extends React.Component {
  //https://stackoverflow.com/questions/37620694/how-to-scroll-to-bottom-in-react
  scrollToTop = () => {
    this.positionStart.scrollIntoView({
      behavior: "instant",
      block: "start",
      inline: "nearest",
    });
  };
  componentDidMount() {
    this.scrollToTop();
    this.props.pullInitialTriggerYOURORDERS();
  }
  render() {
    return (
      <>
        <div
          className="bodytext"
          ref={(el) => {
            this.positionStart = el;
          }}
        >
          <Row className="justify-content-md-center">
            <Col md={9} lg={8} xl={7} xxl={6}>
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

                      {this.props.isYourOrdersRefreshReady &&
                      !this.props.isLoadingYourOrders2Party &&
                      !this.props.isLoadingYourOrders ? (
                        <Button
                          variant="primary"
                          onClick={() => {
                            this.props.handleRefresh_YourOrders();
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

              <h4 style={{ marginTop: ".2rem" }}>
                <b>Your Orders</b>{" "}
              </h4>
              <p></p>

              {this.props.Your2PartyPubKey === "Querying" &&
              (this.props.isLoadingYourOrders2Party ||
                this.props.isLoadingYourOrders) ? (
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
                      onClick={() =>
                        this.props.showModal("Register2PartyModal")
                      }
                    >
                      <b>Enable "2-Party" Pay</b>
                    </Button>
                  </div>
                </>
              ) : (
                <></>
              )}

              {this.props.Your2PartyPubKey === "Querying" ||
              this.props.isLoadingYourOrders2Party ||
              this.props.isLoadingYourOrders ? (
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
            </Col>
          </Row>

          {this.props.Your2PartyPubKey === "Querying" ||
          this.props.Your2PartyPubKey === "No Pub Key" ||
          this.props.isLoadingYourOrders ||
          this.props.isLoadingYourOrders2Party ? (
            <></>
          ) : (
            <>
              {this.props.UnconfirmedOrders.length === 0 ? (
                <div className="bodytext" style={{ textAlign: "center" }}>
                  <p>Sorry, no orders have been made.</p>
                </div>
              ) : (
                <>
                  <YourOrders
                    whichNetwork={this.props.whichNetwork}
                    mode={this.props.mode}
                    identity={this.props.identity}
                    YourOrdersNames={this.props.YourOrdersNames}
                    //MerchantNameDoc={this.props.MerchantNameDoc}
                    uniqueName={this.props.uniqueName}
                    //
                    handleSelectedPage={this.props.handleSelectedPage}
                    handleSelectedItem={this.props.handleSelectedItem}
                    handleCustomerReplyModalShow={
                      this.props.handleCustomerReplyModalShow
                    }
                    handleDeleteOrderModal={this.props.handleDeleteOrderModal}
                    //
                    isLoadingYourOrders={this.props.isLoadingYourOrders}
                    isLoadingYourOrders2Party={
                      this.props.isLoadingYourOrders2Party
                    }
                    YourOrdersInventories={this.props.YourOrdersInventories}
                    UnconfirmedOrders={this.props.UnconfirmedOrders}
                    ConfirmedOrders={this.props.ConfirmedOrders}
                    //2PartyComponent - BELOW

                    mnemonic={this.props.mnemonic}
                    accountHistory={this.props.accountHistory}
                    accountBalance={this.props.accountBalance}
                    //

                    isLoading2Party={this.props.isLoading2Party}
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
                    alreadySentCreateResponse={
                      this.props.alreadySentCreateResponse
                    }
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

export default YourOrdersPage;
