
const prefix = (label) => `redpine/app/views/DoorsScanResult/${label}`

const constants = {
	TICKET: prefix('TICKET'),
	IS_LOADING: prefix('IS_LOADING'),
	ERROR: prefix('ERROR'),
}

export default constants