import { fromJS } from 'immutable'
import constants from './constants'

export const initialState = fromJS({
	show: null,
	isLoading: false,
	campaignBandsUpdating: {},
	venueInvitationsUpdating: {},
	messages: [],
	temporaryMessage: null,
	hasError: false,
	hasFetchedMessages: false
})

export const reducer = (state = initialState, action) => {
	switch (action.type) {
		case constants.SET_SHOW:
			return state
				.set('show', action.show)
				.set('hasFetchedMessages', false)

		case constants.IS_LOADING:
			return state
				.set('isLoading', action.isLoading)

		case constants.RESET_PENDING:
			return state
				.set('campaignBandsUpdating', {})
				.set('venueInvitationsUpdating', {})

		case constants.SET_UPDATE_CAMPAIGN_BAND_PENDING:
			return state
				.setIn(['campaignBandsUpdating', action.id], action.value)

		case constants.SET_UPDATE_VENUE_INVITATION_PENDING:
			return state
				.setIn(['venueInvitationsUpdating', action.id], action.value)

		case constants.UPDATE_SHOW:
			return state
				.mergeDeep(fromJS({ show: action.update }))

		case constants.SET_MESSAGES:
			return state
				.set('messages', action.messages)
				.set('hasFetchedMessages', true)

		case constants.ADD_TO_MESSAGES:
			return state
				.set('messages', state.get('messages').concat(action.messages))
				.set('temporaryMessage', null)

		case constants.SET_TEMPORARY_MESSAGE:
			return state
				.set('temporaryMessage', action.message)

		case constants.HAS_ERROR:
			return state
				.set('hasError', action.hasError)

		default:
			return state
	}
}

export default reducer