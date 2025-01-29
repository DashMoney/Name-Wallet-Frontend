import React from "react";
//import Badge from 'react-bootstrap/Badge';
//import Button from 'react-bootstrap/Button';
import Card from "react-bootstrap/Card";

import Reply from "./Reply";

class Review extends React.Component {
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

  handleRating = () => {
    if (this.props.review.rating === 1) {
      return <>⭐</>;
    } else if (this.props.review.rating === 2) {
      return <>⭐⭐</>;
    } else if (this.props.review.rating === 3) {
      return <>⭐⭐⭐</>;
    } else if (this.props.review.rating === 4) {
      return <>⭐⭐⭐⭐</>;
    } else if (this.props.review.rating === 5) {
      return <span>⭐⭐⭐⭐⭐</span>;
    } else {
      return <>Unavailable</>;
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

    let nameToPass = ""; //this is the nameDoc and not the label

    //  if(this.props.review.$ownerId === this.props.identity){
    //     nameToPass = this.props.uniqueName;
    //   }else{
    nameToPass = this.props.SearchedReviewNames.find((doc) => {
      return this.props.review.$ownerId === doc.$ownerId;
    });
    //}

    if (nameToPass === undefined) {
      nameToPass = "Not Found";
    } else {
      nameToPass = nameToPass.label;
    }

    //NEW THING BELOW -> ADDING Replies TO Reviews

    let replyDoc = this.props.SearchedReplies.find((doc) => {
      return doc.reviewId === this.props.review.$id;
    }); //This ^^^ makes sure reply are for the intended review
    //only return one with find( for latest?) <- based on query return should be right

    let replyToDisplay = [];

    if (replyDoc !== undefined) {
      replyToDisplay.push(replyDoc);

      replyToDisplay = replyToDisplay.map((reply, index) => {
        return (
          <Reply
            key={index}
            mode={this.props.mode}
            index={index}
            reply={reply}
            ReviewerName={nameToPass} //Dont need this for the Reply
            SearchedNameDoc={this.props.SearchedNameDoc} //this is always the replier
            today={this.props.today}
            yesterday={this.props.yesterday}
          />
        );
      });
    }

    // threadDocs = threadDocs.filter((doc)=>{
    //   return doc.$ownerId === this.props.tuple[1].$ownerId || doc.$ownerId === this.props.tuple[1].toId;
    // }); //This ^^^ makes sure threads are from the sender or recipient

    //need to order the docs -> delete for replies
    // threadDocs = threadDocs.sort(function (a, b) {
    //   return a.$createdAt - b.$createdAt;
    // });

    return (
      <>
        <Card id="card" key={this.props.index} bg={cardBkg} text={cardText}>
          <Card.Body>
            <Card.Title className="cardTitle">
              <span
                style={{ color: "#008de3" }}
                onClick={() => this.handleNameClick(nameToPass)}
              >
                {nameToPass}
              </span>

              <span>{this.state.copiedName ? <span>✅</span> : <></>}</span>

              <span className="textsmaller">
                {this.formatDate(
                  this.props.review.$createdAt,
                  this.props.today,
                  this.props.yesterday
                )}
              </span>
            </Card.Title>

            <Card.Subtitle className="mb-2">
              {this.handleRating()}
            </Card.Subtitle>
            {/* ^^^ This will be where the stars go, may need functionto handle display */}

            <Card.Text
            //onClick={()=>this.props.handleSearchedPost(this.props.post, nameToPass)}
            //^^^ There wont be a click on function in DGR -> yes there is if its your reply so must be logged in.
            >
              {this.props.review.review}
            </Card.Text>
            {replyToDisplay}
          </Card.Body>
        </Card>
      </>
    );
  }
}

export default Review;
