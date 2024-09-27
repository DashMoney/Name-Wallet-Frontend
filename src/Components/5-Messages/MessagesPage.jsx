import React from "react";
import Spinner from "react-bootstrap/Spinner";
import Nav from "react-bootstrap/Nav";

import Badge from "react-bootstrap/Badge";

import Alert from "react-bootstrap/Alert";

import MessagespageEveryone from "./MessagesPageEveryone";
import MessagespageForyou from "./MessagesPageForyou";

import "./MessagesPage.css";

class MessagesPage extends React.Component {
  // isLoadingEveryone
  // isLoadingForYou

  render() {
    return (
      <>
        {this.props.isLoginComplete ? (
          <>
            <Nav
              fill
              variant="pills"
              defaultActiveKey={this.props.whichMessagesTab}
              onSelect={(eventKey) => this.props.handleMessagesTab(eventKey)}
            >
              <Nav.Item>
                <Nav.Link eventKey="Everyone">
                  <b>Everyone</b>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="For you">
                  <b>For you</b>
                </Nav.Link>
              </Nav.Item>
            </Nav>

            {this.props.isLoadingRefresh ? (
              <>
                <p></p>
                <div id="spinner">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              </>
            ) : (
              <></>
            )}

            {this.props.errorToDisplay ? (
              <>
                <p></p>
                <Alert
                  variant="danger"
                  onClose={() => this.props.handleMessageFailureAlert()}
                  dismissible
                >
                  <Alert.Heading>Message Failed</Alert.Heading>
                  <p>
                    You either have insufficient credits or have run into a
                    platform error.
                  </p>
                </Alert>
              </>
            ) : (
              <></>
            )}

            {this.props.isLoadingForYou &&
            this.props.whichMessagesTab === "For you" ? (
              <>
                <p></p>
                <div id="spinner">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              </>
            ) : (
              <></>
            )}
          </>
        ) : (
          <></>
        )}

        {this.props.isLoadingEveryone &&
        this.props.whichMessagesTab === "Everyone" ? (
          <>
            <p></p>
            <div id="spinner">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          </>
        ) : (
          <></>
        )}

        {/* {this.props.isLoading ? (
          <>
            <p></p>
            <div id="spinner">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          </>
        ) : (
          <></>
        )} */}

        {/* THIS IS THE START OF A SEPARATE SECTION APART FROM EVERYTHING ABOVE */}

        {!this.props.isLoadingForYou &&
        this.props.whichMessagesTab === "For you" ? (
          <MessagespageForyou
            isLoginComplete={this.props.isLoginComplete}
            isLoadingForYou={this.props.isLoadingForYou}
            ByYouThreads={this.props.ByYouThreads}
            ByYouThreadsNames={this.props.ByYouThreadsNames}
            FromTagsThreads={this.props.FromTagsThreads}
            FromTagsThreadsNames={this.props.FromTagsThreadsNames}
            identity={this.props.identity}
            identityInfo={this.props.identityInfo}
            uniqueName={this.props.uniqueName}
            ByYouMsgs={this.props.ByYouMsgs}
            ByYouNames={this.props.ByYouNames}
            FromTagsMsgs={this.props.FromTagsMsgs}
            FromTagsNames={this.props.FromTagsNames}
            NewDMByYouThreads={this.props.NewDMByYouThreads}
            NewDMFromTagsMsgs={this.props.NewDMFromTagsMsgs}
            NewDMFromTagsThreads={this.props.NewDMFromTagsThreads}
            mode={this.props.mode}
            showModal={this.props.showModal}
            handleThread={this.props.handleThread}
            pushNewDMtoView={this.props.pushNewDMtoView}
          />
        ) : (
          <></>
        )}

        {this.props.whichMessagesTab === "Everyone" ? (
          <MessagespageEveryone
            isLoginComplete={this.props.isLoginComplete}
            EveryoneThreads={this.props.EveryoneThreads}
            EveryoneThreadsNames={this.props.EveryoneThreadsNames}
            identity={this.props.identity}
            identityInfo={this.props.identityInfo}
            uniqueName={this.props.uniqueName}
            EveryoneMsgs={this.props.EveryoneMsgs}
            EveryoneNames={this.props.EveryoneNames}
            NewSOMsgs={this.props.NewSOMsgs}
            NewSOThreads={this.props.NewSOThreads}
            mode={this.props.mode}
            showModal={this.props.showModal}
            handleThread={this.props.handleThread}
            pushNewSOtoView={this.props.pushNewSOtoView}
          />
        ) : (
          <></>
        )}
      </>
    );
  }
}

export default MessagesPage;
