// [START app]
import express from 'express';

import 'lodash.combinations';
import _ from 'lodash';

import {
	onCurrencyRates,
	saveCurrencyRatesCallback,
} from './controllers/exchangeRate.js'

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
app.get('/', (req, res) => {
	//onCurrencies(saveCurrencies)
	onCurrencyRates('brl', saveCurrencyRatesCallback)
	
	res.send('Hi!')
});
// [END app]


