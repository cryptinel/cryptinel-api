// [START app]
import express from 'express';

import 'lodash.combinations';
import _ from 'lodash';

import date from 'date-and-time';

import {
	onCurrencies,
	getCurrencies,
	logCurrenciesCallback,
} from './controllers/currencies.js'

import {
	onCurrencyRates,
	onCurrencyRatesHistory,
	saveCurrencyRatesCallback,
} from './controllers/exchangeRate.js'

import {
	today,
} from './utils/time.js'

const app = express();

// [START enable_parser]
// This middleware is available in Express v4.16.0 onwards
app.use(express.json({ extended: true }));
// [END enable_parser]

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

// Driver program - Create a sample graph
app.get('/', async (req, res) => {
	onCurrencyRatesHistory('eur', 'brl', '2022-01-01', '2022-04-01', console.log)
		
	res.send('Hi!')
});
// [END app]


