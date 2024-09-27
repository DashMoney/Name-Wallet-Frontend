import React from "react";
//import Button from 'react-bootstrap/Button';
import Card from "react-bootstrap/Card";

import Threads from "./Threads";

class MsgForyou extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copiedName: false,
    };
  }

  handleNameClick = () => {
    navigator.clipboard.writeText(this.props.tuple[0]);
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

  checkIfShout = (msgDoc) => {
    if (msgDoc.sh === "out") {
      return <span className="textsmaller">SO</span>;
    } else {
      return <span className="textsmaller">DM</span>;
    }
  };

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
    /**
     * ForYouThreads={ForYouThreads}
       ForYouThreadsNames={ForYouThreadsNames}
     * 
     */

    let threadDocs = this.props.ForYouThreads.filter((doc) => {
      return doc.msgId === this.props.tuple[1].$id;
      //return Identifier.from(doc.msgId, 'base64').toJSON() === this.props.tuple[1].$id;
    });

    //need to order the docs ->
    threadDocs = threadDocs.sort(function (a, b) {
      return a.$createdAt - b.$createdAt;
    });

    let threadsToDisplay = [];

    if (threadDocs.length > 0) {
      threadsToDisplay = threadDocs.map((thr, index) => {
        return (
          <Threads
            isLoginComplete={this.props.isLoginComplete}
            key={index}
            mode={this.props.mode}
            index={index}
            thr={thr}
            msg={this.props.tuple[1]}
            today={this.props.today}
            yesterday={this.props.yesterday}
            identity={this.props.identity}
            uniqueName={this.props.uniqueName}
            // showModal={this.props.showModal}
            handleThread={this.props.handleThread}
            ThreadsNames={this.props.ForYouThreadsNames}
          />
        );
      });
    }

    //END OF NEW THING

    return (
      <Card id="card" key={this.props.index} bg={cardBkg} text={cardText}>
        <Card.Body>
          <Card.Title className="cardTitle">
            {this.props.uniqueName === this.props.tuple[0] ? (
              <b style={{ color: "#008de4" }}>{this.props.tuple[0]}</b>
            ) : (
              <>
                <b
                  style={{ color: "#008de4" }}
                  onClick={() => this.handleNameClick()}
                >
                  {this.props.tuple[0]}
                </b>
                <span>{this.state.copiedName ? <span>✅</span> : <></>}</span>
              </>
            )}

            {this.checkIfShout(this.props.tuple[1])}

            {/* 
          
          <Button variant="outline-primary" 
          onClick={()=> this.handleNameClick()          
          }
          >Copy</Button>
          {this.state.copiedName?<span>✅</span>:<></>} */}

            <span className="textsmaller">
              {this.formatDate(
                this.props.tuple[1].$createdAt,
                this.props.today,
                this.props.yesterday
              )}
            </span>
          </Card.Title>

          <Card.Text
            onClick={() => this.props.handleThread(this.props.tuple[1].$id)}
            style={{ whiteSpace: "pre-wrap" }}
          >
            {this.props.tuple[1].msg}
          </Card.Text>
          {threadsToDisplay}
        </Card.Body>
      </Card>
    );
  }
}

export default MsgForyou;
