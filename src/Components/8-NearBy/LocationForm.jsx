import React from "react";

import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";

import Form from "react-bootstrap/Form";

class LocationForm extends React.Component {
  handleRegionButton = () => {
    this.props.triggerRegionButton();
  };

  onChange = (event) => {
    //console.log(event.target.value);

    event.preventDefault();
    event.stopPropagation();

    //console.log(`id = ${event.target.id}`);

    this.props.handleNearbyOnChangeValidation(event); //<- Do this -> DONE
  };

  handleSubmitClick = (event) => {
    event.preventDefault();
    //console.log(event.target.ControlTextarea1.value);

    this.props.submittedStateAndCategoryTHENConstruct();
  };

  render() {
    /**
     * whichCountryRegion: "Country",

      cityInput: "",
      validCity: false,
      tooLongCityNameError: false,

      countryRegionInput: "",
      validCountryRegion: false,
      tooLongCountryRegionNameError: false,
     */

    return (
      <>
        <Form
          noValidate
          onSubmit={this.handleSubmitClick}
          onChange={this.onChange}
        >
          {/* CITY INPUT BELOW */}

          <Form.Group className="mb-3" controlId="formCityName">
            <h4 style={{ marginTop: ".5rem", marginBottom: ".2rem" }}>
              City/Town
            </h4>
            <Form.Control
              type="text"
              placeholder="Enter city/town (Optional)"
              required
              isInvalid={this.props.tooLongCityNameError}
              isValid={this.props.validCity}
            />
            <p></p>
            <Form.Control.Feedback type="invalid">
              City/Town name is too long.
            </Form.Control.Feedback>
            {/* <Form.Control.Feedback type="valid">
              City/Town name is acceptable!
            </Form.Control.Feedback> */}
          </Form.Group>

          {/* COUNTRY/REGION INPUT BELOW */}
          <Form.Group className="mb-3" controlId="formCountryRegionName">
            {this.props.whichCountryRegion === "Country" ? (
              <ButtonGroup className="me-2" aria-label="First group">
                <Button
                  variant="primary"
                  style={{ textDecoration: "underline" }}
                >
                  <b>Country</b>
                </Button>

                <Button
                  variant="primary"
                  onClick={this.props.triggerRegionButton}
                >
                  <b>State/Province</b>
                </Button>
              </ButtonGroup>
            ) : (
              <ButtonGroup className="me-2" aria-label="First group">
                <Button
                  variant="primary"
                  onClick={this.props.triggerCountryButton}
                >
                  <b>Country</b>
                </Button>

                <Button
                  variant="primary"
                  style={{ textDecoration: "underline" }}
                >
                  <b>State/Province</b>
                </Button>
              </ButtonGroup>
            )}

            {this.props.whichCountryRegion === "Country" ? (
              <>
                <Form.Control
                  type="text"
                  placeholder="Enter country (Optional)"
                  required
                  isInvalid={this.props.tooLongCountryRegionNameError}
                  isValid={this.props.validCountryRegion}
                />
                <p></p>
                <Form.Control.Feedback type="invalid">
                  Country name is too long.
                </Form.Control.Feedback>
                {/* <Form.Control.Feedback type="valid">
              Country name is acceptable!
            </Form.Control.Feedback> */}
              </>
            ) : (
              <>
                <Form.Control
                  type="text"
                  placeholder="Enter state/province (Optional)"
                  required
                  isInvalid={this.props.tooLongCountryRegionNameError}
                  isValid={this.props.validCountryRegion}
                />
                <p></p>
                <Form.Control.Feedback type="invalid">
                  State/Province name is too long.
                </Form.Control.Feedback>
                {/* <Form.Control.Feedback type="valid">
              State/Province name is acceptable!
            </Form.Control.Feedback> */}
              </>
            )}
          </Form.Group>

          {/* 2 separate things is valid? and is Loading? ->  */}

          {/* whichCountryRegion: "Country",

      cityInput: "",
      validCity: false,
      tooLongCityNameError: false,

      countryRegionInput: "",
      validCountryRegion: false,
      tooLongCountryRegionNameError: false, */}

          <div className="ButtonRightNoUnderline">
            {this.props.validCity &&
            this.props.validCountryRegion &&
            !this.props.isLoadingNearbyForm ? (
              <Button variant="primary" type="submit">
                <b>Start Search</b>
              </Button>
            ) : (
              <></>
            )}

            {(!this.props.validCity || !this.props.validCountryRegion) &&
            !this.props.isLoadingNearbyForm ? (
              <Button variant="primary" disabled>
                <b>Start Search</b>
              </Button>
            ) : (
              <></>
            )}

            {this.props.isLoadingNearbyForm ? (
              <Button variant="primary">
                <b>Loading..</b>
              </Button>
            ) : (
              <></>
            )}
          </div>
        </Form>
      </>
    );
  }
}

export default LocationForm;
