import React from "react";

import Proof from "./Proof";

class Proofs extends React.Component {
  render() {
    let d = Date.now();

    let proofs = this.props.SearchedProofs.map((proof, index) => {
      //console.log(proof);
      return (
        <Proof
          key={index}
          mode={this.props.mode}
          index={index}
          proof={proof}
          date={d}
          //identity={this.props.identity}
          //uniqueName={this.props.uniqueName}
          //showModal={this.props.showModal}

          //handleSearchedPost={this.props.handleSearchedPost}

          SearchedNameDoc={this.props.SearchedNameDoc}
        />
      );
    });

    return (
      <>
        {/* Handle if no user of the name doc from search */}
        {this.props.SearchedNameDoc === "No NameDoc" ? (
          <p className="indentStuff">There is no user with this name.</p>
        ) : (
          <></>
        )}
        {/* handle if no proofs for name doc identity */}
        {proofs.length === 0 && this.props.SearchedNameDoc !== "No NameDoc" ? (
          <p className="indentStuff">
            This user has not submitted any proof of funds.
          </p>
        ) : (
          <></>
        )}
        {proofs}
      </>
    );
  }
}

export default Proofs;
