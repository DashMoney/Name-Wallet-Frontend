import React from "react";
//import Button from 'react-bootstrap/Button';
import Card from "react-bootstrap/Card";
import handleDenomDisplay from "../../../UnitDisplay";

class DGPItem extends React.Component {
  handleAvail = () => {
    if (this.props.item.avail) {
      //REPLACE WITH BELOW
      if (this.props.item.price === 0) {
        return <span style={{ color: "#008de4" }}>Tracking Only</span>;
      } else {
        return (
          <span style={{ color: "#008de4" }}>
            {handleDenomDisplay(this.props.whichNetwork, this.props.item.price)}
          </span>
        );
      }
      // return <span style={{ color: "#008de4" }}>{handleDenomDisplay(this.props.whichNetwork,this.props.item.price)}</span>;
    } else {
      return <span style={{ color: "#008de4" }}>Unavailable</span>;
    }
  };

  render() {
    let cardBkg;
    let cardText;

    if (this.props.mode === "primary") {
      cardBkg = "white";
      cardText = "dark";
    } else {
      cardBkg = "dark";
      cardText = "white";
    }

    return (
      <Card id="card" key={this.props.index} bg={cardBkg} text={cardText}>
        <Card.Body>
          <Card.Title className="cardTitle">
            <span>{this.props.item.name}</span>
            {this.handleAvail()}
          </Card.Title>

          <Card.Text>{this.props.item.description}</Card.Text>
          {/* <Button variant="primary"
            onClick={()=> this.props.handleAddToCartModal(this.props.item)}
             
          >Add to Cart
          </Button> */}
        </Card.Body>
      </Card>
    );
  }
}

export default DGPItem;
