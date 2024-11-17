export default function simpleDate(theDate) {
  let weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
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

  const dateTest = new Date(theDate);
  let yearTest = dateTest.getFullYear();
  let monthTest = dateTest.getMonth();
  let dayOfMonth = dateTest.getDate();
  let dayOfWeek = dateTest.getDay();

  let dateReturn = `${weekdays[dayOfWeek]}, ${months[monthTest]} ${dayOfMonth}, ${yearTest}`;
  // let dateReturn = CreatedAt.toLocaleDateString();// 6/25/2024

  return dateReturn;
}

//new Date().toLocaleDateString()
