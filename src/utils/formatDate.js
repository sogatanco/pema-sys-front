const newDate = (date) => {
  const timestamp = new Date(date);
  const dateString = timestamp.toDateString();
  const localeString = timestamp.toLocaleString();
  const time = localeString.split(',')[1];
  return `${dateString}, ${time.split(':')[0]}:${time.split(':')[1]}`;
};

export default newDate;
