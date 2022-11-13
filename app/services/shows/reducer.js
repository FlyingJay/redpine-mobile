import { fromJS } from 'immutable'
import constants from './constants'

export const initialState = fromJS({
	artistShows: [],
	artistShowsError: null,
	artistShowsLoading: false,
	venuePendingShows: [],
	venuePendingShowsError: null,
	venuePendingShowsLoading: false,
	campaignBandsUpdating: {},
	venueInvitationsUpdating: {},
})

export const reducer = (state = initialState, action) => {
	switch (action.type) {
		case constants.SET_ARTIST_SHOWS:
			return state
				.set('artistShows', action.shows)

		case constants.IS_LOADING_ARTIST_SHOWS:
			return state
				.set('artistShowsLoading', action.isLoading)

		case constants.SET_ARTIST_SHOWS_ERROR:
			return state
				.set('artistShowsError', action.showsError)

		case constants.SET_VENUE_PENDING_SHOWS:
			return state
				.set('venuePendingShows', action.shows)

		case constants.IS_LOADING_VENUE_PENDING_SHOWS:
			return state
				.set('venuePendingShowsLoading', action.isLoading)

		case constants.SET_VENUE_PENDING_SHOWS_ERROR:
			return state
				.set('venuePendingShowsError', action.showsError)

		case constants.SET_UPDATE_CAMPAIGN_BAND_PENDING:
			return state
				.setIn(['campaignBandsUpdating', action.id], action.value)

		case constants.SET_UPDATE_VENUE_INVITATION_PENDING:
			return state
				.setIn(['venueInvitationsUpdating', action.id], action.value)

		default:
			return state
	}
}

export default reducer