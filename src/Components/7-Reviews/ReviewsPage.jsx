import React from "react";

import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";

import TabsOnPage from "./TabsOnPage";
import LowCreditsOnPage from "../LowCreditsOnPage";
import CreditsOnPage from "../CreditsOnPage";
import NameSearchForm from "./NameSearchForm";
import RatingSummary from "./RatingSummary";
import AddOrEditReviewButton from "./AddOrEditReviewButton";

import Reviews from "./Reviews";
import YourReviews from "./YourReviews/YourReviews";

class ReviewsPage extends React.Component {
  componentDidMount() {
    if (this.props.isLoginComplete && this.props.InitialPullReviews) {
      this.props.pullInitialTriggerREVIEWS();
    }
  }
  render() {
    return (
      <>
        {this.props.isLoginComplete ? (
          <>
            <TabsOnPage
              whichReviewsTab={this.props.whichReviewsTab}
              handleReviewsTab={this.props.handleReviewsTab}
            />

            <div className="bodytext">
              {this.props.whichReviewsTab === "Search" ? (
                <>
                  <LowCreditsOnPage
                    identityInfo={this.props.identityInfo}
                    uniqueName={this.props.uniqueName}
                    showModal={this.props.showModal}
                  />

                  <h3>
                    <b>Get Reviews for</b>
                  </h3>

                  <NameSearchForm
                    mode={this.props.mode}
                    nameToSearch={this.props.nameToSearch}
                    nameFormat={this.props.nameFormat}
                    SearchedNameDoc={this.props.SearchedNameDoc}
                    searchName={this.props.searchName}
                    //tooLongNameError={this.props.tooLongNameError}

                    handleReviewsOnChangeValidation={
                      this.props.handleReviewsOnChangeValidation
                    }
                  />

                  {/* <div
                    className="BottomBorder"
                    style={{ paddingTop: ".5rem" }}
                  ></div> */}

                  <RatingSummary
                    SearchedReviews={this.props.SearchedReviews}
                    SearchedNameDoc={this.props.SearchedNameDoc}
                    isLoadingReviewsSearch={this.props.isLoadingReviewsSearch}
                  />

                  {/* //Make the reviewSummary remove as well when No NameDoc? ^^^^ ->  */}

                  <AddOrEditReviewButton
                    SearchedReviews={this.props.SearchedReviews}
                    SearchedNameDoc={this.props.SearchedNameDoc}
                    identity={this.props.identity}
                    showModal={this.props.showModal}
                    handleEditReview={this.props.handleEditReview}
                    isLoadingReviewsSearch={this.props.isLoadingReviewsSearch}
                  />

                  {this.props.isLoadingReviewsSearch ? (
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
                  )}

                  <Reviews
                    mode={this.props.mode}
                    SearchedReviews={this.props.SearchedReviews}
                    SearchedReviewNames={this.props.SearchedReviewNames}
                    SearchedReplies={this.props.SearchedReplies}
                    SearchedNameDoc={this.props.SearchedNameDoc}
                  />

                  {this.props.SearchedReviews.length === 0 &&
                  !this.props.isLoadingReviewsSearch ? (
                    <div className="bodytext">
                      <p>Sorry, there are no reviews available.</p>
                    </div>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <>
                  {/* THIS IS WHERE THE "YOUR Reviews" WILL GO */}

                  <CreditsOnPage
                    identityInfo={this.props.identityInfo}
                    uniqueName={this.props.uniqueName}
                    showModal={this.props.showModal}
                  />

                  <YourReviews
                    YourReviews={this.props.YourReviews}
                    YourReviewNames={this.props.YourReviewNames}
                    YourReplies={this.props.YourReplies}
                    identity={this.props.identity}
                    uniqueName={this.props.uniqueName}
                    handleYourReply={this.props.handleYourReply}
                    mode={this.props.mode}
                    isLoadingYourReviews={this.props.isLoadingYourReviews}
                  />
                </>
              )}
            </div>
          </>
        ) : (
          <div className="bodytextnotop">
            <div className="bodytext" style={{ textAlign: "center" }}>
              <h3>Reviews to help build trust and grow the Dash economy!</h3>
            </div>

            <h3>
              <b>Get Reviews for</b>
            </h3>

            <NameSearchForm
              mode={this.props.mode}
              nameToSearch={this.props.nameToSearch}
              SearchedNameDoc={this.props.SearchedNameDoc}
              nameFormat={this.props.nameFormat}
              searchName={this.props.searchName}
              //tooLongNameError={this.props.tooLongNameError}

              handleReviewsOnChangeValidation={
                this.props.handleReviewsOnChangeValidation
              }
            />

            {/* <div
                    className="BottomBorder"
                    style={{ paddingTop: "1rem", paddingBottom: '.5rem' }}
                  ></div> */}

            <RatingSummary
              SearchedReviews={this.props.SearchedReviews}
              SearchedNameDoc={this.props.SearchedNameDoc}
              isLoadingReviewsSearch={this.props.isLoadingReviewsSearch}
            />

            {this.props.isLoadingReviewsSearch ? (
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
            )}

            {!this.props.isLoadingReviewsSearch ? (
              <>
                <Reviews
                  mode={this.props.mode}
                  SearchedReviews={this.props.SearchedReviews}
                  SearchedReviewNames={this.props.SearchedReviewNames}
                  SearchedReplies={this.props.SearchedReplies}
                  SearchedNameDoc={this.props.SearchedNameDoc}
                />
              </>
            ) : (
              <></>
            )}

            {this.props.SearchedReviews.length === 0 &&
            !this.props.isLoadingReviewsSearch ? (
              <div className="bodytext">
                <p>Sorry, there are no reviews available.</p>
              </div>
            ) : (
              <></>
            )}
          </div>
        )}
      </>
    );
  }
}

export default ReviewsPage;
