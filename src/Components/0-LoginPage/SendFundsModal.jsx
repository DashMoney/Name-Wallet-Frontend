import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";
//import Spinner from "react-bootstrap/Spinner";
import CloseButton from "react-bootstrap/CloseButton";
import "./CreateNewWalletModal.css";

class SendFundsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      isLoading: true,
      response: {},
      copiedAddress: false,
    };
  }

  handleCloseClick = () => {
    this.props.hideModal();
  };

  componentDidMount() {
    this.props.closeTopNav();
  }

  render() {
    let modalBkg = "";
    let closeButtonColor;
    let modalBackdrop;

    if (this.props.mode === "primary") {
      modalBackdrop = "modal-backdrop-nochange";
      modalBkg = "modal-backcolor-primary";
      closeButtonColor = <CloseButton onClick={this.handleCloseClick} />;
    } else {
      modalBackdrop = "modal-backdrop-dark";
      modalBkg = "text-bg-dark";
      closeButtonColor = (
        <CloseButton onClick={this.handleCloseClick} variant="white" />
      );
    }

    return (
      <>
        <Modal
          show={this.props.isModalShowing}
          backdropClassName={modalBackdrop}
          contentClassName={modalBkg}
        >
          <Modal.Header>
            <Modal.Title>Send Funds to Wallet</Modal.Title>
            {closeButtonColor}
          </Modal.Header>

          <Modal.Body>
            {this.props.whichNetwork === "testnet" ? (
              <p>
                Use your <b>Wallet Address</b> and one of the Faucets below to
                send tDash (Testnet Dash) to your Wallet.
              </p>
            ) : (
              <p>
                Use your <b>Wallet Address</b> and send Dash to your Wallet
              </p>
            )}

            <Alert variant="primary">
              <Alert.Heading>Wallet Address:</Alert.Heading>
              <p>{this.props.accountAddress}</p>

              <Button
                variant="outline-primary"
                onClick={() => {
                  navigator.clipboard.writeText(this.props.accountAddress);
                  this.setState({
                    copiedAddress: true,
                  });
                }}
              >
                <b>Copy</b>
              </Button>
              {this.state.copiedAddress ? <span>Copied!</span> : <></>}
            </Alert>

            {/* <h5>Unused Address:</h5>
          <p className='importantText'>
          {this.state.response.unusedAddress}
          </p> */}
            <p></p>
            {this.props.whichNetwork === "testnet" ? (
              <>
                {" "}
                <p>
                  Use your <b>Address</b> and send some Dash to your account to
                  be able to use Dash Platform!
                </p>
                <h5>Dash Testnet Faucets:</h5>
                <ul>
                  <li>
                    <b>
                      <a
                        rel="noopener noreferrer"
                        target="_blank"
                        href="https://testnet-faucet.dash.org/"
                      >
                        testnet-faucet.dash.org/
                      </a>
                    </b>
                  </li>
                  <p></p>

                  <li>
                    <a
                      rel="noopener noreferrer"
                      target="_blank"
                      href="http://faucet.test.dash.crowdnode.io/"
                    >
                      <b>faucet.test.dash.crowdnode.io/</b>
                    </a>
                  </li>
                </ul>
                {/* <h5>Testnet Block Explorer:</h5>
        <ul>
          <li><a rel="noopener noreferrer" target="_blank" href = "https://testnet-insight.dashevo.org/insight/">https://testnet-insight.dashevo.org/insight/</a></li>
          
        </ul>
        <p>Enter your "unused address" (now used address) in the Block Explorer to check that you have received tDash.</p> */}
                {/* Using the faucet at https://testnet-faucet.dash.org/,   There is a block explorer running at https://testnet-insight.dashevo.org/insight/ which can be used to check confirmations. */}
              </>
            ) : (
              <></>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="primary" onClick={this.handleCloseClick}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default SendFundsModal;
