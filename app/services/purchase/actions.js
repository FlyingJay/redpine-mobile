import constants from './constants'
import selectors from './selectors'
import doorcodeSelectors from 'redpine/app/services/doorcode/selectors'


const helpers = {
	getTransactionParams: (state) => {
		const show = selectors.selectShow(state)
		const hereToSee = selectors.selectHereToSee(state)
		const hereToSeeEveryone = selectors.selectHereToSeeEveryone(state)
		const _items = selectors.selectItems(state)
		const doorCodes = doorcodeSelectors.selectDoorCodeAccess(state)
		const doorCodeObj = doorCodes.get(show.id) || doorCodes.get(show.id.toString())
		const doorCode = doorCodeObj ? doorCodeObj.get('doorCode') : null

		let items = [], quantities = []
		_items.keySeq().toArray().forEach((key) => {
			items.push(key)
			quantities.push(_items.get(key))
		})

		let bands

		if (hereToSeeEveryone) {
			bands = show.bands.map(band => band.id)
		} else {
			bands = []
			hereToSee.keySeq().toArray().forEach((key) => {
				if (hereToSee.get(key)) {
					bands.push(key)
				}
			})
		}

		let payload = {
			campaign: show.id,
			bands,
			items,
			quantities,
		}

		if (doorCode) {
			payload.door_code = doorCode
		}

		return payload
	}
}


const actions = {
	setHereToSee: (id, value) => {
		return {
			type: constants.SET_HERE_TO_SEE,
			id,
			value
		}
	},
	resetHereToSee: () => {
		return {
			type: constants.RESET_HERE_TO_SEE
		}
	},
	setHereToSeeEveryone: (value) => {
		return {
			type: constants.SET_HERE_TO_SEE_EVERYONE,
			value
		}
	},
	setShow: (show) => {
		return {
			type: constants.SET_SHOW,
			show
		}
	},
	getShow: (id) => {
		return (dispatch, getState, api) => {
			dispatch(actions.setShow(null))
			api.campaigns.get(id, {
				expand: 'bands.band,purchase_options,timeslot.venue'
			}).then((res) => {
				dispatch(actions.setShow(res))
			})
		}
	},
	resetItems: () => {
		return {
			type: constants.RESET_ITEMS
		}
	},
	setItem: (id, value) => {
		return {
			type: constants.SET_ITEM,
			id,
			value
		}
	},
	creatingTransaction: (value) => {
		return {
			type: constants.CREATING_TRANSACTION,
			value
		}
	},
	createError: (value) => {
		return {
			type: constants.CREATE_ERROR,
			value
		}
	},
	createCashTransaction: () => {
		return (dispatch, getState, api) => {
			dispatch(actions.createError(false))
			dispatch(actions.creatingTransaction(true))
			const state = getState()
			const params = helpers.getTransactionParams(state)
			api.appCashTransactions.create(params).then((result) => {
				dispatch(actions.creatingTransaction(false))
			}).catch((err) => {
				dispatch(actions.creatingTransaction(false))
				dispatch(actions.createError(true))
			})
		}
	},
	setCardTransaction: (result) => {
		return {
			type: constants.SET_CARD_TRANSACTION,
			result
		}
	},
	createCardTransaction: () => {
		return (dispatch, getState, api) => {
			dispatch(actions.createError(false))
			dispatch(actions.creatingTransaction(true))
			const state = getState()
			const params = helpers.getTransactionParams(state)
			api.appCardTransactions.create(params).then((result) => {
				dispatch(actions.creatingTransaction(false))
				dispatch(actions.setCardTransaction(result))
			}).catch((err) => {
				dispatch(actions.creatingTransaction(false))
				dispatch(actions.createError(true))
			})
		}
	},
	confirmCardTransaction: (id, transaction_id,  client_transaction_id) => {
		return (dispatch, getState, api) => {
			dispatch(actions.createError(false))
			dispatch(actions.creatingTransaction(true))
			api.appCardTransactions.square_pos_callback(id, {
				transaction_id,
				client_transaction_id
			}).then((result) => {
				dispatch(actions.creatingTransaction(false))
			}).catch(err => {
				dispatch(actions.creatingTransaction(false))
			})
		}
	}
}

export default actions