import formatDate from "./TimeDisplayLong";
import Badge from "react-bootstrap/Badge";

// let d = Date.now()
//date = {d}
//{this.getRelativeTimeAgo(this.props.tuple[1].$createdAt, this.props.date)}

export default function getRelativeTimeAgo(messageTime, timeNow) {
  //How do I make the adjustments....
  //So the messageTime is the time Stamp
  //So I want Time of message

  let timeDifference = messageTime - timeNow;
  //console.log(timeDifference);
  /*
  Calculate milliseconds in a year
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const year = day * 365;
  */
  if (timeDifference < -1200000) {
    return (
      <Badge>
        <b>Out of Queue</b>
      </Badge>
    );
  }
  if (timeDifference < -60000 && timeDifference > -1200000) {
    let minutes = -(timeDifference / 60000).toFixed(0);
    return `${minutes} mins ago`;
  } else if (timeDifference < 60000) {
    return "Right now";
  } else if (timeDifference < 5400000) {
    let minutes = (timeDifference / 60000).toFixed(0);
    return `In ${minutes} mins`;
  } else {
    let today = new Date(); //Date.now(); <= Wrong
    let yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    //return long time format
    //
    // {this.formatDate(
    //   this.props.tuple[1].$createdAt,
    //   this.props.today,
    //   this.props.yesterday
    // )}
    //
    return formatDate(messageTime, today, yesterday);
  }

  // if(timeDifference >= 5400000){
  //   let longFormDate = new Date();
  //    longFormDate.setTime(messageTime);
  //   return longFormDate.toLocaleDateString();
  // }
}
