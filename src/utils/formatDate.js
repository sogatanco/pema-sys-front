const newDate = (date) => {
  if (date) {
    const todayTimeStamp = new Date();
    const timestamp = new Date(date);

    const dateString =
      timestamp.toDateString() === todayTimeStamp.toDateString()
        ? 'Today'
        : timestamp.toDateString();
    const localeString = timestamp.toLocaleString();
    const time = localeString.split(',')[1];
    return `${dateString}, ${time.split(':')[0]}:${time.split(':')[1]} ${time.split(' ')[2] || ''}`;
  }
  return date;
  //   return `${dateString}, ${time.split(':')[0]}:${time.split(':')[1]}`;
};

export default newDate;
