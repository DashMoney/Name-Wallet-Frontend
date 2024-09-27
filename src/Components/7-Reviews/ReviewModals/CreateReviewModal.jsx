import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import CloseButton from "react-bootstrap/CloseButton";

class CreateReviewModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commentInput: "", //SO A COMMENT IS NOT REQUIRED -> OKAY
      validComment: true,
      tooLongCommentError: false,

      selectedStars: 5, // 0 - 5 and controlled by radio boxes <- special case handle like other modals do switches <- yes
    };
  }

  handleCloseClick = () => {
    this.props.hideModal();
  };

  handleNumOfStars = (whichCheckbox) => {
    if (whichCheckbox === "inline-checkbox-0") {
      this.setState({
        selectedStars: 0,
      });
    } else if (whichCheckbox === "inline-checkbox-1") {
      this.setState(
        {
          selectedStars: 1,
        } //,()=>console.log(this.state.selectedStars)
      );
    } else if (whichCheckbox === "inline-checkbox-2") {
      this.setState({
        selectedStars: 2,
      });
    } else if (whichCheckbox === "inline-checkbox-3") {
      this.setState({
        selectedStars: 3,
      });
    } else if (whichCheckbox === "inline-checkbox-4") {
      this.setState({
        selectedStars: 4,
      });
    } else if (whichCheckbox === "inline-checkbox-5") {
      this.setState({
        selectedStars: 5,
      });
    } else {
      this.setState({
        selectedStars: "error",
      });
    }
  };

  handleStars = () => {
    if (this.state.selectedStars === 0) {
      return (
        <span>
          <b>No Stars</b>
        </span>
      );
    } else if (this.state.selectedStars === 1) {
      return <>⭐</>;
    } else if (this.state.selectedStars === 2) {
      return <>⭐⭐</>;
    } else if (this.state.selectedStars === 3) {
      return <>⭐⭐⭐</>;
    } else if (this.state.selectedStars === 4) {
      return <>⭐⭐⭐⭐</>;
    } else if (this.state.selectedStars === 5) {
      return <span>⭐⭐⭐⭐⭐</span>;
    } else {
      return <>Unavailable</>;
    }
  };

  onChange = (event) => {
    //console.log(event.target);
    //console.log(`id = ${event.target.id}`);

    if (event.target.id === "formComment") {
      event.preventDefault();
      event.stopPropagation();
      this.commentValidate(event.target.value);
    } else {
      event.stopPropagation();

      this.handleNumOfStars(event.target.id);
    }
  };

  commentValidate = (comment) => {
    let regex = /^.[\S\s]{0,350}$/;

    let valid = regex.test(comment);

    if (valid) {
      this.setState({
        commentInput: comment,
        validComment: true,
        tooLongCommentError: false,
      });
    } else {
      if (comment.length > 200) {
        this.setState({
          commentInput: comment,
          validComment: false,
          tooLongCommentError: true,
        });
      } else {
        this.setState({
          commentInput: comment,
          validComment: false,
        });
      }
    }
  };

  handleSubmitClick = () => {
    if (this.state.selectedStars !== "error") {
      let review = {
        review: this.state.commentInput,
        rating: this.state.selectedStars,
      };

      this.props.createReview(review);
      this.props.hideModal();
    }
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
          <Modal.Header>
            <Modal.Title>
              <h3>
                <b>Review for {this.props.SearchedNameDoc.label}</b>
              </h3>
            </Modal.Title>
            {closeButtonColor}
          </Modal.Header>
          <Modal.Body>
            <Form
              noValidate
              onSubmit={this.handleSubmitClick}
              onChange={this.onChange}
            >
              <Form.Check
                inline
                label="0"
                name="group0"
                checked={this.state.selectedStars === 0 ? true : false}
                onChange={this.onChange}
                type="checkbox"
                id="inline-checkbox-0"
              />

              <Form.Check
                inline
                label="1"
                name="group1"
                checked={this.state.selectedStars === 1 ? true : false}
                onChange={this.onChange}
                type="checkbox"
                id="inline-checkbox-1"
              />

              <Form.Check
                inline
                label="2"
                name="group2"
                checked={this.state.selectedStars === 2 ? true : false}
                onChange={this.onChange}
                type="checkbox"
                id="inline-checkbox-2"
              />

              <Form.Check
                inline
                label="3"
                name="group3"
                checked={this.state.selectedStars === 3 ? true : false}
                onChange={this.onChange}
                type="checkbox"
                id="inline-checkbox-3"
              />
              <Form.Check
                inline
                label="4"
                name="group4"
                checked={this.state.selectedStars === 4 ? true : false}
                onChange={this.onChange}
                type="checkbox"
                id="inline-checkbox-4"
              />
              <Form.Check
                inline
                label="5"
                name="group5"
                checked={this.state.selectedStars === 5 ? true : false}
                onChange={this.onChange}
                type="checkbox"
                id="inline-checkbox-5"
              />
              <p></p>
              {this.handleStars()}

              <p></p>
              <Form.Group className="mb-3" controlId="formComment">
                {/* <Form.Label><b>Reply to Review</b></Form.Label> */}

                <Form.Control
                  onChange={this.onChange}
                  as="textarea"
                  rows={3}
                  placeholder="Enter review here..."
                  required
                  isInvalid={this.state.tooLongCommentError}
                  isValid={this.state.validComment}
                />

                {this.state.tooLongError ? (
                  <Form.Control.Feedback className="floatLeft" type="invalid">
                    Sorry, this is too long! Please use less than 250
                    characters.
                  </Form.Control.Feedback>
                ) : (
                  <></>
                )}
              </Form.Group>

              <p></p>
              <Button
                variant="primary"
                onClick={() => this.handleSubmitClick()}
              >
                <b>Create Review</b>
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default CreateReviewModal;
