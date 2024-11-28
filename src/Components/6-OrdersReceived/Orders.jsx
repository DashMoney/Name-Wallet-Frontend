import React from "react";
import Form from "react-bootstrap/Form";

import Order from "./Order";

class Orders extends React.Component {
  // constructor(props) {  //MOVED TO APP STATE
  //   super(props);
  //   this.state = {
  //     DisplayOrders: "Orders", //Payment Schedule
  //   };
  // }

  handleOrderFilter = (selected) => {
    this.props.handleMerchantOrdersFilter(selected);
  };

  onChange = (event) => {
    //Payment Schedule
    if (event.target.id === "formOrderFilter") {
      event.stopPropagation();
      this.handleOrderFilter(event.target.value);
    }
  };

  render() {
    let today = new Date();
    let yesterday = new Date(today);

    yesterday.setDate(yesterday.getDate() - 1);

    let unconfirmedOrders = [];
    let confirmedOrders = [];

    this.props.UnconfirmedOrders.forEach((order) => {
      let bool = this.props.ConfirmedOrders.some(
        (confirm) => confirm.orderId === order.$id
      );
      if (bool) {
        confirmedOrders.push(order);
      } else {
        unconfirmedOrders.push(order);
      }
    });

    let orders = [];

    if (this.props.DisplayOrders === "Orders") {
      orders = unconfirmedOrders.map((order, index) => {
        //console.log(post);
        return (
          <div key={index} style={{ marginBottom: "0.5rem" }}>
            <Order
              whichNetwork={this.props.whichNetwork}
              //key={index}

              mode={this.props.mode}
              index={index}
              order={order}
              today={today}
              yesterday={yesterday}
              identity={this.props.identity} //For if my review so can edit
              uniqueName={this.props.uniqueName}
              handleConfirmOrderModal={this.props.handleConfirmOrderModal}
              //
              DisplayOrders={this.props.DisplayOrders}
              handleSelectedYourOrder={this.props.handleSelectedYourOrder}
              handleSelectedPage={this.props.handleSelectedPage}
              handleSelectedItem={this.props.handleSelectedItem}
              Inventory={this.props.Inventory}
              // UnconfirmedOrders={this.props.UnconfirmedOrders}
              ConfirmedOrders={this.props.ConfirmedOrders}
              OrdersControllers={this.props.OrdersControllers}
              OrdersProxies={this.props.OrdersProxies}
              OrdersNames={this.props.OrdersNames}
            />
          </div>
        );
      });
    }

    if (this.props.DisplayOrders === "Confirmed") {
      orders = confirmedOrders.map((order, index) => {
        //console.log(post);
        return (
          <div key={index} style={{ marginBottom: "0.1rem" }}>
            <Order
              whichNetwork={this.props.whichNetwork}
              //key={index}
              mode={this.props.mode}
              index={index}
              order={order}
              today={today}
              yesterday={yesterday}
              identity={this.props.identity} //For if my review so can edit
              uniqueName={this.props.uniqueName}
              handleConfirmOrderModal={this.props.handleConfirmOrderModal}
              handleMerchantReplyModalShow={
                this.props.handleMerchantReplyModalShow
              }
              //
              DisplayOrders={this.props.DisplayOrders}
              handleSelectedYourOrder={this.props.handleSelectedYourOrder}
              handleSelectedPage={this.props.handleSelectedPage}
              handleSelectedItem={this.props.handleSelectedItem}
              Inventory={this.props.Inventory}
              // UnconfirmedOrders={this.props.UnconfirmedOrders}
              ConfirmedOrders={this.props.ConfirmedOrders}
              OrdersControllers={this.props.OrdersControllers}
              OrdersProxies={this.props.OrdersProxies}
              OrdersNames={this.props.OrdersNames}
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
              //
              showOrders2PartyReqModal={this.props.showOrders2PartyReqModal}
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

          <Form.Group className="mb-3" controlId="formOrderFilter">
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
              defaultValue={this.props.DisplayOrders}
            >
              <option value="Orders" style={{ fontWeight: "bold" }}>
                Orders (Unconfirmed)
              </option>
              <option value="Confirmed" style={{ fontWeight: "bold" }}>
                Confirmed
              </option>
            </Form.Select>
          </Form.Group>
        </Form>

        <p></p>
        {this.props.DisplayOrders === "Orders" ? <>{orders}</> : <></>}
        {this.props.DisplayOrders === "Orders" &&
        unconfirmedOrders.length === 0 ? (
          <>
            <p style={{ textAlign: "center" }}>
              There are no unconfirmed orders at this time.
            </p>
          </>
        ) : (
          <></>
        )}
        {this.props.DisplayOrders === "Confirmed" ? <>{orders}</> : <> </>}
        {this.props.DisplayOrders === "Confirmed" &&
        confirmedOrders.length === 0 ? (
          <>
            {" "}
            <p style={{ textAlign: "center" }}>
              This is where confirmed orders will appear.
            </p>
          </>
        ) : (
          <> </>
        )}
      </>
    );
  }
}

export default Orders;
