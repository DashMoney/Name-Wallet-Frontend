import React from "react";
import Button from "react-bootstrap/Button";

import Spinner from "react-bootstrap/Spinner";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import CloseButton from "react-bootstrap/CloseButton";

import dapiClientNoWallet from "../DapiClientNoWallet";

import Dash from "dash";

class NewDMModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingNames: false,
      taggedArray: [],
      messageInput: "",
      tooLongError: false,
      tooManyTagsError: false,
      tooFewTagsError: false,
      validityAvail: false,
      validityCheck: false,

      retrievedNameLabelArray: [],
      ownerIdsfromTagsRetrieved: [],
    };
  }

  /*
  <NewDMModal
            whichNetwork={this.state.whichNetwork}
            uniqueName={this.state.uniqueName}
            submitDSODocument={this.submitDSODocument}
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
            closeExpandedNavs={this.closeExpandedNavs}
          />
  */

  handleCloseClick = () => {
    this.props.hideModal();
  };

  taggedValidate = (taggedInput) => {
    let regex = /[@]{1}[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]/gm;
    //Added the g so returns all tags
    //let regex = /[@]{1}[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]/m;
    //Remove the g so that only returns the first one

    //Accomplishes for Display -> handles if no tags, removes @
    //DOESN'T HANDLE IF NAMES ARE DIFFERNT UPPER OR LOWERCASE

    let tags = taggedInput.match(regex);

    //console.log(tags);
    if (tags === null) {
      tags = [];
    }

    let names = [];

    if (tags.length >= 1) {
      names = tags.map((tag) => tag.slice(1));
      //console.log(names);
    }

    //This makes sure that only a list of unique names is made.
    let uniqueNames = new Set([...names]);
    //Puts in back to an array
    let nameArray = [...uniqueNames];

    //Still lets through upper/lowercase differences but its okay for now

    return nameArray;
  };

  formValidate = (messageText) => {
    let regex1 = /^.[\S\s]{0,450}$/;

    let valid1 = regex1.test(messageText);

    let regex2 = /^(?:[^\r\n]*(?:\r\n?|\n)){0,4}[^\r\n]*$/;

    let valid2 = regex2.test(messageText);

    let valid = false;

    if (valid1 && valid2) {
      valid = true;
    }

    if (valid && !this.state.tooManyTagsError && !this.state.tooFewTagsError) {
      //Put tag error here
      this.setState({
        messageInput: messageText,
        tooLongError: false,
      });
      return true;
    } else {
      if (messageText.length > 450 || !valid2) {
        this.setState({
          tooLongError: true,
        });
      }
      return false;
    }
  };

  onChange = (event) => {
    event.preventDefault();
    event.stopPropagation();

    //console.log(event.target.value);
    //this is the message body!!!

    let taggedNames = this.taggedValidate(event.target.value);

    //
    //MUST RESET THE NAMES AND OWNERIDS IF TAGS ARE DELETED**
    //
    if (
      taggedNames.length === 0 &&
      this.state.retrievedNameLabelArray.length > 0
    ) {
      this.setState({
        retrievedNameLabelArray: [],
        ownerIdsfromTagsRetrieved: [],
      });
    }

    //console.log(taggedNames);
    // console.log('Too few tags: ', this.state.tooFewTagsError);

    if (this.formValidate(event.target.value) && taggedNames.length >= 1) {
      if (taggedNames.length < 1) {
        this.setState({
          tooFewTagsError: true,
          validityCheck: true,
          taggedArray: taggedNames,
        });
      } else if (taggedNames.length > 10) {
        this.setState({
          validityCheck: true,
          taggedArray: taggedNames,
          tooManyTagsError: true,
        });
      } else {
        this.setState({
          tooManyTagsError: false,
          tooFewTagsError: false,
          validityCheck: true,
          taggedArray: taggedNames,
        });
      }
    } else {
      this.setState({
        validityCheck: false,
        taggedArray: taggedNames,
      });
    }
  };

  handleSubmitClick = (event) => {
    event.preventDefault();
    // console.log(event.target.ControlTextarea1.value);

    this.setState({
      isLoadingNames: true,
    });

    if (this.formValidate(event.target.ControlTextarea1.value)) {
      //Accomplishes for Document Creation -> sets lowercase,  and ensures unique on lowercase

      let names = this.state.taggedArray;

      // names.push(this.props.uniqueName); //Add the author
      // console.log(names);

      names = names.map((tag) => tag.toLowerCase());
      //console.log(names);

      let uniqueNames = new Set([...names]); // ensures unique

      let nameArray = [...uniqueNames]; //Puts in back to an array

      console.log(nameArray);

      //base58

      let base58NameArray = nameArray.map((name) => {
        let base58Name = name.replace(/l/g, "1");
        base58Name = base58Name.replace(/i/g, "1");
        base58Name = base58Name.replace(/o/g, "0");

        return base58Name;
      });
      console.log(base58NameArray);

      if (
        this.state.taggedArray.length -
          this.state.retrievedNameLabelArray.length ===
          0 &&
        this.checkNamesVersusTags()
      ) {
        //Use this to separate the function into verify and submit respectively.
        //So the first part will be for submitting bc ===1
        let newMessage;

        /*dsomsg ->
      msg, sh,  (only first 2 are required)
*/
        newMessage = {
          //OR JUST PUT TYPE: SO OR DM HERE?
          sh: "dir", //this just goes to function and not DataContract creation
          msg: `${event.target.ControlTextarea1.value}`,
        };

        if (this.state.ownerIdsfromTagsRetrieved.length > 0) {
          //SINGLE TAG CHANGE****
          this.props.submitDSODocument(
            newMessage,
            [this.state.ownerIdsfromTagsRetrieved[0]] //SINGLE TAG CHANGE****
          );
        } else {
          this.props.submitDSODocument(
            newMessage,
            this.state.ownerIdsfromTagsRetrieved
          );
        }

        this.props.hideModal();
      } else {
        //this part will be the retrieving the name labels..

        //START OF NAME RETRIEVAL

        // console.log("Calling getDPNSDocsforNewDMModal");

        const client = new Dash.Client(
          dapiClientNoWallet(this.props.whichNetwork)
        );

        const getNameDocuments = async () => {
          return client.platform.documents.get("DPNSContract.domain", {
            where: [
              ["normalizedParentDomainName", "==", "dash"],
              // Return all matching names from the provided array
              ["normalizedLabel", "in", base58NameArray],
            ],
            orderBy: [["normalizedLabel", "asc"]],
          });
        };

        getNameDocuments()
          .then((d) => {
            if (d.length === 0) {
              //  console.log("No DPNS domain documents retrieved.");
            }

            let nameDocArray = [];

            for (const n of d) {
              //console.log("NameDoc:\n", n.toJSON());

              nameDocArray = [n.toJSON(), ...nameDocArray];
            }
            //console.log(`DPNS Name Docs: ${nameDocArray}`);

            let ownerarrayOfOwnerIds = nameDocArray.map((doc) => {
              return doc.$ownerId;
            });

            let retrievedNameLabels = nameDocArray.map((doc) => {
              return doc.label;
            });

            //  console.log("Names of Tags!");
            //  console.log(retrievedNameLabels);

            this.setState({
              retrievedNameLabelArray: retrievedNameLabels,
              ownerIdsfromTagsRetrieved: ownerarrayOfOwnerIds,
              isLoadingNames: false,
            });
          })
          .catch((e) => {
            console.error("Something went wrong:\n", e);
          });
        //END OF NAME RETRIEVAL
      }
    } else {
      console.log("Invalid Message");
    }
  };

  checkNamesVersusTags = () => {
    if (
      this.state.taggedArray.length !== 0 &&
      this.state.retrievedNameLabelArray.length !== 0
    ) {
      let lowerCaseRetrieved = this.state.retrievedNameLabelArray.map((name) =>
        name.toLowerCase()
      );

      return this.state.taggedArray.every((tag) => {
        let normalizedTag = tag.toLowerCase();
        // normalizedTag = normalizedTag.replace(/l/g, '1');
        // normalizedTag = normalizedTag.replace(/i/g, '1');
        // normalizedTag = normalizedTag.replace(/o/g, '0');

        return lowerCaseRetrieved.find((name) => name === normalizedTag);
      });
    } else {
      return true;
    }
  };

  render() {
    let modalBkg = "";
    let closeButtonColor;
    let modalBackdrop;

    if (this.props.mode === "primary") {
      modalBackdrop = "modal-backdrop-nochange";
      modalBkg = "modal-backcolor-primary";
      closeButtonColor = <CloseButton onClick={this.handleCloseClick} />;
    } else {
      modalBackdrop = "modal-backdrop-dark";
      modalBkg = "text-bg-dark";
      closeButtonColor = (
        <CloseButton onClick={this.handleCloseClick} variant="white" />
      );
    }

    //Fix the rendering of the Tagged names here
    let namesToDisplay = "";
    if (this.state.taggedArray.length >= 1) {
      namesToDisplay = "";
      this.state.taggedArray.forEach((name) => (namesToDisplay += " " + name));
    }

    //Fix the rendering of the names labels here
    let labelsToDisplay = "";
    if (this.state.retrievedNameLabelArray.length >= 1) {
      labelsToDisplay = this.state.retrievedNameLabelArray[0]; //SINGLE TAG CHANGE****
      //labelsToDisplay = "";
      // this.state.retrievedNameLabelArray.forEach(
      //   (label) => (labelsToDisplay += " " + label)
      // );
    }

    return (
      <>
        <Modal
          show={this.props.isModalShowing}
          backdropClassName={modalBackdrop}
          contentClassName={modalBkg}
        >
          <Modal.Header>
            <Modal.Title>
              <h3>
                <b>Direct Message</b>
              </h3>
            </Modal.Title>
            {closeButtonColor}
          </Modal.Header>
          <Modal.Body>
            <Form noValidate onSubmit={this.handleSubmitClick}>
              <Form.Group className="mb-3" controlId="ControlTextarea1">
                {/* <Form.Label>Example textarea</Form.Label> */}

                <Form.Control
                  onChange={this.onChange}
                  as="textarea"
                  rows={4}
                  placeholder="Write message here.."
                  required
                  isInvalid={
                    this.state.tooLongError ||
                    this.state.tooManyTagsError | this.state.tooFewTagsError ||
                    (this.state.taggedArray !== 0 &&
                      this.state.retrievedNameLabelArray.length !==
                        this.state.taggedArray.length)
                  }
                />

                {this.state.tooLongError ? (
                  <Form.Control.Feedback className="floatLeft" type="invalid">
                    Sorry, this is too long! Please use less than 450
                    characters.
                  </Form.Control.Feedback>
                ) : (
                  <></>
                )}

                {this.state.tooFewTagsError ? (
                  <Form.Control.Feedback className="floatLeft" type="invalid">
                    Direct Messages need at least one tag.
                  </Form.Control.Feedback>
                ) : (
                  <></>
                )}

                {this.state.tooManyTagsError ? (
                  <Form.Control.Feedback className="floatLeft" type="invalid">
                    Sorry, too many tags! Please use no more than 10 tags.
                  </Form.Control.Feedback>
                ) : (
                  <></>
                )}

                {/* {this.state.taggedArray !== 0 &&
                this.state.retrievedNameLabelArray.length !==
                  this.state.taggedArray.length ? (
                  <Form.Control.Feedback className="floatLeft" type="invalid" >
                    Please use <b>Verify Tags</b> below, to ensure there is a Dash Name that matches before sending.
                  </Form.Control.Feedback>
                ) : (
                  <></>
                )} */}

                {this.state.taggedArray.length < 1 ? (
                  <div>
                    <p></p>
                    <div>Add @Name to tag another user.</div>
                    <div>(Direct Messages must have at least 1 tag.)</div>
                  </div>
                ) : (
                  <div>
                    <p></p>
                    <b>Tags: </b>
                    {namesToDisplay}
                  </div>
                )}

                {this.state.retrievedNameLabelArray.length < 1 ? (
                  <></>
                ) : (
                  <>
                    <div>
                      <b>Dash Names: </b>
                      {labelsToDisplay}
                    </div>
                  </>
                )}

                {this.state.retrievedNameLabelArray.length < 1 &&
                this.state.taggedArray.length > 0 ? (
                  <div>
                    <b>Dash Names: </b>(There are no matching Dash Names)
                  </div>
                ) : (
                  <></>
                )}
                {/* SINGLE TAG CHANGE**** */}
                {this.state.retrievedNameLabelArray.length > 1 ? (
                  <p
                    className="smallertext"
                    style={{ color: "red", marginTop: ".2rem" }}
                  >
                    <b>
                      Sorry, currently only single tag messages available for
                      now.
                    </b>
                  </p>
                ) : (
                  <></>
                )}

                {this.state.isLoadingNames ? (
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
              </Form.Group>

              {this.state.taggedArray.length -
                this.state.retrievedNameLabelArray.length ===
                0 && this.checkNamesVersusTags() ? (
                this.state.validityCheck &&
                this.state.ownerIdsfromTagsRetrieved.length <= 1 ? ( //SINGLE TAG CHANGE**** the last one above
                  <Button variant="primary" type="submit">
                    Create Message
                  </Button>
                ) : (
                  <Button variant="primary" disabled type="submit">
                    Create Message
                  </Button>
                )
              ) : this.state.validityCheck && !this.state.isLoadingNames ? (
                <Button variant="primary" type="submit">
                  Verify Tags
                </Button>
              ) : (
                <Button variant="primary" disabled type="submit">
                  Verify Tags
                </Button>
              )}
            </Form>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default NewDMModal;
