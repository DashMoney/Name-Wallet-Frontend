import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import CloseButton from "react-bootstrap/CloseButton";

//Post
/**
 * city: {
          type: 'string',
          minLength: 1,
          maxLength: 32,
        },

        region: {
          type: 'string',
          minLength: 1,
          maxLength: 32,
        },

        country: {
          type: 'string',
          minLength: 1,
          maxLength: 32,
        },
        description: { 
          type: 'string',
          minLength: 1,
          maxLength: 350,
        },
        category: { // offrent, offbiz, offother, lookrent, lookother
          type: 'string',
          minLength: 0,
          maxLength: 32,
        },

        link:{ //one url/http address
              type: 'string',
              minLength: 1,
              maxLength: 350,
        },


        // links:{ //array of url/http addresses
        //   type: 'array', 
        //   minItems: 1,
        //   maxItems: 10,
        //   items: { //This defines the url
        //       type: 'string',
        //       minLength: 1,
        //       maxLength: 350,
        //     },
        // },

        price: { //this will be priced in duffs but i will have Dash, mDash for display
          type: 'integer',
          minimum: 0,
          maximum: 10000000000000, // 100,000 Dash is max
           
        },

        // avail:{ //the post appears in the search but cannot click in
        //   type: 'boolean'
        // },

        active:{ //Post does not appear in search
          type: 'boolean'
        },

        dgp:{
          type:'boolean'
        }
 */

//EVENT
class CreatePostModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCategory: "",

      cityInput: "",
      validCity: false,
      tooLongCityError: false,

      regionInput: "",
      validRegion: false,
      tooLongRegionError: false,

      countryInput: "",
      validCountry: false,
      tooLongCountryError: false,

      // priceInput: 0,
      // validPrice: false,

      descriptionInput: "",
      validDescription: false,
      tooLongDescriptionError: false,

      linkInput: "",
      validLink: true,
      tooLongLinkError: false,

      groupInput: "",
      validGroup: false,
      tooLongGroupError: false,

      addressInput: "",
      validAddress: true,
      tooLongAddressError: false,

      dateInput: "",
      validDate: true,
      tooLongDateError: false,

      timeInput: "",
      validTime: true,
      tooLongTimeError: false,

      postActive: true,
      //postAvail: true,
      postDGP: true,

      //EVENT
      // group: maxLength: 32,
      // address: maxLength: 100,
      // date: maxLength: 32,
      // time: maxLength: 32,
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

  handleDGP = () => {
    if (this.state.postDGP) {
      this.setState({
        postDGP: false,
      });
    } else {
      this.setState({
        postDGP: true,
      });
    }
  };

  // handleAvail = () => {
  //   if (this.state.itemAvail) {
  //     this.setState({
  //       itemAvail: false,
  //     });
  //   } else {
  //     this.setState({
  //       itemAvail: true,
  //     });
  //   }
  // };

  // formValidate = (messageText) => {
  //   let regex = /^.[\S\s]{0,350}$/;

  //   let valid = regex.test(messageText);

  //   if (valid) {
  //     //Put tag error here
  //     this.setState({
  //       messageInput: messageText,
  //       tooLongError: false,
  //     });
  //     return true;
  //   } else {
  //     if (messageText.length > 300) {
  //       this.setState({
  //         tooLongError: true,
  //       });
  //     }
  //     return false;
  //   }
  // };

  onChange = (event) => {
    // console.log(event.target.value);

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

    // if (event.target.id === "formItemPrice") {
    //   this.priceValidate(event.target.value);
    // }

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
    }
    if (event.target.id === "formAddress") {
      event.preventDefault();
      event.stopPropagation();
      this.addressValidate(event.target.value);
    }

    if (event.target.id === "formGroup") {
      event.preventDefault();
      event.stopPropagation();
      this.groupValidate(event.target.value);
    }
    if (event.target.id === "formDate") {
      event.preventDefault();
      event.stopPropagation();
      this.dateValidate(event.target.value);
    }
    if (event.target.id === "formTime") {
      event.preventDefault();
      event.stopPropagation();
      this.timeValidate(event.target.value);
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

  //   priceValidate = (numberInput) => {
  //     //console.log(this.props.accountBalance);

  //     let regex = /(^[0-9]+[.,]{0,1}[0-9]{0,5}$)|(^[.,][0-9]{1,5}$)/;
  //     //CHANGED TO LIMIT TO minimum mDash possible
  //     //let regex = /(^[0-9]+[.,]{0,1}[0-9]*$)|(^[.,][0-9]+$)/;

  //     let valid = regex.test(numberInput);

  // //MAX SPENDABLE IS 10000 DASH
  //     if (valid && numberInput > 0 && numberInput <= 10000) {
  //       this.setState({
  //         priceInput: numberInput,
  //         validPrice: true,
  //       });
  //     } else {
  //       this.setState({
  //         priceInput: numberInput,
  //         validPrice: false,
  //       });
  //     }
  //   };

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
      if (link.length > 350) {
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
  //  EVENT VALIDATION
  // group: maxLength: 32,
  // address: maxLength: 150,
  // date: maxLength: 32,
  // time: maxLength: 32,
  groupValidate = (group) => {
    let regex = /^\S.{1,30}\S$/;
    let valid = regex.test(group);

    if (valid) {
      this.setState({
        groupInput: group,
        tooLongGroupError: false,
        validGroup: true,
      });
    } else {
      if (group.length > 32) {
        this.setState({
          groupInput: group,
          tooLongGroupError: true,
          validGroup: false,
        });
      } else {
        this.setState({
          groupInput: group,
          validGroup: false,
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

  dateValidate = (date) => {
    let regex = /^[\S\s]{0,32}$/;
    let valid = regex.test(date);

    if (valid) {
      this.setState({
        dateInput: date,
        tooLongDateError: false,
        validDate: true,
      });
    } else {
      if (date.length > 32) {
        this.setState({
          dateInput: date,
          tooLongDateError: true,
          validDate: false,
        });
      } else {
        this.setState({
          dateInput: date,
          validDate: false,
        });
      }
    }
  };

  timeValidate = (time) => {
    let regex = /^[\S\s]{0,32}$/;
    let valid = regex.test(time);

    if (valid) {
      this.setState({
        timeInput: time,
        tooLongTimeError: false,
        validTime: true,
      });
    } else {
      if (time.length > 32) {
        this.setState({
          timeInput: time,
          tooLongTimeError: true,
          validTime: false,
        });
      } else {
        this.setState({
          timeInput: time,
          validTime: false,
        });
      }
    }
  };

  handleSubmitClick = (event) => {
    event.preventDefault();
    //console.log(event.target.ControlTextarea1.value);

    //CHANGE TO NEWPOST AND SET THE LOWERCASE HERE!
    let newPost;
    //if statement for POST OR EVENT ->
    if (this.state.selectedCategory === "events") {
      newPost = {
        city: this.state.cityInput.toLocaleLowerCase(),
        region: this.state.regionInput.toLocaleLowerCase(),
        country: this.state.countryInput.toLocaleLowerCase(),

        description: this.state.descriptionInput,
        category: this.state.selectedCategory,
        link: this.state.linkInput,

        active: this.state.postActive,
        dgp: false, //use this in Events also? -> ? maybe

        group: this.state.groupInput,
        address: this.state.addressInput,
        date: this.state.dateInput,
        time: this.state.timeInput,
      };
    } else {
      newPost = {
        city: this.state.cityInput.toLocaleLowerCase(),
        region: this.state.regionInput.toLocaleLowerCase(),
        country: this.state.countryInput.toLocaleLowerCase(),
        //price:  Number((this.state.priceInput * 100000000).toFixed(0)),
        description: this.state.descriptionInput,
        category: this.state.selectedCategory,
        link: this.state.linkInput,
        address: this.state.addressInput,

        active: this.state.postActive,
        dgp: this.state.postDGP,
      };
    }
    //console.log(newPost);
    this.props.createYourPost(newPost);
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
                <b>Create a Post</b>
              </h3>
            </Modal.Title>
            {closeButtonColor}
          </Modal.Header>

          {/* <div className="BottomBorder" style={{ paddingTop: ".5rem" }}></div> */}

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

            {this.state.selectedCategory === "events" ? (
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
                    paddingLeft: ".5rem",
                    paddingRight: ".5rem",
                  }}
                >
                  Events
                </b>
              </Button>
            ) : (
              <Button
                variant="primary"
                style={{
                  marginBottom: ".7rem",
                  marginRight: ".5rem",
                }}
                onClick={() => this.handleCategoryButtons("events")}
              >
                <b
                  style={{
                    paddingLeft: ".5rem",
                    paddingRight: ".5rem",
                  }}
                >
                  Events
                </b>
              </Button>
            )}

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
                style={{ textDecoration: "underline", marginRight: ".5rem" }}
              >
                <b>Place to Rent</b>
              </Button>
            ) : (
              <Button
                variant="primary"
                style={{ marginRight: ".5rem" }}
                onClick={() => this.handleCategoryButtons("lookrent")}
              >
                <b>Place to Rent</b>
              </Button>
            )}

            {this.state.selectedCategory === "lookother" ? (
              <Button
                variant="primary"
                style={{ textDecoration: "underline", marginRight: ".5rem" }}
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
                style={{ marginRight: ".5rem" }}
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

            {this.state.selectedCategory === "" ? (
              <>
                <p className="bodytext">
                  Please select the appropriate category for this post above.
                </p>
                <div className="ButtonRightNoUnderline">
                  <Button variant="primary" disabled>
                    <b>Create Post</b>
                  </Button>
                </div>
              </>
            ) : (
              <>
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
                      placeholder="Enter city/town"
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
                      placeholder="Enter state/province"
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
                      placeholder="Enter country"
                      required
                      isInvalid={this.state.tooLongCountryError}
                      isValid={this.state.validCountry}
                    />
                    <p></p>
                    <Form.Control.Feedback type="invalid">
                      Country name is too long.
                    </Form.Control.Feedback>
                  </Form.Group>

                  {this.state.selectedCategory === "events" ? (
                    <>
                      {/* Group FORM BELOW */}
                      <Form.Group className="mb-3" controlId="formGroup">
                        <h5
                          style={{ marginTop: ".2rem", marginBottom: ".2rem" }}
                        >
                          <b>Name of Event/Group</b>
                        </h5>
                        <Form.Control
                          type="text"
                          placeholder="Enter event/group name"
                          required
                          isInvalid={this.state.tooLongGroupError}
                          isValid={this.state.validGroup}
                        />
                        <p></p>
                        <Form.Control.Feedback type="invalid">
                          Event/Group name is too long.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </>
                  ) : (
                    <></>
                  )}

                  {/* POST DESCRIPTION FORM BELOW */}

                  <Form.Group className="mb-3" controlId="formDescription">
                    <Form.Label>
                      <h5 style={{ marginTop: ".5rem", marginBottom: ".2rem" }}>
                        Description
                      </h5>
                    </Form.Label>

                    <Form.Control
                      // onChange={this.onChange}
                      as="textarea"
                      rows={2}
                      placeholder="Put description here.."
                      required
                      isInvalid={this.state.tooLongDescriptionError}
                      isValid={this.state.validDescription}
                    />

                    {this.state.tooLongDescriptionError ? (
                      <Form.Control.Feedback
                        className="floatLeft"
                        type="invalid"
                      >
                        Sorry, this is too long! Please use less than 300
                        characters.
                      </Form.Control.Feedback>
                    ) : (
                      <></>
                    )}
                  </Form.Group>

                  {this.state.selectedCategory === "events" ? (
                    <>
                      {/* Date FORM BELOW */}
                      <Form.Group className="mb-3" controlId="formDate">
                        <h5
                          style={{ marginTop: ".2rem", marginBottom: ".2rem" }}
                        >
                          <b>Date of Event</b>
                        </h5>
                        <Form.Control
                          type="text"
                          placeholder="Enter date (Optional)"
                          required
                          isInvalid={this.state.tooLongDateError}
                          isValid={this.state.validDate}
                        />
                        <p className="smallertext">
                          (e.g."Friday, 2nd of January" or "Every Saturday")
                        </p>
                        <p></p>
                        <Form.Control.Feedback type="invalid">
                          Date info is too long.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </>
                  ) : (
                    <></>
                  )}

                  {/* Time FORM BELOW */}

                  {this.state.selectedCategory === "events" ? (
                    <>
                      <Form.Group className="mb-3" controlId="formTime">
                        <h5
                          style={{ marginTop: ".2rem", marginBottom: ".2rem" }}
                        >
                          <b>Time of Event</b>
                        </h5>
                        <Form.Control
                          type="text"
                          placeholder="Enter time (Optional)"
                          required
                          isInvalid={this.state.tooLongTimeError}
                          isValid={this.state.validTime}
                        />
                        <p></p>
                        <Form.Control.Feedback type="invalid">
                          Time info is too long.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </>
                  ) : (
                    <></>
                  )}

                  {/* LINKS FORM BELOW */}

                  <Form.Group className="mb-3" controlId="formLink">
                    <h5 style={{ marginTop: ".5rem", marginBottom: ".2rem" }}>
                      Link
                    </h5>

                    <Form.Control
                      type="text"
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
                      <b>Active</b> means people can view the post when
                      searching.
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
                  {/* Make separate/distinct submit for events for separate validation */}
                  <div className="ButtonRightNoUnderline">
                    {this.state.selectedCategory === "events" ? (
                      <>
                        {this.state.validCity &&
                        this.state.validRegion &&
                        this.state.validCountry &&
                        this.state.validDescription &&
                        this.state.validLink &&
                        this.state.validGroup &&
                        this.state.validAddress &&
                        this.state.validDate &&
                        this.state.validTime ? (
                          <Button variant="primary" type="submit">
                            <b>Create Event</b>
                          </Button>
                        ) : (
                          <Button variant="primary" disabled>
                            <b>Create Event</b>
                          </Button>
                        )}
                      </>
                    ) : (
                      <>
                        {this.state.validCity &&
                        this.state.validRegion &&
                        this.state.validCountry &&
                        this.state.validDescription &&
                        this.state.validLink &&
                        this.state.validAddress ? (
                          <Button variant="primary" type="submit">
                            <b>Create Post</b>
                          </Button>
                        ) : (
                          <Button variant="primary" disabled>
                            <b>Create Post</b>
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </Form>
              </>
            )}
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default CreatePostModal;
