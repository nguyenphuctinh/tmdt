export default IsEmpty = (value) => {
  if (value === null || value === undefined || value === "") {
    return true;
  }
  return false;
};
