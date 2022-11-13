
const prefix = (label) => `redpine/app/views/MyVenues/${label}`

const constants = {
	IS_LOADING: prefix('IS_LOADING'),
	SET_SHOWS: prefix('SET_SHOWS'),
	SET_SHOWS_ERROR: prefix('SET_SHOWS_ERROR'),
	LOADING_VENUES: prefix('LOADING_VENUES'),
	SET_VENUES: prefix('SET_VENUES'),
}

export default constants