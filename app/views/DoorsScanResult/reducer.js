import { fromJS } from 'immutable'
import constants from './constants'

export const initialState = fromJS({
	isLoading: false,
	ticket: null,
	error: false,
})

export const reducer = (state = initialState, action) => {
	switch (action.type) {
		case constants.IS_LOADING:
			return state
				.set('isLoading', action.isLoading)

		case constants.TICKET:
			return state
				.set('ticket', action.ticket)

		case constants.ERROR:
			return state
				.set('error', action.error)

		default:
			return state
	}
}

export default reducer