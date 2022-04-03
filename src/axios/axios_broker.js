import axios from 'axios';

const BASE_URL = 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1';

const handleError = (error) => {
  // Error 😨
  if (error.response) {
      /*
      * The request was made and the server responded with a
      * status code that falls out of the range of 2xx
      */
      const data = 'Data: '+`${error.response.data}`;
      const status = `Status ${error.response.status}`;
      const message = `Message: ${error.message}`;
      
      console.log('Error: '+`${status}`+', '+`${message}`+', '+`${data}`);

  } else if (error.request) {
      /*
      * The request was made but no response was received, `error.request`
      * is an instance of XMLHttpRequest in the browser and an instance
      * of http.ClientRequest in Node.js
      */
      console.log(error.request);
  } else {
      // Something happened in setting up the request and triggered an Error
      console.log('Error', error.message);
  }
}

const getRequest = async (url, callback, headers = {}) => {
  return await axios
    .get(url, headers)
    .then((res) => {
      return callback(res);
    })
    .catch((error) => {
      console.log('This is milestone 1.')
      handleError(error);
    });
};

export const CurrenciesAsync = async (callback, date_ = 'latest') => {
  const response = await getRequest(`${BASE_URL}/${date_}/currencies.json`, callback);
};

export const CurrencyRatesAsync = async (base_currency, callback, date_ = 'latest') => {
  return await getRequest(`${BASE_URL}/${date_}/currencies/${base_currency}.json`, callback);
};
