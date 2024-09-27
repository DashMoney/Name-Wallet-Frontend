import React from "react";
//import Button from 'react-bootstrap/Button';
import Card from "react-bootstrap/Card";

class Reply extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copiedName: false,
    };
  }

  handleName = (nameDoc) => {
    return <span>{nameDoc.label}</span>;
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
    // let cardBkg;
    // let cardText;

    // if (this.props.mode === "primary") {
    //   cardBkg = "white";
    //   cardText = "dark";
    // } else {
    //   cardBkg = "dark";
    //   cardText = "white";
    // }

    return (
      // <Card id="thread" key={this.props.index} bg={cardBkg} text={cardText}>
      //   <Card.Body>
      <>
        <div
          className="ThreadBorder"
          style={{ paddingTop: ".2rem", marginBottom: ".3rem" }}
        ></div>
        <Card.Title className="cardTitle">
          {this.handleName(this.props.SearchedNameDoc)}

          <span className="textsmaller">
            {this.formatDate(
              this.props.reply.$createdAt,
              this.props.today,
              this.props.yesterday
            )}
          </span>
        </Card.Title>
        <Card.Text>{this.props.reply.reply}</Card.Text>
      </>
    );
  }
}

export default Reply;
