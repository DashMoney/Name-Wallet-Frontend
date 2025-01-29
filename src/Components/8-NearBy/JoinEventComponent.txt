import React from "react";

import Button from "react-bootstrap/Button";

import Spinner from "react-bootstrap/Spinner";

class JoinEventComponent extends React.Component {
  render() {
    let joined = true;
    let myGroups = []; //array of group names

    if (!this.props.isLoadingGroupEvents && this.props.isLoginComplete) {
      this.props.dgtInvitesForEvents.forEach((invite) => {
        if (invite.dgt === "self") {
          myGroups.push(invite.group);
        }
      });
    }
    // invite.dgt !== undefined &&
    joined = myGroups.includes(this.props.event.group);
    //console.log(joined);

    return (
      <>
        {this.props.isLoginComplete ? (
          <>
            {this.props.isLoadingGroupEvents || this.props.isLoadingGroups ? (
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
              <>
                {!joined ? (
                  <div className="d-grid gap-2">
                    <Button
                      variant="primary"
                      //onClick={() => this.handleGotoGroupClick()}
                      onClick={() =>
                        this.props.handleSelectedJoinGroup(
                          this.props.event.group
                        )
                      }
                    >
                      <b>Join {this.props.event.group}?</b>
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* <h5 style={{ textAlign: "center", margin: "1.2rem" }}>
                      {" "}
                      <b>{this.props.event.group} joined!</b>
                    </h5> */}
                    <div className="d-grid gap-2">
                      <Button
                        variant="primary"
                        onClick={() =>
                          this.props.showGroupPage(this.props.event.group)
                        }
                      >
                        <b>Go to {this.props.event.group}!</b>
                      </Button>
                    </div>
                  </>
                )}
              </>
            )}
          </>
        ) : (
          <>
            <div className="d-grid gap-2">
              <Button variant="primary" disabled>
                <b>Join {this.props.event.group}?</b>
              </Button>
            </div>
          </>
        )}
      </>
    );
  }
}

export default JoinEventComponent;
