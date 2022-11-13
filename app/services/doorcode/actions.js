import constants from './constants'
import selectors from './selectors'


const actions = {
	saveDoorCode: (campaignId, doorCode) => {
		return {
			type: constants.SET_DOOR_CODE,
			campaignId,
			doorCode
		}
	},
	setLoadingDoorCode: (isLoading) => {
		return {
			type: constants.LOADING_DOOR_CODE,
			isLoading
		}
	},
	getDoorCode: (campaignId) => {
		return (dispatch, getState, api) => {
			dispatch(actions.setLoadingDoorCode(true))
			api.campaigns.door_code(campaignId).then((res) => {
				dispatch(actions.saveDoorCode(campaignId, res.door_code))
				dispatch(actions.setLoadingDoorCode(false))
			}).catch((err) => {
				dispatch(actions.setLoadingDoorCode(false))
			})
		}
	},
	setCheckingDoorCode: (isLoading) => {
		return {
			type: constants.CHECKING_DOOR_CODE,
			isLoading
		}
	},
	saveDoorCodeAccess: (campaign, doorCode) => {
		return {
			type: constants.SAVE_DOOR_CODE_ACCESS,
			campaign,
			doorCode
		}
	},
	setAddDoorCodeStatus: (status) => {
		return {
			type: constants.SET_ADD_DOOR_CODE_STATUS,
			status
		}
	},
	checkDoorcode: (doorCode) => {
		return (dispatch, getState, api) => {
			dispatch(actions.setCheckingDoorCode(true))
			dispatch(actions.setAddDoorCodeStatus(null))
			api.campaigns.check_door_code({
				door_code: doorCode
			}).then((res) => {
				api.campaigns.get(res.campaign, {
					expand: 'bands.band.artists.purchase_options,timeslot.venue'
				}).then(campaign => {	
					dispatch(actions.saveDoorCodeAccess(campaign, doorCode))
					dispatch(actions.setCheckingDoorCode(false))
					dispatch(actions.setAddDoorCodeStatus(true))
				}).catch(err => {
					dispatch(actions.setCheckingDoorCode(false))
					dispatch(actions.setAddDoorCodeStatus(false))
				})
			}).catch(err => {
				dispatch(actions.setCheckingDoorCode(false))
				dispatch(actions.setAddDoorCodeStatus(false))
			})
		}
	},
	setIsCheckingExisting: (isCheckingExisting) => {
		return {
			type: constants.SET_IS_CHECKING_EXISTING,
			isCheckingExisting
		}
	},
	removeDoorCodeAccessById: (id) => {
		return {
			type: constants.REMOVE_DOOR_CODE_ACCESS_BY_ID,
			id
		}
	},
	updateDoorCodeAccess: (campaign) => {
		return {
			type: constants.UPDATE_DOOR_CODE_ACCESS,
			campaign
		}
	},
	checkExistingDoorcodes: () => {
		return (dispatch, getState, api) => {
			dispatch(actions.setIsCheckingExisting(true))
			const state = getState()
			const ids = selectors
				.selectDoorCodeAccess(state)
				.valueSeq().toArray()
				.map(value => value.get('campaign').toJS().id)
			
			api.campaigns.query({
				id__in: ids.join(','),
				expand: 'bands.band.artists.purchase_options,timeslot.venue'
			}).then(res => {
				let foundIds = res.results.map(campaign => campaign.id)
				let missingIds = []

				ids.map(id => {
					if (foundIds.indexOf(id) === -1) {
						dispatch(actions.removeDoorCodeAccessById(id))
						missingIds.push(id)
					}
				})

				res.results.map(campaign => {
					if (missingIds.indexOf(campaign.id) === -1) {
						dispatch(actions.updateDoorCodeAccess(campaign))
					}
				})

				dispatch(actions.setIsCheckingExisting(false))
			}).catch(err => {
				dispatch(actions.setIsCheckingExisting(false))
			})
		}
	}
}

export default actions