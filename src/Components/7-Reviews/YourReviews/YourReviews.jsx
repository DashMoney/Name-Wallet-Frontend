import React from "react";

import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

import YourReview from "./YourReview";

class YourReviews extends React.Component {
  render() {
    let today = new Date();
    let yesterday = new Date(today);

    yesterday.setDate(yesterday.getDate() - 1);

    let yourreviews = this.props.YourReviews.map((yourreview, index) => {
      //console.log(item);
      return (
        <YourReview
          key={index}
          mode={this.props.mode}
          index={index}
          today={today}
          yesterday={yesterday}
          // identity={this.props.identity}
          // uniqueName={this.props.uniqueName}

          YourNameDoc={{
            $ownerId: this.props.identity,
            label: this.props.uniqueName,
          }}
          yourreview={yourreview}
          YourReviewNames={this.props.YourReviewNames}
          YourReplies={this.props.YourReplies}
          handleYourReply={this.props.handleYourReply} //Goes and determines if edit or create REPLY
        />
      );
    });

    return (
      <>
        {this.props.isLoadingYourReviews ? (
          <>
            <div id="spinner">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          </>
        ) : (
          <>
            {this.props.YourReviews.length === 0 ? (
              <>
                <p style={{ textAlign: "center" }}>
                  (Sorry, there have no reviews for you yet.)
                </p>
              </>
            ) : (
              <>
                <p style={{ textAlign: "center" }}>
                  Just tap on the review to reply!
                </p>
                <p></p>
                {yourreviews}
              </>
            )}
          </>
        )}
      </>
    );
  }
}

export default YourReviews;
