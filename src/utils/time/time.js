import _ from 'lodash';

export const toTimestamp = (strDate) => Date.parse(strDate);

export const dateToFilename = (date_) => {
  const date__ = new Date(toTimestamp(date_.toString()));
  const year = date__.getFullYear();
  let month = date__.getMonth() + 1;
  const day = date__.getDate();

  if (month < 10) {
    month = fillLeftWith(`${month}`, 2, '0');
  } else {
    month = `${month}`;
  }

  return `${year}-${month}-${day}`;
};
