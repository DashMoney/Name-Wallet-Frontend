import React from "react";
//import Card from "react-bootstrap/Card";

class GroupMsg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copiedName: false,
    };
  }

  handleNameClick = () => {
    navigator.clipboard.writeText(`${this.props.tuple[0]}`);
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

    return (
      <>
        <div
          className="BottomThinBorder"
          //style={{ paddingTop: ".5rem" }}
        ></div>
        <div
          key={this.props.index}
          style={{
            paddingTop: ".5rem",
            paddingBottom: ".2rem",
            paddingLeft: "1.5rem",
            paddingRight: "1.5rem",
          }}
        >
          <div className="cardTitle">
            {this.props.uniqueName === this.props.tuple[0] ? (
              <h5>
                {" "}
                <b style={{ color: "#008de4" }}>{this.props.tuple[0]}</b>
              </h5>
            ) : (
              <>
                <h5>
                  <b
                    style={{ color: "#008de4" }}
                    onClick={() => this.handleNameClick()}
                  >
                    {this.props.tuple[0]}
                  </b>
                </h5>
                <span>{this.state.copiedName ? <span>✅</span> : <></>}</span>
              </>
            )}
            <span className="textsmaller">
              {this.formatDate(
                this.props.tuple[1].$createdAt,
                this.props.today,
                this.props.yesterday
              )}
            </span>
          </div>
          <p>{this.props.tuple[1].message}</p>
        </div>
      </>
      // <Card id="card" key={this.props.index} bg={cardBkg} text={cardText}>
      //   <Card.Body>
      //     <Card.Title className="cardTitle">
      //       {this.props.uniqueName === this.props.tuple[0] ? (
      //         <b style={{ color: "#008de4" }}>{this.props.tuple[0]}</b>
      //       ) : (
      //         <>
      //           <b onClick={() => this.handleNameClick()}>
      //             {this.props.tuple[0]}
      //           </b>
      //           <span>{this.state.copiedName ? <span>✅</span> : <></>}</span>
      //         </>
      //       )}
      //       <span className="textsmaller">
      //         {this.formatDate(
      //           this.props.tuple[1].$createdAt,
      //           this.props.today,
      //           this.props.yesterday
      //         )}
      //       </span>
      //     </Card.Title>

      //     <Card.Text>{this.props.tuple[1].message}</Card.Text>
      //   </Card.Body>
      // </Card>
    );
  }
}

export default GroupMsg;
