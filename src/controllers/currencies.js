import {
	getCurrenciesAsync,
} from '../axios/axios_broker.js'

import {
	saveFileTo,
} from '../utils/file.js'

import fs from 'fs'

export const onCurrencies = callback => {
	getCurrenciesAsync(callback)
}

export const saveCurrencies = (currencies_raw) => {
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
