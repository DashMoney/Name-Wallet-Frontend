import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import CloseButton from "react-bootstrap/CloseButton";

class EditPostModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCategory: this.props.selectedYourPost.category,

      cityInput: this.props.selectedYourPost.city,
      validCity: true,
      tooLongCityError: false,

      regionInput: this.props.selectedYourPost.region,
      validRegion: true,
      tooLongRegionError: false,

      countryInput: this.props.selectedYourPost.country,
      validCountry: true,
      tooLongCountryError: false,

      descriptionInput: this.props.selectedYourPost.description,
      validDescription: true,
      tooLongDescriptionError: false,

      linkInput: this.props.selectedYourPost.link,
      validLink: true,
      tooLongLinkError: false,

      addressInput: this.props.selectedYourPost.address,
      validAddress: true,
      tooLongAddressError: false,

      postActive: this.props.selectedYourPost.active,

      postDGP: this.props.selectedYourPost.dgp,
    };
  }

  handleCloseClick = () => {
    this.props.hideModal();
  };

  handleCategoryButtons = (category) => {
    this.setState({
      selectedCategory: category,
    });
  };

  handleActive = () => {
    if (this.state.postActive) {
      this.setState({
        postActive: false,
      });
    } else {
      this.setState({
        postActive: true,
      });
    }
  };

  onChange = (event) => {
    //console.log(event.target.id);

    //console.log(`id = ${event.target.id}`);

    if (event.target.id === "formCityName") {
      event.preventDefault();
      event.stopPropagation();
      this.cityValidate(event.target.value);
    }

    if (event.target.id === "formRegionName") {
      event.preventDefault();
      event.stopPropagation();
      this.regionValidate(event.target.value);
    }

    if (event.target.id === "formCountryName") {
      event.preventDefault();
      event.stopPropagation();
      this.countryValidate(event.target.value);
    }

    if (event.target.id === "custom-switch") {
      event.stopPropagation();
      this.handleActive();
    }

    if (event.target.id === "DGP-switch") {
      event.stopPropagation();
      this.handleDGP();
    }

    if (event.target.id === "formDescription") {
      event.preventDefault();
      event.stopPropagation();
      this.descriptionValidate(event.target.value);
    }

    if (event.target.id === "formLink") {
      event.preventDefault();
      event.stopPropagation();
      this.linkValidate(event.target.value);

      if (event.target.id === "formAddress") {
        event.preventDefault();
        event.stopPropagation();
        this.addressValidate(event.target.value);
      }
    }
  };

  cityValidate = (city) => {
    let regex = /^\S.{1,30}\S$/;
    let valid = regex.test(city);

    if (valid) {
      this.setState({
        cityInput: city,
        tooLongCityError: false,
        validCity: true,
      });
    } else {
      if (city.length > 32) {
        this.setState({
          cityInput: city,
          tooLongCityError: true,
          validCity: false,
        });
      } else {
        this.setState({
          cityInput: city,
          validCity: false,
        });
      }
    }
  };

  regionValidate = (region) => {
    let regex = /^\S.{1,30}\S$/;
    let valid = regex.test(region);

    if (valid) {
      this.setState({
        regionInput: region,
        tooLongRegionError: false,
        validRegion: true,
      });
    } else {
      if (region.length > 32) {
        this.setState({
          regionInput: region,
          tooLongRegionError: true,
          validRegion: false,
        });
      } else {
        this.setState({
          regionInput: region,
          validRegion: false,
        });
      }
    }
  };

  countryValidate = (country) => {
    let regex = /^\S.{1,30}\S$/;
    let valid = regex.test(country);

    if (valid) {
      this.setState({
        countryInput: country,
        tooLongCountryError: false,
        validCountry: true,
      });
    } else {
      if (country.length > 32) {
        this.setState({
          countryInput: country,
          tooLongCountryError: true,
          validCountry: false,
        });
      } else {
        this.setState({
          countryInput: country,
          validCountry: false,
        });
      }
    }
  };

  descriptionValidate = (description) => {
    // let regex = /^.[\S\s]{0,350}$/;

    // let valid = regex.test(description);

    let regex1 = /^.[\S\s]{0,349}$/;

    let valid1 = regex1.test(description);

    let regex2 = /^(?:[^\r\n]*(?:\r\n?|\n)){0,4}[^\r\n]*$/;

    let valid2 = regex2.test(description);

    let valid = false;

    if (valid1 && valid2) {
      valid = true;
    }

    if (valid) {
      this.setState({
        descriptionInput: description,
        validDescription: true,
        tooLongDescriptionError: false,
      });
    } else {
      if (description.length > 350 || !valid2) {
        this.setState({
          descriptionInput: description,
          validDescription: false,
          tooLongDescriptionError: true,
        });
      } else {
        this.setState({
          descriptionInput: description,
          validDescription: false,
        });
      }
    }
  };

  linkValidate = (link) => {
    let regex = /^[\S\s]{0,350}$/;

    let valid = regex.test(link);

    if (valid) {
      this.setState({
        linkInput: link,
        validLink: true,
        tooLongLinkError: false,
      });
    } else {
      if (link.length > 300) {
        this.setState({
          linkInput: link,
          validLink: false,
          tooLongLinkError: true,
        });
      } else {
        this.setState({
          linkInput: link,
          validLink: false,
        });
      }
    }
  };

  addressValidate = (address) => {
    let regex = /^[\S\s]{0,150}$/;
    let valid = regex.test(address);

    if (valid) {
      this.setState({
        addressInput: address,
        tooLongAddressError: false,
        validAddress: true,
      });
    } else {
      if (address.length > 150) {
        this.setState({
          addressInput: address,
          tooLongAddressError: true,
          validAddress: false,
        });
      } else {
        this.setState({
          addressInput: address,
          validAddress: false,
        });
      }
    }
  };

  handleSubmitClick = (event) => {
    event.preventDefault();
    //console.log(event.target.ControlTextarea1.value);

    //CHANGE TO NEWPOST AND SET THE LOWERCASE HERE!

    let newPost = {
      city: this.state.cityInput.toLocaleLowerCase(),
      region: this.state.regionInput.toLocaleLowerCase(),
      country: this.state.countryInput.toLocaleLowerCase(),

      description: this.state.descriptionInput,
      category: this.state.selectedCategory,

      link: this.state.linkInput,
      address: this.state.addressInput,

      active: this.state.postActive,
      dgp: this.state.postDGP,
    };

    this.props.editYourPost(newPost);
    this.props.hideModal();
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

    return (
      <>
        <Modal
          show={this.props.isModalShowing}
          backdropClassName={modalBackdrop}
          contentClassName={modalBkg}
        >
          <Modal.Header style={{ paddingBottom: ".2rem" }}>
            <Modal.Title>
              <h3>
                <b>Edit Post</b>
              </h3>
            </Modal.Title>
            {closeButtonColor}
          </Modal.Header>
          <Modal.Body>
            <h4 style={{ marginBottom: ".1rem" }}>
              <b>You are Offering:</b>
            </h4>

            {this.state.selectedCategory === "offbiz" ? (
              <Button
                variant="primary"
                style={{
                  textDecoration: "underline",
                  marginRight: ".5rem",
                  marginBottom: ".7rem",
                }}
              >
                <b>Shops/Menus</b>
              </Button>
            ) : (
              <Button
                variant="primary"
                style={{ marginRight: ".5rem", marginBottom: ".7rem" }}
                onClick={() => this.handleCategoryButtons("offbiz")}
              >
                <b>Shops/Menus</b>
              </Button>
            )}

            {/* {this.state.selectedCategory === "events" ? (
              <Button variant="primary" style={{ textDecoration: "underline",marginRight: ".5rem", marginBottom: ".7rem" }}>
                <b>Events</b>
              </Button>
            ) : (
              <Button
                variant="primary"
                style={{ marginRight: ".5rem", marginBottom: ".7rem" }}
                onClick={() => this.handleCategoryButtons("events")}
              >
                <b>Events</b>
              </Button>
            )} */}

            {this.state.selectedCategory === "offrent" ? (
              <Button
                variant="primary"
                style={{
                  textDecoration: "underline",
                  marginRight: ".5rem",

                  marginBottom: ".7rem",
                }}
              >
                <b>Place to Rent</b>
              </Button>
            ) : (
              <Button
                variant="primary"
                style={{ marginRight: ".5rem", marginBottom: ".7rem" }}
                onClick={() => this.handleCategoryButtons("offrent")}
              >
                <b>Place to Rent</b>
              </Button>
            )}

            {this.state.selectedCategory === "offother" ? (
              <Button
                variant="primary"
                style={{
                  textDecoration: "underline",
                  marginRight: ".5rem",
                  marginBottom: ".7rem",
                }}
              >
                <b
                  style={{
                    paddingLeft: ".7rem",
                    paddingRight: ".7rem",
                  }}
                >
                  Trade
                </b>
              </Button>
            ) : (
              <Button
                variant="primary"
                style={{ marginRight: ".5rem", marginBottom: ".7rem" }}
                onClick={() => this.handleCategoryButtons("offother")}
              >
                <b
                  style={{
                    paddingLeft: ".7rem",
                    paddingRight: ".7rem",
                  }}
                >
                  Trade
                </b>
              </Button>
            )}

            <h4 style={{ marginTop: ".2rem", marginBottom: ".1rem" }}>
              <b>You are Looking For:</b>
            </h4>

            {this.state.selectedCategory === "lookrent" ? (
              <Button
                variant="primary"
                style={{
                  textDecoration: "underline",
                  marginRight: ".5rem",
                  marginBottom: ".7rem",
                }}
              >
                <b>Place to Rent</b>
              </Button>
            ) : (
              <Button
                variant="primary"
                style={{ marginRight: ".5rem", marginBottom: ".7rem" }}
                onClick={() => this.handleCategoryButtons("lookrent")}
              >
                <b>Place to Rent</b>
              </Button>
            )}

            {this.state.selectedCategory === "lookother" ? (
              <Button
                variant="primary"
                style={{
                  textDecoration: "underline",
                  marginRight: ".5rem",
                  marginBottom: ".7rem",
                }}
              >
                <b
                  style={{
                    paddingLeft: ".7rem",
                    paddingRight: ".7rem",
                  }}
                >
                  Trade
                </b>
              </Button>
            ) : (
              <Button
                variant="primary"
                style={{ marginRight: ".5rem", marginBottom: ".7rem" }}
                onClick={() => this.handleCategoryButtons("lookother")}
              >
                <b
                  style={{
                    paddingLeft: ".7rem",
                    paddingRight: ".7rem",
                  }}
                >
                  Trade
                </b>
              </Button>
            )}
            <div className="BottomBorder" style={{ paddingTop: ".5rem" }}></div>

            <Form
              noValidate
              onSubmit={this.handleSubmitClick}
              onChange={this.onChange}
            >
              {/* CITY FORM BELOW */}
              <Form.Group className="mb-3" controlId="formCityName">
                <h5 style={{ marginTop: ".2rem", marginBottom: ".2rem" }}>
                  City/Town
                </h5>
                <Form.Control
                  type="text"
                  defaultValue={this.props.selectedYourPost.city}
                  required
                  isInvalid={this.state.tooLongCityError}
                  isValid={this.state.validCity}
                />
                <p></p>
                <Form.Control.Feedback type="invalid">
                  City/Town name is too long.
                </Form.Control.Feedback>
                {/* <Form.Control.Feedback type="valid">
              City/Town name is acceptable!
            </Form.Control.Feedback> */}
              </Form.Group>

              {/* REGION FORM BELOW */}
              <Form.Group className="mb-3" controlId="formRegionName">
                <h5 style={{ marginTop: ".2rem", marginBottom: ".2rem" }}>
                  Region
                </h5>
                <Form.Control
                  type="text"
                  defaultValue={this.props.selectedYourPost.region}
                  required
                  isInvalid={this.state.tooLongRegionError}
                  isValid={this.state.validRegion}
                />
                <p></p>
                <Form.Control.Feedback type="invalid">
                  State/Province name is too long.
                </Form.Control.Feedback>
              </Form.Group>

              {/* COUNTRY FORM BELOW */}
              <Form.Group className="mb-3" controlId="formCountryName">
                <h5 style={{ marginTop: ".2rem", marginBottom: ".2rem" }}>
                  Country
                </h5>
                <Form.Control
                  type="text"
                  defaultValue={this.props.selectedYourPost.country}
                  required
                  isInvalid={this.state.tooLongCountryError}
                  isValid={this.state.validCountry}
                />
                <p></p>
                <Form.Control.Feedback type="invalid">
                  Country name is too long.
                </Form.Control.Feedback>
              </Form.Group>

              {/* POST DESCRIPTION FORM BELOW */}

              <Form.Group className="mb-3" controlId="formDescription">
                <Form.Label>
                  <h5 style={{ marginTop: ".5rem", marginBottom: ".2rem" }}>
                    Description
                  </h5>
                </Form.Label>

                <Form.Control
                  onChange={this.onChange}
                  as="textarea"
                  rows={2}
                  defaultValue={this.props.selectedYourPost.description}
                  required
                  isInvalid={this.state.tooLongDescriptionError}
                  isValid={this.state.validDescription}
                />

                {this.state.tooLongDescriptionError ? (
                  <Form.Control.Feedback className="floatLeft" type="invalid">
                    Sorry, this is too long! Please use less than 300
                    characters.
                  </Form.Control.Feedback>
                ) : (
                  <></>
                )}
              </Form.Group>

              {/* LINKS FORM BELOW */}

              <Form.Group className="mb-3" controlId="formLink">
                <h5 style={{ marginTop: ".5rem", marginBottom: ".2rem" }}>
                  Link
                </h5>

                <Form.Control
                  type="text"
                  defaultValue={this.props.selectedYourPost.link}
                  placeholder="Enter a URL (Optional)"
                  required
                  isInvalid={this.state.tooLongLinkError}
                  isValid={this.state.validLink}
                />
                <p></p>
                <Form.Control.Feedback type="invalid">
                  Link is too long.
                </Form.Control.Feedback>
              </Form.Group>

              {/* ADDRESS FORM BELOW */}
              <Form.Group className="mb-3" controlId="formAddress">
                <h5 style={{ marginTop: ".2rem", marginBottom: ".2rem" }}>
                  Address
                </h5>
                <Form.Control
                  //onChange={this.onChange}
                  as="textarea"
                  rows={2}
                  defaultValue={this.props.selectedYourPost.address}
                  placeholder="Enter address(Optional)"
                  required
                  isInvalid={this.state.tooLongAddressError}
                  isValid={this.state.validAddress}
                />
                <p></p>
                <Form.Control.Feedback type="invalid">
                  Address is too long.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" id="formGridCheckbox">
                {/* <Form.Label>
                  <b>Is Post Active?</b>
                </Form.Label> */}
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  label={
                    this.state.postActive ? <b>Active</b> : <b>Inactive</b>
                  }
                  //onChange={() => this.handleActive()}
                />

                <p>
                  <b>Active</b> means people can view the post when searching.
                </p>
              </Form.Group>

              {this.state.selectedCategory === "offbiz" ? (
                <Form.Group className="mb-3" id="formDGPCheckbox">
                  {/* <Form.Label>
                  <b>Is Post Active?</b>
                </Form.Label> */}
                  <Form.Check
                    type="switch"
                    id="DGP-switch"
                    label={
                      this.state.postDGP ? (
                        <b>My Store</b>
                      ) : (
                        <b>No 'My Store' for viewing</b>
                      )
                    }
                    //onChange={() => this.handleActive()}
                  />

                  <p>
                    <b>My Store</b> means you have Shop/Menu available for
                    viewing in the <b>My Store</b> dapp.
                  </p>
                </Form.Group>
              ) : (
                <></>
              )}

              <div className="ButtonRightNoUnderline">
                {this.state.validCity &&
                this.state.validRegion &&
                this.state.validCountry &&
                this.state.validDescription &&
                this.state.validLink &&
                this.state.validAddress ? (
                  <Button variant="primary" type="submit">
                    Edit Post
                  </Button>
                ) : (
                  <Button variant="primary" disabled>
                    Edit Post
                  </Button>
                )}
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default EditPostModal;
