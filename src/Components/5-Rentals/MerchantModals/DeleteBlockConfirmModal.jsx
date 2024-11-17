//NEED THE QUERY here and its a simple query because it should return empty!
import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import Spinner from "react-bootstrap/Spinner";
import CloseButton from "react-bootstrap/CloseButton";

import handleDenomDisplay from "../../UnitDisplay";

import simpleDate from "../../DateDisplay";

//import "./ConfirmPaymentModal.css";

class DeleteBlockConfirmModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copiedName: false,

      loadTime: 3, //set to 4 when successful dgm addr and call
    };
  }

  handleNameClick = (nameLabel) => {
    navigator.clipboard.writeText(nameLabel);
    this.setState({
      copiedName: true,
    });
  };

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

  handleSubmitClick = (event) => {
    event.preventDefault();

    this.props.deleteBlockConfirm();

    this.handleCloseClick();
  };

  componentDidMount = () => {
    this.decrementTimer();
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

    // let numOfDays = (
    //   (this.props.selectedRequest.departDate -
    //     this.props.selectedRequest.arriveDate) /
    //   86400000
    // ).toFixed(0);
    // // console.log(`Number of Days: ${numOfDays}`);
    // let calcAmt = (
    //   Number(this.props.SelectedRental.rate) * Number(numOfDays)
    // ).toFixed(0);
    //  console.log(`Calculated Amt: ${calcAmt}`);
    return (
      <>
        <Modal
          contentClassName={modalBkg}
          backdropClassName={modalBackdrop}
          show={this.props.isModalShowing}
        >
          <Modal.Header>
            <Modal.Title>Delete Block Confirm</Modal.Title>
            {closeButtonColor}
          </Modal.Header>
          <Modal.Body>
            {/* <h5>
              <span
                style={{
                  marginTop: ".2rem",
                  marginBottom: "0rem",
                }}
              >
                <b>Owner:</b>
              </span>
              <span
                style={{
                  color: "#008de3",
                  marginTop: ".2rem",
                  marginBottom: "0rem",
                }}
              >
                {" "}
                <b
                  onClick={() =>
                    this.handleNameClick(this.props.MerchantNameDoc.label)
                  }
                >
                  {this.props.MerchantNameDoc.label}
                </b>
              </span>
              <span>{this.state.copiedName ? <span>✅</span> : <></>}</span>
            </h5> 
            <p></p>*/}
            {/* {this.state.LoadingConfirms ? (
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
            )} */}

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
              <b> {simpleDate(this.props.selectedConfirm.arriveDate)}</b>{" "}
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
              <b> {simpleDate(this.props.selectedConfirm.departDate)}</b>{" "}
            </h5>

            {/* Amount */}

            {/* <h4
              style={{
                marginTop: "1.5rem",
                marginBottom: "2rem",
                textAlign: "center",
              }}
            >
              Total Cost{" "}
              <b style={{ marginLeft: "1rem", color: "#008de4" }}>
                {handleDenomDisplay(this.props.whichNetwork,Number(calcAmt))}
              </b>
            </h4> */}
          </Modal.Body>
          <Modal.Footer>
            {this.state.loadTime >= 1 ? (
              <Button variant="primary" disabled>
                <b>Delete Block Confirm ({this.state.loadTime})</b>
              </Button>
            ) : (
              <Button variant="primary" onClick={this.handleSubmitClick}>
                <b>Delete Block Confirm</b>
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default DeleteBlockConfirmModal;
