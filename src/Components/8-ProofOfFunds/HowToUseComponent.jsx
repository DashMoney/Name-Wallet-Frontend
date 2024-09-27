import React from "react";
import Button from "react-bootstrap/Button";

class HowToUseComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      howToUseInfo: false,
    };
  }

  handleHowToUseInfo = () => {
    if (this.state.howToUseInfo === false)
      this.setState({
        howToUseInfo: true,
      });
    else {
      this.setState({
        howToUseInfo: false,
      });
    }
  };

  render() {
    let buttonColor;

    if (this.props.mode === "primary") {
      buttonColor = "outline-dark";
    } else {
      buttonColor = "outline-light";
    }

    return (
      <>
      <div className="positionButton">
          <Button
            variant={buttonColor}
            onClick={() => {
              this.handleHowToUseInfo();
            }}
          >
            <h3>How to use..</h3>
          </Button>
        </div>

        {this.state.howToUseInfo ? (
          <>
            <p></p>
            <div className="indentStuff">

              <p><b>Proof Of Dash</b> is implemented such that the wallet with your funds is a different wallet than the one connected to this dapp.</p>
              <p>You will need to use the Dash Core wallet. It is assumed you have the knowledge of how to use the Dash Core wallet. If not, there is plenty of help in the <a rel="noopener noreferrer" target="_blank" href="https://docs.dash.org/en/stable/docs/user/wallets/dashcore/index.html">
            <b>Dash Documentation</b>
            </a>.</p>
              
              <p> The list of the steps below is a high level overview of the steps needed to use this dapp.</p>
              <ol>
                <li>
Have the address, where the amount of Dash is, you want to prove.
                </li>
                <li>
                  In the Dash Core wallet, go to <b>File</b> then click <b>Sign Message</b>.
                </li>
                <li>Copy the same <b>Address, Message, and Signature</b> from Dash Core wallet to the <b>Create Proof</b> when you are signed into this dapp.
                </li>
                
              </ol>
              <p>Now anyone can search your Dash Name and verify that you have the funds available.</p>
              
             
            </div>
          </>
        ) : (
          <></>
        )}
      
      </>
    );
  }
}
export default HowToUseComponent;
