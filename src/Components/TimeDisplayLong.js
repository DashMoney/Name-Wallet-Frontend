export default function formatDate(theCreatedAt, today, yesterday) {
  let CreatedAt = new Date(theCreatedAt);

  const timeOptions = {
    hour: "numeric",
    minute: "2-digit", //numeric?
  };

  function isSameDay(date1, date2) {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  if (isSameDay(CreatedAt, today)) {
    // it's today
    return `Today at ${CreatedAt.toLocaleTimeString(undefined, timeOptions)}`;
  }

  if (isSameDay(CreatedAt, yesterday)) {
    // it was yesterday
    return `Yesterday at ${CreatedAt.toLocaleTimeString(
      undefined,
      timeOptions
    )}`;
  }
  let dateReturn = CreatedAt.toLocaleDateString().concat(
    "  ",
    CreatedAt.toLocaleTimeString(undefined, timeOptions)
  );
  return dateReturn;
}
