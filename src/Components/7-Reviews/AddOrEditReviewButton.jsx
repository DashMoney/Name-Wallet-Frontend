import React from "react";

import Button from "react-bootstrap/Button";

class AddOrEditReviewButton extends React.Component {
  render() {
    let reviewToPass = this.props.SearchedReviews.find((review) => {
      return review.$ownerId === this.props.identity;
    });

    let indexToPass = this.props.SearchedReviews.findIndex((review) => {
      return review.$ownerId === this.props.identity;
    });

    //if undefined => create button

    return (
      <>
        {this.props.SearchedNameDoc !== "No NameDoc" &&
        // this.props.SearchedNameDoc.preorderSalt !== undefined &&
        this.props.SearchedNameDoc.$ownerId !==
          "JAdeE9whiXXdxzSrz7Rd1i8aHC3XFh5AvuV7cpxcFAKE" &&
        !this.props.isLoadingReviewsSearch &&
        this.props.identity !== this.props.SearchedNameDoc.$ownerId &&
        this.props.identity !== "" ? (
          <>
            {reviewToPass === undefined ? (
              <>
                <p></p>
                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    onClick={() => this.props.showModal("CreateReviewModal")}
                  >
                    <b>Add Review</b>
                  </Button>
                  <p></p>
                </div>
              </>
            ) : (
              <>
                <p></p>
                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    onClick={() =>
                      this.props.handleEditReview(reviewToPass, indexToPass)
                    }
                  >
                    <b>Edit Review</b>
                  </Button>
                  <p></p>
                </div>
              </>
            )}
          </>
        ) : (
          <></>
        )}
      </>
    );
  }
}

export default AddOrEditReviewButton;
