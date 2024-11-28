import React from "react";

import YourOrder from "./YourOrder";

class YourOrders extends React.Component {
  render() {
    let today = new Date();
    let yesterday = new Date(today);

    yesterday.setDate(yesterday.getDate() - 1);

    let orders = this.props.UnconfirmedOrders.map((order, index) => {
      //console.log(post);
      return (
        <div key={index} style={{ marginBottom: "0.5rem" }}>
          <YourOrder
            //key={index}
            whichNetwork={this.props.whichNetwork}
            mode={this.props.mode}
            index={index}
            order={order}
            today={today}
            yesterday={yesterday}
            identity={this.props.identity} //For if my review so can edit
            //

            YourOrdersNames={this.props.YourOrdersNames}
            uniqueName={this.props.uniqueName}
            //
            handleSelectedYourOrder={this.props.handleSelectedYourOrder}
            handleSelectedPage={this.props.handleSelectedPage}
            handleSelectedItem={this.props.handleSelectedItem}
            handleCustomerReplyModalShow={
              this.props.handleCustomerReplyModalShow
            }
            handleDeleteOrderModal={this.props.handleDeleteOrderModal}
            //

            YourOrdersInventories={this.props.YourOrdersInventories}
            UnconfirmedOrders={this.props.UnconfirmedOrders}
            ConfirmedOrders={this.props.ConfirmedOrders}
            //2PartyComponent - BELOW

            mnemonic={this.props.mnemonic}
            accountHistory={this.props.accountHistory}
            accountBalance={this.props.accountBalance}
            //
            //DisplayReqsOrPmts={this.props.DisplayReqsOrPmts}
            isLoading2Party={this.props.isLoading2Party}
            Your2PartyPubKey={this.props.Your2PartyPubKey}
            ReqsToYou={this.props.ReqsToYou}
            ReqsToYouPubKeys={this.props.ReqsToYouPubKeys}
            //ReqsToYouNames={this.props.ReqsToYouNames}
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

    return <>{orders}</>;
  }
}

export default YourOrders;
