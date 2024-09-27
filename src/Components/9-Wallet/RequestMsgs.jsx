import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import handleDenomDisplay from "../UnitDisplay";

import Threads from "./Threads";

class RequestMsgs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copiedName: false,
    };
  }

  handleNameClick = () => {
    navigator.clipboard.writeText(this.props.tuple[0].label);
    this.setState({
      copiedName: true,
    });
  };

  formatDate(theCreatedAt, today, yesterday) {
    let CreatedAt = new Date(theCreatedAt);

    const timeOptions = {
      hour: "numeric",
      minute: "2-digit", //numeric?
    };

    function isSameDay(date1, date2) {
      return (
        date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
      );
    }

    if (isSameDay(CreatedAt, today)) {
      // it's today
      return `Today at ${CreatedAt.toLocaleTimeString(undefined, timeOptions)}`;
    }

    if (isSameDay(CreatedAt, yesterday)) {
      // it was yesterday
      return `Yesterday at ${CreatedAt.toLocaleTimeString(
        undefined,
        timeOptions
      )}`;
    }
    let dateReturn = CreatedAt.toLocaleDateString().concat(
      "  ",
      CreatedAt.toLocaleTimeString(undefined, timeOptions)
    );
    return dateReturn;
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

    //NEW THING BELOW -> ADDING THREADS TO MSGS

    let threadDocs = this.props.tupleThreads.filter((doc) => {
      return doc.msgId === this.props.tuple[1].$id;
    }); //This ^^^ makes sure threads are for the intended msg

    threadDocs = threadDocs.filter((doc) => {
      return (
        doc.$ownerId === this.props.tuple[1].$ownerId ||
        doc.$ownerId === this.props.tuple[1].toId
      );
    }); //This ^^^ makes sure threads are from the sender or recipient

    //need to order the docs ->
    threadDocs = threadDocs.sort(function (a, b) {
      return a.$createdAt - b.$createdAt;
    });

    let threadsToDisplay = [];

    if (threadDocs.length > 0) {
      threadsToDisplay = threadDocs.map((thr, index) => {
        return (
          <Threads
            key={index}
            mode={this.props.mode}
            index={index}
            thr={thr}
            //msg = {this.props.tuple[1]}//need the tuple bc has the name
            tuple={this.props.tuple}
            today={this.props.today}
            yesterday={this.props.yesterday}
            identity={this.props.identity}
            uniqueName={this.props.uniqueName}
            // showModal={this.props.showModal}
            handleThread={this.props.handleThread}

            //ThreadsNames={this.props.ForYouThreadsNames}
            //Change ^^ to
          />
        );
      });
    }

    //END OF NEW THING

    return (
      <Card id="card" key={this.props.index} bg={cardBkg} text={cardText}>
        <Card.Body>
          <Card.Title className="cardTitle">
            {/* {this.props.identity === this.props.tuple[1].$ownerId ? (
              <>
                <div>
                  <span style={{ color: "red" }}>To: </span>{" "}
                  <span
                    style={{ color: "#008de4" }}
                    onClick={() => this.handleNameClick()}
                  >
                    {this.props.tuple[0].label}
                  </span>
                </div>
                <span>{this.state.copiedName ? <span>✅</span> : <></>}</span>
              </>
            ) : (
              <>
                <div>
                  <span style={{ color: "green" }}>From: </span>{" "}
                  <span
                    style={{ color: "#008de4" }}
                    onClick={() => this.handleNameClick()}
                  >
                    {this.props.tuple[0].label}
                  </span>
                 
                </div>
                <span>{this.state.copiedName ? <span>✅</span> : <></>}</span>
              </>
            )} */}

            <b
              style={{ color: "#008de4" }}
              onClick={() => this.handleNameClick()}
            >
              {this.props.tuple[0].label}
            </b>

            <span
              className="textsmaller" //style={{textAlign:'right'}}
            >
              {this.formatDate(
                this.props.tuple[1].$createdAt,
                this.props.today,
                this.props.yesterday
              )}
            </span>
          </Card.Title>
          {/* <h5>{this.props.tuple[0].label}</h5> */}
          <div
            style={{
              textAlign: "center",
              marginTop: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <h5
            //style={{ color: "green" }}
            //onClick={() => this.handleNameClick()}
            >
              <b style={{ color: "#008de4" }}>{this.props.tuple[0].label}</b>{" "}
              requests{" "}
              <b style={{ color: "#008de4" }}>
                {handleDenomDisplay(
                  this.props.whichNetwork,
                  this.props.tuple[1].amt
                )}
              </b>
            </h5>
          </div>
          {/* <Card.Text
          // onClick={() =>
          //   this.props.handleThread(
          //     this.props.tuple[1].$id,
          //     this.props.tuple[0].label
          //   )
          // }
          > */}

          <p style={{ marginTop: ".7rem", marginBottom: "2rem" }}>
            {this.props.tuple[1].msg}
          </p>

          <div className="TwoButtons">
            <Button
              variant="primary"
              style={{
                fontSize: "larger",
                paddingLeft: "1rem",
                paddingRight: "1rem",
              }}
              onClick={() =>
                this.props.showRejectReplyReqModal(
                  this.props.tuple[0],
                  this.props.tuple[1] //Pass PmtReqmsg bc need for msgId
                )
              }
            >
              <b>Other</b>
            </Button>
            <Button
              variant="primary"
              onClick={() =>
                this.props.showPayRequestModal(
                  this.props.tuple[0],
                  this.props.tuple[1] //Pass PmtReqmsg bc need for msgId
                )
              }
              //inputNameDoc, //name and OwnerId
              //inputNumber //Should already be in duffs
              style={{
                fontSize: "larger",
                paddingLeft: "2rem",
                paddingRight: "2rem",
              }}
            >
              <b>Pay</b>
            </Button>
          </div>
          {/* </Card.Text> */}
          <p></p>
          {threadsToDisplay}
        </Card.Body>
      </Card>
    );
  }
}

export default RequestMsgs;
