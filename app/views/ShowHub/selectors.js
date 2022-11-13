const root = (state) => {
	return state.showHub
}

const selectors = {
	selectShow: (state) => root(state).get('show'),
	selectIsLoading: (state) => root(state).get('isLoading'),
	selectVenueInvitationsUpdating: (state) => root(state).get('venueInvitationsUpdating'),
	selectCampaignBandsUpdating: (state) => root(state).get('campaignBandsUpdating'),
	selectMessages: (state) => root(state).get('messages').sort((a, b) => {
		const aDate = Date.parse(a.created_date)
		const bDate = Date.parse(b.created_date)
		if (aDate > bDate) return 1
		if (bDate > aDate) return -1
		return 0
	}),
	selectTemporaryMessage: (state) => root(state).get('temporaryMessage'),
	selectHasError: (state) => root(state).get('hasError'),
	selectHasFetchedMessages: (state) => root(state).get('hasFetchedMessages'),
}

export default selectors