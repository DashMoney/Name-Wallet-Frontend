import React from "react";

import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";

class NameSearchForm extends React.Component {
  onChange = (event) => {
    //console.log(event.target.value);

    event.preventDefault();
    event.stopPropagation();

    //console.log(`id = ${event.target.id}`);
    this.props.handleOnChangeValidation(event);
  };

  handleSubmitClick = (event) => {
    event.preventDefault();
    //console.log(event.target.ControlTextarea1.value);

    this.props.searchName();
  };

  render() {
    return (
      <>
        <Form
          id="Search-Name-form"
          noValidate
          onSubmit={this.handleSubmitClick}
          onChange={this.onChange}
        >
          <Form.Group className="mb-3" controlId="validationCustomName">
            {this.props.isLoadingSearch ? (
              <Form.Control
                type="text"
                placeholder={this.props.nameToSearch}
                readOnly
              />
            ) : (
              <Form.Control
                type="text"
                placeholder="Enter name  here..."
                defaultValue={this.props.nameToSearch}
                required
                isValid={this.props.nameFormat}
              />
            )}
          </Form.Group>

          {this.props.isLoadingSearch ? (
            <>
              <p> </p>
              <div id="spinner">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
              <p> </p>
            </>
          ) : (
            <>
              {this.props.nameFormat && !this.props.isLoadingSearch ? (
                <div className="ButtonRightNoUnderline">
                  <Button variant="primary" type="submit">
                    <b>Search</b>
                  </Button>
                </div>
              ) : (
                <div className="ButtonRightNoUnderline">
                  <Button disabled variant="primary" type="submit">
                    <b>Search</b>
                  </Button>
                </div>
              )}
            </>
          )}
        </Form>
      </>
    );
  }
}

export default NameSearchForm;
