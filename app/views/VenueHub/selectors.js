const root = (state) => {
	return state.venueHub
}

const selectors = {
	selectCampaigns: (state) => root(state).get('campaigns'),
	selectOpenings: (state) => root(state).get('openings'),
	selectIsLoading: (state) => root(state).get('isLoading'),
	selectDatesSearched: (state) => root(state).get('datesSearched'),
}

export default selectors