import React from "react";

import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

import YourProof from "./YourProof";

class YourProofsPage extends React.Component {
  //Dont need a constructor because gets data from app.js this is just to display
  /**
   * 1) So the tabs and credits appear at the top
   * 2) like DGP -> button that says add post
   * 3)
   */

  render() {
    let proofs = this.props.YourProofs.map((proof, index) => {
      //console.log(item);
      return (
        <YourProof
          uniqueName={this.props.uniqueName}
          handleDeleteYourProof={this.props.handleDeleteYourProof}
          key={index}
          mode={this.props.mode}
          index={index}
          proof={proof}

          //deleteYourPost={this.props.deleteYourPost}
        />
      );
    });

    return (
      <>
        <p></p>
        {this.props.isLoadingYourProofs ? (
          <>
            <div id="spinner">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          </>
        ) : (
          <>
            <div className="d-grid gap-2">
              <Button
                variant="primary"
                onClick={() => this.props.showModal("CreateProofModal")}
              >
                <b>Create New Proof</b>
              </Button>
            </div>
            <p></p>

            {this.props.YourProofs.length === 0 ? (
              <>
                <p style={{ textAlign: "center" }}>
                  (This is where your proofs will appear)
                </p>
              </>
            ) : (
              <>{proofs}</>
            )}
          </>
        )}
      </>
    );
  }
}

export default YourProofsPage;
