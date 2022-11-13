import { fromJS } from 'immutable'
import constants from './constants'

export const initialState = fromJS({
	pushRegistered: false,
	pushRequested: false,
	token: null,
	lastNotification: null
})

export const reducer = (state = initialState, action) => {
	switch (action.type) {
		case constants.PUSH_REGISTERED:
			return state
				.set('pushRegistered', true)
				.set('token', action.token)

		case constants.PUSH_REQUESTED:
			return state
				.set('pushRequested', true)

		case constants.RESET:
			return state
				.set('token', null)
				.set('pushRegistered', false)
				.set('pushRequested', false)

		case constants.HANDLE_NOTIFICATION:
			return state
				.set('lastNotification', action.notificationId)

		default:
			return state
	}
}

export default reducer