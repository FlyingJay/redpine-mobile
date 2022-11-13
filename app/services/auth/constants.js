
const prefix = (label) => `redpine/app/services/auth/${label}`

const constants = {
	LOGGING_IN: prefix('LOGGING_IN'),
	ERROR: prefix('ERROR'),
	SET_USER: prefix('SET_USER'),
	SET_CREDENTIALS: prefix('SET_CREDENTIALS'),
}

export default constants