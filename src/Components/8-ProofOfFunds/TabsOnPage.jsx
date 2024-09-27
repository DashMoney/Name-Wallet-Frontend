import React from 'react';
import Nav from "react-bootstrap/Nav";

class TabsOnPage extends React.Component {
  

  render() { 
    return (
      <>

<Nav
          fill
          variant="pills"
          defaultActiveKey={this.props.whichTab}
          onSelect={(eventKey) => this.props.handleTab(eventKey)}
        >
          <Nav.Item>
            <Nav.Link eventKey="Search">
              <b>Search</b>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="Your Proofs">
              <b>Your Proofs</b>
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </>
    );
  }
}
 
export default TabsOnPage;
