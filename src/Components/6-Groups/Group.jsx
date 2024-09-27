import React from "react";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
//import Card from "react-bootstrap/Card";
import ButtonGroup from "react-bootstrap/ButtonGroup";

import Navbar from "react-bootstrap/Navbar";

import Container from "react-bootstrap/Container";

import ViewMembersModal from "./ViewMembersModal";
import NewMessageModal from "./NewMessageModal";
import SendInviteModal from "./SendInviteModal";

import { HiOutlineSpeakerphone } from "react-icons/hi";
//import { FaArrowUp } from "react-icons/fa6";
import { FiMail } from "react-icons/fi";
import { IoMdArrowRoundBack } from "react-icons/io";

//import { CgUserAdd } from "react-icons/cg";
import { MdRefresh } from "react-icons/md";

import GroupMsg from "./GroupMsg";

// import GroupBottomNav from "../GroupBottomNav/GroupBottomNav";
import "../../App.css";

import dapiClientNoWallet from "../DapiClientNoWallet";

import Dash from "dash";

const {
  PlatformProtocol: { Identifier },
} = Dash;

class Group extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      LoadingMsgs: true,
      LoadingMembers: true,

      groupMembers: [],
      // groupMembersNames: [], //Uses tuples instead

      groupMsgs: [],
      //groupMsgsNames: [],

      isModalShowing: false, //Why are the modals here? just put in app.js? why?
      presentModal: "",
    };
  }
  // //https://stackoverflow.com/questions/37620694/how-to-scroll-to-bottom-in-react
  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({
      behavior: "instant",
      block: "start",
      inline: "nearest",
    });
  };

  hideModal = () => {
    this.setState({
      isModalShowing: false,
    });
  };

  showModal = (modalName) => {
    this.setState({
      presentModal: modalName,
      isModalShowing: true,
    });
  };

  refreshGroup = () => {
    this.setState({
      LoadingMsgs: true,
      LoadingMembers: true,
    });
    this.getDGTMessages();
    this.getDGTInvites();
  };

  // handleTimeToDate = (timeObject) => {
  //   let date = new Date(timeObject);

  //   //let longFormDate= setTime(date);

  //   return date.toLocaleDateString();
  // };

  //Bring in the full one ? -> no date thing is needed here

  getDGTMessages = () => {
    //console.log(`Calling get messages for ${this.props.selectedGroup}`);

    const client = new Dash.Client(dapiClientNoWallet(this.props.whichNetwork));

    const getMessages = async () => {
      return client.platform.documents.get("DGTContract.dgtmsg", {
        limit: 90,
        where: [
          ["group", "==", this.props.selectedGroup],
          ["$createdAt", "<=", Date.now()],
        ],
        orderBy: [["$createdAt", "desc"]],
      });
    };

    getMessages()
      .then((d) => {
        if (d.length === 0) {
          this.setState({
            LoadingMsgs: false,
          });
        } else {
          let docArray = [];
          for (const n of d) {
            //console.log("Document:\n", n.toJSON());
            docArray = [n.toJSON(), ...docArray];
          }

          this.getDGTMsgsNames(docArray);
        }
      })
      .catch((e) => console.error("Something went wrong:\n", e))

      .finally(() => client.disconnect());
  };

  getDGTMsgsNames = (msgArr) => {
    //console.log("Calling getDGTMsgsNames");

    let ownerarrayOfOwnerIds = msgArr.map((doc) => {
      return doc.$ownerId;
    });

    let setOfOwnerIds = [...new Set(ownerarrayOfOwnerIds)];

    let arrayOfOwnerIds = [...setOfOwnerIds];

    // arrayOfOwnerIds = arrayOfOwnerIds.map((item) =>
    //   Buffer.from(Identifier.from(item))
    // );

    const client = new Dash.Client(dapiClientNoWallet(this.props.whichNetwork));

    const getNameDocuments = async () => {
      return client.platform.documents.get("DPNSContract.domain", {
        where: [["records.identity", "in", arrayOfOwnerIds]],
        orderBy: [["records.identity", "asc"]],
      });
    };

    getNameDocuments()
      .then((d) => {
        //WHAT IF THERE ARE NO NAMES?
        if (d.length === 0) {
          console.log("No DPNS domain documents retrieved.");
        }

        let nameDocArray = [];

        for (const n of d) {
          //console.log("NameDoc:\n", n.toJSON());

          nameDocArray = [n.toJSON(), ...nameDocArray];
        }
        //console.log(nameDocArray);

        let tupleArray = []; //<- Final array

        // My 2 arrays are: nameDocArray and msgArr
        //There may not be very many name docs because same author for lots of msgs..

        tupleArray = msgArr.map((msg) => {
          let tuple = "";

          for (let nameDoc of nameDocArray) {
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
        //HAVE TO SORT THE MSGS AND NAMES TOGETHER BC THEY DON'T COME TOGETHER WELL.

        //console.log("Tuple!");
        //console.log(tupleArray);
        this.setState(
          {
            groupMsgs: tupleArray,
            LoadingMsgs: false,
          },
          () => this.scrollToBottom()
        );
      })

      .catch((e) => {
        console.error("Something went wrong:\n", e);

        this.setState({
          LoadingMsgs: false,
        });
      })
      .finally(() => client.disconnect());
  };

  getDGTInvites = () => {
    // console.log(`Calling get invites for ${this.props.selectedGroup}`);

    const client = new Dash.Client(dapiClientNoWallet(this.props.whichNetwork));

    //DGTInvites Query ->
    const getInvites = async () => {
      return client.platform.documents.get("DGTContract.dgtinvite", {
        limit: 80,
        where: [
          ["group", "==", this.props.selectedGroup],
          ["dgt", "==", "self"],
        ],
      });
    };

    getInvites()
      .then((d) => {
        if (d.length === 0) {
          console.log("There are no invites.");
          this.setState({
            LoadingMembers: false,
          });
        } else {
          let docArray = [];
          for (const n of d) {
            // console.log("Document:\n", n.toJSON());
            docArray = [...docArray, n.toJSON()];
          }

          this.getNamesforDGTInvites(docArray);
        }
      })
      .catch((e) => console.error("Something went wrong:\n", e))
      .finally(() => client.disconnect());
  };

  getNamesforDGTInvites = (invArr) => {
    let ownerarrayOfOwnerIds = invArr.map((doc) => {
      return doc.$ownerId;
    });

    let setOfOwnerIds = [...new Set(ownerarrayOfOwnerIds)];

    let arrayOfOwnerIds = [...setOfOwnerIds];

    //***** */
    //CREATE UNIQUE SET OF INVITES BASED ON MSG OWNERID ->

    let uniqueInvites = arrayOfOwnerIds.map((ownerId) => {
      let invite = invArr.find((inv) => {
        return inv.$ownerId === ownerId;
      });
      return invite;
    });
    //***** */

    // arrayOfOwnerIds = arrayOfOwnerIds.map((item) =>
    //   Buffer.from(Identifier.from(item))
    // );

    // console.log("Calling getNamesforDGTInvites");

    const client = new Dash.Client(dapiClientNoWallet(this.props.whichNetwork));

    const getNameDocuments = async () => {
      return client.platform.documents.get("DPNSContract.domain", {
        where: [["records.identity", "in", arrayOfOwnerIds]],
        orderBy: [["records.identity", "asc"]],
      });
    };

    getNameDocuments()
      .then((d) => {
        //WHAT IF THERE ARE NO NAMES?
        if (d.length === 0) {
          console.log("No DPNS domain documents retrieved.");
        }

        let nameDocArray = [];

        for (const n of d) {
          // console.log("NameDoc:\n", n.toJSON());

          nameDocArray = [n.toJSON(), ...nameDocArray];
        }
        // console.log(nameDocArray);

        let tupleArray = []; //<- Final array

        // My 2 arrays are: nameDocArray and invArr
        //There may not be very many name docs because same author for lots of msgs..

        tupleArray = uniqueInvites.map((msg) => {
          let tuple = "";

          for (let nameDoc of nameDocArray) {
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
        //HAVE TO SORT THE MSGS AND NAMES TOGETHER BC THEY DON'T COME TOGETHER WELL.

        // console.log("Tuple!");
        // console.log(tupleArray);

        this.setState({
          groupMembers: tupleArray,
          LoadingMembers: false,
        });
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);

        this.setState({
          LoadingMembers: false,
        });
      })
      .finally(() => client.disconnect());
  };

  componentDidMount() {
    this.getDGTMessages();
    this.getDGTInvites();
  }

  render() {
    let messages = [];
    let msgsToAdd = [];

    //Change to Loading?? <-
    let today = new Date();
    let yesterday = new Date(today);

    yesterday.setDate(yesterday.getDate() - 1);

    messages = this.state.groupMsgs.map((msg, index) => {
      return (
        <GroupMsg
          key={index}
          mode={this.props.mode}
          index={index}
          tuple={msg} //This will be a tuple
          //date={d}
          today={today}
          yesterday={yesterday}
          uniqueName={this.props.uniqueName}
        />
      );
    });

    if (!this.state.LoadingMsgs) {
      if (this.state.groupMsgs.length !== 0) {
        msgsToAdd = this.props.GroupsMsgsToAdd.map((msg, index) => {
          if (
            msg.group === this.props.selectedGroup &&
            msg.$createdAt >
              this.state.groupMsgs[this.state.groupMsgs.length - 1][1]
                .$createdAt //Because this is a Tuple.. in an array
          ) {
            return (
              <GroupMsg
                key={index}
                mode={this.props.mode}
                index={index}
                tuple={[this.props.uniqueName, msg]} //This will be a tuple
                //date={d}
                today={today}
                yesterday={yesterday}
                uniqueName={this.props.uniqueName}
              />
            );
          } //check that its the right group and it is later than latest $createdAt
        });
      } else {
        msgsToAdd = this.props.GroupsMsgsToAdd.map((msg, index) => {
          if (msg.group === this.props.selectedGroup) {
            return (
              <GroupMsg
                key={index}
                mode={this.props.mode}
                index={index}
                tuple={[this.props.uniqueName, msg]} //This will be a tuple
                today={today}
                yesterday={yesterday}
                uniqueName={this.props.uniqueName}
              />
            );
          }
        });
      }
    }

    return (
      <>
        <Navbar
          //className="sticky top-0"
          //style={{ paddingLeft: "2%", paddingRight: "2%", zIndex: 10 }}
          //style={{ position: "sticky", top: "0" }}
          bg={this.props.mode}
          variant={this.props.mode}
          fixed="top"
        >
          <Container>
            <Button
              variant="primary"
              onClick={() => this.props.hideGroupPage()}
            >
              <IoMdArrowRoundBack size={28} />
            </Button>

            <h3 style={{ textAlign: "center" }}>
              {this.props.mode === "primary" ? (
                <b className="lightMode">{this.props.selectedGroup}</b>
              ) : (
                <b>{this.props.selectedGroup}</b>
              )}
            </h3>
            <Button
              variant="primary"
              onClick={() => this.showModal("ViewMembersModal")}
            >
              <b>Members</b>
            </Button>
          </Container>
        </Navbar>

        <div>
          {this.state.groupMsgs.length === 0 &&
          !this.state.LoadingMsgs &&
          msgsToAdd.length === 0 ? (
            <>
              <p></p>
              <div className="bodytext">
                <p>There are no messages available for this group.</p>
              </div>
            </>
          ) : (
            <></>
          )}

          {/* <div className="footer">{tuples}</div> */}

          <div className="bootstrapMenu">
            <ButtonGroup size="lg" className="one-level-nav">
              {!this.props.isLoadingGroup && !this.state.LoadingMsgs ? (
                <>
                  <Button
                    onClick={() => {
                      this.showModal("NewMessageModal");
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
              {!this.props.isLoadingGroup && !this.state.LoadingMsgs ? (
                <>
                  <Button onClick={() => this.refreshGroup()}>
                    {" "}
                    <div className="icon-position">
                      <MdRefresh size={28} />
                    </div>
                  </Button>
                </>
              ) : (
                <>
                  <Button disabled>
                    <div className="icon-position">
                      <MdRefresh size={28} />
                    </div>
                  </Button>
                </>
              )}

              {!this.props.isLoadingGroup ? (
                <>
                  <Button
                    onClick={() => {
                      this.showModal("SendInviteModal");
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
          <p></p>
          <div className="footer">
            {messages}
            {msgsToAdd}
          </div>

          <p></p>
          {/* https://stackoverflow.com/questions/37620694/how-to-scroll-to-bottom-in-react */}
          <div
            style={{ float: "left", clear: "both" }}
            ref={(el) => {
              this.messagesEnd = el;
            }}
          ></div>
          <p></p>

          {this.state.LoadingMsgs ||
          this.props.isLoadingGroup ||
          this.state.LoadingMembers ||
          this.props.isLoadingGroupInvite ? (
            <div id="shoutOutSpinner">
              <p></p>
              <Spinner animation="border">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p></p>
            </div>
          ) : (
            <></>
          )}

          {/* DIFFERENT SUCCESS STATE PASSED DOWN, CHANGE BELOW */}

          {this.props.sentGroupInviteSuccess ? (
            <>
              <p></p>
              <Alert variant="success" dismissible>
                <Alert.Heading>Invite Sent!</Alert.Heading>
                You have successfully invited{" "}
                <b>{this.props.sendToNameInvite}!</b>
              </Alert>
            </>
          ) : (
            <></>
          )}

          {/* DIFFERENT FAILURE STATE PASSED DOWN, CHANGE BELOW */}
          {this.props.sentGroupInviteError ? (
            <>
              <p></p>
              <Alert variant="danger" dismissible>
                <Alert.Heading>Invite Error</Alert.Heading>
                Invite failed to send. You may have insufficient credits or
                there may have been a platform error.
              </Alert>
            </>
          ) : (
            <></>
          )}

          {/* DIFFERENT FAILURE STATE PASSED DOWN, CHANGE BELOW */}
          {this.state.sentMsgError ? (
            <>
              <p></p>
              <Alert variant="danger" dismissible>
                <Alert.Heading>Message Error</Alert.Heading>
                Message failed to send. You may have insufficient credits or
                there may have been a platform error.
              </Alert>
            </>
          ) : (
            <></>
          )}
        </div>

        {this.state.isModalShowing &&
        this.state.presentModal === "NewMessageModal" ? (
          <NewMessageModal
            submitDGTmessage={this.props.submitDGTmessage}
            selectedGroup={this.props.selectedGroup}
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.props.mode}
          />
        ) : (
          <></>
        )}

        {this.state.isModalShowing &&
        this.state.presentModal === "SendInviteModal" ? (
          <SendInviteModal
            submitDGTinvite={this.props.submitDGTinvite}
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.props.mode}
          />
        ) : (
          <></>
        )}

        {this.state.isModalShowing &&
        this.state.presentModal === "ViewMembersModal" ? (
          <ViewMembersModal
            LoadingMembers={this.state.LoadingMembers}
            showDeleteModal={this.props.showModal}
            groupMembers={this.state.groupMembers}
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.props.mode}
          />
        ) : (
          <></>
        )}
      </>
    );
  }
}

export default Group;
