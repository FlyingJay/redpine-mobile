
const prefix = (label) => `redpine/app/services/shows/${label}`

const constants = {
	SET_HERE_TO_SEE: prefix('SET_HERE_TO_SEE'),
	RESET_HERE_TO_SEE: prefix('RESET_HERE_TO_SEE'),
	SET_HERE_TO_SEE_EVERYONE: prefix('SET_HERE_TO_SEE_EVERYONE'),
	SET_SHOW: prefix('SET_SHOW'),
	RESET_ITEMS: prefix('RESET_ITEMS'),
	SET_ITEM: prefix('SET_ITEM'),
	CREATING_TRANSACTION: prefix('CREATING_TRANSACTION'),
	CREATE_ERROR: prefix('CREATE_ERROR'),
	SET_CARD_TRANSACTION: prefix('SET_CARD_TRANSACTION'),
}

export default constants