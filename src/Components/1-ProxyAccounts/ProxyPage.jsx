//Button at top -> Add a Proxy

//My Proxy Accounts (this is the list)

//then the modal pops up and you add the Identity Id

//also modals for editing proxies -> Label add, delete proxy

//needs to verify the document of the Proxy so It will search and verify and then allow to be proxy.

// also the proxies document must be unique(singleton) so not multiple Proxy Controllers!

// Maybe add the credits in an identity as well!!

import React from "react";
import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
//import Alert from "react-bootstrap/Alert";

import CreditsOnPage from "../CreditsOnPage";

class ProxyPage extends React.Component {
  handleTimeToDate = (timeObject) => {
    let date = new Date(timeObject);
    //let longFormDate= setTime(date);
    return date.toLocaleDateString();
  };

  componentDidMount() {
    this.props.pullInitialTriggerPROXY();
  }

  render() {
    // Deactivate?? list for reactivate.
    // NO , just delete and active

    let proxyCards = <></>;

    let cardBkg;
    let cardText;

    if (this.props.mode === "primary") {
      cardBkg = "white";
      cardText = "dark";
    } else {
      cardBkg = "dark";
      cardText = "white";
    }

    //USE THIS FOR THE PROXY DOC AND THE IDENTITY CREDITS?
    //let tupleArray = [];

    //this.props.ProxyController
    //this.props.ProxyDocs
    //this.props.ProxyIdentities

    // tupleArray = othersInvites.map((invite) => {
    //   let tuple = "";

    //   for (let nameDoc of this.props.dgtInvitesNames) {
    //     if (nameDoc.$ownerId === invite.$ownerId) {
    //       tuple = [nameDoc.label, invite];
    //       break;
    //     }
    //   }
    //   if (tuple !== "") {
    //     return tuple;
    //   }

    //   return ["No Name Avail..", invite];
    // });
    if (!this.props.isLoadingProxy) {
      proxyCards = this.props.ProxyController.proxyList.map((proxy, index) => {
        //proxy -> IdentityId=[0] and label=[1]
        // need to find that proxyDoc is not undefined

        let proxyVerified = this.props.ProxyDocs.find((proxyDoc) => {
          return proxyDoc.$ownerId === proxy[0];
        });
        // if (proxyVerified !== undefined) {
        //   //PUT THE WHOLE RETURN HERE AND THEN
        // }
        //and dont have credits yet so just place Holder
        return (
          <Card id="card" key={index} bg={cardBkg} text={cardText}>
            <Card.Body>
              <Card.Title className="cardTitle">
                <div>
                  {proxyVerified !== undefined ? (
                    <>
                      <h5>
                        <b style={{ color: "#008de4" }}>
                          {this.props.uniqueName}*
                        </b>
                      </h5>
                    </>
                  ) : (
                    <>
                      <h5>
                        <b style={{ color: "red" }}>No Connected Proxy</b>
                      </h5>
                    </>
                  )}

                  {proxy[1] !== undefined && proxy[1] !== "" ? (
                    <>
                      <p>{proxy[1]}</p>
                    </>
                  ) : (
                    <>
                      <p style={{ color: "red" }}>No Label</p>
                    </>
                  )}
                </div>
                {/* 
          <Button variant="outline-primary" 
          onClick={()=> this.handleNameClick()          
          }
          >Copy</Button>
          {this.state.copiedName?<span>☑️🔵☑️</span>:<></>} */}

                {/* <span className="textsmaller">
                
                {this.formatDate(
                  this.props.tuple[1].$createdAt,
                  this.props.today,
                  this.props.yesterday
                )}
              </span> */}
              </Card.Title>

              <div
                style={{
                  textAlign: "center",
                  marginTop: "1.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <p>
                  {/* <Badge className="paddingBadge" bg="primary" pill> */}
                  {/* {this.handleCreditsToTopup()}  */}
                  This is where the proxy's <b>Platform Credits</b> will display
                  when the getIdentitiesBalances is added to the JS SDK.
                  {/* </Badge> */}
                </p>
                {proxyVerified !== undefined ? (
                  <>
                    <p style={{ fontSize: "small", opacity: "0.8" }}>
                      Created:
                      {this.handleTimeToDate(proxyVerified.$createdAt)}
                    </p>
                  </>
                ) : (
                  <></>
                )}

                {/* <h5>
                <b>the credits in Topups</b>
              </h5> */}
              </div>

              {/* <Card.Text
              onClick={() => this.handleReplyClick()}
              style={{ whiteSpace: "pre-wrap" }}
            >
            
              Hello!
            </Card.Text> */}
              <div className="TwoButtons">
                {/* <div className="ButtonRightNoUnderline"> */}
                <Button
                  variant="primary"
                  style={{}}
                  onClick={() => this.props.handleDeleteProxy(proxy, index)}
                >
                  <b>Delete Proxy</b>
                  {/* <Badge className="createwalletbtn" bg="light" text="dark" pill>
            {this.handleTimeToDate(acceptedGroup.$createdAt)}
          </Badge> */}
                </Button>
                <Button
                  variant="primary"
                  style={{}}
                  onClick={() => this.props.handleEditProxy(proxy, index)}
                >
                  <b>Edit Proxy</b>
                  {/* <Badge className="createwalletbtn" bg="light" text="dark" pill>
            {this.handleTimeToDate(acceptedGroup.$createdAt)}
          </Badge> */}
                </Button>
              </div>
            </Card.Body>
          </Card>
        );
      });
    }
    return (
      <>
        <div className="bodytext">
          <CreditsOnPage
            identityInfo={this.props.identityInfo}
            uniqueName={this.props.uniqueName}
            showModal={this.props.showModal}
          />

          <div className="cardTitle">
            <h3>
              <b>Proxy Accounts</b>
            </h3>
          </div>

          <div className="d-grid gap-2">
            <Button
              // style={{ marginRight: "1rem", marginBottom: ".5rem" }}
              size="lg"
              variant="primary"
              onClick={() => this.props.showModal("AddProxyModal")}
            >
              <b>Add Proxy</b>
            </Button>
          </div>
          <p></p>
          {this.props.isLoadingProxy ? (
            <>
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

          {!this.props.isLoadingProxy &&
          this.props.ProxyController.proxyList.length === 0 ? (
            <p style={{ textAlign: "center" }}>
              Proxies, you have created will appear here!
            </p>
          ) : (
            <>{proxyCards}</>
          )}
        </div>
      </>
    );
  }
}

export default ProxyPage;
