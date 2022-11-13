import { fromJS } from 'immutable'
import constants from './constants'

export const initialState = fromJS({
	doorCodes: {},
	isLoading: false,
	isChecking: false,
	doorCodeAccess: {},
	addDoorCodeStatus: null,
	isCheckingExisting: false
})

export const reducer = (state = initialState, action) => {
	switch (action.type) {
		case constants.SET_DOOR_CODE:
			return state
				.setIn(['doorCodes', action.campaignId], action.doorCode)

		case constants.LOADING_DOOR_CODE:
			return state
				.set('isLoading', action.isLoading)

		case constants.CHECKING_DOOR_CODE:
			return state
				.set('isChecking', action.isLoading)

		case constants.SAVE_DOOR_CODE_ACCESS:
			return state
				.setIn(['doorCodeAccess', action.campaign.id], fromJS({
					campaign: action.campaign,
					doorCode: action.doorCode
				}))

		case constants.SET_ADD_DOOR_CODE_STATUS:
			return state
				.set('addDoorCodeStatus', action.status)

		case constants.SET_IS_CHECKING_EXISTING:
			return state
				.set('isCheckingExisting', action.isCheckingExisting)

		case constants.REMOVE_DOOR_CODE_ACCESS_BY_ID:
			return state
				.deleteIn(['doorCodeAccess', action.id])

		case constants.UPDATE_DOOR_CODE_ACCESS:
			return state
				.setIn(['doorCodeAccess', action.campaign.id, 'campaign'], action.campaign)

		default:
			return state
	}
}

export default reducer