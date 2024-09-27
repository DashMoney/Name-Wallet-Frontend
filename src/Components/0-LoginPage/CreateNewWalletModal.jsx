import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";
import CloseButton from "react-bootstrap/CloseButton";
import "./CreateNewWalletModal.css";

import Dash from "dash";

class CreateNewWalletModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      response: {},
      copiedMnemonic: false,
      copiedAddress: false,
    };
  }

  createWallet = async () => {
    let clientOpts = {};
    if (this.props.whichNetwork === "mainnet") {
      clientOpts = {
        network: this.props.whichNetwork,
        dapiAddresses: [
          //'149.28.241.190:443',
          "134.255.182.186:443",
          "185.198.234.25:443",
        ],
        wallet: {
          mnemonic: null, // this indicates that we want a new wallet to be generated
          // if you want to get a new address for an existing wallet
          // replace 'null' with an existing wallet mnemonic
          offlineMode: true, // this indicates we don't want to sync the chain
          // it can only be used when the mnemonic is set to 'null'
        },
      };
    } else {
      clientOpts = {
        network: this.props.whichNetwork,

        wallet: {
          mnemonic: null, // this indicates that we want a new wallet to be generated
          // if you want to get a new address for an existing wallet
          // replace 'null' with an existing wallet mnemonic
          offlineMode: true, // this indicates we don't want to sync the chain
          // it can only be used when the mnemonic is set to 'null'
        },
      };
    }

    const client = new Dash.Client(clientOpts);
    const account = await client.getWalletAccount();

    const dashmnemonic = client.wallet.exportWallet();
    const dashaddress = account.getUnusedAddress();
    this.setState({
      response: { mnemonic: dashmnemonic, unusedAddress: dashaddress.address },
    });
    // console.log('Mnemonic:', dashmnemonic);
    // console.log('Unused Address:', dashaddress.address);
  };

  handleCloseClick = () => {
    this.props.hideModal();
  };

  componentDidMount() {
    this.createWallet();
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
      //modalBkg = "modal-backcolor-dark";
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
            <Modal.Title>Create New Wallet</Modal.Title>
            {closeButtonColor}
          </Modal.Header>

          <Modal.Body>
            <h5>Important:</h5>
            <p>
              <b>You will need to save the 12 word mnemonic!</b>{" "}
            </p>
            {this.props.whichNetwork === "testnet" ? (
              <>
                {" "}
                <p style={{ color: "yellow" }}>
                  <b>This site is currently operating on testnet!</b>
                </p>
              </>
            ) : (
              <></>
            )}
            <Alert variant="primary">
              <Alert.Heading>Mnemonic(12 words):</Alert.Heading>
              <p>{this.state.response.mnemonic}</p>
              <Button
                variant="outline-primary"
                onClick={() => {
                  navigator.clipboard.writeText(this.state.response.mnemonic);
                  this.setState({
                    copiedMnemonic: true,
                  });
                }}
              >
                <b>Copy</b>
              </Button>
              {this.state.copiedMnemonic ? <span>Copied!</span> : <></>}
            </Alert>

            <Alert variant="primary">
              <Alert.Heading>Address:</Alert.Heading>
              <p>{this.state.response.unusedAddress}</p>
              <Button
                variant="outline-primary"
                onClick={() => {
                  navigator.clipboard.writeText(
                    this.state.response.unusedAddress
                  );
                  this.setState({
                    copiedAddress: true,
                  });
                }}
              >
                <b>Copy</b>
              </Button>
              {this.state.copiedAddress ? <span>Copied!</span> : <></>}
            </Alert>

            <p>
              Use your <b>Address</b> and send some Dash to your wallet to be
              able to use Dash Platform!
            </p>

            <h6 style={{ textAlign: "center" }}>
              (<b>0.03 Dash</b> should be sufficient and is the wallet minimum
              for Identity Registration.)
            </h6>
            {/* <Alert variant="warning">
        When this window closes, all this info with go with it
          
        </Alert> */}
            {this.props.whichNetwork === "testnet" ? (
              <>
                {" "}
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

export default CreateNewWalletModal;
