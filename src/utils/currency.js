import {
	dateStringToFilename
} from './time.js'

export const extractHeaderDate = (payload) => {
	return dateStringToFilename(`${payload.headers['date']}`);
}

