import React from "react";
import Button from "react-bootstrap/Button";

class ButtonsOnPage extends React.Component {
  render() {
    // CALC THE POST NUMBERS FOR DISPLAY ->

    let offRentNumFiltered = this.props.OffRentPosts.filter((post) => {
      return post.active;
    });
    let offRentNum = offRentNumFiltered.length;

    let offBizNumFiltered = this.props.OffBizPosts.filter((post) => {
      return post.active;
    });
    let offBizNum = offBizNumFiltered.length;

    //let offBizNum = this.props.OffBizPosts.length;

    let offOtherNumFiltered = this.props.OffOtherPosts.filter((post) => {
      return post.active;
    });
    let offOtherNum = offOtherNumFiltered.length;

    //EVENTS
    let offEventsNumFiltered = this.props.OffEventsPosts.filter((post) => {
      return post.active;
    });
    let offEventsNum = offEventsNumFiltered.length;

    let lookRentNumFiltered = this.props.LookRentPosts.filter((post) => {
      return post.active;
    });
    let lookRentNum = lookRentNumFiltered.length;

    //let lookRentNum = this.props.LookRentPosts.length;

    let lookOtherNumFiltered = this.props.LookOtherPosts.filter((post) => {
      return post.active;
    });

    let lookOtherNum = lookOtherNumFiltered.length;

    /**
     *  OffBizPulled={this.props.OffBizPulled}
        OffEventsPulled={this.props.OffEventsPulled}
        OffRentPulled={this.props.OffRentPulled}
        OffTradePulled={this.props.OffTradePulled}
        LookRentPulled={this.props.LookRentPulled}
        LookTradePulled={this.props.LookTradePulled}
     */

    return (
      <>
        <h3 style={{ marginTop: ".5rem", marginBottom: ".3rem" }}>
          <b>Offerings</b>
        </h3>

        {this.props.selectedCategoryButton === "offbiz" ? (
          <Button
            variant="primary"
            style={{
              textDecoration: "underline",
              marginRight: ".5rem",
              marginBottom: ".7rem",
            }}
          >
            <b>Shopping</b>
            {""}
            {this.props.OffBizPulled ? <b>({offBizNum})</b> : <></>}
          </Button>
        ) : (
          <Button
            variant="primary"
            style={{ marginRight: ".5rem", marginBottom: ".7rem" }}
            onClick={() => this.props.handleSelectedCategoryButton("offbiz")}
          >
            <b>Shopping</b>
            {""}
            {this.props.OffBizPulled ? <b>({offBizNum})</b> : <></>}
          </Button>
        )}

        {/* //EVENTS */}

        {this.props.selectedCategoryButton === "offevents" ? (
          <Button
            variant="primary"
            style={{
              textDecoration: "underline",
              marginRight: ".5rem",
              marginBottom: ".7rem",
            }}
          >
            <b
              style={{
                paddingLeft: ".5rem",
              }}
            >
              Events
            </b>
            {""}
            {this.props.OffEventsPulled ? (
              <b
                style={{
                  paddingRight: ".5rem",
                }}
              >
                ({offEventsNum})
              </b>
            ) : (
              <>
                <b
                  style={{
                    paddingRight: ".5rem",
                  }}
                ></b>
              </>
            )}
          </Button>
        ) : (
          <Button
            variant="primary"
            style={{
              marginRight: ".5rem",
              marginBottom: ".7rem",
            }}
            onClick={() => this.props.handleSelectedCategoryButton("offevents")}
          >
            <b
              style={{
                paddingLeft: ".5rem",
              }}
            >
              Events
            </b>
            {""}
            {this.props.OffEventsPulled ? (
              <b
                style={{
                  paddingRight: ".5rem",
                }}
              >
                ({offEventsNum})
              </b>
            ) : (
              <>
                <b
                  style={{
                    paddingRight: ".5rem",
                  }}
                ></b>
              </>
            )}
          </Button>
        )}

        {this.props.selectedCategoryButton === "offrent" ? (
          <Button
            variant="primary"
            style={{
              textDecoration: "underline",
              marginRight: ".5rem",
              marginBottom: ".7rem",
            }}
          >
            <b>Places to Rent</b>
            {""}
            {this.props.OffRentPulled ? <b>({offRentNum})</b> : <></>}
          </Button>
        ) : (
          <Button
            variant="primary"
            style={{ marginRight: ".5rem", marginBottom: ".7rem" }}
            onClick={() => this.props.handleSelectedCategoryButton("offrent")}
          >
            <b>Places to Rent</b>
            {""}
            {this.props.OffRentPulled ? <b>({offRentNum})</b> : <></>}
          </Button>
        )}

        {/* Get/got rid of  offother, lookrent, lookother */}
      </>
    );
  }
}

export default ButtonsOnPage;
