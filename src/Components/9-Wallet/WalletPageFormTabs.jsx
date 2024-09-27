import React from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";

class WalletPageFormTabs extends React.Component {
  render() {
    return (
      <>
        <p></p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {this.props.whichPayType === "Pay" ? (
            <ButtonGroup className="me-2" aria-label="offer-name">
              <Button variant="primary" style={{ textDecoration: "underline" }}>
                <b
                  style={{
                    fontSize: "larger",
                    paddingLeft: "1.5rem",
                    paddingRight: "1.5rem",
                  }}
                >
                  Pay
                </b>
              </Button>

              <Button
                variant="primary"
                onClick={this.props.triggerRequestButton}
              >
                <b
                  style={{
                    fontSize: "larger",
                    paddingLeft: ".7rem",
                    paddingRight: ".7rem",
                  }}
                >
                  Request
                </b>
              </Button>
            </ButtonGroup>
          ) : (
            <ButtonGroup className="me-2" aria-label="First group">
              <Button variant="primary" onClick={this.props.triggerPayButton}>
                <b
                  style={{
                    fontSize: "larger",
                    paddingLeft: "1.5rem",
                    paddingRight: "1.5rem",
                  }}
                >
                  Pay
                </b>
              </Button>

              <Button variant="primary" style={{ textDecoration: "underline" }}>
                <b
                  style={{
                    fontSize: "larger",
                    paddingLeft: ".7rem",
                    paddingRight: ".7rem",
                  }}
                >
                  Request
                </b>
              </Button>
            </ButtonGroup>
          )}
        </div>
        <p></p>
      </>
    );
  }
}

export default WalletPageFormTabs;
