import React from "react";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";

import ButtonGroup from "react-bootstrap/ButtonGroup";

import CreditsOnPage from "../CreditsOnPage";
//import LowCreditsOnPage from "../LowCreditsOnPage";

import { HiOutlineSpeakerphone } from "react-icons/hi";
import { FaArrowUp } from "react-icons/fa6";
import { FiMail } from "react-icons/fi";
import MsgForyou from "./MsgForyouv2";

class MessagespageForyou extends React.Component {
  handleCreditsToTopup = () => {
    let topUpAmt = (this.props.identityInfo.balance / 1000000000).toFixed(2);
    return topUpAmt;
  };
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
    // *** *** *** *** *** ***
    let tupleFromYouArray = [];

    tupleFromYouArray = this.props.ByYouMsgs.map((msg) => {
      let tuple = "";

      for (let nameDoc of this.props.ByYouNames) {
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
    // *** *** *** *** *** ***

    let tupleFromOthersArray = [];

    tupleFromOthersArray = this.props.FromTagsMsgs.map((msg) => {
      let tuple = "";

      for (let nameDoc of this.props.FromTagsNames) {
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
    // *** *** *** *** *** ***

    // ### ### ### ### ### ###

    let ForYouThreads = [
      ...this.props.ByYouThreads,
      ...this.props.FromTagsThreads,
    ];

    // Ensure Unique threads***
    let arrayOfThrIds = ForYouThreads.map((thr) => {
      return thr.$id;
    });

    // console.log('Combined ForYou Threads!!', arrayOfThrIds);

    let setOfThrIds = [...new Set(arrayOfThrIds)];

    arrayOfThrIds = [...setOfThrIds];

    //       ***

    ForYouThreads = arrayOfThrIds.map((thrId) => {
      let thread;

      for (let thrDoc of ForYouThreads) {
        if (thrDoc.$id === thrId) {
          thread = thrDoc;
          break;
        }
      }
      return thread;
    });

    let ForYouThreadsNames = [
      ...this.props.ByYouThreadsNames,
      ...this.props.FromTagsThreadsNames,
    ];

    // ### ### ### ### ### ###

    let tupleArray = [...tupleFromYouArray, ...tupleFromOthersArray];

    // Ensure Unique msgs***
    let arrayOfMsgIds = tupleArray.map((tuple) => {
      return tuple[1].$id;
    });

    // console.log('Combine FORYOU arrayMsgId!!', arrayOfMsgIds);

    let setOfMsgIds = [...new Set(arrayOfMsgIds)];

    arrayOfMsgIds = [...setOfMsgIds];

    //       ***

    tupleArray = arrayOfMsgIds.map((msgId) => {
      let tuple = [];

      for (let tupleDoc of tupleArray) {
        if (tupleDoc[1].$id === msgId) {
          tuple = tupleDoc;
          break;
        }
      }
      return tuple;
    });

    // console.log('CombineandUnique FORYOU!!', tupleArray);

    let sortedForYou = tupleArray.sort(function (a, b) {
      return b[1].$createdAt - a[1].$createdAt;
    });

    // console.log('Final FORYOU!!', sortedForYou);

    let today = new Date();
    let yesterday = new Date(today);

    yesterday.setDate(yesterday.getDate() - 1);

    let tuples = sortedForYou.map((tuple, index) => {
      return (
        <MsgForyou
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
          ForYouThreads={ForYouThreads}
          ForYouThreadsNames={ForYouThreadsNames}
        />
      );
    });

    return (
      <>
        <div className="bodytexttighternobottom">
          <CreditsOnPage
            identityInfo={this.props.identityInfo}
            uniqueName={this.props.uniqueName}
            showModal={this.props.showModal}
          />

          {sortedForYou.length < 1 ? (
            <p>
              Once you send a message or someone tags you in a message, it will
              show up here.
            </p>
          ) : (
            <></>
          )}

          {this.props.NewDMByYouThreads.length !== 0 ||
          this.props.NewDMFromTagsMsgs.length !== 0 ||
          this.props.NewDMFromTagsThreads.length !== 0 ? (
            !this.props.isLoadingForYou ? (
              <div className="d-grid gap-2">
                <Button
                  variant="primary"
                  onClick={() => {
                    this.props.pushNewDMtoView();
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
            <Button
              onClick={() => {
                this.props.showModal("NewSOModal");
              }}
            >
              <div className="icon-position">
                <HiOutlineSpeakerphone size={28} />
              </div>
            </Button>
            <Button onClick={() => this.scrollToTop()}>
              {" "}
              <div className="icon-position">
                <FaArrowUp size={28} />
              </div>
            </Button>
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
          </ButtonGroup>
        </div>
      </>
    );
  }
}

export default MessagespageForyou;
