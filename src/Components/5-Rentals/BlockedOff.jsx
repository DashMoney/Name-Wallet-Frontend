import React from "react";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";

import handleDenomDisplay from "../UnitDisplay";
import formatDate from "../TimeDisplayLong";
import simpleDate from "../DateDisplay";

class BlockedOff extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //copiedName: false,
      copiedAddress: false,
    };
  }

  render() {
    let cardBkg;
    let cardText;

    if (this.props.mode === "primary") {
      cardBkg = "white";
      cardText = "dark";
    } else {
      cardBkg = "dark";
      cardText = "white";
    }

    let rental = this.props.Rentals.find((rental) => {
      return rental.$id === this.props.confirmBlock.rentalId;
    });

    return (
      <>
        <Card id="card" key={this.props.index} bg={cardBkg} text={cardText}>
          <Card.Body>
            <Card.Title className="cardTitle">
              <h5>
                {" "}
                <b //style={{ color: "#008de4" }}
                >
                  {rental.title}
                </b>
              </h5>

              <span className="textsmaller">
                {formatDate(
                  this.props.confirmBlock.$updatedAt,
                  this.props.today,
                  this.props.yesterday
                )}
              </span>
            </Card.Title>

            {rental.address !== undefined && rental.address !== "" ? (
              <div
                style={{
                  display: "flex",
                  alignContent: "baseline",
                  justifyContent: "space-between",
                  marginLeft: "1rem",
                  marginRight: "2rem",
                  marginBottom: "1rem",
                }}
              >
                <span style={{ whiteSpace: "pre-wrap" }}>{rental.address}</span>

                {/* <Button
                  variant="outline-primary"
                  onClick={() => {
                    navigator.clipboard.writeText(this.props.rental.address);
                    this.setState({
                      copiedAddress: true,
                    });
                  }}
                >
                  {this.state.copiedAddress ? <b>Copied!</b> : <b>Copy</b>}
                </Button> */}
              </div>
            ) : (
              <></>
            )}

            <p></p>
            {/* <div className="d-grid gap-2">
              <Button
                // size="lg"
                variant="primary"
                onClick={() => this.props.handleSelectedRental(rental)}
              >
                <b>View Rental</b>
              </Button>
            </div>
            <p></p> */}

            {/* ArriveDate*/}
            <p
              style={{
                marginTop: ".2rem",
                marginBottom: "0rem",
                color: "#008de4",
              }}
            >
              <b>Arrival</b>
            </p>

            <h5 style={{ textAlign: "center" }}>
              <b> {simpleDate(this.props.confirmBlock.arriveDate)}</b>{" "}
            </h5>

            {/* DepartDate*/}
            <p
              style={{
                marginTop: ".2rem",
                marginBottom: "0rem",
                color: "#008de4",
              }}
            >
              <b>Departure</b>
            </p>

            <h5 style={{ textAlign: "center" }}>
              <b> {simpleDate(this.props.confirmBlock.departDate)}</b>{" "}
            </h5>

            <p></p>
            <div className="d-grid gap-2">
              <Button
                variant="primary"
                onClick={() =>
                  this.props.handleDeleteBlockConfirmModal(
                    this.props.confirmBlock,
                    this.props.index
                  )
                }
              >
                <b>Delete Block Off</b>
              </Button>
            </div>
          </Card.Body>{" "}
        </Card>
      </>
    );
  }
}

export default BlockedOff;
