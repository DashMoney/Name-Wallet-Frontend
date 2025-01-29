import React from "react";

import Button from "react-bootstrap/Button";

import DGPItem from "./DGPItem";

class DGPView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCategory: "",
    };
  }

  handleCategory = (category) => {
    this.setState({
      selectedCategory: category,
    });
  };

  handleCatBack = () => {
    this.setState({
      selectedCategory: "",
    });
  };

  render() {
    //First sort out items that have categories and which do not
    let categoryItems = [];
    let nonCatItems = [];

    this.props.merchantItems.forEach((item) => {
      if (item.category === undefined || item.category === "") {
        nonCatItems.push(item);
      } else {
        categoryItems.push(item);
      }
    });

    // Next create a list of buttons based on the category names
    let categoryNames = categoryItems.map((item) => {
      return item.category;
    });

    let setOfCatNames = [...new Set(categoryNames)];

    categoryNames = [...setOfCatNames];

    let categoryButtons = categoryNames.map((category, index) => (
      <Button
        key={index}
        variant="primary"
        onClick={() => {
          this.handleCategory(category);
        }}
      >
        <b>{category}</b>
      </Button>
    ));

    // display category above or below items? -> above I think, thought about below to indicate specials but its bad design.

    let itemsToDisplay = [];

    if (this.state.selectedCategory === "") {
      itemsToDisplay = nonCatItems;
    } else {
      itemsToDisplay = categoryItems.filter((item) => {
        return item.category === this.state.selectedCategory;
      });
    }

    let items = itemsToDisplay.map((item, index) => {
      //console.log(item);
      return (
        <DGPItem key={index} mode={this.props.mode} index={index} item={item} />
      );
    });

    return (
      <>
        {/* <div  className="footer"> */}

        {this.props.merchantItems.length === 0 ? (
          <>
            <p>This store has no items for purchase.</p>
          </>
        ) : (
          <div>
            {this.state.selectedCategory === "" ? (
              <div className="d-grid gap-2">{categoryButtons}</div>
            ) : (
              <div className="categoryTitle">
                <Button
                  variant="primary"
                  onClick={() => {
                    this.handleCatBack();
                  }}
                >
                  <b>Back</b>
                </Button>

                <h3 className="spaceLeft">
                  <b>{this.state.selectedCategory}</b>
                </h3>
              </div>
            )}

            {items}
          </div>
        )}

        {/* </div> */}
      </>
    );
  }
}

export default DGPView;
