const root = (state) => {
	return state.showsService
}

const selectors = {
	selectArtistShows: (state) => root(state).get('artistShows'),
	selectArtistShowsLoading: (state) => root(state).get('artistShowsLoading'),
	selectArtistShowsError: (state) => root(state).get('artistShowsError'),
	selectVenuePendingShows: (state) => root(state).get('venuePendingShows'),
	selectVenuePendingShowsLoading: (state) => root(state).get('venuePendingShowsLoading'),
	selectVenuePendingShowsError: (state) => root(state).get('venuePendingShowsError'),
	selectShow: (state, id) => {
		const allShows = selectors.selectArtistShows(state)
			.concat(selectors.selectVenuePendingShows(state))
		const shows = allShows.filter(show => show.id === id)
		return shows.length ? shows[0] : null
	},
}

export default selectors