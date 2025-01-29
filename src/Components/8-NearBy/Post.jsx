import React from "react";
import Badge from "react-bootstrap/Badge";
//import Button from 'react-bootstrap/Button';
import Card from "react-bootstrap/Card";

class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copiedName: false,
    };
  }

  handleNameClick = (nameLabel) => {
    navigator.clipboard.writeText(nameLabel);
    this.setState({
      copiedName: true,
    });
  };

  // handleName = (msgDoc) =>{
  //   if(msgDoc.$ownerId === this.props.identity){
  //   return <span style={{ color: "#008de4" }}>{this.props.uniqueName}</span>
  //   }

  //   //*** *** */
  //     let nameDoc = this.props.PostNames.find(doc => {
  //       return msgDoc.$ownerId === doc.$ownerId
  //     })

  //     if(nameDoc === undefined){
  //       return 'Not Found'
  //     }

  //     return <span style={{ color: "#008de4" }} onClick={() => this.handleNameClick(nameDoc.label)}>
  //       {nameDoc.label}
  //       </span>

  // }

  formatDate(theCreatedAt) {
    let CreatedAt = new Date(theCreatedAt);

    let dateReturn = CreatedAt.toLocaleDateString();

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

    let nameDocToPass = ""; //this is the nameDoc and not the label

    if (this.props.post.$ownerId === this.props.identity) {
      let myNameDoc = {
        $ownerId: this.props.identity,
        label: this.props.uniqueName,
      };
      nameDocToPass = myNameDoc;
    } else {
      nameDocToPass = this.props.PostNames.find((doc) => {
        return this.props.post.$ownerId === doc.$ownerId;
      });
    }

    if (nameDocToPass === undefined) {
      nameDocToPass = {
        // $ownerId: this.props.identity,
        label: "NO NAME FOUND",
      };
    }

    //Pass the entire NameDoc!! =>
    // if(nameToPass === undefined){
    //   nameToPass = 'Not Found'
    // }else{
    //   nameToPass = nameToPass.label;
    // }

    return (
      <>
        <Card id="card" key={this.props.index} bg={cardBkg} text={cardText}>
          <Card.Body
          // onClick={() =>
          //   this.props.handleSearchedPost(this.props.post, nameDocToPass)
          // }
          >
            <div className="locationTitle" style={{ marginBottom: ".5rem" }}>
              <Badge bg="primary" style={{ marginRight: ".5rem" }}>
                {this.props.post.city}
              </Badge>

              <Badge bg="primary" style={{ marginRight: ".5rem" }}>
                {this.props.post.region}
              </Badge>

              <Badge bg="primary">{this.props.post.country}</Badge>
            </div>
            <div className="cardTitle">
              <h4
                style={{ color: "#008de4" }}
                onClick={() => this.handleNameClick(nameDocToPass.label)}
              >
                {nameDocToPass.label}
              </h4>

              <span>{this.state.copiedName ? <span>✅</span> : <></>}</span>

              <span className="textsmaller">
                {this.formatDate(
                  this.props.post.$createdAt,
                  this.props.today,
                  this.props.yesterday
                )}
              </span>
            </div>

            <p style={{ whiteSpace: "pre-wrap" }}>
              {this.props.post.description}
            </p>

            {this.props.post.link !== undefined &&
            this.props.post.link !== "" ? (
              <>
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  href={this.props.post.link}
                >
                  <b>{this.props.post.link}</b>
                </a>
              </>
            ) : (
              <></>
            )}
            <p></p>
            {this.props.post.address !== undefined &&
            this.props.post.address !== "" ? (
              <>
                <p style={{ whiteSpace: "pre-wrap" }}>
                  {this.props.post.address}
                </p>
                {/* ADD COPY HERE */}
                <Button
                  variant="outline-primary"
                  onClick={() => {
                    navigator.clipboard.writeText(this.props.post.address);
                    this.setState({
                      copiedAddress: true,
                    });
                  }}
                >
                  <b>Copy</b>
                </Button>
                {this.state.copiedAddress ? <span>Copied!</span> : <></>}
              </>
            ) : (
              <></>
            )}
            <p></p>

            {/* {this.props.post.date !== undefined &&
            this.props.post.date !== "" ? (
              <p>
                Date: <b>{this.props.post.date}</b>
              </p>
            ) : (
              <></>
            )}

            {this.props.post.time !== undefined &&
            this.props.post.time !== "" ? (
              <p>
                Time: <b>{this.props.post.time}</b>
              </p>
            ) : (
              <></>
            )} */}
            {/* <p className="textsmaller" style={{ textAlign: "center" }}>
              ** Tap to Preview **
            </p> */}
          </Card.Body>
        </Card>
      </>
    );
  }
}

export default Post;
