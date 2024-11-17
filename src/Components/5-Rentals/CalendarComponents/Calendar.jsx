import React from "react";

import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import dapiClientNoWallet from "../../DapiClientNoWallet";
import Dash from "dash";

const {
  // Essentials: { Buffer },
  PlatformProtocol: { Identifier },
} = Dash;

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reqDateArr: [], //[year, month, day],
      reqDateInput: Date.now(), //Have to set to sundayStart
      validReqDate: false,
      //
      Confirm1: false,
      Confirm2: false,
      //
      priorConfirm: [], //Logic of Good to Go so want true <-
      subsequentConfirms: [],
      // confirmDocuments: [],
      scheduleBlockedDates: [], //THIS IS AN ARRAY OF 1-35
      LoadingConfirms: true,
    };
  }

  displayDate = (theIndex, theDateObject, ifSunday, months) => {
    let theDayOfMonth = theDateObject.getDate();
    let ifFirstOfMonth = theDayOfMonth === 1;

    let availArray = this.state.scheduleBlockedDates;

    if (availArray.includes(theIndex)) {
      return (
        <td key={theIndex} style={{ textAlign: "center" }}>
          {/* Do a noncolor if its still loading to have a placeholder but not false indication. <- YES */}
          {this.state.LoadingConfirms ? (
            <p style={{ fontSize: "smaller", margin: "0rem" }}>
              {theDateObject.getDate()}
            </p>
          ) : (
            <p style={{ fontSize: "smaller", margin: "0rem", color: "red" }}>
              {theDateObject.getDate()}
            </p>
          )}

          <p style={{ margin: "0rem" }}>
            {ifSunday || ifFirstOfMonth ? (
              <>
                <b>{months[theDateObject.getMonth()]}</b>
              </>
            ) : (
              <></>
            )}
          </p>
        </td>
      );
    } else {
      return (
        <td key={theIndex} style={{ textAlign: "center" }}>
          {this.state.LoadingConfirms ? (
            <p style={{ fontSize: "smaller", margin: "0rem" }}>
              {theDateObject.getDate()}
            </p>
          ) : (
            <p style={{ fontSize: "smaller", margin: "0rem", color: "green" }}>
              {theDateObject.getDate()}
            </p>
          )}

          <p style={{ margin: "0rem" }}>
            {ifSunday || ifFirstOfMonth ? (
              <>
                <b>{months[theDateObject.getMonth()]}</b>
              </>
            ) : (
              <></>
            )}
          </p>
        </td>
      );
    }
  };

  handleDateCalc = () => {
    let dateArr = [];

    if (this.state.reqDateArr.length === 3) {
      dateArr = [...this.state.reqDateArr]; // [year, month, day],
      //console.log(dateArr);
      //  console.log(d);
      // console.log(d.getTime()); //.getTime() just w/o milliseconds
      let d = new Date(dateArr[0], dateArr[1], dateArr[2]);
      //   let yearInitial = d.getFullYear();
      // let monthInitial = d.getMonth();
      // let dayOfMonth = d.getDate();
      let dayOfWeek = d.getDay();

      // let dateArray = [yearInitial, monthInitial, dayOfMonth];
      // console.log(dateArray);

      // let sunDateArray = [
      //   d.getFullYear(),
      //   d.getMonth() + 1,
      //   d.getDate() - dayOfWeek,
      // ];
      // console.log(sunDateArray);

      let startingSunday = new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate() - dayOfWeek
      ).getTime();

      //console.log(startingSunday);

      this.setState(
        {
          reqDateInput: startingSunday, // DO i NEED THIS SETsTATE??
          validReqDate: true,
          priorConfirm: [],
          subsequentConfirms: [],

          scheduleBlockedDates: [],
        },
        () =>
          this.startConfirmRace(startingSunday, startingSunday + 35 * 86400000)
      );
    } else {
      console.log("No date avail..");
      this.setState({
        reqDateInput: "",
        validReqDate: false,
        LoadingConfirms: false,
      });
    }
  };

  onChange = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.target.id === "formReqDate") {
      console.log(event.target.value);
      this.reqDateParse(event.target.value);
    }
  };

  reqDateParse = (date) => {
    //2024-04-15
    // console.log(date);
    let year = date.slice(0, 4);
    let month = date.slice(5, 7);
    month = Number(month - 1).toString();
    let day = date.slice(8, 10);
    // console.log(month);
    this.setState(
      {
        reqDateArr: [year, month, day],
        validReqDate: true,
        // LoadingConfirms: true,
      } //,() => this.handleDateCalc()
    );
  };

  //CONFIRMS QUERIES

  startConfirmRace = (theStart, theEnd) => {
    this.getPriorConfirm(theStart);
    this.getSubsequentConfirms(theStart, theEnd);
  };

  confirmsRace = () => {
    if (this.state.Confirm1 && this.state.Confirm2) {
      // let schedule = this.createScheduleDateArray(
      //   [initialSunday + 86400000, initialSunday + 86400000 * 6],
      //   initialSunday
      // );
      let schedule = [];

      [...this.state.priorConfirm, ...this.state.subsequentConfirms].forEach(
        (confirm) => {
          schedule.push(confirm.arriveDate, confirm.departDate);
        }
      );

      //console.log(`Schedule: ${schedule}`);

      let scheduleToSet = this.createScheduleDateArray(
        schedule,
        this.state.reqDateInput
      );

      //console.log(`ScheduleToSet: ${scheduleToSet}`);

      this.setState({
        Confirm1: false,
        Confirm2: false,
        scheduleBlockedDates: scheduleToSet,
        LoadingConfirms: false,
      });
    }
  };

  getPriorConfirm = (startDate) => {
    //console.log("Calling getConfirms");
    // if (!this.state.LoadingConfirms) {
    //   this.setState({ LoadingConfirms: true });
    // }

    const client = new Dash.Client(dapiClientNoWallet(this.props.whichNetwork));

    const getDocuments = async () => {
      return client.platform.documents.get("RENTALSContract.confirm", {
        limit: 1,
        where: [
          ["$ownerId", "==", this.props.MerchantId],
          ["rentalId", "==", this.props.rental.$id],
          ["arriveDate", "<=", startDate],
        ],
        orderBy: [["arriveDate", "asc"]],
      });
    };
    // Only one range operator is allowed in a query (except for between behavior)
    // Sorting must be by the last indexed property

    getDocuments()
      .then((d) => {
        if (d.length === 0) {
          // console.log("There are no Confirm");

          this.setState(
            {
              Confirm1: true,
              priorConfirm: [],
            },
            () => this.confirmsRace()
          );
        } else {
          let docArray = [];
          //  console.log("Getting Confirms");

          for (const n of d) {
            let returnedDoc = n.toJSON();
            //console.log("Confirm:\n", returnedDoc);
            returnedDoc.reqId = Identifier.from(
              returnedDoc.reqId,
              "base64"
            ).toJSON();
            returnedDoc.rentalId = Identifier.from(
              returnedDoc.rentalId,
              "base64"
            ).toJSON();
            // console.log("newConfirm:\n", returnedDoc);
            docArray = [...docArray, returnedDoc];
          }
          //IS THE DEPARTURE DATE AFTER THE ARRIVAL DATE?
          let overlap = docArray.find((doc) => {
            return doc.departDate > startDate;
          });

          if (overlap === undefined) {
            this.setState(
              {
                Confirm1: true,
                priorConfirm: [],
              },
              () => this.confirmsRace()
            );
          } else {
            this.setState(
              {
                Confirm1: true,
                priorConfirm: [overlap],
              },
              () => this.confirmsRace()
            );
          }
        }
      })
      .catch((e) => console.error("Something went wrong:\n", e))
      .finally(() => client.disconnect());
  };

  getSubsequentConfirms = (startDate, endDate) => {
    //console.log("Calling getSubsequentConfirms");

    const client = new Dash.Client(dapiClientNoWallet(this.props.whichNetwork));

    const getDocuments = async () => {
      return client.platform.documents.get("RENTALSContract.confirm", {
        limit: 36,
        where: [
          ["$ownerId", "==", this.props.MerchantId],
          ["rentalId", "==", this.props.rental.$id],
          ["arriveDate", ">=", startDate], //24 * 60 * 60 * 1000
        ],
        orderBy: [["arriveDate", "desc"]],
      });
    };
    // Only one range operator is allowed in a query (except for between behavior)
    // Sorting must be by the last indexed property

    getDocuments()
      .then((d) => {
        if (d.length === 0) {
          console.log("There are no Confirms");

          this.setState(
            {
              Confirm2: true,
              subsequentConfirms: [],
            },
            () => this.confirmsRace()
          );
        } else {
          let docArray = [];
          //console.log("Getting Confirms");

          for (const n of d) {
            let returnedDoc = n.toJSON();
            //console.log("Confirm:\n", returnedDoc);
            returnedDoc.reqId = Identifier.from(
              returnedDoc.reqId,
              "base64"
            ).toJSON();
            returnedDoc.rentalId = Identifier.from(
              returnedDoc.rentalId,
              "base64"
            ).toJSON();
            // console.log("newConfirm:\n", returnedDoc);
            docArray = [returnedDoc, ...docArray];
          }

          //  console.log(`docArray: ${docArray}`);

          //IS THE DEPARTURE DATE AFTER THE ARRIVAL DATE?
          let overlap = docArray.filter((doc) => {
            return (
              doc.arriveDate < endDate //|| doc.arriveDate === startDate
            );
          });

          //  console.log(`overlap: ${overlap}`);

          if (overlap === undefined) {
            this.setState(
              {
                Confirm2: true,
                subsequentConfirms: [],
              },
              () => this.confirmsRace()
            );
          } else {
            this.setState(
              {
                Confirm2: true,
                subsequentConfirms: overlap,
              },
              () => this.confirmsRace()
            );
          }
        }
      })
      .catch((e) => console.error("Something went wrong:\n", e))
      .finally(() => client.disconnect());
  };

  //CONFIRMS QUERIES^^^

  // getRentalConfirmSchedule = (startDate) => {
  //   //console.log("Calling getRentalConfirmSchedule");
  //   if (!this.state.LoadingConfirms) {
  //     this.setState({ LoadingConfirms: true });
  //   }

  //   const client = new Dash.Client(dapiClientNoWallet(this.props.whichNetwork));

  //   const getDocuments = async () => {
  //     return client.platform.documents.get("RENTALSContract.confirm", {
  //       // { $ownerId: 'asc' }, //owner(Merchant) - IdentityId
  //       // { rentalId: 'asc' }, //the rental
  //       // { arriveDate: 'asc' },
  //       // { departDate: 'asc' },
  //       where: [
  //         ["$ownerId", "==", this.props.MerchantId],
  //         ["rentalId", "==", this.props.rental.$id],
  //         ["arriveDate", "<=", startDate + 35 * 86400000], //24 * 60 * 60 * 1000
  //         ["departDate", ">", startDate],
  //       ], //,orderBy: [["$updatedAt", "desc"]],
  //     });
  //   };

  //   getDocuments()
  //     .then((d) => {
  //       if (d.length === 0) {
  //         //console.log("There are no YourRides");

  //         this.setState({
  //           LoadingConfirms: false,
  //         });
  //       } else {
  //         let docArray = [];
  //         //console.log("Getting YourRides");

  //         for (const n of d) {
  //           let returnedDoc = n.toJSON();
  //           //console.log("Confirm:\n", returnedDoc);
  //           returnedDoc.reqId = Identifier.from(
  //             returnedDoc.reqId,
  //             "base64"
  //           ).toJSON();
  //           // console.log("newConfirm:\n", returnedDoc);
  //           docArray = [...docArray, returnedDoc];
  //         }
  //         //SEND TO CREATESCHEDULEDATEARRAY AND SETSTATE THERE ->
  //         //
  //         //createScheduleDateArray = (docArray, startDate)
  //         //  THIS ^^^ RETURNS AN ARRAY oR CHANGE SO NO RETURN JUST SETS?
  //         this.setState({
  //           LoadingConfirms: false,
  //           scheduleBlockedDates: [],
  //         });
  //       }
  //     })
  //     .catch((e) => console.error("Something went wrong:\n", e))
  //     .finally(() => client.disconnect());
  // };

  createScheduleDateArray = (docArray, startDate) => {
    let startEndDateArray = [...docArray];
    //REPLACE WITH BELOW WHEN READY TO USE QUERY ->
    // let startEndDateArray = [];

    // docArray.forEach((confirm) => {
    //   startEndDateArray.push(confirm.arriveDate);
    //   startEndDateArray.push(confirm.departDate);
    // });

    let numberArray = [];
    //CASE:
    if (startEndDateArray.length === 0) {
      return numberArray;
    }
    //clear the inital
    //
    //CASE: //PARTIAL FOR CASE.. AND CASE...
    //
    //NEED A FLIP TO CONTROL IF NEXT DATE IS A START OR AN END. =>
    let nextDate = "start";
    //
    //if docArray[0]<startdate then add 0 and remove first date
    if (startEndDateArray[0] <= startDate) {
      numberArray.push(0);
      nextDate = "end";
      startEndDateArray.shift();
    }
    //CASE:
    if (startEndDateArray.length === 0) {
      for (let i = 1; i < 35; i++) {
        numberArray.push(i);
      }
      return numberArray;
    }

    //
    for (let i = 1; i < 35; i++) {
      let currentDate = startDate + i * 86400000;
      //need to remove the start of array ->
      //if
      //
      if (nextDate === "end") {
        if (currentDate < startEndDateArray[0]) {
          numberArray.push(i);
        }
        if (currentDate === startEndDateArray[0]) {
          startEndDateArray.shift();
          nextDate = "start";
        }
      } else {
        //nextDate==='start'
        // if (currentDate < startEndDateArray[0]) {
        //numberArray.push(i);
        // }
        if (currentDate === startEndDateArray[0]) {
          numberArray.push(i);
          nextDate = "end";
          startEndDateArray.shift();
        }
      }
      //
      if (startEndDateArray.length === 0) {
        return numberArray;
      }
    }

    return numberArray;
    //how to get the [0-34]
  };

  onSubmitClick = (event) => {
    event.preventDefault();
    this.setState(
      {
        LoadingConfirms: true,
      },
      () => this.handleDateCalc()
    );
  };

  // THE FLOW - Initial
  /*
  1) componentDidMount -> new Date() -> SundayInitial
      // SO QUERY SHOULD GO HERE..
      THEN
    createScheduleDateArray

    THE FLOW - Subsequent
    1) 
     */

  componentDidMount() {
    //The get methods above return Local time.
    const dateInitial = new Date();
    // let yearInitial = dateInitial.getFullYear();
    // let monthInitial = dateInitial.getMonth();
    // let dayOfMonth = dateInitial.getDate();
    let dayOfWeek = dateInitial.getDay();

    // let dateArray = [yearInitial, monthInitial, dayOfMonth];
    // console.log(dateArray);

    let sunInitDateArray = [
      dateInitial.getFullYear(),
      dateInitial.getMonth(),
      dateInitial.getDate() - dayOfWeek,
    ];
    // console.log(sunInitDateArray);

    let initialSunday = new Date(
      sunInitDateArray[0],
      sunInitDateArray[1],
      sunInitDateArray[2]
    ).getTime();

    this.setState(
      {
        reqDateInput: initialSunday,
      },
      () => this.startConfirmRace(initialSunday, initialSunday + 3024000000)
    );

    // console.log(`initialSunday: ${initialSunday}`);
    // console.log(
    //   `initialSunday + 35 * 86400000: ${initialSunday + 35 * 86400000}`
    // );

    //
    //createScheduleDateArray = (docArray, startDate)
    //
    // let schedule = this.createScheduleDateArray(
    //   [initialSunday + 86400000, initialSunday + 86400000 * 6],
    //   initialSunday
    // );

    // this.setState({
    //   scheduleBlockedDates: schedule,
    // });
  }

  render() {
    let weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    //HAVE TO BUILD EACH DAY <-
    //FIRST FUNCTION -> TAKE A DATE(TODAY) -> RETURN MOST RECENT SUNDAY
    //TAKE ISO
    //should be array [year, month(0-11), dayOfMonth(1-31)]
    //const d = new Date("2022-03-25");
    // let dOfWeek = d.getDay();
    // console.log(dOfWeek);
    //
    //The get methods above return Local time.
    const dateTest = new Date(this.state.reqDateInput);
    let yearTest = dateTest.getFullYear();
    let monthTest = dateTest.getMonth();
    let dayOfMonth = dateTest.getDate();
    let dayOfWeek = dateTest.getDay();

    //console.log(typeof dayOfMonth);
    //console.log(typeof dayOfWeek);

    let dateArray = [yearTest, monthTest, dayOfMonth];
    // console.log(dateArray);

    let sunDateArray = [
      dateTest.getFullYear(),
      dateTest.getMonth(),
      dateTest.getDate() - dayOfWeek,
    ];
    // console.log(sunDateArray);

    //let computedDay = Number(dayOfMonth - dayOfWeek);
    // sunDateArray = [yearTest, monthTest, dayOfMonth - dayOfWeek];
    //console.log(sunDateArray);
    //create array of objects and then create the table from the objects
    let calendarArray = [];
    //
    for (let i = 0; i < 35; i++) {
      let theDateArray = [...sunDateArray]; //BE CAREFUL, DON'T JUST MESS WITH ARRAYS,COPY <= ***
      theDateArray.pop();
      let newDate = sunDateArray[2] + i;
      theDateArray.push(newDate);
      let dateObj = new Date(theDateArray[0], theDateArray[1], theDateArray[2]);
      calendarArray.push(dateObj);
    }

    //console.log(calendarArray);

    //need a start date could be any day of the week
    //push back to nearest sunday.
    //may cover multiple months (3 max) 3 shades
    //months on Sunday
    //needs an array input of days that are confirmed -> produced separately
    //
    // absolute dates or relative

    //TABLE RECEIVES -> FIRST DAY -> GETS NEAREST SUNDAY GETS MONTH, JUST WALK THROUGH EACH DAY AND GENERATE
    //new Date(year,month, day) just add

    // let tableBody = calendarArray.map((day, index) => {

    // });

    let weeks = [];
    for (let i = 0; i < 5; i++) {
      //
      let week = [];
      for (let j = 0; j < 7; j++) {
        let theIndex = i * 7 + j;
        week.push(
          this.displayDate(theIndex, calendarArray[theIndex], j === 0, months)
          // <td key={theIndex} style={{ textAlign: "center" }}>
          //   <p style={{ fontSize: "smaller", margin: "0rem" }}>
          //     {calendarArray[theIndex].getDate()}
          //   </p>

          //   <p style={{ margin: "0rem" }}>
          //     {j === 0 ? (
          //       <>
          //         <b>{months[calendarArray[theIndex].getMonth()]}</b>
          //       </>
          //     ) : (
          //       <></>
          //     )}
          //   </p>

          //   {/* {calendarArray[theIndex].getDate()} */}
          //   {/* Need Month is Sunday */}
          //   {/* Need Month if First */}
          // </td>
        );
      }
      let addWeek = <tr key={i}>{week}</tr>;
      weeks.push(addWeek);
    }
    //
    // dateMin={dateMin}
    // dateMinForm={dateMinForm}
    // dateMax={dateMax}
    //dateMaxForm={dateMaxForm}
    //

    return (
      <>
        <h5 style={{ textAlign: "center", color: "green" }}>
          {" "}
          <b>Rental Availabity</b>
        </h5>

        {this.state.LoadingConfirms ? (
          <>
            <p></p>
            <div id="spinner">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
            <p></p>
          </>
        ) : (
          <>
            <Form
              noValidate
              onSubmit={this.onSubmitClick}
              onChange={this.onChange}
            >
              {/* Date FORM BELOW */}
              <Form.Group
                className="mb-3"
                controlId="formReqDate"
                max={this.props.dateMaxForm}
                min={this.props.dateMinForm}

                // onChange={this.onChange}
              >
                <h5 style={{ marginTop: ".2rem", marginBottom: ".2rem" }}>
                  <b>Select Date</b>
                </h5>

                <Form.Control
                  type="date"
                  required
                  max={this.props.dateMaxForm}
                  min={this.props.dateMinForm}
                  //  isInvalid={this.state.tooLongDateError}
                  //isValid={this.state.validDate}
                />

                {/* <Form.Control.Feedback type="invalid">
                    Date info is too long.
                  </Form.Control.Feedback> */}
              </Form.Group>
              <p></p>
              <div className="d-grid gap-2">
                {this.state.validReqDate ? (
                  <Button size="lg" variant="primary" type="submit">
                    <b>View Schedule</b>
                  </Button>
                ) : (
                  <Button size="lg" variant="primary" disabled>
                    <b>View Schedule</b>
                  </Button>
                )}
              </div>
              <p></p>
            </Form>
          </>
        )}

        {this.props.mode === "primary" ? (
          <>
            <Table responsive bordered size="md">
              <thead>
                <tr>
                  {weekdays.map((day, index) => (
                    <th key={index} style={{ textAlign: "center" }}>
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>{weeks}</tbody>
            </Table>
          </>
        ) : (
          <>
            <Table responsive bordered size="md" variant="dark">
              <thead>
                <tr>
                  {weekdays.map((day, index) => (
                    <th key={index} style={{ textAlign: "center" }}>
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>{weeks}</tbody>
            </Table>
          </>
        )}
      </>
    );
  }
}

export default Calendar;
