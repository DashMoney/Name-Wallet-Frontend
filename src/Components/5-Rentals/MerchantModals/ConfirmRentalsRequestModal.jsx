//NEED THE QUERY here and its a simple query because it should return empty!
import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import Spinner from "react-bootstrap/Spinner";
import CloseButton from "react-bootstrap/CloseButton";
import Alert from "react-bootstrap/Alert";

import handleDenomDisplay from "../../UnitDisplay";

import simpleDate from "../../DateDisplay";

//import "./ConfirmPaymentModal.css";

import dapiClientNoWallet from "../../DapiClientNoWallet";

import Dash from "dash";

const {
  // Essentials: { Buffer },
  PlatformProtocol: { Identifier },
} = Dash;

class ConfirmRentalsRequestModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      LoadingConfirms: true,
      Confirm1: false,
      Confirm2: false,

      loadTime: 3, //set to 4 when successful dgm addr and call
      priorConfirm: false, //Logic of Good to Go so want true <-
      subsequentConfirm: false,
      // confirmDocuments: [],
    };
  }

  handleCloseClick = () => {
    this.props.hideModal();
  };

  decrementTimer = () => {
    this.setState({
      loadTime: this.state.loadTime - 1,
    });
    if (this.state.loadTime >= 1) {
      const myTimeout = setTimeout(this.decrementTimer, 1000);
    }
  };

  startConfirmRace = (theStart, theEnd) => {
    this.getPriorConfirm(theStart);
    this.getSubsequentConfirm(theStart, theEnd);
  };

  confirmsRace = () => {
    if (this.state.Confirm1 && this.state.Confirm2) {
      this.setState(
        {
          Confirm1: false,
          Confirm2: false,

          LoadingConfirms: false,
        },
        () => this.decrementTimer()
      );
    }
  };

  getPriorConfirm = (startDate) => {
    //console.log("Calling getConfirms");
    // if (!this.state.LoadingConfirms) {
    //   this.setState({ LoadingConfirms: true });
    // }

    const client = new Dash.Client(dapiClientNoWallet(this.props.whichNetwork));

    const getDocuments = async () => {
      return client.platform.documents.get("RENTALSContract.confirm", {
        limit: 1,
        where: [
          ["$ownerId", "==", this.props.MerchantId],
          ["rentalId", "==", this.props.SelectedRental.$id],
          ["arriveDate", "<=", startDate],
        ],
        orderBy: [["arriveDate", "asc"]],
      });
    };
    // Only one range operator is allowed in a query (except for between behavior)
    // Sorting must be by the last indexed property

    getDocuments()
      .then((d) => {
        if (d.length === 0) {
          console.log("There are no Confirms");

          this.setState(
            {
              Confirm1: true,
              priorConfirm: true,
            },
            () => this.confirmsRace()
          );
        } else {
          let docArray = [];
          console.log("Getting Confirms");

          for (const n of d) {
            let returnedDoc = n.toJSON();
            //console.log("Confirm:\n", returnedDoc);
            returnedDoc.reqId = Identifier.from(
              returnedDoc.reqId,
              "base64"
            ).toJSON();
            // console.log("newConfirm:\n", returnedDoc);
            docArray = [...docArray, returnedDoc];
          }
          //IS THE DEPARTURE DATE AFTER THE ARRIVAL DATE?
          let overlap = docArray.find((doc) => {
            return doc.departDate > startDate;
          });

          if (overlap === undefined) {
            this.setState(
              {
                Confirm1: true,
                priorConfirm: true,
              },
              () => this.confirmsRace()
            );
          } else {
            this.setState(
              {
                Confirm1: true,
                priorConfirm: false,
              },
              () => this.confirmsRace()
            );
          }
        }
      })
      .catch((e) => console.error("Something went wrong:\n", e))
      .finally(() => client.disconnect());
  };

  getSubsequentConfirm = (startDate, endDate) => {
    //console.log("Calling getSubsequentConfirms");

    const client = new Dash.Client(dapiClientNoWallet(this.props.whichNetwork));

    const getDocuments = async () => {
      return client.platform.documents.get("RENTALSContract.confirm", {
        limit: 1,
        where: [
          ["$ownerId", "==", this.props.MerchantId],
          ["rentalId", "==", this.props.SelectedRental.$id],
          ["arriveDate", ">=", startDate], //24 * 60 * 60 * 1000
        ],
        orderBy: [["arriveDate", "desc"]],
      });
    };
    // Only one range operator is allowed in a query (except for between behavior)
    // Sorting must be by the last indexed property

    getDocuments()
      .then((d) => {
        if (d.length === 0) {
          console.log("There are no Confirms");

          this.setState(
            {
              Confirm2: true,
              subsequentConfirm: true,
            },
            () => this.confirmsRace()
          );
        } else {
          let docArray = [];
          //console.log("Getting Confirms");

          for (const n of d) {
            let returnedDoc = n.toJSON();
            //console.log("Confirm:\n", returnedDoc);
            returnedDoc.reqId = Identifier.from(
              returnedDoc.reqId,
              "base64"
            ).toJSON();
            console.log("newConfirm:\n", returnedDoc);
            docArray = [...docArray, returnedDoc];
          }

          //IS THE DEPARTURE DATE AFTER THE ARRIVAL DATE?
          let overlap = docArray.find((doc) => {
            return doc.arriveDate < endDate || doc.arriveDate === startDate;
          });

          if (overlap === undefined) {
            this.setState(
              {
                Confirm2: true,
                subsequentConfirm: true,
              },
              () => this.confirmsRace()
            );
          } else {
            this.setState(
              {
                Confirm2: true,
                subsequentConfirm: false,
              },
              () => this.confirmsRace()
            );
          }
        }
      })
      .catch((e) => console.error("Something went wrong:\n", e))
      .finally(() => client.disconnect());
  };

  handleSubmitClick = (event) => {
    event.preventDefault();

    this.props.createConfirmRequest();

    this.handleCloseClick();
  };

  componentDidMount = () => {
    this.startConfirmRace(
      this.props.request.arriveDate,
      this.props.request.departDate
    );
    //console.log(this.props.request.arriveDate);
  };

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

    let numOfDays = (
      (this.props.request.departDate - this.props.request.arriveDate) /
      86400000
    ).toFixed(0);
    // console.log(`Number of Days: ${numOfDays}`);

    let calcAmt = Number(
      (Number(this.props.SelectedRental.rate) * Number(numOfDays)).toFixed(0)
    );
    // console.log(`Calculated Amt: ${calcAmt}`);
    // console.log(`Request Amt: ${this.props.request.amt}`);

    //HAVE TO CONFIRM THE AMOUNT HERE TO CHECK ->

    //can use the calcAmt
    // have to pass the request
    // will have to change the StartDate and EndDate to the request data ->

    let amtVerified = this.props.request.amt === calcAmt;
    //console.log(amtVerified);
    let wasRentalDocUpdated = true;
    //if amtVerified does not match
    if (!amtVerified) {
      if (
        this.props.SelectedRental.$updatedAt < this.props.request.$updatedAt
      ) {
        wasRentalDocUpdated = false;
      }
      // if not before then DENY === amtVerified=false && wasRentalDocUpdated=false
      // if after then allow&ALERT === amtVerified=false && wasRentalDocUpdated=true
    }

    return (
      <>
        <Modal
          contentClassName={modalBkg}
          backdropClassName={modalBackdrop}
          show={this.props.isModalShowing}
        >
          <Modal.Header>
            <Modal.Title>Confirm Reservation</Modal.Title>
            {closeButtonColor}
          </Modal.Header>
          <Modal.Body>
            {this.state.LoadingConfirms ? (
              <>
                <p></p>
                <div id="spinner">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
                <p></p>
              </>
            ) : (
              <></>
            )}
            {/* priorConfirm: false, //Logic of Good to Go so want true <-
      subsequentConfirm: false, */}
            {(!this.state.priorConfirm || !this.state.subsequentConfirm) &&
            !this.state.LoadingConfirms ? (
              <>
                <p>
                  There is already a scheduled reservation in this date window.
                  Please select a different date range.
                </p>

                <p></p>
              </>
            ) : (
              <></>
            )}
            {/* priorConfirm: false, //Logic of Good to Go so want true <-
      subsequentConfirm: false, */}
            {this.state.priorConfirm &&
            this.state.subsequentConfirm &&
            !this.state.LoadingConfirms ? (
              <>
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
                  <b> {simpleDate(this.props.request.arriveDate)}</b>{" "}
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
                  <b> {simpleDate(this.props.request.departDate)}</b>{" "}
                </h5>

                {/* Amount */}

                <h4
                  style={{
                    marginTop: "1.5rem",
                    marginBottom: "2rem",
                    textAlign: "center",
                  }}
                >
                  Total Cost{" "}
                  <b style={{ marginLeft: "1rem", color: "#008de4" }}>
                    {handleDenomDisplay(
                      this.props.whichNetwork,
                      this.props.request.amt
                    )}
                  </b>
                </h4>
                <p></p>
              </>
            ) : (
              <></>
            )}

            {!amtVerified &&
            wasRentalDocUpdated &&
            !this.state.LoadingConfirms ? (
              <>
                <Alert variant="danger">
                  <Alert.Heading>Request Amount (Warning)</Alert.Heading>
                  <p>
                    The <b>Total Amount</b> from the <b>Request does Not</b>{" "}
                    match the <b>current Rental Rate</b>.
                  </p>
                  <p>
                    Request was made prior to the latest Rental update/edit.
                  </p>
                  <p style={{ textAlign: "center" }}>
                    <b>*Confirm Only after You have Verified.*</b>
                  </p>
                </Alert>

                <p></p>
              </>
            ) : (
              <></>
            )}
            {!amtVerified &&
            !wasRentalDocUpdated &&
            !this.state.LoadingConfirms ? (
              <>
                <Alert variant="danger">
                  <Alert.Heading>Request Amount Failure</Alert.Heading>
                  <p>
                    The <b>Total Amount</b> from the <b>Request does Not</b>
                    match the <b>current Rental Rate</b>.
                  </p>
                  <p>
                    Request was <b>Not</b> made prior to the latest Rental
                    update/edit.
                  </p>
                  <p style={{ textAlign: "center" }}>
                    <b>*Customer must resubmit request properly*</b>
                  </p>
                </Alert>

                <p></p>
              </>
            ) : (
              <></>
            )}
          </Modal.Body>
          <Modal.Footer>
            <>
              {this.state.priorConfirm && this.state.subsequentConfirm ? (
                <>
                  {amtVerified ? (
                    <>
                      {this.state.LoadingConfirms ||
                      this.state.loadTime >= 1 ? (
                        <Button variant="primary" disabled>
                          <b>Confirm ({this.state.loadTime})</b>
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          onClick={this.handleSubmitClick}
                        >
                          <b>Confirm</b>
                        </Button>
                      )}
                    </>
                  ) : (
                    <>
                      {wasRentalDocUpdated ? (
                        <>
                          {this.state.LoadingConfirms ||
                          this.state.loadTime >= 1 ? (
                            <Button variant="primary" disabled>
                              <b>Verify and Confirm ({this.state.loadTime})</b>
                            </Button>
                          ) : (
                            <Button
                              variant="primary"
                              onClick={this.handleSubmitClick}
                            >
                              <b>Verify and Confirm</b>
                            </Button>
                          )}
                        </>
                      ) : (
                        <>
                          <Button variant="primary" disabled>
                            <b>Unable to Confirm</b>
                          </Button>
                        </>
                      )}
                    </>
                  )}
                </>
              ) : (
                <Button variant="primary" disabled>
                  <b>Confirm</b>
                </Button>
              )}
            </>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default ConfirmRentalsRequestModal;
