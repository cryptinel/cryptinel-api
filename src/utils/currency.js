import {
	dateStringToFilename
} from './time.js'

export const extractHeaderDate = (payload) => {
	return dateStringToFilename(`${payload.headers['date']}`);
}

export const getCallableCryptoSymbols = () => {
	return ['btc', 'eth', 'ltc', 'bch']
}

export const getCryptoSymbols = () => {
	return [
		'btc', 'eth', 'wbtc', 'usdt', 'bnb', 'sol', 
		'xrp', 'ada', 'avax', 'luna', 'dot', 'busd', 
		'shib', 'matic', 'cro', 'dai', 'atom', 'ltc', 
		'link', 'uni', 'brx', 'bch', 'ftt', 'etc', 'algo', 
		'xlm', 'vet', 'icp', 'fil', 'egld', 'theta', 'xmr', 
		'grt', 'one', 'ksm', 'chz'
	]
}