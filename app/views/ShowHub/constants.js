
const prefix = (label) => `redpine/app/views/ShowHub/${label}`

const constants = {
	IS_LOADING: prefix('IS_LOADING'),
	SET_SHOW: prefix('SET_SHOW'),
	RESET_PENDING: prefix('RESET_PENDING'),
	SET_UPDATE_CAMPAIGN_BAND_PENDING: prefix('SET_UPDATE_CAMPAIGN_BAND_PENDING'),
	SET_UPDATE_VENUE_INVITATION_PENDING: prefix('SET_UPDATE_VENUE_INVITATION_PENDING'),
	UPDATE_SHOW: prefix('UPDATE_SHOW'),
	SET_MESSAGES: prefix('SET_MESSAGES'),
	ADD_TO_MESSAGES: prefix('ADD_TO_MESSAGES'),
	SET_TEMPORARY_MESSAGE: prefix('SET_TEMPORARY_MESSAGE'),
	HAS_ERROR: prefix('HAS_ERROR'),
}

export default constants