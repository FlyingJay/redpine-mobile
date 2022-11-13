import { fromJS } from 'immutable'
import constants from './constants'

export const initialState = fromJS({
	shows: [],
	showsError: null,
	showsLoading: false,
	venues: [],
	venuesLoading: false,
})

export const reducer = (state = initialState, action) => {
	switch (action.type) {
		case constants.SET_SHOWS:
			return state
				.set('shows', action.shows)

		case constants.IS_LOADING:
			return state
				.set('showsLoading', action.isLoading)

		case constants.SET_SHOWS_ERROR:
			return state
				.set('showsError', action.showsError)

		case constants.LOADING_VENUES:
			return state
				.set('venuesLoading', action.isLoading)

		case constants.SET_VENUES:
			return state
				.set('venues', action.venues)

		default:
			return state
	}
}

export default reducer