// [START app]
import express from 'express';

import _ from 'lodash';

import { objectFilter } from 'dot-quiver/utils/objects/objects.js';

import Graph from 'dot-quiver/data-structures/graph/Graph.js';
import { createVertices } from 'dot-quiver/data-structures/graph/utils/graph.js';
import { createEdges } from 'dot-quiver/data-structures/graph/utils/graph.js';

import {
	getCurrenciesAsync,
	getCurrencyRatesAsync
} from './broker/axios_broker.js'

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

const printResult = result => {
	console.log(result)
}

const getCurrencyRates = result => {
	const exchange_obj = result.data
	const base_currency = _.difference(Object.keys(exchange_obj), ['date'])[0]
	const currencies = Object.keys(exchange_obj[base_currency])
	const exchange_rates = exchange_obj[base_currency]
	
	let exchange_table = {}
	let exchange_key = ''
	let exchange_rate = 1;

	// Currency exchange to itself is 1
	for(const currency of currencies) {
		exchange_key = `${currency}_${currency}`
		exchange_rate = 1
		exchange_table[exchange_key] = exchange_rate
	}

	// Exchange from currency 1 to 2 is C2/C1
	for(const currency_comb of _.combinations(currencies, 2)) {
		exchange_key = `${currency_comb[0]}_${currency_comb[1]}`
		exchange_rate = exchange_rates[currency_comb[1]]/exchange_rates[currency_comb[0]]
		exchange_table[exchange_key] = exchange_rate
	}

	console.log(objectFilter(
		exchange_table,
		(key, value) => value === 1
	))
	
}

const CurrencyRates = callback => {
	getCurrencyRatesAsync('eur', callback)
}	

// Driver program - Create a sample graph
app.get('/', (req, res) => {
	//CurrencyRates(getCurrencyRates)
	
	res.send('HI')
});
// [END app]


