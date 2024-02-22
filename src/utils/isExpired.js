const isExpired = (val) => {
  const today = new Date();
  const end = new Date(val);
  const result = (end - today) / (1000 * 60 * 60 * 24);
  return result.toFixed() < 1;
};

export default isExpired;
