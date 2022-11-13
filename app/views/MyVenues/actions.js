import constants from './constants'
import moment from 'moment'


const actions = {
	loadingShows: (isLoading) => {
		return {
			type: constants.IS_LOADING,
			isLoading
		}
	},

	setShows: (shows) => {
		return {
			type: constants.SET_SHOWS,
			shows
		}
	},

	setShowsError: (error) => {
		return {
			type: constants.SET_SHOWS_ERROR,
			error
		}
	},

	getShows: () => {
		return (dispatch, getState, api) => {
			dispatch(actions.loadingShows(true))
			api.campaigns.query({
				timeslot__venue__managers__id__in: api.user,
				funding_end__gte: moment().toISOString(),
				ordering: 'funding_end',
				expand: 'bands.band.artists.purchase_options,timeslot,timeslot.venue,purchase_options'
			}).then((res) => {
				dispatch(actions.setShows(res.results))
				dispatch(actions.loadingShows(false))
			}).catch((err) => {
				dispatch(actions.setShowsError(err))
			})
		}
	},

	loadingVenues: (isLoading) => {
		return {
			type: constants.LOADING_VENUES,
			isLoading
		}
	},

	setVenues: (venues) => {
		return {
			type: constants.SET_VENUES,
			venues
		}
	},

	getVenues: () => {
		return (dispatch, getState, api) => {
			dispatch(actions.loadingVenues(true))
			api.venues.query({
				managers__id__in: api.user,
				expand: 'events'
			}).then((res) => {
				dispatch(actions.setVenues(res.results))
				dispatch(actions.loadingVenues(false))
			})
		}
	}
}

export default actions