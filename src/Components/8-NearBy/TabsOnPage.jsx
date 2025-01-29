import React from "react";
import Nav from "react-bootstrap/Nav";

class TabsOnPage extends React.Component {
  render() {
    return (
      <>
        <Nav
          fill
          variant="pills"
          defaultActiveKey={this.props.whichNearbyTab}
          onSelect={(eventKey) => this.props.handleNearbyTab(eventKey)}
        >
          <Nav.Item>
            <Nav.Link eventKey="Search">
              <b>Search</b>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="Your Posts">
              <b>Your Posts</b>
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </>
    );
  }
}

export default TabsOnPage;
