import React from "react";

import Post from "./Post";
import Event from "./Event";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

class Posts extends React.Component {
  render() {
    //let today = new Date();
    //let yesterday = new Date(today);
    //yesterday.setDate(yesterday.getDate() - 1);

    //DONT NEED ^^^ ONLY USING SIMPLIFED DATE FORMAT

    //SO THERE WILL BE A SELECTEDCATEGORYBUTTON SO DO I WANT TO PASS ALL THE CATEGORY POSTS HERE OR JUST THE ONE CATEGORY THAT WILL BE DISPLAYED?
    //i THOUGHT TO JUST PASS THE ONE TO BE DISPLAYED BUT THEN i HAVE TO WORRY ABOUT DISPLAYING THAT ONE ON LOAD CHANGES AND SUCH BUT i THINK IT IS JUST EASIER TO JUST SORT IT HERE AND SO LESS TO WORRY ABOUT IN APP.JS <- HMM YEP
    let postArray = [];
    let postNameArray = [];

    switch (this.props.selectedCategoryButton) {
      case "offbiz":
        postArray = this.props.OffBizPosts;
        postNameArray = this.props.OffBizNames;
        break;

      case "offevents":
        postArray = this.props.OffEventsPosts;
        postNameArray = this.props.OffEventsNames;
        break;

      case "offrent":
        postArray = this.props.OffRentPosts;
        postNameArray = this.props.OffRentNames;
        break;

      // case "offother":
      //   postArray = this.props.OffOtherPosts;
      //   postNameArray = this.props.OffOtherNames;
      //   break;

      // case "lookrent":
      //   postArray = this.props.LookRentPosts;
      //   postNameArray = this.props.LookRentNames;
      //   break;

      // case "lookother":
      //   postArray = this.props.LookOtherPosts;
      //   postNameArray = this.props.LookOtherNames;
      //   break;

      default:
        postArray = [];
        postNameArray = [];
    }

    let postFilteredArray = postArray.filter((post) => {
      return post.active;
    });

    let posts;
    //let events; Just use the posts because for display

    let today = new Date(); //Date.now(); <= Wrong
    let yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (this.props.selectedCategoryButton === "offevents") {
      posts = postFilteredArray.map((event, index) => {
        //console.log(post);
        return (
          <Col key={index} lg={4}>
            <div style={{ marginBottom: "0.5rem" }}>
              <Event
                // key={index}
                today={today}
                yesterday={yesterday}
                mode={this.props.mode}
                index={index}
                event={event}
                identity={this.props.identity}
                uniqueName={this.props.uniqueName}
                showModal={this.props.showModal}
                handleSearchedEvent={this.props.handleSearchedEvent}
                EventNames={postNameArray}
              />
            </div>
          </Col>
        );
      });
    } else {
      posts = postFilteredArray.map((post, index) => {
        //console.log(post);
        return (
          <Col key={index} lg={4}>
            <div style={{ marginBottom: "0.5rem" }}>
              <Post
                // key={index}
                mode={this.props.mode}
                index={index}
                post={post}
                //today={today}
                //yesterday={yesterday}
                identity={this.props.identity}
                uniqueName={this.props.uniqueName}
                showModal={this.props.showModal}
                handleSearchedPost={this.props.handleSearchedPost}
                PostNames={postNameArray}
              />
            </div>
          </Col>
        );
      });
    }

    return (
      <>
        {!this.props.isLoadingNearbyInitial &&
        !this.props.isLoadingNearbySearch ? (
          <div className="footer">
            {postArray.length !== 0 ? (
              <>
                <Row className="justify-content-md-center">{posts}</Row>
              </>
            ) : (
              <div className="bodytext" style={{ textAlign: "center" }}>
                Sorry, there are not any posts for this category yet!
              </div>
            )}
          </div>
        ) : (
          <></>
        )}
      </>
    );
  }
}

export default Posts;
