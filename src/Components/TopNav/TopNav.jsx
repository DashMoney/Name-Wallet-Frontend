import React from "react";
import DashIcon from "../../Images/white-d.svg";
import DashIconBlue from "../../Images/blue-d.svg";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
// import Dropdown from "react-bootstrap/Dropdown";
// import NavLink from "react-bootstrap/NavLink";

// import Badge from "react-bootstrap/Badge";

import Offcanvas from "react-bootstrap/Offcanvas";

import CloseButton from "react-bootstrap/CloseButton";

import NavSelects from "./NavSelects";
import CreditsOnPage from "../CreditsOnPage";

import "./TopNav.css";

class TopNav extends React.Component {
  handleCloseClick = () => {
    this.props.toggleTopNav();
  };

  handleFrontendFee = () => {
    // return unit for display or no fee
    if (this.props.validFrontendFee) {
      //Need to add a decimal or comma on the second from last
      return (this.props.FrontendFee / 100).toFixed(2);
    } else {
      return "0"; //"No Frontend Fee";
    }
  };

  render() {
    let offCanvasBkgd;
    let closeButtonColor;

    if (this.props.mode === "primary") {
      offCanvasBkgd = "text-bg-light";
      closeButtonColor = <CloseButton onClick={this.handleCloseClick} />;
    } else {
      offCanvasBkgd = "text-bg-dark";
      closeButtonColor = (
        <CloseButton onClick={this.handleCloseClick} variant="white" />
      );
    }

    let isLoginComplete =
      this.props.uniqueName !== "" && this.props.uniqueName !== "no name";

    return (
      <>
        <Navbar
          expanded={this.props.expandedTopNav}
          className="Top"
          bg={this.props.mode}
          data-bs-theme={this.props.mode}
          //variant={this.props.mode}
          expand={false}
        >
          <Container>
            <Navbar.Brand>
              {this.props.mode === "primary" ? (
                <img
                  src={DashIcon}
                  width="30"
                  height="30"
                  className="d-inline-block align-top"
                  alt="Dash logo"
                />
              ) : (
                <img
                  src={DashIconBlue}
                  width="30"
                  height="30"
                  className="d-inline-block align-top"
                  alt="Dash logo"
                />
              )}
              {"   "}
              {this.props.mode === "primary" ? (
                <>
                  <b className="lightMode">
                    {import.meta.env.VITE_FRONTEND_NAME}
                  </b>
                  {this.props.whichNetwork === "testnet" ? (
                    <span className="textsmallest">testnet</span>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <>
                  <b>{import.meta.env.VITE_FRONTEND_NAME}</b>
                  {this.props.whichNetwork === "testnet" ? (
                    <span className="textsmallest">testnet</span>
                  ) : (
                    <></>
                  )}
                </>
              )}
            </Navbar.Brand>
            <Form>
              {this.props.mode === "primary" ? (
                <div>
                  <Form.Check
                    type="switch"
                    id="custom-switch"
                    onChange={() => this.props.handleMode()}
                  />
                </div>
              ) : (
                <div>
                  <Form.Check
                    type="switch"
                    id="custom-switch-dark"
                    onChange={() => this.props.handleMode()}
                  />
                </div>
              )}
            </Form>

            <Navbar.Toggle
              //This needs to just switch itself or toggle self
              onClick={() => this.props.toggleTopNav()}
              aria-controls="basic-navbar-nav"
            />

            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand`}
              aria-labelledby={`offcanvasNavbarLabel-expand`}
              placement="start"
              className={offCanvasBkgd}
              onHide={this.props.toggleTopNav}
              style={{ width: "300px" }}
              //https://getbootstrap.com/docs/5.2/components/offcanvas/#variables
            >
              <Offcanvas.Header
                className="BottomBorder"
                style={{ paddingBottom: ".3rem" }}
              >
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand`}>
                  <h5 style={{ textAlign: "center" }}>
                    <b>{import.meta.env.VITE_FRONTEND_NAME}</b>
                    {this.props.whichNetwork === "testnet" ? (
                      <span className="textsmallest">testnet</span>
                    ) : (
                      <></>
                    )}
                  </h5>
                  {/* <h5 style={{ textAlign: "center" }}>
                    <Badge
                      variant="primary"
                      pill
                      onClick={() =>
                        this.props.showModal("FrontEndFeeExplaination")
                      }
                    >
                      <b>{this.handleFrontendFee()}% of TopUp</b>
              //          VITE_FEE_AMOUNT_AS_PERCENT_OF_A_TOPUP
              // {import.meta.env.VITE_FRONTEND_NAME} 
                    </Badge>
                  </h5> */}
                </Offcanvas.Title>
                {closeButtonColor}
              </Offcanvas.Header>

              <Offcanvas.Body>
                {this.props.isLoggedIn ? (
                  <>
                    {isLoginComplete ? (
                      <div
                        onClick={() => this.props.handleSelectedDapp("Login")}
                      >
                        <CreditsOnPage
                          identityInfo={this.props.identityInfo}
                          uniqueName={this.props.uniqueName}
                          showModal={this.props.showModal}
                        />
                      </div>
                    ) : (
                      <div
                        className="d-grid gap-2"
                        style={{ marginBottom: "1rem" }}
                      >
                        <Button
                          variant="primary"
                          size="lg"
                          onClick={() => this.props.handleSelectedDapp("Login")}
                        >
                          <b>Complete Sign up</b>
                        </Button>
                      </div>
                    )}
                    {/* COMPLETE LOGIN BUTTON OR WALLET AND IDENTITY INFO */}
                  </>
                ) : (
                  <div
                    className="d-grid gap-2"
                    style={{ marginBottom: "1rem" }}
                  >
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => this.props.handleSelectedDapp("Login")}
                    >
                      <b>Login/Sign up</b>
                    </Button>
                  </div>
                )}

                <Nav fill>
                  {/* <NavSelects
                    selection="Messages"
                    selectedDapp={this.props.selectedDapp}
                    handleSelectedDapp={this.props.handleSelectedDapp}
                  /> */}
                  <p></p>
                  {isLoginComplete ? ( // ADDED ! FOR CONSTRUCTION
                    <NavSelects
                      selection="Proxy Accounts"
                      selectedDapp={this.props.selectedDapp}
                      handleSelectedDapp={this.props.handleSelectedDapp}
                    />
                  ) : (
                    <Nav.Link className="canvasLinkDisabled" disabled>
                      <h5>
                        <b>Proxy Accounts</b>
                      </h5>
                    </Nav.Link>
                  )}

                  {isLoginComplete ? (
                    <NavSelects
                      selection="2-Party Pay"
                      selectedDapp={this.props.selectedDapp}
                      handleSelectedDapp={this.props.handleSelectedDapp}
                    />
                  ) : (
                    <Nav.Link className="canvasLinkDisabled" disabled>
                      <h5>
                        <b>2-Party Pay</b>
                      </h5>
                    </Nav.Link>
                  )}
                  <p></p>
                  <h4 style={{ color: "#008de4" }}>
                    <b>Customer</b>
                  </h4>
                  {isLoginComplete ? (
                    <NavSelects
                      selection="Your Orders"
                      selectedDapp={this.props.selectedDapp}
                      handleSelectedDapp={this.props.handleSelectedDapp}
                    />
                  ) : (
                    <Nav.Link className="canvasLinkDisabled" disabled>
                      <h5>
                        <b>Your Orders</b>
                      </h5>
                    </Nav.Link>
                  )}

                  {isLoginComplete ? (
                    <NavSelects
                      selection="Reservations"
                      selectedDapp={this.props.selectedDapp}
                      handleSelectedDapp={this.props.handleSelectedDapp}
                    />
                  ) : (
                    <Nav.Link className="canvasLinkDisabled" disabled>
                      <h5>
                        <b>Reservations</b>
                      </h5>
                    </Nav.Link>
                  )}

                  <p></p>
                  <h4 style={{ color: "#008de4" }}>
                    <b>Merchant</b>
                  </h4>

                  {isLoginComplete ? (
                    <NavSelects
                      selection="Orders Received"
                      selectedDapp={this.props.selectedDapp}
                      handleSelectedDapp={this.props.handleSelectedDapp}
                    />
                  ) : (
                    <Nav.Link className="canvasLinkDisabled" disabled>
                      <h5>
                        <b>Orders Received</b>
                      </h5>
                    </Nav.Link>
                  )}

                  {isLoginComplete ? (
                    <NavSelects
                      selection="Rentals"
                      selectedDapp={this.props.selectedDapp}
                      handleSelectedDapp={this.props.handleSelectedDapp}
                    />
                  ) : (
                    <Nav.Link className="canvasLinkDisabled" disabled>
                      <h5>
                        <b>Rentals</b>
                      </h5>
                    </Nav.Link>
                  )}

                  <p></p>
                  {/* 
                  <h4>
                    <b>Utils</b>
                  </h4> */}
                  {/* {isLoginComplete ? (
                    <NavSelects
                      selection="Wallet"
                      selectedDapp={this.props.selectedDapp}
                      handleSelectedDapp={this.props.handleSelectedDapp}
                    />
                  ) : (*/}
                  {/* <Nav.Link className="canvasLinkDisabled" disabled>
                    <h5>
                      <b>Reviews</b>
                    </h5>
                  </Nav.Link> */}
                  {/*  )} */}

                  {/* {isLoginComplete ? (
                    <NavSelects
                      selection="Wallet"
                      selectedDapp={this.props.selectedDapp}
                      handleSelectedDapp={this.props.handleSelectedDapp}
                    />
                  ) : (*/}
                  {/* <Nav.Link className="canvasLinkDisabled" disabled>
                    <h5>
                      <b>Simple Wallet</b>
                    </h5>
                  </Nav.Link> */}
                  {/*  )} */}

                  {/* <NavSelects
                    selection="Reviews"
                    selectedDapp={this.props.selectedDapp}
                    handleSelectedDapp={this.props.handleSelectedDapp}
                  />

                  <NavSelects
                    selection="Proof of Funds"
                    selectedDapp={this.props.selectedDapp}
                    handleSelectedDapp={this.props.handleSelectedDapp}
                  />
                  <p></p> */}
                  <p></p>
                  <div
                    className="d-grid gap-2"
                    style={{
                      marginTop: ".5rem",
                      paddingLeft: "1.5rem",
                      paddingRight: "1.5rem",
                    }}
                  >
                    <Button
                      variant="primary"
                      //size="sm"
                      onClick={() =>
                        this.props.showModal("NameWalletExplaination")
                      }
                    >
                      <b>About Name Wallet</b>
                    </Button>
                  </div>

                  {isLoginComplete ? (
                    <div
                      className="d-grid gap-2"
                      style={{
                        marginTop: ".5rem",
                        paddingLeft: "3rem",
                        paddingRight: "3rem",
                      }}
                    >
                      <Button
                        variant="primary"
                        //size="lg"
                        onClick={() => this.props.handleSelectedDapp("Login")}
                      >
                        <b>Your Account</b>
                      </Button>
                    </div>
                  ) : (
                    <></>
                  )}
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      </>
    );
  }
}
export default TopNav;
