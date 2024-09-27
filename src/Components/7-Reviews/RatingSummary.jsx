import React from 'react';

class RatingSummary extends React.Component {
 /**
  * Summary of Ratings needs: The   BurgerJoint   4.5⭐    (13)
  * needs the Reviews, SearchedNameDoc
  */ 
  render() { 

    let rating = 0;

    if(this.props.SearchedReviews.length !== 0){

     //there is a cool js function for this
    //ensure not undefined -> required in datacontract 0 to 5

    this.props.SearchedReviews.forEach(rev => {
      rating += rev.rating;
    })

    rating = rating / this.props.SearchedReviews.length;

    rating = rating.toFixed(1) // to one decimal place

  }else{
    rating = 'No Rating'
  }

    return (
      <>
{!this.props.isLoadingReviewsSearch && this.props.SearchedNameDoc !== 'No NameDoc'? 
<>
<div className='summarytext'>
    <div className='cardTitle'>
      <h3><b>{this.props.SearchedNameDoc.label}</b></h3>
      <b>{rating}⭐</b>
      <b>({this.props.SearchedReviews.length})</b>
    </div>
    </div>
</>
  :
  <></>}

      
    </>
    );
  }
}
 
export default RatingSummary;
