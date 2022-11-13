import constants from './constants'
import selectors from './selectors'


const helpers = {
	refreshShow: (dispatch, getState, id) => {
		return new Promise((resolve, reject) => {
			dispatch(actions.getShow(id, true))
			const interval = setInterval(() => {
				const state = getState()
				const loading = selectors.selectIsLoading(state)
				if (!loading) {
					clearInterval(interval)
					resolve()
				}
			}, 500)
		})
	}
}


const actions = {
	loadingShow: (isLoading) => {
		return {
			type: constants.IS_LOADING,
			isLoading
		}
	},

	setShow: (show) => {
		return {
			type: constants.SET_SHOW,
			show
		}
	},

	error: (hasError) => {
		return {
			type: constants.HAS_ERROR,
			hasError
		}
	},

	getShow: (id, hideLoading) => {
		return (dispatch, getState, api) => {
			if (hideLoading) {

			} else {
				dispatch(actions.setShow(null))
				dispatch(actions.loadingShow(true))
			}

			dispatch(actions.error(false))

			api.campaigns.get(id, {
				expand: 'documents,purchase_options,bands.band.artists.purchase_options,timeslot.venue,bands.band.artists.user,timeslot.venue.managers.manager'
			}).then((res) => {
				dispatch(actions.setShow(res))
				dispatch(actions.loadingShow(false))
			}).catch((err) => {
				dispatch(actions.loadingShow(false))
				dispatch(actions.error(true)) 
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
					helpers.refreshShow(dispatch, getState, data.campaign)
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
            		helpers.refreshShow(dispatch, getState, id)
            			.then(() => {
            				dispatch(actions.venueInvitationPending(id, false))
            			})
            	})
            	.catch((err) => {
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
            		helpers.refreshShow(dispatch, getState, id)
            			.then(() => {
            				dispatch(actions.venueInvitationPending(id, false))
            			})
            	})
            	.catch((err) => {
					dispatch(actions.venueInvitationPending(id, false))
            	})
		}
	},

	resetPending: () => {
		return {
			type: constants.RESET_PENDING
		}
	},

	updateShowInReducer: (update) => {
		return {
			type: constants.UPDATE_SHOW,
			update
		}
	},

	updateShow: (id, update) => {
		return (dispatch, getState, api) => {
			dispatch(actions.updateShowInReducer(update))
			api.campaigns
				.update(id, update)
				.then(() => {
					// success, nothing to do
				})
				.catch((err) => {
					// error, refresh the show & TODO display an error
					dispatch(actions.getShow())
				})
		}
	},

	setMessages: (messages) => {
		return {
			type: constants.SET_MESSAGES,
			messages
		}
	},

	addToMessages: (messages) => {
		return {
			type: constants.ADD_TO_MESSAGES,
			messages
		}
	},

	fetchMessages: (campaign) => {
		return (dispatch, getState, api) => {
			dispatch(actions.setMessages([]))
			let query = { 
				campaign, 
				expand: 'sender'
			}
			api.campaignFeed
				.query(query)
				.then((res) => {
					dispatch(actions.setMessages(res.results.reverse()))
				})
		}
	},

	pollMessages: (campaign) => {
		return (dispatch, getState, api) => {
			const state = getState()
			const messages = selectors.selectMessages(state)
			let query = { 
				campaign,
				expand: 'sender',
			}
			if (messages.length > 0) {
				const lastDate = messages[messages.length - 1].created_date
				query['created_date__gt'] = lastDate
			}
			api.campaignFeed
				.query(query)
				.then((res) => {
					dispatch(actions.addToMessages(res.results.reverse()))
				})
		}
	},

	setTemporaryMessage: (message) => {
		return {
			type: constants.SET_TEMPORARY_MESSAGE,
			message
		}
	},

	sendMessage: (payload) => {
		return (dispatch, getState, api) => {
			payload.is_system = false
			payload.item_type = 1
			dispatch(actions.setTemporaryMessage({
				created_date: Date.now() + new Date().getTimezoneOffset() * 60 * 1000,
				text: payload.text
			}))
			api.campaignFeed
				.create(payload)
				.then((res) => {
					dispatch(actions.pollMessages(payload.campaign))
				})
				.catch((err) => {
					// in the future, maybe tell the user the message didn't send.
					dispatch(actions.pollMessages(payload.campaign))
				})
		}
	}
}

export default actions