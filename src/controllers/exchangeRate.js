import fs from 'fs'

import {
	getCurrencyRatesAsync
} from '../axios/axios_broker.js'

import {
	extractHeaderDate
} from '../utils/currency.js'

import {
	saveFileTo
} from '../utils/file.js'

export const onCurrencyRates = (base_currency, callback) => {
	getCurrencyRatesAsync(base_currency, callback)
}

export const saveCurrencyRatesCallback = (currency_rates_raw) => {
	const folder_name = `${extractHeaderDate(currency_rates_raw)}`;
	
	const file_root_path = `src/assets/${folder_name}`;

	const file_name = 'currency_rates';
	const content = JSON.stringify(currency_rates_raw.data, null, 2);
	console.log(file_root_path)
	try {
		fs.mkdirSync(file_root_path);
	} catch(ignore) {} finally {
		saveFileTo(file_root_path, file_name, 'json', content)
	}
}

export const getCurrencyRatesCallback = payload => {
	const exchange_obj = payload.data
	const base_currency = _.difference(Object.keys(exchange_obj), ['date'])[0]
	const exchange_rates = exchange_obj[base_currency]

	return {
		base_currency: base_currency,
		exchange_rates: exchange_rates
	}
}

export const buildCurrencyExchangeTable = (exchange_info) => {
	const exchange_rates = exchange_info['exchange_rates'];
	
	let exchange_table = {}
	let exchange_key = ''
	let exchange_rate = 1;
	
	const currencies = Object.keys(exchange_rates)

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

		exchange_key = `${currency_comb[1]}_${currency_comb[0]}`
		exchange_rate = exchange_rates[currency_comb[0]]/exchange_rates[currency_comb[1]]
		
		exchange_table[exchange_key] = exchange_rate
	}

	return {
		currencies: currencies,
		exchange_table: exchange_table
	}
}

export const getCurrencyExchangeTableCallback = (payload) => {
	return buildCurrencyExchangeTable(
		getCurrencyRates(payload)
	)
}