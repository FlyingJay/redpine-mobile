import constants from './constants'
import selectors from './selectors'


// these are called by the actions. 
// the logic is separated just because they're
// used by multiple actions
const helpers = {
	refreshPendingVenueShowsAndWait: (dispatch, getState) => {
		return new Promise((resolve) => {
	        dispatch(actions.getVenuePendingShows())
	        const interval = setInterval(() => {	        	const state = getState()
	        	const stillLoading = selectors.selectVenuePendingShowsLoading(state)
	       		if (!stillLoading) {
	       			clearInterval(interval)
	       			resolve()
	       		}
	        }, 500)
	    })
	},
	refreshArtistShowsAndWait: (dispatch, getState) => {
		return new Promise((resolve) => {
			dispatch(actions.getArtistShows())

			// wait for fetch to complete, so we know the notification will hide
			const interval = setInterval(() => {
				const state = getState()
				const loadingArtistShows = selectors.selectArtistShowsLoading(state)

				if (!loadingArtistShows) {
					clearInterval(interval)
					resolve()
				}
			}, 500)
		})
	},
}


const actions = {
	loadingArtistShows: (isLoading) => {
		return {
			type: constants.IS_LOADING_ARTIST_SHOWS,
			isLoading
		}
	},

	setArtistShows: (shows) => {
		return {
			type: constants.SET_ARTIST_SHOWS,
			shows
		}
	},

	setArtistShowsError: (error) => {
		return {
			type: constants.SET_ARTIST_SHOWS_ERROR,
			error
		}
	},

	getArtistShows: () => {
		return (dispatch, getState, api) => {
			dispatch(actions.loadingArtistShows(true))
			api.campaigns.query({
				bands__artists__user__id: api.user,
				bands__artists__is_accepted: true,
				expand: 'bands.band.artists.purchase_options,timeslot.venue',
				ordering: '-funding_end'
			}).then((res) => {
				dispatch(actions.setArtistShows(res.results))
				dispatch(actions.loadingArtistShows(false))
			}).catch((err) => {
				dispatch(actions.setArtistShowsError(err))
			})
		}
	},

	setVenuePendingShows: (shows) => {
		return {
			type: constants.SET_VENUE_PENDING_SHOWS,
			shows
		}
	},

	loadingVenuePendingShows: (isLoading) => {
		return {
			type: constants.IS_LOADING_VENUE_PENDING_SHOWS,
			isLoading
		}
	},

	setVenuePendingShowsError: (error) => {
		return {
			type: constants.SET_VENUE_PENDING_SHOWS_ERROR,
			error
		}
	},

	getVenuePendingShows: () => {
		return (dispatch, getState, api) => {
			dispatch(actions.loadingVenuePendingShows(true))
	        api.campaigns.query({
				timeslot__venue__managers__id__in: api.user,
				is_venue_approved: null,
				expand: 'bands,bands.band,band.artists,timeslot,timeslot.venue,purchase_options'
	        }).then((res) => {
				dispatch(actions.loadingVenuePendingShows(false))
				dispatch(actions.setVenuePendingShows(res.results))
	        }).catch((err) => {
	        	dispatch(actions.setVenuePendingShowsError(err))
	        	dispatch(actions.loadingVenuePendingShows(false))
	        })
	    }
	},

	updateCampaignBandPending: (id, value) => {
		return {
			type: constants.SET_UPDATE_CAMPAIGN_BAND_PENDING,
			id,
			value
		}
	},

	updateCampaignBand: (id, data) => {
		return (dispatch, getState, api) => {
			dispatch(actions.updateCampaignBandPending(id, true))
			api.campaignBands
				.update(id, data)
				.then((res) => {
					helpers.refreshArtistShowsAndWait(dispatch, getState)
						.then(() => {
							dispatch(actions.updateCampaignBandPending(id, false))
						})
				})
				.catch((err) => {
					dispatch(actions.updateCampaignBandPending(id, false))
				})
		}
	},

	venueInvitationPending: (id, value) => {
		return {
			type: constants.SET_UPDATE_VENUE_INVITATION_PENDING,
			id,
			value
		}
	},

	venueConfirmShow: (id) => {
		return (dispatch, getState, api) => {
			dispatch(actions.venueInvitationPending(id, true))
            api.campaigns
            	.confirm(id)
            	.then(() => {
            		Promise.all([
            			helpers.refreshPendingVenueShowsAndWait(dispatch, getState),
            			helpers.refreshArtistShowsAndWait(dispatch, getState),
            		]).then(() => {
        				dispatch(actions.venueInvitationPending(id, false))
        			})
            	})
            	.catch(() => {
					dispatch(actions.venueInvitationPending(id, false))
            	})
		}
	},

	venueDenyShow: (id) => {
		return (dispatch, getState, api) => {
			dispatch(actions.venueInvitationPending(id, true))
            api.campaigns
            	.deny(id)
            	.then(() => {
            		Promise.all([
            			helpers.refreshPendingVenueShowsAndWait(dispatch, getState),
            			helpers.refreshArtistShowsAndWait(dispatch, getState),
            		]).then(() => {
        				dispatch(actions.venueInvitationPending(id, false))
        			})
            	})
            	.catch(() => {
					dispatch(actions.venueInvitationPending(id, false))
            	})
		}
	},
}

export default actions