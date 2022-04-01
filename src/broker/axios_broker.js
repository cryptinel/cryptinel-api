import axios from 'axios'

const BASE_URL = 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest'

const getRequest = async (url, callback) => {
  axios
      .get(url, {})
      .then(res => {
        callback(res);
      })
      .catch(error => {
        console.error(error)
      })
}

export const getCurrenciesAsync = async (callback) => {
    getRequest(BASE_URL+`/currencies.json`, callback)
}

export const getCurrencyRatesAsync = async (base_currency, callback) => {
    getRequest(BASE_URL+`/currencies/${base_currency}.json`, callback)
}