import constants from './constants'


const actions = {
	isLoading: (isLoading) => {
		return {
			type: constants.IS_LOADING,
			isLoading
		}
	},

	campaignsLoaded: (campaigns) => {
		return {
			type: constants.CAMPAIGNS_LOADED,
			campaigns
		}
	},

	openingsLoaded: (openings) => {
		console.log('openings action', openings)
		return {
			type: constants.OPENINGS_LOADED,
			openings
		}
	},

	datesSearched: (datesSearched) => {
		return {
			type: constants.DATES_SEARCHED,
			datesSearched
		}
	},

	fetchEvents: (venueId, startDate, endDate) => {
		return (dispatch, getState, api) => {
			dispatch(actions.datesSearched([startDate, endDate]))

			const loadCampaigns = api.campaigns.query({
				timeslot__venue: venueId,
				timeslot__start_time__gte: `${startDate}T00:00:00.000Z`,
				timeslot__end_time__lte: `${endDate}T00:00:00.000Z`,
				ordering: 'funding_end',
				expand: 'timeslot'
			})

			loadCampaigns.then((res) => {
				dispatch(actions.campaignsLoaded(res.results))
			})

			const loadOpenings = api.openings.query({
				timeslot__venue: venueId,
				timeslot__start_time__gte: `${startDate}T00:00:00.000Z`,
				timeslot__end_time__lte: `${endDate}T00:00:00.000Z`,
				expand: 'timeslot'
			})

			loadOpenings.then((res) => {
				dispatch(actions.openingsLoaded(res.results))
			})

			Promise.all([
				loadCampaigns,
				loadOpenings
			]).then(() => {
				dispatch(actions.isLoading(false))
			})
		}
	},

	clearState: () => {
		return {
			type: constants.RESET
		}
	}
}

export default actions