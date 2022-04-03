// [START app]
import express from 'express';

import 'lodash.combinations';
import _ from 'lodash';

import {
	onYearMonthCurrencyRatesHistory,
	getWorstBestExchangeHistoryProfit,
	onYearCurrencyRatesHistory,
	getCurrencyRatesHistory
} from './controllers/exchangeRate.js'

import {
	onCurrencies,
	getCurrencies
} from './controllers/currencies.js'

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
	const currencies = await onCurrencies(getCurrencies);
	let year_stats = {};
	let month_stats = {};
	
	const year = 2021;
	
	for (let month = 1; month <= 12; month += 1) {
		month_stats = await onYearMonthCurrencyRatesHistory(
			'btc', 'brl', month, year, getWorstBestExchangeHistoryProfit
		)
		
		console.log(month_stats)

		year_stats[`${year}-${month}`] = month_stats
	}
	
	res.send(year_stats)
});
// [END app]


