import React from "react";

import Badge from "react-bootstrap/Badge";

/**
 * So this will have the credits display and able to click to TopUp and then the modal will have the walletbalance and topup Function
 *
 */

/* 
<CreditsOnPage
identityInfo={this.props.identityInfo}
uniqueName={this.props.uniqueName}
showModal={this.props.showModal}
/>
*/

class CreditsOnPage extends React.Component {
  handleCreditsToTopup = () => {
    let topUpAmt = (this.props.identityInfo.balance / 1000000000).toFixed(2);
    return topUpAmt;
  };

  render() {
    return (
      <>
        {this.props.identityInfo === "" ? (
          <div className="ms-2 me-auto">
            <div className="id-line">
              <h5>
                <Badge bg="primary">{this.props.uniqueName}</Badge>
              </h5>
              <p>
                <Badge className="paddingBadge" bg="primary" pill>
                  Loading..
                </Badge>
              </p>
            </div>
          </div>
        ) : (
          <></>
        )}

        {this.props.identityInfo !== "" &&
        this.props.identityInfo.balance > 450000000 ? (
          // <div className="ms-2 me-auto">
          <div className="id-line">
            <h5>
              <Badge bg="primary">{this.props.uniqueName}</Badge>
            </h5>
            <p>
              <Badge className="paddingBadge" bg="primary" pill>
                {/* {this.props.identityInfo.balance} Credits */}
                {this.handleCreditsToTopup()} TopUps of Credits
              </Badge>
            </p>
          </div>
        ) : (
          // </div>
          <></>
        )}

        {this.props.identityInfo !== "" &&
        this.props.identityInfo.balance <= 450000000 ? (
          <div
            className="id-line"
            onClick={() => this.props.showModal("TopUpIdentityModal")}
          >
            <>
              <h5>
                <Badge className="paddingBadge" bg="danger">
                  Platform Credits : Low!
                </Badge>
              </h5>
            </>
            <>
              <p></p>
              <h5>
                <Badge className="paddingBadge" bg="danger" pill>
                  {/* {this.props.identityInfo.balance} */}
                  {this.handleCreditsToTopup()} TopUps of Credits
                </Badge>
              </h5>
            </>
          </div>
        ) : (
          <></>
        )}
      </>
    );
  }
}

export default CreditsOnPage;
