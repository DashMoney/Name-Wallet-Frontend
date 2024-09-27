import React from "react";

import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";

import TabsOnPage from "./TabsOnPage";
import LowCreditsOnPage from "../LowCreditsOnPage";
import CreditsOnPage from "../CreditsOnPage";

import NameSearchForm from "./NameSearchForm";
import HowToUseComponent from "./HowToUseComponent";

import YourProofsPage from "./YourProofs/YourProofsPage";
import Proofs from "./Proofs";

class ProofsPage extends React.Component {
  componentDidMount() {
    if (this.props.isLoginComplete && this.props.InitialPullProofs) {
      this.props.pullInitialTriggerPROOFS();
    }
  }
  render() {
    return (
      <>
        {this.props.isLoginComplete ? (
          <>
            <TabsOnPage
              whichTab={this.props.whichTab_POD}
              handleTab={this.props.handleTab_POD}
            />

            <div className="bodytext">
              {this.props.whichTab_POD === "Search" ? (
                <>
                  <LowCreditsOnPage
                    identityInfo={this.props.identityInfo}
                    uniqueName={this.props.uniqueName}
                    showModal={this.props.showModal}
                  />

                  {/* <div className="BottomBorder"></div> */}
                  <p></p>

                  <h3>
                    <b>Get Proof for</b>
                  </h3>

                  <NameSearchForm
                    mode={this.props.mode}
                    nameToSearch={this.props.nameToSearch_POD}
                    nameFormat={this.props.nameFormat_POD}
                    SearchedNameDoc={this.props.SearchedNameDoc_POD}
                    //tooLongNameError={this.props.tooLongNameError}
                    searchName={this.props.searchName_POD}
                    handleOnChangeValidation={
                      this.props.handleOnChangeValidation_POD
                    }
                  />

                  {/* <div className="BottomBorder"></div> */}

                  <p></p>

                  {this.props.isLoadingSearch_POD ? (
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
                      <Proofs
                        mode={this.props.mode}
                        SearchedNameDoc={this.props.SearchedNameDoc_POD}
                        SearchedProofs={this.props.SearchedProofs}
                      />
                    </>
                  )}

                  <p></p>
                  <HowToUseComponent mode={this.props.mode} />
                </>
              ) : (
                <>
                  {/* THIS IS WHERE THE "YOUR PROOFS" WILL GO WHEN LOGGEDIN */}
                  <p></p>
                  <CreditsOnPage
                    identityInfo={this.props.identityInfo}
                    uniqueName={this.props.uniqueName}
                    showModal={this.props.showModal}
                  />

                  <YourProofsPage
                    isLoadingYourProofs={this.props.isLoadingYourProofs}
                    mode={this.props.mode}
                    YourProofs={this.props.YourProofs}
                    uniqueName={this.props.uniqueName}
                    handleDeleteYourProof={this.props.handleDeleteYourProof}
                    showModal={this.props.showModal}
                  />

                  <p></p>
                  <HowToUseComponent mode={this.props.mode} />
                </>
              )}
            </div>
          </>
        ) : (
          // Landing Page ->

          <div className="bodytextnotop">
            <div className="bodytext" style={{ textAlign: "center" }}>
              <h4>Instead of credit history, just prove you have the funds.</h4>
            </div>

            {/* <div className="BottomBorder"></div> */}

            <h3>
              <b>Get Proof for</b>
            </h3>

            <NameSearchForm
              mode={this.props.mode}
              nameToSearch={this.props.nameToSearch_POD}
              nameFormat={this.props.nameFormat_POD}
              SearchedNameDoc={this.props.SearchedNameDoc_POD}
              //tooLongNameError={this.props.tooLongNameError}
              searchName={this.props.searchName_POD}
              handleOnChangeValidation={this.props.handleOnChangeValidation_POD}
            />

            {/* <div className="BottomBorder"></div> */}

            <p></p>

            {this.props.isLoadingSearch_POD ? (
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
                <Proofs
                  mode={this.props.mode}
                  SearchedNameDoc={this.props.SearchedNameDoc_POD}
                  SearchedProofs={this.props.SearchedProofs}
                />
              </>
            )}

            <p></p>
            <HowToUseComponent mode={this.props.mode} />
          </div>
        )}
      </>
    );
  }
}

export default ProofsPage;
