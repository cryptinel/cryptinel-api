// [START app]
import express from 'express';

import 'lodash.combinations';
import _ from 'lodash';

import fs from 'fs'

import Graph from 'dot-quiver/data-structures/graph/Graph.js'
import GraphEdge from 'dot-quiver/data-structures/graph/GraphEdge.js'

import {
	createVertices
} from 'dot-quiver/data-structures/graph/utils/graph.js'

import {
	objectReduce, objectFilter
} from 'dot-quiver/utils/objects/objects.js'

import {
	getCurrenciesAsync,
	getCurrencyRatesAsync
} from './broker/axios_broker.js'

import {
	dateStringToFilename
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

const saveFileTo = (file_root_path, file_name, file_extension, content) => {
	// convert JSON object to string
	const file_fullpath = `${file_root_path}/${file_name}.${file_extension}`;
	
	// write JSON string to a file
	fs.writeFile(file_fullpath, content, (err) => {
	  if (err) {
		throw err;
	  }
	  
	  console.log(`File ${file_name}.${file_extension} is saved on ${file_fullpath}.`);
	});
}

const extractHeaderDate = (payload) => {
	return dateStringToFilename(`${payload.headers['date']}`);
}

const saveCurrencies = (currencies_raw) => {
	const folder_name = `${extractHeaderDate(currencies_raw)}`;
	const file_root_path = `src/assets/${folder_name}`;
		
	const file_name = 'currencies';
	const content = JSON.stringify(currencies_raw.data, null, 2);

	try {
		fs.mkdirSync(file_root_path);
	} catch(ignore) {} finally {
		saveFileTo(file_root_path, file_name, 'json', content)
	}
}

const saveCurrencyRates = (currency_rates_raw) => {
	const folder_name = `${extractHeaderDate(currency_rates_raw)}`;
	
	const file_root_path = `src/assets/${folder_name}`;

	const file_name = 'currency_rates';
	const content = JSON.stringify(currency_rates_raw.data, null, 2);
	
	try {
		fs.mkdirSync(file_root_path);
	} catch(ignore) {} finally {
		saveFileTo(file_root_path, file_name, 'json', content)
	}
}

const getCurrencyRates = payload => {
	const exchange_obj = payload.data
	const base_currency = _.difference(Object.keys(exchange_obj), ['date'])[0]
	const exchange_rates = exchange_obj[base_currency]

	return {
		base_currency: base_currency,
		exchange_rates: exchange_rates
	}
}

const buildCurrencyExchangeTable = (exchange_info) => {
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

function* yieldCurrencyExchangeSubgraph(exchange_table_info) {
	const currencies = exchange_table_info['currencies']
	let subgraph_exchange_table = {}

	for(let graph_size of _.range(2, currencies.length + 1)) {
		for(let currency_combination of _.combinations(currencies, graph_size)) {
			const subgraph = new Graph(false);
			
			subgraph.addVertices(createVertices(currency_combination));
			
			subgraph_exchange_table = objectFilter(
				exchange_table_info['exchange_table'],
				(curr_encies) => _.intersection(
					curr_encies.split('_'), currency_combination
				).length === 2
			)
			
			let splitted = [];
			let from_currency = '';
			let to_currency = '';
	
			subgraph.addEdges(
				objectReduce(
					subgraph_exchange_table,
					(edges, from_to_currency, exchange_rate) => {
						
						splitted = from_to_currency.split('_')
					
						from_currency = splitted[0]
						to_currency = splitted[1]
						
						edges.push(
							new GraphEdge(
								subgraph.vertices[from_currency],
								subgraph.vertices[to_currency],
								exchange_rate
							)
						)
			
						return edges
					}, []
				)
			)
			
			yield subgraph
		}
	}
	
}

function* getCurrencyExchangeSubgraph(payload) {
	yield* yieldCurrencyExchangeSubgraph(
		buildCurrencyExchangeTable(
			getCurrencyRates(payload)
		)
	);
}

const getHamiltonianExchangeCircuits = (payload) => {
	for(const exchange_subgraph of getCurrencyExchangeSubgraph(payload)) {
		for(let hamiltonian_circuit of exchange_subgraph.getHamiltonianCycles()) {
			console.log(hamiltonian_circuit)
		}
	}
}

const onCurrencies = callback => {
	getCurrenciesAsync(callback)
}

const onCurrencyRates = (base_currency, callback) => {
	getCurrencyRatesAsync(base_currency, callback)
}

// Driver program - Create a sample graph
app.get('/', (req, res) => {
	//onCurrencies(saveCurrencies)
	onCurrencyRates('brl', getHamiltonianExchangeCircuits)
	
	res.send('Hi!')
});
// [END app]


