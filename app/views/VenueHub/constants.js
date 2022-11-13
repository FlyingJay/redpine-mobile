
const prefix = (label) => `redpine/app/views/VenueHub/${label}`

const constants = {
	IS_LOADING: prefix('IS_LOADING'),
	CAMPAIGNS_LOADED: prefix('CAMPAIGNS_LOADED'),
	OPENINGS_LOADED: prefix('OPENINGS_LOADED'),
	RESET: prefix('RESET'),
	DATES_SEARCHED: prefix('DATES_SEARCHED'),
}

export default constants