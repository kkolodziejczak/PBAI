export const mapError = err => {
  const tmp = err.split('\\');
  tmp.shift();
  const fieldName = tmp[0].substring(1);
  const error = tmp[1].substring(2, tmp[1].length - 2);
  return {[fieldName]: error};
};

export const statusIsValid = status => status >= 200 && status < 300;
