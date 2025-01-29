import React from "react";

import ButtonGroup from "react-bootstrap/ButtonGroup";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import CloseButton from "react-bootstrap/CloseButton";
import Spinner from "react-bootstrap/Spinner";

import Reviews from "./PostModalAddons/DGReview/Reviews"; //DGR Integration
import RatingSummary from "./PostModalAddons/DGReview/RatingSummary";

import DGPView from "./PostModalAddons/DGPaid/DGPView";

import dapiClientNoWallet from "../DapiClientNoWallet";

import Dash from "dash";

const {
  PlatformProtocol: { Identifier },
} = Dash;

//1) Must bring in the functions to do this.

/**
               * 
               * {!this.state.isLoadingSearch ? (
          <>
             <Reviews 
            mode={this.state.mode} //Props

            SearchedReviews={this.state.SearchedReviews}  // State
            SearchedReviewNames={this.state.SearchedReviewNames} //State
            SearchedReplies={this.state.SearchedReplies} //State

            SearchedNameDoc={this.state.SearchedNameDoc} //Props

              />
          </>
        ) : (
          <></>
        )}

        {this.state.isLoadingSearch ? (
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
               */

class PostModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copiedName: false,
      copiedAddress: false,
      whichDSODGR: "DSO",
      LoadingDGR: true,
      LoadingDSO: true, // => Move DSO to app so can load entire time and pop alert that it sent?
      LoadingDGP: true,

      //DGR State to pass
      SearchedReviews: [],
      SearchedReviewNames: [],
      SearchedReplies: [],

      SearchDGR1: false,
      SearchDGR2: false,

      merchantStore: [],

      SearchDGP1: false,
      SearchDGP2: false,
    };
  }

  triggerDSOButton = () => {
    this.setState({
      whichDSODGR: "DSO",
    });
  };

  triggerDGRButton = () => {
    this.setState({
      whichDSODGR: "DGR",
    });
  };

  handleCloseClick = () => {
    this.props.hideModal();
  };

  handleNameClick = (nameLabel) => {
    navigator.clipboard.writeText(nameLabel);
    this.setState({
      copiedName: true,
    });
  };

  //   handleName = (msgDoc) =>{
  //     if(msgDoc.$ownerId === this.props.identity){
  //     return <span style={{ color: "#008de4" }}>{this.props.uniqueName}</span>
  //     }

  //     //*** *** */
  //       let nameDoc = this.props.PostNames.find(doc => {
  //         return msgDoc.$ownerId === doc.$ownerId
  //       })

  //       if(nameDoc === undefined){
  //         return 'Not Found'
  //       }

  //       return <span style={{ color: "#008de4" }} onClick={() => this.handleNameClick(nameDoc.label)}>
  //         {nameDoc.label}
  //         </span>
  // }

  formatDate(theCreatedAt, today, yesterday) {
    let CreatedAt = new Date(theCreatedAt);

    // const timeOptions = {
    //   hour: "numeric",
    //   minute: "2-digit", //numeric?
    // };

    // function isSameDay(date1, date2) {
    //   return (
    //     date1.getDate() === date2.getDate() &&
    //     date1.getMonth() === date2.getMonth() &&
    //     date1.getFullYear() === date2.getFullYear()
    //   );
    // }

    // if (isSameDay(CreatedAt, today)) {
    //   // it's today
    //   return `Today at ${CreatedAt.toLocaleTimeString(undefined, timeOptions)}`;
    // }

    // if (isSameDay(CreatedAt, yesterday)) {
    //   // it was yesterday
    //   return `Yesterday at ${CreatedAt.toLocaleTimeString(
    //     undefined,
    //     timeOptions
    //   )}`;
    // }
    // let dateReturn = CreatedAt.toLocaleDateString().concat(
    //   "  ",
    //   CreatedAt.toLocaleTimeString(undefined, timeOptions)
    // );

    let dateReturn = CreatedAt.toLocaleDateString();

    return dateReturn;
  }

  // getDGPItems = (theIdentity) => {
  //   if (!this.state.LoadingItems) {
  //     this.setState({
  //       LoadingItems: true,
  //     });
  //   }

  //   const client = new Dash.Client(dapiClientNoWallet(this.props.whichNetwork));

  //   const getDocuments = async () => {
  //     console.log("Called Get DGP Items");

  //     return client.platform.documents.get("DGPContract.dgpitem", {
  //       where: [["$ownerId", "==", theIdentity]],
  //     });
  //   };

  //   getDocuments()
  //     .then((d) => {
  //       let docArray = [];

  //       for (const n of d) {
  //         //console.log("Item:\n", n.toJSON());
  //         docArray = [...docArray, n.toJSON()];
  //       }

  //       if (docArray.length === 0) {
  //         this.setState({
  //           LoadingItems: false,
  //         });
  //       } else {
  //         this.setState({
  //           merchantItems: docArray,
  //           LoadingItems: false,
  //         });
  //       } //Ends the else
  //     })
  //     .catch((e) => {
  //       console.error("Something went wrong:\n", e);
  //       this.setState({
  //         itemError: true,
  //         LoadingItems: false,
  //       });
  //     })
  //     .finally(() => client.disconnect());
  // };

  /* ####  ####  ####  ####  ####  ####  ####  ####  ####  ####  ####  #### */

  //PUT THE QUERY SEARCHES HERE

  // startSearch = (identityToSearch) =>{ //Called from name doc pulled ->
  //   this.getSearchReviews(identityToSearch);
  // }

  // ####      ####       ####      ####       ####      ####       ####

  searchDGRRace = () => {
    if (this.state.SearchDGR1 && this.state.SearchDGR2) {
      this.setState({
        SearchDGR1: false,
        SearchDGR2: false,
        //DONT HAVE TO ADD STATE TO PUSH TO DISPLAY BECAUSE THE REVIEWS AND NAMES PUSHED TOGETHER AND THEN THREADS APPEAR <- SO DO I WANT TO QUERY NAME FIRST THEN?
        LoadingDGR: false,
      });
    }
  };

  getSearchReviews = (theIdentity) => {
    //console.log("Calling getSearchReviews");

    const client = new Dash.Client(dapiClientNoWallet(this.props.whichNetwork));

    const getDocuments = async () => {
      return client.platform.documents.get("DGRContract.dgrreview", {
        where: [
          ["toId", "==", theIdentity],
          ["$createdAt", "<=", Date.now()],
        ],
        orderBy: [["$createdAt", "desc"]],
      });
    };

    getDocuments()
      .then((d) => {
        if (d.length === 0) {
          //console.log("There are no SearchReviews");

          this.setState(
            {
              SearchDGR1: true,
              SearchDGR2: true,
              SearchedReviews: [],
            },
            () => this.searchDGRRace()
          );
        } else {
          let docArray = [];
          //console.log("Getting Search Reviews");

          for (const n of d) {
            let returnedDoc = n.toJSON();

            //console.log("Review:\n", returnedDoc);
            returnedDoc.toId = Identifier.from(
              returnedDoc.toId,
              "base64"
            ).toJSON();
            //console.log("newReview:\n", returnedDoc);

            docArray = [...docArray, returnedDoc];
          }
          this.getSearchReviewNames(docArray);
          this.getSearchReplies(docArray);
        }
      })
      .catch((e) => console.error("Something went wrong:\n", e))
      .finally(() => client.disconnect());
  };

  getSearchReviewNames = (docArray) => {
    const client = new Dash.Client(dapiClientNoWallet(this.props.whichNetwork));
    //START OF NAME RETRIEVAL

    let ownerarrayOfOwnerIds = docArray.map((doc) => {
      return doc.$ownerId;
    });

    let setOfOwnerIds = [...new Set(ownerarrayOfOwnerIds)];

    let arrayOfOwnerIds = [...setOfOwnerIds];

    // Start of Setting Unique reviews
    let arrayOfReviews = arrayOfOwnerIds.map((id) => {
      return docArray.find((doc) => id === doc.$ownerId);
    });
    // End of Setting Unique reviews

    // arrayOfOwnerIds = arrayOfOwnerIds.map((ownerId) =>
    //   Buffer.from(Identifier.from(ownerId))
    // );

    //console.log("Calling getNamesforDSOmsgs");

    const getNameDocuments = async () => {
      return client.platform.documents.get("DPNSContract.domain", {
        where: [["records.identity", "in", arrayOfOwnerIds]],
        orderBy: [["records.identity", "asc"]],
      });
    };

    getNameDocuments()
      .then((d) => {
        //WHAT IF THERE ARE NO NAMES? -> THEN THIS WON'T BE CALLED
        if (d.length === 0) {
          //console.log("No DPNS domain documents retrieved.");
        }

        let nameDocArray = [];

        for (const n of d) {
          //console.log("NameDoc:\n", n.toJSON());

          nameDocArray = [n.toJSON(), ...nameDocArray];
        }
        //console.log(`DPNS Name Docs: ${nameDocArray}`);

        this.setState(
          {
            SearchedReviewNames: nameDocArray,
            SearchedReviews: arrayOfReviews, //This is a unique set of reviews only single review per reviewer
            SearchDGR1: true,
          },
          () => this.searchDGRRace()
        );
      })
      .catch((e) => {
        console.error("Something went wrong getting Search DGR Names:\n", e);
      })
      .finally(() => client.disconnect());
    //END OF NAME RETRIEVAL
  };

  getSearchReplies = (docArray) => {
    const client = new Dash.Client(dapiClientNoWallet(this.props.whichNetwork));

    // This Below is to get unique set of ByYou review doc ids
    let arrayOfReviewIds = docArray.map((doc) => {
      return doc.$id;
    });

    //console.log("Array of ByYouThreads ids", arrayOfReviewIds);

    let setOfReviewIds = [...new Set(arrayOfReviewIds)];

    arrayOfReviewIds = [...setOfReviewIds];

    //console.log("Array of order ids", arrayOfReviewIds);

    const getDocuments = async () => {
      //console.log("Called Get Search Replies");

      return client.platform.documents.get("DGRContract.dgrreply", {
        where: [["reviewId", "in", arrayOfReviewIds]], // check reviewId ->
        orderBy: [["reviewId", "asc"]],
      });
    };

    getDocuments()
      .then((d) => {
        let docArray = [];

        for (const n of d) {
          let returnedDoc = n.toJSON();
          //console.log("Thr:\n", returnedDoc);
          returnedDoc.reviewId = Identifier.from(
            returnedDoc.reviewId,
            "base64"
          ).toJSON();
          //console.log("newThr:\n", returnedDoc);
          docArray = [...docArray, returnedDoc];
        }

        this.setState(
          {
            SearchDGR2: true,
            SearchedReplies: docArray,
          },
          () => this.searchDGRRace()
        );
      })
      .catch((e) => {
        console.error("Something went wrong Search DGR Replies:\n", e);
      })
      .finally(() => client.disconnect());
  };

  // ####      ####       ####      ####       ####      ####       ####

  searchDGPRace = () => {
    if (this.state.SearchDGP1 && this.state.SearchDGP2) {
      this.setState({
        SearchDGP1: false,
        SearchDGP2: false,
        LoadingDGP: false,
      });
    }
  };

  getDGPStore = (theIdentity) => {
    const client = new Dash.Client(dapiClientNoWallet(this.props.whichNetwork));

    const getDocuments = async () => {
      //console.log("Called Get DGP Store");

      return client.platform.documents.get("DGPContract.dgpstore", {
        where: [["$ownerId", "==", theIdentity]],
      });
    };

    getDocuments()
      .then((d) => {
        let docArray = [];

        if (d.length === 0) {
          this.setState(
            {
              merchantStore: [],
              SearchDGP1: true,
            },
            () => this.searchDGPRace()
          );
        } else {
          for (const n of d) {
            //console.log("Store:\n", n.toJSON());
            docArray = [...docArray, n.toJSON()];
          }
          this.setState(
            {
              merchantStore: docArray,
              SearchDGP1: true,
            },
            () => this.searchDGPRace()
          );
        } //Ends the else
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
      })
      .finally(() => client.disconnect());
  };

  getDGPItems = (theIdentity) => {
    const client = new Dash.Client(dapiClientNoWallet(this.props.whichNetwork));

    const getDocuments = async () => {
      //console.log("Called Get DGP Items");

      return client.platform.documents.get("DGPContract.dgpitem", {
        where: [["$ownerId", "==", theIdentity]],
      });
    };

    getDocuments()
      .then((d) => {
        let docArray = [];

        for (const n of d) {
          //console.log("Item:\n", n.toJSON());
          docArray = [...docArray, n.toJSON()];
        }

        if (docArray.length === 0) {
          this.setState(
            {
              merchantItems: [],
              SearchDGP2: true,
            },
            () => this.searchDGPRace()
          );
        } else {
          this.setState(
            {
              merchantItems: docArray,
              SearchDGP2: true,
            },
            () => this.searchDGPRace()
          );
        } //Ends the else
      })
      .catch((e) => {
        console.error("Something went wrong DGP Items:\n", e);
      })
      .finally(() => client.disconnect());
  };

  // ####      ####       ####      ####       ####      ####       ####

  componentDidMount() {
    this.getSearchReviews(this.props.selectedSearchedPostNameDoc.$ownerId);

    if (this.props.selectedSearchedPost.dgp) {
      this.getDGPStore(this.props.selectedSearchedPostNameDoc.$ownerId);
      this.getDGPItems(this.props.selectedSearchedPostNameDoc.$ownerId);
    }
  }

  render() {
    let today = new Date();
    let yesterday = new Date(today);

    yesterday.setDate(yesterday.getDate() - 1);

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

    return (
      <Modal
        show={this.props.isModalShowing}
        backdropClassName={modalBackdrop}
        contentClassName={modalBkg}
      >
        {/* <Modal.Header> */}

        {/* NO HEADER JUST PUT EVERYTHING IN THE BODY??? -> PROBABLY NEED TO TEST AND LOOK AT ->  */}

        {/* <Modal.Title>
          <h3>
               <b>Selected Post</b>
               </h3>
               </Modal.Title>  */}

        {/* </Modal.Header> */}
        <Modal.Body>
          <div className="postModalCloseButton">
            <Modal.Title>{closeButtonColor}</Modal.Title>
          </div>

          <div className="locationTitle">
            <h5>
              <Badge bg="primary" style={{ marginRight: ".2rem" }}>
                {this.props.selectedSearchedPost.city}
              </Badge>
            </h5>

            <h5>
              <Badge bg="primary" style={{ marginRight: ".2rem" }}>
                {this.props.selectedSearchedPost.region}
              </Badge>
            </h5>

            <h5>
              <Badge bg="primary">
                {this.props.selectedSearchedPost.country}
              </Badge>
            </h5>
          </div>
          <p></p>
          <div className="cardTitle">
            <h4
              style={{ color: "#008de4" }}
              onClick={() =>
                this.handleNameClick(
                  this.props.selectedSearchedPostNameDoc.label
                )
              }
            >
              {this.props.selectedSearchedPostNameDoc.label}
            </h4>

            {/* <span onClick={() => this.handleNameClick()}>
    {this.props.tuple[0]}
  </span> */}
            <span>{this.state.copiedName ? <span>✅</span> : <></>}</span>

            <span className="textsmaller">
              {this.formatDate(
                this.props.selectedSearchedPost.$createdAt,
                today,
                yesterday
              )}
            </span>
          </div>

          <p style={{ whiteSpace: "pre-wrap" }}>
            {this.props.selectedSearchedPost.description}
          </p>

          {this.props.selectedSearchedPost.link !== undefined &&
          this.props.selectedSearchedPost.link !== "" ? (
            <>
              <a
                rel="noopener noreferrer"
                target="_blank"
                href={this.props.selectedSearchedPost.link}
              >
                <b>{this.props.selectedSearchedPost.link}</b>
              </a>
            </>
          ) : (
            <></>
          )}
          <p></p>
          {this.props.selectedSearchedPost.address !== undefined &&
          this.props.selectedSearchedPost.address !== "" ? (
            <>
              <p style={{ whiteSpace: "pre-wrap" }}>
                {this.props.selectedSearchedPost.address}
              </p>
              {/* ADD COPY HERE */}
              <Button
                variant="outline-primary"
                onClick={() => {
                  navigator.clipboard.writeText(
                    this.props.selectedSearchedPost.address
                  );
                  this.setState({
                    copiedAddress: true,
                  });
                }}
              >
                <b>Copy</b>
              </Button>
              {this.state.copiedAddress ? <span>Copied!</span> : <></>}
            </>
          ) : (
            <></>
          )}
          <p></p>
          {this.props.selectedSearchedPost.category === "offbiz" ? (
            <>
              <h5>
                <b>Shop/Menu Items</b>
              </h5>

              {/* CURRENTLY NOT USING THE STORE DOC AT ALL => ? => 

    SO I THINK i NEED TO HAVE THE STORE BE A BUTTON THAT SAYS VIEW STORE/MENU ITEMS AND DISPLAYS THE STORE INFO/STATUS/DESCRIPTION/PAYLATER etc..


*/}

              {this.state.LoadingDGP ? (
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

              {/* <h5>DashGetPaid (Coming Soon)</h5>
<p>I think this will not be a button and will just straight up load the DGPSTore and items!!</p> */}

              {this.props.selectedSearchedPost.dgp && !this.state.LoadingDGP ? (
                <>
                  <DGPView
                    whichNetwork={this.props.whichNetwork}
                    merchantStore={this.state.merchantStore}
                    merchantItems={this.state.merchantItems}
                    mode={this.props.mode}
                  />
                </>
              ) : (
                <></>
              )}
            </>
          ) : (
            <></>
          )}
          <p></p>
          <div className="BottomBorder"></div>
          <p></p>

          <h4>
            <b>Reviews</b>
          </h4>

          {/* Move out of button group and removed DSO */}

          {this.state.LoadingDGR ? (
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

          <RatingSummary
            SearchedReviews={this.state.SearchedReviews}
            SearchedNameDoc={this.props.selectedSearchedPostNameDoc}
            isLoadingSearch={this.state.LoadingDGR}
          />

          {!this.state.LoadingDGR ? (
            <>
              <Reviews
                mode={this.props.mode} //Props
                SearchedReviews={this.state.SearchedReviews} // State
                SearchedReviewNames={this.state.SearchedReviewNames} //State
                SearchedReplies={this.state.SearchedReplies} //State
                SearchedNameDoc={this.props.selectedSearchedPostNameDoc} //Props
              />
            </>
          ) : (
            <></>
          )}

          {this.state.SearchedReviews.length === 0 && !this.state.LoadingDGR ? (
            <div className="bodytext">
              <p>Sorry, there are no reviews available.</p>
            </div>
          ) : (
            <></>
          )}
        </Modal.Body>
      </Modal>
    );
  }
}

export default PostModal;
