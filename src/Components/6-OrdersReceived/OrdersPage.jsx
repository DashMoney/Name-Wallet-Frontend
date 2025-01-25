import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import CreditsOnPage from "../CreditsOnPage";

import handleDenomDisplay from "../UnitDisplay";

import Orders from "./Orders";

class OrdersPage extends React.Component {
  componentDidMount() {
    this.props.pullInitialTriggerORDERS();
  }

  render() {
    return (
      <>
        <div className="bodytext">
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

                      {this.props.isOrdersRefreshReady &&
                      !this.props.isLoadingOrdersMerchant &&
                      !this.props.isLoadingOrders2Party ? (
                        <Button
                          variant="primary"
                          onClick={() => {
                            this.props.handleRefresh_Orders();
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
                <b>Orders Received</b>{" "}
              </h4>
              <p></p>

              {this.props.Your2PartyPubKey === "Querying" &&
              (this.props.isLoadingOrdersMerchant ||
                this.props.isLoadingOrders2Party) ? (
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
              this.props.isLoadingOrdersMerchant ||
              this.props.isLoadingOrders2Party ? (
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
          this.props.isLoadingOrdersMerchant ||
          this.props.isLoadingOrders2Party ? (
            <></>
          ) : (
            <>
              {this.props.UnconfirmedOrders.length === 0 ? (
                <div className="bodytext" style={{ textAlign: "center" }}>
                  <p>Sorry, no requests have been made.</p>
                </div>
              ) : (
                <>
                  <Orders
                    whichNetwork={this.props.whichNetwork}
                    isLoadingWallet={this.props.isLoadingWallet}
                    isLoadingOrders2Party={this.props.isLoadingOrders2Party}
                    isLoadingOrdersMerchant={this.props.isLoadingOrdersMerchant}
                    isOrdersRefreshReady={this.props.isOrdersRefreshReady}
                    handleRefresh_Orders={this.handleRefresh_Orders}
                    OrdersInventoryDoc={this.props.OrdersInventoryDoc}
                    Inventory={this.props.Inventory}
                    UnconfirmedOrders={this.props.UnconfirmedOrders}
                    ConfirmedOrders={this.props.ConfirmedOrders}
                    OrdersNames={this.props.OrdersNames}
                    OrdersControllers={this.props.OrdersControllers}
                    OrdersProxies={this.props.OrdersProxies}
                    //
                    handleConfirmOrderModal={this.props.handleConfirmOrderModal}
                    handleMerchantOrdersFilter={
                      this.props.handleMerchantOrdersFilter
                    }
                    //
                    identity={this.props.identity}
                    identityInfo={this.props.identityInfo}
                    uniqueName={this.props.uniqueName}
                    MerchantNameDoc={this.props.MerchantNameDoc}
                    accountHistory={this.props.accountHistory}
                    //
                    mode={this.props.mode}
                    showModal={this.props.showModal}
                    //
                    //2PartyComponent - BELOW
                    //
                    mnemonic={this.props.mnemonic}
                    accountBalance={this.props.accountBalance}
                    //
                    DisplayOrders={this.props.DisplayOrders}
                    isLoading2Party={this.props.isLoading2Party}
                    Your2PartyPubKey={this.props.Your2PartyPubKey}
                    ReqsFromYou={this.props.ReqsFromYou}
                    ReqsFromYouPubKeys={this.props.ReqsFromYouPubKeys}
                    // ReqsFromYouNames={this.props.ReqsFromYouNames}
                    ReqsFromYouResponses={this.props.ReqsFromYouResponses}
                    showOrders2PartyReqModal={
                      this.props.showOrders2PartyReqModal
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

export default OrdersPage;
