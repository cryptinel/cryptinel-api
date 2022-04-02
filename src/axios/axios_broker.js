import axios from 'axios';

const BASE_URL = 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1';

const getRequest = async (url, callback) => {
  return await axios
    .get(url, {})
    .then((res) => {
      return callback(res);
    })
    .catch((error) => {
      console.error(error);
    });
};

export const CurrenciesAsync = async (callback, date_ = 'latest') => {
  return await getRequest(`${BASE_URL}/${date_}/currencies.json`, callback);
};

export const CurrencyRatesAsync = async (base_currency, callback, date_ = 'latest') => {
  return await getRequest(`${BASE_URL}/${date_}/currencies/${base_currency}.json`, callback);
};
