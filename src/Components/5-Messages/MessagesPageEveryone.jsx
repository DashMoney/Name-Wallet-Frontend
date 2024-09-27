import React from "react";

import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Badge from "react-bootstrap/Badge";

import { HiOutlineSpeakerphone } from "react-icons/hi";
import { FaArrowUp } from "react-icons/fa6";
import { FiMail } from "react-icons/fi";

import MsgEveryone from "./MsgEveryonev2";

import LowCreditsOnPage from "../LowCreditsOnPage";

class MessagespageEveryone extends React.Component {
  // //https://stackoverflow.com/questions/37620694/how-to-scroll-to-bottom-in-react
  scrollToTop = () => {
    this.messagesEnd.scrollIntoView({
      //messagesEnd is a special div inserted below to assist in positioning
      behavior: "smooth",
      block: "end", //"start"
      inline: "nearest",
    });
  };

  render() {
    let tupleArray = [];

    tupleArray = this.props.EveryoneMsgs.map((msg) => {
      let tuple = "";

      for (let nameDoc of this.props.EveryoneNames) {
        if (nameDoc.$ownerId === msg.$ownerId) {
          tuple = [nameDoc.label, msg];
          break;
        }
      }
      if (tuple !== "") {
        return tuple;
      }

      return ["No Name Avail..", msg];
    });

    // console.log(tupleArray);

    let today = new Date(); //Date.now(); <= Wrong
    let yesterday = new Date(today);

    yesterday.setDate(yesterday.getDate() - 1);

    let tuples = tupleArray.map((tuple, index) => {
      //message to tuple
      //console.log(tuple);
      return (
        <MsgEveryone
          isLoginComplete={this.props.isLoginComplete}
          key={index}
          mode={this.props.mode}
          index={index}
          tuple={tuple}
          today={today}
          yesterday={yesterday}
          identity={this.props.identity}
          uniqueName={this.props.uniqueName}
          showModal={this.props.showModal}
          handleThread={this.props.handleThread}
          EveryoneThreads={this.props.EveryoneThreads}
          EveryoneThreadsNames={this.props.EveryoneThreadsNames}
        />
      );
    });

    return (
      <>
        <div className="bodytexttighter">
          <LowCreditsOnPage
            identityInfo={this.props.identityInfo}
            uniqueName={this.props.uniqueName}
            showModal={this.props.showModal}
          />
          {this.props.isLoginComplete ? (
            <></>
          ) : (
            <h5 style={{ margin: "0rem", padding: "0rem" }}>
              <b>Login for more!</b>
            </h5>
          )}
          {this.props.NewSOMsgs.length !== 0 ||
          this.props.NewSOThreads.length !== 0 ? (
            !this.props.isLoadingEveryone ? (
              <div className="d-grid gap-2">
                <Button
                  variant="primary"
                  onClick={() => {
                    this.props.pushNewSOtoView();
                  }}
                >
                  <b>New Messages</b>
                </Button>
              </div>
            ) : (
              <></>
            )
          ) : (
            <></>
          )}
        </div>
        {/* https://stackoverflow.com/questions/37620694/how-to-scroll-to-bottom-in-react */}
        <div
          style={{
            float: "left",
            clear: "both",
            margin: "0rem",
            padding: "0rem",
          }}
          ref={(el) => {
            this.messagesEnd = el;
          }}
        ></div>

        <div className="footer">{tuples}</div>

        <div className="bootstrapMenu">
          <ButtonGroup size="lg" className="one-level-nav">
            {this.props.isLoginComplete ? (
              <>
                <Button
                  onClick={() => {
                    this.props.showModal("NewSOModal");
                  }}
                >
                  <div className="icon-position">
                    <HiOutlineSpeakerphone size={28} />
                  </div>
                </Button>
              </>
            ) : (
              <>
                <Button disabled>
                  <div className="icon-position">
                    <HiOutlineSpeakerphone size={28} />
                  </div>
                </Button>
              </>
            )}
            <Button onClick={() => this.scrollToTop()}>
              {" "}
              <div className="icon-position">
                <FaArrowUp size={28} />
              </div>
            </Button>
            {this.props.isLoginComplete ? (
              <>
                <Button
                  onClick={() => {
                    this.props.showModal("NewDMModal");
                  }}
                >
                  {" "}
                  <div className="icon-position">
                    <FiMail size={28} />
                  </div>
                </Button>
              </>
            ) : (
              <>
                <Button disabled>
                  {" "}
                  <div className="icon-position">
                    <FiMail size={28} />
                  </div>
                </Button>
              </>
            )}
          </ButtonGroup>
        </div>
      </>
    );
  }
}

export default MessagespageEveryone;
