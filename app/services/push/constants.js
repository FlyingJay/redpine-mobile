
const prefix = (label) => `redpine/app/services/push/${label}`

const constants = {
	PUSH_REGISTERED: prefix('PUSH_REGISTERED'),
	PUSH_REQUESTED: prefix('PUSH_REQUESTED'),
	HANDLE_NOTIFICATION: prefix('HANDLE_NOTIFICATION'),
	RESET: prefix('RESET'),
}

export default constants