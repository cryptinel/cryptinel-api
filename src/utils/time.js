import _ from 'lodash';
import date from 'date-and-time';

import {
  fillLeftWithToken
} from './string.js'

export const toTimestamp = (strDate) => Date.parse(strDate);

export const dateStringToFilename = (date_) => {
  const date__ = new Date(toTimestamp(date_.toString()));
  const year = date__.getFullYear();
  let month = date__.getMonth() + 1;
  let day = date__.getDate();

  month = fillLeftWithToken(`${month}`, 2, '0');
  day = fillLeftWithToken(`${day}`, 2, '0');
  
  return `${year}-${month}-${day}`;
};

export const today = () => {
  const now = new Date();
  return date.format(now, 'YYYY-MM-DD');
}