import React from "react";

class AlertComponent extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {

  //   };
  // }

  render() {
    return (
      <>
        {this.props.WALLET_sendSuccess ? (
          <>
            <p></p>
            <Alert
              variant="success"
              onClose={() => this.props.handleSuccessAlert_WALLET()}
              dismissible
            >
              <Alert.Heading>Payment Successful!</Alert.Heading>
              <p>
                You have successfully sent{" "}
                <b>
                  {handleDenomDisplay(
                    this.props.whichNetwork,
                    this.props.WALLET_amountToSend
                  )}
                </b>{" "}
                to{" "}
                <b>
                  {this.props.WALLET_sendToName !== ""
                    ? this.props.WALLET_sendToName
                    : this.props.WALLET_sendToAddress}
                  !
                </b>
              </p>
            </Alert>
          </>
        ) : (
          <></>
        )}
        {this.props.WALLET_sendSuccess ? (
          <>
            <p></p>
            <Alert
              variant="success"
              onClose={() => this.props.handleSuccessAlert_WALLET()}
              dismissible
            >
              <Alert.Heading>Payment Success!</Alert.Heading>
              <p>
                You have successfully sent{" "}
                <b>
                  {handleDenomDisplay(
                    this.props.whichNetwork,
                    this.props.WALLET_amountToSend
                  )}
                </b>{" "}
                to{" "}
                <b>
                  {this.props.WALLET_sendToName !== ""
                    ? this.props.WALLET_sendToName
                    : this.props.WALLET_sendToAddress}
                  !
                </b>
              </p>
            </Alert>
          </>
        ) : (
          <></>
        )}

        {this.props.WALLET_sendFailure ? (
          <>
            <p></p>
            <Alert
              variant="danger"
              onClose={() => this.props.handleFailureAlert_WALLET()}
              dismissible
            >
              <Alert.Heading>Payment Failed</Alert.Heading>
              <p>
                Payment was not sent. If everything seems correct, please retry{" "}
                <b>Send Dash</b> to try again.
              </p>
            </Alert>
          </>
        ) : (
          <></>
        )}
      </>
    );
  }
}

export default AlertComponent;
