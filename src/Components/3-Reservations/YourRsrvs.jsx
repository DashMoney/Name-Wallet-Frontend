import React from "react";

import YourRsrv from "./YourRsrv";

class YourRsrvs extends React.Component {
  render() {
    let today = new Date();
    let yesterday = new Date(today);

    yesterday.setDate(yesterday.getDate() - 1);

    let requests = this.props.RentalRequests.map((request, index) => {
      //console.log(post);
      return (
        <div key={index} style={{ marginBottom: "0.1rem" }}>
          <YourRsrv
            whichNetwork={this.props.whichNetwork}
            //key={index}
            mode={this.props.mode}
            index={index}
            request={request}
            today={today}
            yesterday={yesterday}
            identity={this.props.identity} //For if my review so can edit
            //
            RsrvsRentalsNames={this.props.RsrvsRentalsNames}
            uniqueName={this.props.uniqueName}
            //
            handleSelectedYourRsrv={this.props.handleSelectedYourRsrv}
            handleSelectedDapp={this.props.handleSelectedDapp}
            handleSelectedRental={this.props.handleSelectedRental}
            handleCustomerReplyModalShow={
              this.props.handleCustomerReplyModalShow
            }
            handleDeleteRequestModal={this.props.handleDeleteRequestModal}
            //
            Rentals={this.props.Rentals}
            RentalRequests={this.props.RentalRequests}
            RentalConfirms={this.props.RentalConfirms}
            mnemonic={this.props.mnemonic}
            isLoadingRsrvsRentals={this.props.isLoadingRsrvsRentals}
            isLoadingRsrvs2Party={this.props.isLoadingRsrvs2Party}
            //key={index}
            //2PartyComponent - BELOW
            //req={req}
            accountHistory={this.props.accountHistory}
            accountBalance={this.props.accountBalance}
            //
            DisplayReqsOrPmts={this.props.DisplayReqsOrPmts}
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

    return <>{requests}</>;
  }
}

export default YourRsrvs;
