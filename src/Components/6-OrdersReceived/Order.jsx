import React from "react";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";

import Table from "react-bootstrap/Table";

import handleDenomDisplay from "../UnitDisplay";
import formatDate from "../TimeDisplayLong";

import SentOrdersReqsComp from "./SentOrdersReqsComp";

//import simpleDate from "../DateDisplay";

class Order extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copiedName: false,
      copiedAddress: false,
    };
  }

  handleNameClick = (nameLabel) => {
    navigator.clipboard.writeText(nameLabel);
    this.setState({
      copiedName: true,
    });
  };

  verifyOrderStatus = (theOrder, theConfirm) => {
    // if (ride.txId1 !== "") {
    //   //pass to the verify payment function ->
    //   // console.log("Called Verify Payment Status");
    //   return this.verifyPaymentStatus(ride);
    // }

    if (theConfirm === undefined) {
      //console.log("Awaiting Confirmation");
      return <Badge bg="warning">Awaiting Confirm</Badge>;
    }

    //if(confirm!==undefined){this will check if the order and confirm dates and amts match }
    //
    if (
      theConfirm.amt === theOrder.amt //&&
      //theConfirm.arriveDate === theOrder.arriveDate
    ) {
      //console.log("Acceptance Rejected");
      return <Badge bg="success">Confirmed</Badge>;
    }

    // if (paidThrs.length === 0) {
    //   //console.log("Ordered");
    //   return <Badge bg="success">Ordered</Badge>;
    // }

    // if (ride.replyId === this.props.drive.$id) {
    //console.log("Confirmed");
    return <Badge bg="danger">Confirm Error</Badge>;
    //}
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
    //this.prop.order.cart AND this.props.merchantItems
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

      //FOR ITEM DELETED FROM INVENTORY
      let theVariant;
      if (theItem === undefined) {
        theItem = {
          name: "Item Not Found",
          itemId: "Item Not Found",
          variants: [["", "", 0]],
        };
        theVariant = ["", "", 0];
      } else {
        theVariant = theItem.variants.find((vari) => {
          return vari[0] === cartTuple[0].variant;
        });
        if (theVariant === undefined) {
          theVariant = ["unknown", "", 0];
        }
      }
      // let theVariant = theItem.variants.find((vari) => {
      //   return vari[0] === cartTuple[0].variant;
      // });

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

    // "Orders"
    // "Confirmed"

    let confirm = undefined;

    if (this.props.DisplayOrders === "Confirmed") {
      confirm = this.props.ConfirmedOrders.find((confirm) => {
        return this.props.order.$id === confirm.orderId;
      });
    }

    //console.log(confirm);

    //this.props.OrdersNames

    let orderProxy = this.props.OrdersProxies.find((ordProxy) => {
      return ordProxy.$ownerId === this.props.order.$ownerId;
    });

    let orderName = {
      label: "No Name Avail",
      $ownerId: this.props.order.$ownerId,
    };

    let orderController;
    let orderControllerTuple; //[IdentityId, Label]
    //let isProxyApproved = false;

    if (orderProxy !== undefined) {
      orderController = this.props.OrdersControllers.find((ordController) => {
        return ordController.$ownerId === orderProxy.controlId;
      });

      if (orderController !== undefined) {
        // if the proxyDoc is on the ControllerList -> need to check the list ->
        // proxyList   //[IdentityId, Label]
        orderControllerTuple = orderController.proxyList.find((tuple) => {
          return orderProxy.$ownerId === tuple[0];
        });

        if (orderControllerTuple !== undefined) {
          orderName = this.props.OrdersNames.find((ordName) => {
            return ordName.$ownerId === orderController.$ownerId;
          });
        }

        if (orderName === undefined) {
          orderName = {
            label: "No Name Avail",
            $ownerId: this.props.order.$ownerId,
          };
        }

        // console.log(orderName);

        // <div className="indentStuff">
        //                         <h5 style={{ color: "#008de4" }}>
        //                           <b>{this.props.ProxyNameDoc.label}*</b>
        //                         </h5>
        //                         <p style={{ marginLeft: "1rem" }}>
        //                           {" "}
        //                           {this.props.ProxyTuple[1]}
        //                         </p>
        //                       </div>
      }
    }

    //GET THE 2PARTY STUFF

    //Need to make sure that is it verifying proxy and disable the 2Party if fails ->

    let the2Party = (
      <>
        {" "}
        <p></p>
        <div className="d-grid gap-2">
          <Button
            variant="success"
            onClick={() =>
              this.props.showOrders2PartyReqModal(
                confirm,
                orderName,
                this.props.order.amt
              )
            }
          >
            <b>Request 2-Party Pay</b>
          </Button>
        </div>
        <p></p>
      </>
    );

    if (confirm !== undefined) {
      let req2Party = this.props.ReqsFromYou.find((req) => {
        return req.forId === confirm.$id;
      });

      if (req2Party !== undefined) {
        the2Party = (
          <SentOrdersReqsComp
            mnemonic={this.props.mnemonic}
            whichNetwork={this.props.whichNetwork}
            mode={this.props.mode}
            req={req2Party}
            today={this.props.today}
            yesterday={this.props.yesterday}
            identity={this.props.identity} //For if my review so can edit
            uniqueName={this.props.uniqueName}
            accountHistory={this.props.accountHistory}
            accountBalance={this.props.accountBalance}
            //
            DisplayReqsOrPmts={this.props.DisplayReqsOrPmts}
            isLoading2Party={this.props.isLoading2Party}
            Your2PartyPubKey={this.props.Your2PartyPubKey}
            ReqsFromYou={this.props.ReqsFromYou}
            ReqsFromYouPubKeys={this.props.ReqsFromYouPubKeys}
            ReqsFromYouNames={[requestName]}
            ReqsFromYouResponses={this.props.ReqsFromYouResponses}
            showRetrieveFundsModal={this.props.showRetrieveFundsModal}
            showAddMsgToRequestModal={this.props.showAddMsgToRequestModal}
            showRefundFundsModal={this.props.showRefundFundsModal}
          />
        );
      }
    }

    //  Table Creation (BELOW)

    let variantRows = [];
    let theIndex = 0;

    this.props.order.cart.forEach((cartItem, index) => {
      let theItem = this.props.Inventory.find((item) => {
        return item.itemId === cartItem[0].itemId; //This is from the cart
      });

      //FOR ITEM DELETED FROM INVENTORY
      let theVariant;
      if (theItem === undefined) {
        theItem = {
          name: "Item Not Found",
          itemId: "Item Not Found",
          variants: [["", "", 0]],
        };
        theVariant = ["", "", 0];
      } else {
        theVariant = theItem.variants.find((vari) => {
          return vari[0] === cartItem[0].variant;
        });
        if (theVariant === undefined) {
          theVariant = ["unknown", "", 0];
        }
      }

      // let theVariant = theItem.variants.find((vari) => {
      //   return vari[0] === cartItem[0].variant;
      // });

      let variantRow = [];
      theIndex += 1;
      variantRow.push(
        <td style={{ textAlign: "left" }} key={theIndex}>
          <div>
            <h5 style={{ marginBottom: "0rem" }}>{theItem.name}</h5>
            <p style={{ color: "#008de4" }}>{theVariant[0]}</p>
          </div>
        </td>
      );
      theIndex += 1;
      variantRow.push(
        <td key={theIndex} style={{ textAlign: "center" }}>
          <b>{cartItem[1]}</b>
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
        </td>
      );

      let addVariantRow = <tr key={index}>{variantRow}</tr>;
      variantRows.push(addVariantRow);
    });

    //  Table Creation ^^^

    let qtyVerified = this.handleSufficientInventory();

    return (
      <>
        <Card
          id="card"
          key={this.props.index}
          index={this.props.index}
          bg={cardBkg}
          text={cardText}
        >
          <Card.Body>
            {}
            <Card.Title className="cardTitle">
              <h5>
                <span
                  style={{
                    marginTop: ".2rem",
                    marginBottom: "0rem",
                  }}
                >
                  <b>Customer:</b>
                </span>
                <span
                  style={{
                    color: "#008de3",
                    marginTop: ".2rem",
                    marginBottom: "0rem",
                  }}
                >
                  {" "}
                  <b onClick={() => this.handleNameClick(orderName.label)}>
                    {orderName.label}
                  </b>
                </span>
                <span>{this.state.copiedName ? <span>✅</span> : <></>}</span>
              </h5>

              <span className="textsmaller">
                {formatDate(
                  this.props.order.$updatedAt,
                  this.props.today,
                  this.props.yesterday
                )}
              </span>
            </Card.Title>
            <Card.Title style={{ display: "flex", justifyContent: "center" }}>
              {this.verifyOrderStatus(this.props.order, confirm)}
            </Card.Title>
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

            <div className="cartTotal">
              <h4>
                <b>Total</b> ({this.handleTotalItems()})<b>:</b>
              </h4>

              {this.handleTotal()}
            </div>

            {confirm === undefined && !this.props.isLoadingOrders ? (
              <>
                <p></p>
                {qtyVerified ? (
                  <>
                    <div className="d-grid gap-2">
                      <Button
                        variant="primary"
                        onClick={() =>
                          this.props.handleConfirmOrderModal(
                            this.props.order,
                            orderName
                          )
                        }
                      >
                        <b>Confirm Order</b>
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="d-grid gap-2">
                    <Button variant="danger" disabled>
                      <b>Insufficient Inventory</b>
                    </Button>
                  </div>
                )}
                <p></p>
              </>
            ) : (
              <></>
            )}

            {/* Need to Show the order message that can be sent with the order -> */}

            <>
              <div
                className="BottomBorder"
                style={{ paddingTop: ".7rem", marginBottom: ".7rem" }}
              ></div>
              <div
                className="cardTitle"
                style={{ marginTop: ".4rem", marginBottom: ".5rem" }}
              >
                <h5>Status</h5>
                {this.verifyOrderStatus(this.props.order, confirm)}
              </div>
            </>

            {confirm !== undefined ? (
              <>
                <div
                  className="BottomBorder"
                  style={{ paddingTop: ".7rem", marginBottom: ".7rem" }}
                ></div>
                <div className="cardTitle" style={{ marginBottom: ".5rem" }}>
                  <h5
                    style={{
                      color: "#008de4",
                    }}
                  >
                    2-Party Pay
                  </h5>
                  {/* {this.verifyRequestStatus(this.props.request, confirm)} */}
                </div>
              </>
            ) : (
              <></>
            )}

            <p></p>
            {orderName.label !== "No Name Avail" && confirm !== undefined ? (
              <>{the2Party}</>
            ) : (
              <></>
            )}
          </Card.Body>
        </Card>
      </>
    );
  }
}

export default Order;
