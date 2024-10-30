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
        {this.props.WALLET_sendSuccess &&
        !this.props.WALLET_sendMsgSuccess &&
        !this.props.WALLET_sendMsgFailure ? (
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
              {this.props.WALLET_sendToName !== "" &&
              this.props.WALLET_messageToSend !== "" ? (
                <p>Sending payment message..</p>
              ) : (
                <></>
              )}
            </Alert>
          </>
        ) : (
          <></>
        )}
        {this.props.WALLET_sendSuccess && this.props.WALLET_sendMsgSuccess ? (
          <>
            <p></p>
            <Alert
              variant="success"
              onClose={() => this.props.handleSuccessAlert_WALLET()}
              dismissible
            >
              <Alert.Heading>Payment & Message Success!</Alert.Heading>
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
        {this.props.WALLET_sendMsgFailure ? (
          <>
            <p></p>
            <Alert
              variant="danger"
              onClose={() => this.props.handleFailureMsgAlert_WALLET()}
              dismissible
            >
              <Alert.Heading>Message Failed</Alert.Heading>
              <p>You have run into a platform error or insufficient credits.</p>
              <p>
                Go the <b>View TXs</b> to resend message. This will be part of{" "}
                <b>Detailed</b> in the future.
              </p>
            </Alert>
          </>
        ) : (
          <></>
        )}

        {this.props.WALLET_sendPmtMsgFailure ? (
          <>
            <p></p>
            <Alert
              variant="danger"
              onClose={() => this.props.handleFailurePmtMsgAlert_WALLET()}
              dismissible
            >
              <Alert.Heading>Message Failed</Alert.Heading>
              <p>
                You have run into a platform error or have insufficient credits.
              </p>
            </Alert>
          </>
        ) : (
          <></>
        )}

        {this.props.WALLET_sendPmtMsgSuccess ? (
          <>
            <p></p>
            <Alert
              variant="success"
              onClose={() => this.props.handleSuccessPmtMsgAlert_WALLET()}
              dismissible
            >
              <Alert.Heading>Payment Request Success!</Alert.Heading>
              <p>
                You have successfully requested{" "}
                <b>
                  {handleDenomDisplay(
                    this.props.whichNetwork,
                    this.props.WALLET_amountToSend
                  )}
                </b>{" "}
                from <b>{this.props.WALLET_sendToName} !</b>
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
