import React from "react";
import Form from "react-bootstrap/Form";

import SentRequestsComponent from "./SentRequestsComponent";
import PayRequestsComponent from "./PayRequestsComponent";

class TwoPartyCombine extends React.Component {
  // constructor(props) {  //MOVED TO APP STATE
  //   super(props);
  //   this.state = {
  //     DisplayOrders: "Orders", //Payment Schedule
  //   };
  // }

  onChange = (event) => {
    //Payment Schedule
    if (event.target.id === "formFilter") {
      event.stopPropagation();
      this.props.handleReqsOrPmtsFilter(event.target.value);
    }
  };

  render() {
    // let cardBkg;
    // let cardText;

    // if (this.props.mode === "primary") {
    //   cardBkg = "white";
    //   cardText = "dark";
    // } else {
    //   cardBkg = "dark";
    //   cardText = "white";
    // }

    let today = new Date();
    let yesterday = new Date(today);

    yesterday.setDate(yesterday.getDate() - 1);

    let payments = [];

    if (this.props.DisplayReqsOrPmts === "Payments") {
      payments = this.props.ReqsToYou.map((req, index) => {
        //console.log(req);
        return (
          <div key={index} style={{ marginBottom: "0.1rem" }}>
            <PayRequestsComponent
              mnemonic={this.props.mnemonic}
              whichNetwork={this.props.whichNetwork}
              //key={index}

              mode={this.props.mode}
              index={index}
              req={req}
              today={today}
              yesterday={yesterday}
              identity={this.props.identity} //For if my review so can edit
              uniqueName={this.props.uniqueName}
              accountHistory={this.props.accountHistory}
              accountBalance={this.props.accountBalance}
              //
              DisplayReqsOrPmts={this.props.DisplayReqsOrPmts}
              isLoading2Party={this.props.isLoading2Party}
              Your2PartyPubKey={this.props.Your2PartyPubKey}
              ReqsToYou={this.props.ReqsToYou}
              ReqsToYouPubKeys={this.props.ReqsToYouPubKeys}
              ReqsToYouNames={this.props.ReqsToYouNames}
              ReqsToYouResponses={this.props.ReqsToYouResponses}
              show2PartyPayRequestModal={this.props.show2PartyPayRequestModal}
              showReleaseFundsModal={this.props.showReleaseFundsModal}
              showAddMessageToResponseModal={
                this.props.showAddMessageToResponseModal
              }
              showWithdrawRefundModal={this.props.showWithdrawRefundModal}
            />
          </div>
        );
      });
    }

    let requests = [];

    if (this.props.DisplayReqsOrPmts === "Requests") {
      requests = this.props.ReqsFromYou.map((req, index) => {
        //console.log(post);
        return (
          <div key={index} style={{ marginBottom: "0.1rem" }}>
            <SentRequestsComponent
              mnemonic={this.props.mnemonic}
              whichNetwork={this.props.whichNetwork}
              //key={index}
              mode={this.props.mode}
              index={index}
              req={req}
              today={today}
              yesterday={yesterday}
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
              ReqsFromYouNames={this.props.ReqsFromYouNames}
              ReqsFromYouResponses={this.props.ReqsFromYouResponses}
              showRetrieveFundsModal={this.props.showRetrieveFundsModal}
              showAddMsgToRequestModal={this.props.showAddMsgToRequestModal}
              showRefundFundsModal={this.props.showRefundFundsModal}
            />
          </div>
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
        <Form
          noValidate
          // onSubmit={this.handleSubmitClick}
          onChange={this.onChange}
        >
          {/* ORDER FILTER FORM BELOW */}

          <Form.Group className="mb-3" controlId="formFilter">
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
              defaultValue={this.props.DisplayReqsOrPmts}
            >
              <option value="Payments" style={{ fontWeight: "bold" }}>
                Your Payments
              </option>
              <option value="Requests" style={{ fontWeight: "bold" }}>
                Your Requests
              </option>
            </Form.Select>
          </Form.Group>
        </Form>

        <p></p>
        {this.props.DisplayReqsOrPmts === "Payments" ? <>{payments}</> : <></>}
        {this.props.DisplayReqsOrPmts === "Payments" &&
        this.props.ReqsToYou.length === 0 ? (
          <>
            <p style={{ textAlign: "center" }}>
              No one has requested a payment from you at this time.
            </p>
          </>
        ) : (
          <></>
        )}
        {this.props.DisplayReqsOrPmts === "Requests" ? <>{requests}</> : <> </>}
        {this.props.DisplayReqsOrPmts === "Requests" &&
        this.props.ReqsFromYou.length === 0 ? (
          <>
            {" "}
            <p style={{ textAlign: "center" }}>
              Requests you have sent to others will appear here.
            </p>
          </>
        ) : (
          <> </>
        )}
      </>
    );
  }
}

export default TwoPartyCombine;
