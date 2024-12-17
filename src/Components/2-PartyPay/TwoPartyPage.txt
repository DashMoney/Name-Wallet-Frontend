import React from "react";
//import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";

class TwoPartyPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <>
        <div className="bodytext" id="easyReadText">
          {/* <div style={{ textAlign: "right" }}>
            <Button
              variant="primary"
              size="sm"
              onClick={() => this.props.handleSelectedDapp("Login")}
            >
              <b> Go to Decentralized Frontend</b>
            </Button>
          </div> */}

          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <h3 style={{ color: "#008de4" }}>
              <b>Dash "2-Party" Pay</b>
            </h3>
          </div>
          <p></p>
          <p>
            Facilitates transactions between 2 parties who are at a distance
            that don’t trust each other but want too. They just need somewhere,
            they can meet in the middle.
          </p>

          <h6 style={{ marginTop: "1.5rem", color: "#008de4" }}>
            <b>How it works</b>
          </h6>
          <p style={{ paddingLeft: ".6rem", paddingRight: ".6rem" }}>
            You sign into a Merchant Frontend with your Proxy account. You place
            an order to the merchant, let’s say for 2.5 Dash. The merchant then
            accepts the orders and sends a payment request to the 2-Party Pay
            dapp (here).
          </p>
          <p style={{ paddingLeft: ".6rem", paddingRight: ".6rem" }}>
            Instead of sending funds directly to the merchant,
            <b> you create a multisig wallet together!</b>
          </p>
          <p style={{ paddingLeft: ".6rem", paddingRight: ".6rem" }}>
            The multisig wallet is a 2 of 2. This is where it gets interesting.
            You send 2.5 Dash to the multisig wallet.
          </p>
          <p style={{ paddingLeft: ".6rem", paddingRight: ".6rem" }}>
            {" "}
            The merchant can then see in their Name-Wallet that you(the
            customer) have sent the Dash to the multisig, and the merchant can
            send/give the good or service to you.
          </p>
          <p style={{ paddingLeft: ".6rem", paddingRight: ".6rem" }}>
            {" "}
            And once you receive whatever you have ordered, you sign the
            multisig TX, so the merchant can then receive the 2.5 Dash.
          </p>

          <p style={{ textAlign: "center", color: "#008de4" }}>
            All this is peer to peer. No 3rd Party!
          </p>
          <p style={{ marginTop: "1.5rem" }}>
            Additionally: This is all just push button for the users. (e.g.,
            Send Payment Request, Customer sends Dash to 2-Party, Customer signs
            to release funds. Merchant receives funds) It's straightforward.
            Dash 2-Party is not restricted to just online exchange, but also for
            property rentals as well or anything else.
          </p>
        </div>
      </>
    );
  }
}

export default TwoPartyPage;
