import { fromJS } from 'immutable'
import constants from './constants'

export const initialState = fromJS({
	loggingIn: false,
	error: null,
	user: null,
	token: null,
	userId: null
})

export const reducer = (state = initialState, action) => {
	switch (action.type) {
		case constants.LOGGING_IN:
			return state
				.set('loggingIn', action.isLoggingIn)

		case constants.ERROR:
			return state
				.set('error', action.error)

		case constants.SET_USER:
			return state
				.set('user', action.user)

		case constants.SET_CREDENTIALS:
			return state
				.set('token', action.token)
				.set('userId', action.userId)

		default:
			return state
	}
}

export default reducer