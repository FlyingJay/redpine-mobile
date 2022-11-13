
const prefix = (label) => `redpine/app/services/doorcode/${label}`

const constants = {
	SET_DOOR_CODE: prefix('SET_DOOR_CODE'),
	LOADING_DOOR_CODE: prefix('LOADING_DOOR_CODE'),
	CHECKING_DOOR_CODE: prefix('CHECKING_DOOR_CODE'),
	SAVE_DOOR_CODE_ACCESS: prefix('SAVE_DOOR_CODE_ACCESS'),
	SET_ADD_DOOR_CODE_STATUS: prefix('SET_ADD_DOOR_CODE_STATUS'),
	SET_IS_CHECKING_EXISTING: prefix('SET_IS_CHECKING_EXISTING'),
	REMOVE_DOOR_CODE_ACCESS_BY_ID: prefix('REMOVE_DOOR_CODE_ACCESS_BY_ID'),
	UPDATE_DOOR_CODE_ACCESS: prefix('UPDATE_DOOR_CODE_ACCESS'),
}

export default constants