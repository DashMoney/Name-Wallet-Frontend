import React from "react";

class MemberComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copiedName: false,
    };
  }

  handleNameClick = (nameToPass) => {
    navigator.clipboard.writeText(nameToPass);
    this.setState({
      copiedName: true,
    });
  };

  render() {
    // let members = this.props.groupMembers.map((member, index) => {
    //   return (
    //     <div key={index}>
    //       <b
    //         style={{ color: "#008de4", margin: ".2rem" }}
    //         onClick={() => this.handleNameClick(member[0])}
    //       >
    //         {member[0]}
    //       </b>
    //       <span>{this.state.copiedName ? <span>✅</span> : <></>}</span>
    //     </div>
    //   );
    // });

    return (
      <>
        <div key={this.props.index}>
          <b
            style={{ color: "#008de4", margin: ".2rem" }}
            onClick={() => this.handleNameClick(this.props.member[0])}
          >
            {this.props.member[0]}
          </b>
          <span>{this.state.copiedName ? <span>✅</span> : <></>}</span>
        </div>
      </>
    );
  }
}

export default MemberComponent;
