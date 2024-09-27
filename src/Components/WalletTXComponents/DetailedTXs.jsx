import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

class DetailedTXs extends React.Component {
  render() {
    //Card - What does it look like? ->
    //only tx that you know
    // Name and Full date

    // Paid you 2.000 Dash   'OR'    You Paid 2.000 Dash
    //https://react-bootstrap.netlify.app/docs/components/cards#background-color   <= BACKGROUND COLOR!!

    //Wallet Message  'OR'  My Store Order 'OR'  Shopping Order
    // ^^ Just Bold wording.

    //***OR***   Send Message    //   Resend Order        'BUTTON'

    return (
      <>
        {[
          "Primary",
          "Secondary",
          "Success",
          "Danger",
          "Warning",
          "Info",
          "Light",
          "Dark",
        ].map((variant) => (
          <Card
            bg={variant.toLowerCase()}
            key={variant}
            text={variant.toLowerCase() === "light" ? "dark" : "white"}
            style={{ width: "18rem" }}
            className="mb-2"
          >
            <Card.Header>Header</Card.Header>
            <Card.Body>
              <Card.Title>{variant} Card Title </Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </Card.Text>
            </Card.Body>
          </Card>
        ))}
      </>
    );
  }
}

export default DetailedTXs;
