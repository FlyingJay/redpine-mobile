
import moment from 'moment'

const helpers = {
	// safely fetches a nested property and returns default if it doesn't exist
	safeGet: (obj, prop, _default) => {
		const split = prop.split('.')
		for (let i = 0; i < split.length; i += 1) {
			if (obj[split[i]]) {
				obj = obj[split[i]]
			} else {
				return _default
			}
		}
		return obj
	},

	localTimeFromUTC(utc_time, offset) {
    	return moment(utc_time).add(offset, 'hours')
	}
}

export default helpers