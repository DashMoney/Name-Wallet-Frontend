//NEED THE QUERY here and its a simple query because it should return empty!
import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import Spinner from "react-bootstrap/Spinner";
import CloseButton from "react-bootstrap/CloseButton";

import Table from "react-bootstrap/Table";

import handleDenomDisplay from "../../UnitDisplay";

import simpleDate from "../../DateDisplay";

//import "./ConfirmPaymentModal.css";

// import dapiClientNoWallet from "../../DapiClientNoWallet";

// import Dash from "dash";

// const {
//   // Essentials: { Buffer },
//   PlatformProtocol: { Identifier },
// } = Dash;

class ConfirmOrderModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copiedName: false,
      loadTime: 3, //set to 4 when successful dgm addr and call
    };
  }

  handleCloseClick = () => {
    this.props.hideModal();
  };

  handleSufficientInventory = () => {
    return this.props.order.cart.every((tuple) => {
      //What is in the tuple? itemObj&qty
      //Tuples of [cartItem,Qty2Purchase]
      //// [
      //   {
      //     itemId: "Cool T-Shirt345",
      //     variant: "",
      //   },
      //   1,  //QTY
      // ],
      //"", 10, 120000000  //variant

      //console.log("sufficInv Tuple: ", tuple);

      //GET THE ITEM
      let theItem = this.props.Inventory.find((item) => {
        return item.itemId === tuple[0].itemId; //This is from the cart
      });

      if (theItem === undefined) {
        //means the item is not in inventory
        return false;
      }

      //GET THE VARIANT
      let theVariant = theItem.variants.find((vari) => {
        return vari[0] === tuple[0].variant;
      });

      //THEN COMPARE if not >= then set overall var to return to false. =>
      if (theVariant === undefined) {
        //means the variant is not in the cart
        return false;
      }

      if (theVariant[1] === "") {
        return true;
      }

      if (tuple[1] <= theVariant[1]) {
        return true;
      }

      return false;
    });
    //if none fail then returns true
    //return true; //handled with .every
  };

  handleTotalItems = () => {
    let numOfItems = 0;
    this.props.order.cart.forEach((tuple) => {
      // this.props.merchantItems.find((item)=>{
      //   return item.$id === tuple[0].$id
      // })
      numOfItems += tuple[1];
    });

    return (
      <span>
        {numOfItems} {numOfItems > 1 ? <span>items</span> : <span>item</span>}
      </span>
    );
  };

  handleTotal = () => {
    //this.prop.CartItems AND this.props.merchantItems
    let theTotal = 0;

    this.props.order.cart.forEach((cartTuple) => {
      //NEED TO GET THE PRICE FROM THE INVENTORY LIKE I GET THE QTY FROM THE INVENTORY
      // let variantFromInventory = this.props.Inventory.find((item) => {
      //   return (
      //     item.itemId === cartTuple[0].itemId &&
      //     item.variants[0] === cartTuple[0].variant
      //   );
      // });

      let theItem = this.props.Inventory.find((item) => {
        return item.itemId === cartTuple[0].itemId;
      }); //this gets active as well

      let theVariant = theItem.variants.find((vari) => {
        return vari[0] === cartTuple[0].variant;
      });

      if (theVariant[2] !== 0) {
        theTotal += cartTuple[1] * theVariant[2];
        //console.log(theTotal);
      }
    });

    return (
      <h4 className="indentMembers" style={{ color: "#008de4" }}>
        <b>{handleDenomDisplay(this.props.whichNetwork, theTotal)}</b>
      </h4>
    );
  };

  handleTotalNotForDisplay = () => {
    let theTotal = 0;

    this.props.order.cart.forEach((tuple) => {
      let theItem = this.props.Inventory.find((item) => {
        return item.itemId === tuple[0].itemId;
      }); //this gets active as well

      let theVariant = theItem.variants.find((vari) => {
        return vari[0] === tuple[0].variant;
      });

      if (theVariant[2] !== 0) {
        theTotal += tuple[1] * theVariant[2];
        //console.log(theTotal);
      }
    });
    return Number(theTotal);
  };

  decrementTimer = () => {
    this.setState({
      loadTime: this.state.loadTime - 1,
    });
    if (this.state.loadTime >= 1) {
      const myTimeout = setTimeout(this.decrementTimer, 1000);
    }
  };

  handleSubmitClick = (event) => {
    event.preventDefault();

    this.props.createConfirmOrder();

    this.handleCloseClick();
  };

  componentDidMount = () => {
    this.decrementTimer();
  };

  render() {
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

    let variantRows = [];
    let theIndex = 0;

    this.props.order.cart.forEach((cartItem, index) => {
      let theItem = this.props.Inventory.find((item) => {
        return item.itemId === cartItem[0].itemId; //This is from the cart
      });

      let theVariant = theItem.variants.find((vari) => {
        return vari[0] === cartItem[0].variant;
      });

      let variantRow = [];
      theIndex += 1;
      variantRow.push(
        <td style={{ textAlign: "left" }} key={theIndex}>
          <div>
            <h5 style={{ marginBottom: "0rem" }}>{theItem.name}</h5>
            <p style={{ color: "#008de4" }}>{theVariant[0]}</p>
          </div>
          {/* <p
              style={{
                //fontSize: "smaller",
                margin: "0rem",
              }}
            >
              {this.props.item.variants[i][j]}
            </p> */}
        </td>
      );
      theIndex += 1;
      variantRow.push(
        <td key={theIndex} style={{ textAlign: "center" }}>
          <b>{cartItem[1]}</b>
          {/* <p
                style={{
                  //fontSize: "smaller",
                  margin: "0rem",
                }}
              >
                {this.props.item.variants[i][j]}
              </p> */}
        </td>
      );
      theIndex += 1;
      variantRow.push(
        <td style={{ textAlign: "center" }} key={theIndex}>
          <b>
            {handleDenomDisplay(
              this.props.whichNetwork,
              theVariant[2],
              cartItem[1]
            )}
          </b>
          {/* <p
              style={{
                //fontSize: "smaller",
                margin: "0rem",
              }}
            >
              {handleDenomDisplay(this.props.whichNetwork,this.props.item.variants[i][j])}
            </p> */}
        </td>
      );

      let addVariantRow = <tr key={index}>{variantRow}</tr>;
      variantRows.push(addVariantRow);
    });

    let amtVerified = this.props.order.amt === this.handleTotalNotForDisplay();
    //console.log(amtVerified);

    let qtyVerified = this.handleSufficientInventory(); //Need to calc here -> this.handleSufficientInventory

    return (
      <>
        <Modal
          contentClassName={modalBkg}
          backdropClassName={modalBackdrop}
          show={this.props.isModalShowing}
        >
          <Modal.Header>
            <Modal.Title>Confirm Order</Modal.Title>
            {closeButtonColor}
          </Modal.Header>

          <Modal.Body>
            <h5>
              <span
                style={{
                  marginTop: ".2rem",
                  marginBottom: "0rem",
                }}
              >
                <b>Ordered by:</b>
              </span>
              <span
                style={{
                  color: "#008de3",
                  marginTop: ".2rem",
                  marginBottom: "0rem",
                }}
              >
                {" "}
                <b
                  onClick={() =>
                    this.handleNameClick(this.props.SelectedOrderNameDoc.label)
                  }
                >
                  {this.props.SelectedOrderNameDoc.label}
                </b>
              </span>
              <span>{this.state.copiedName ? <span>✅</span> : <></>}</span>
            </h5>

            {this.props.mode === "primary" ? (
              <>
                <Table
                  responsive
                  borderless
                  //bordered
                  size="md"
                  style={{ paddingLeft: "0rem" }}
                >
                  <thead>
                    <tr>
                      <th style={{ textAlign: "center" }}>
                        <b>Item</b>
                      </th>
                      <th style={{ textAlign: "center" }}>
                        <b>Qty</b>
                      </th>
                      <th style={{ textAlign: "center" }}>
                        <b>Subtotal</b>
                      </th>
                    </tr>
                  </thead>
                  <tbody>{variantRows}</tbody>
                </Table>
              </>
            ) : (
              <>
                <Table
                  responsive
                  borderless //bordered
                  size="md"
                  variant="dark"
                >
                  <thead>
                    <tr>
                      <th style={{ textAlign: "center" }}>
                        <b>Item</b>
                      </th>
                      <th style={{ textAlign: "center" }}>
                        <b>Qty</b>
                      </th>
                      <th style={{ textAlign: "center" }}>
                        <b>Subtotal</b>
                      </th>
                    </tr>
                  </thead>
                  <tbody>{variantRows}</tbody>
                </Table>
              </>
            )}

            {/* Amount */}
            <p></p>
            <div className="ButtonRightNoUnderline">
              <h4>
                <b>Total</b> ({this.handleTotalItems()})<b>:</b>
              </h4>

              {this.handleTotal()}
            </div>
            <p></p>

            {!amtVerified ? (
              <>
                <p style={{ color: "red" }}>
                  The amount from the order does not match the current item
                  rate.
                </p>

                <p></p>
              </>
            ) : (
              <></>
            )}
            {!qtyVerified ? (
              <>
                <p style={{ color: "red" }}>
                  There is not sufficient inventory to fulfill the order.
                </p>

                <p></p>
              </>
            ) : (
              <></>
            )}
          </Modal.Body>
          <Modal.Footer>
            <>
              {qtyVerified && amtVerified ? (
                <>
                  {this.state.loadTime >= 1 ? (
                    <Button variant="primary" disabled>
                      <b>Confirm ({this.state.loadTime})</b>
                    </Button>
                  ) : (
                    <Button variant="primary" onClick={this.handleSubmitClick}>
                      <b>Confirm</b>
                    </Button>
                  )}
                </>
              ) : (
                <Button variant="primary" disabled>
                  <b>Confirm</b>
                </Button>
              )}
            </>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default ConfirmOrderModal;