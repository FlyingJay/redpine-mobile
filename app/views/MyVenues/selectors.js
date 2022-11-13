const root = (state) => {
	return state.venues
}

const selectors = {
	selectShows: (state) => root(state).get('shows'),
	selectShowsLoading: (state) => root(state).get('showsLoading'),
	selectShowsError: (state) => root(state).get('showsError'),
	selectVenues: (state) => root(state).get('venues'),
	selectVenuesLoading: (state) => root(state).get('venuesLoading')
}

export default selectors