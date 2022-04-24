// [START app]
import express from 'express';

import 'lodash.combinations';
import _ from 'lodash';

import {
	onCurrencyRatesHistory,
	onYearMonthCurrencyRatesHistory,
	getWorstBestExchangeHistoryProfit,
	onYearCurrencyRatesHistory,
	onCurrencyRates,
	logCurrenciesRatesCallback,
	getCurrencyRatesHistory, 
	getExchangeHistoryProfit
} from './controllers/exchangeRate.js'

import {
	onCurrencies,
	getCurrencies
} from './controllers/currencies.js'

import {
	getCallableCryptoSymbols
} from './utils/currency.js'

import {
	today
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
	const currencies = await onCurrencies(getCurrencies);
	const crypto_symbs = getCallableCryptoSymbols();

	let crypto_stats = {};
	let month_stats = {};

	const month = 2;
	const year = 2021;

	let date_key = '';
	
	/*
	onCurrencyRates(
		'ada', 
		logCurrenciesRatesCallback, 
		'2021-09-15')
	*/
	
	const profit_history = await onCurrencyRatesHistory(
		'ada', 'brl', 
		'2021-09-16', today(), 
		getExchangeHistoryProfit
	)
	
	console.log(profit_history)

	/*
	for(const crypto_symb of crypto_symbs) {
		month_stats = await onYearCurrencyRatesHistory(
			`${crypto_symb}`, 'brl', year, getWorstBestExchangeHistoryProfit
		)
		
		console.log(`crypto symbol: ${crypto_symb}`)
		console.log(month_stats)
		
		date_key = `${year}-${month}`;
		
		crypto_stats[crypto_symb] = {
			date: date_key,
			month_stats: month_stats
		} 
	}
	*/

	res.send(crypto_stats)
});
// [END app]


