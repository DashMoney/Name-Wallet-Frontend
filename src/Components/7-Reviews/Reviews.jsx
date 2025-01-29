import React from "react";

import Review from "./Review";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

class Reviews extends React.Component {
  render() {
    let today = new Date();
    let yesterday = new Date(today);

    yesterday.setDate(yesterday.getDate() - 1);

    let reviews = this.props.SearchedReviews.map((review, index) => {
      //console.log(post);
      return (
        <Col key={index} lg={4}>
          <div style={{ marginBottom: "0.5rem" }}>
            <Review
              // key={index}
              mode={this.props.mode}
              index={index}
              review={review}
              today={today}
              yesterday={yesterday}
              identity={this.props.identity} //For if my review so can edit
              //uniqueName={this.props.uniqueName}

              handleSearchedReview={this.props.handleSearchedReview} //to edit my reviews
              SearchedNameDoc={this.props.SearchedNameDoc}
              SearchedReviewNames={this.props.SearchedReviewNames}
              SearchedReplies={this.props.SearchedReplies}
            />
          </div>
        </Col>
      );
    });

    return (
      <>
        <Row className="justify-content-md-center">{reviews}</Row>
      </>
    );
  }
}

export default Reviews;
