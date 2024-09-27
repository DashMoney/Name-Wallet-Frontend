//this will be all the time displays and so not lots of different ones and remove alot of reuse
export default function formatDate(theCreatedAt) {
  let CreatedAt = new Date(theCreatedAt);

  let dateReturn = CreatedAt.toLocaleDateString();

  return dateReturn;
}
