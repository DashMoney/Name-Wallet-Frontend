import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
//import Alert from "react-bootstrap/Alert";
import handleDenomDisplay from "../UnitDisplay";

import CreditsOnPage from "../CreditsOnPage";
import TwoPartyCombine from "./TwoPartyCombine";

import "../../App.css";

class TwoPartyPage extends React.Component {
  componentDidMount() {
    this.props.pullInitialTrigger2Party();
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

                      {this.props.is2PartyRefreshReady ? (
                        <Button
                          variant="primary"
                          onClick={() => {
                            this.props.handleRefresh_2Party();
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

              <div
                //className="cardTitle"
                style={{ textAlign: "center" }}
              >
                <h2>
                  <b>2-Party Pay</b>
                </h2>
              </div>

              {this.props.isLoading2Party ? (
                <>
                  <p></p>
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

              {this.props.Your2PartyPubKey === "No Pub Key" &&
              !this.props.isLoading2Party ? (
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

              {/* {this.props.Your2PartyPubKey === "Querying" &&
          this.props.isLoading2Party ? (
            <>
              <div className="d-grid gap-2" style={{ margin: "1rem" }}>
                <Button variant="success" size="lg" disabled>
                  <b>Enable "2-Party" Pay</b>
                </Button>
              </div>
            </>
          ) : (
            <></>
          )} */}

              {this.props.Your2PartyPubKey !== "Querying" &&
              this.props.Your2PartyPubKey !== "No Pub Key" &&
              !this.props.isLoading2Party ? (
                <>
                  <div className="d-grid gap-2" style={{ margin: "1rem" }}>
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() =>
                        this.props.handleSelectedDapp("2-PartyRequest")
                      }
                    >
                      <b>Make Request</b>
                    </Button>
                  </div>
                </>
              ) : (
                <></>
              )}
            </Col>
          </Row>
          {/* BELOW - Both Requests*/}
          {/* Dont need the wallet bc request and paidthrs just function on msgs */}
          {this.props.Your2PartyPubKey === "No Pub Key" ||
          this.props.isLoading2Party ? (
            <></>
          ) : (
            <>
              <TwoPartyCombine
                mnemonic={this.props.mnemonic}
                DisplayReqsOrPmts={this.props.DisplayReqsOrPmts}
                handleReqsOrPmtsFilter={this.props.handleReqsOrPmtsFilter}
                whichNetwork={this.props.whichNetwork}
                mode={this.props.mode}
                identity={this.props.identity}
                uniqueName={this.props.uniqueName}
                //presentModal={this.state.presentModal}
                accountHistory={this.props.accountHistory}
                accountBalance={this.props.accountBalance}
                Your2PartyPubKey={this.props.Your2PartyPubKey}
                ReqsFromYou={this.props.ReqsFromYou}
                ReqsFromYouPubKeys={this.props.ReqsFromYouPubKeys}
                ReqsFromYouNames={this.props.ReqsFromYouNames}
                ReqsFromYouResponses={this.props.ReqsFromYouResponses}
                ReqsToYou={this.props.ReqsToYou}
                ReqsToYouPubKeys={this.props.ReqsToYouPubKeys}
                ReqsToYouNames={this.props.ReqsToYouNames}
                ReqsToYouResponses={this.props.ReqsToYouResponses}
                show2PartyPayRequestModal={this.props.show2PartyPayRequestModal}
                showReleaseFundsModal={this.props.showReleaseFundsModal}
                showRetrieveFundsModal={this.props.showRetrieveFundsModal}
                showAddMsgToRequestModal={this.props.showAddMsgToRequestModal}
                showAddMessageToResponseModal={
                  this.props.showAddMessageToResponseModal
                }
                showRefundFundsModal={this.props.showRefundFundsModal}
                showWithdrawRefundModal={this.props.showWithdrawRefundModal}
                alreadySentCreateResponse={this.props.alreadySentCreateResponse}
                //showRejectReplyReqModal={this.props.showRejectReplyReqModal}
              />
            </>
          )}
        </div>
      </>
    );
  }
}

export default TwoPartyPage;
