import { Platform, Alert } from 'react-native'
import firebase from 'react-native-firebase'

import constants from './constants'
import selectors from './selectors'


const actions = {
	_pushRegistered: (token) => {
		return {
			type: constants.PUSH_REGISTERED,
			token
		}
	},

	pushRegistered: () => {
		return async (dispatch, getState, api) => {
			const token = await firebase.messaging().getToken()
			const state = getState()
			const prevToken = selectors.selectToken(state)

			if (prevToken !== token) {
				try {
					await api.pushTokens.create({ token })
					dispatch(actions._pushRegistered(token))
				} catch (err) {
					console.log(err)
					// couldn't update remote
				}
			}
		}
	},

	pushRequested: () => {
		return {
			type: constants.PUSH_REQUESTED
		}
	},

	requestPermission: () => {
		return (dispatch, getState, api) => {
			dispatch(actions.reset())
			dispatch(actions.pushRequested())
			firebase.messaging().requestPermission().then((enabled) => {
				dispatch(actions.pushRegistered())
			})
		}
	},

	checkPermission: () => {
		return async (dispatch, getState, api) => {
			firebase.messaging().hasPermission().then(enabled => {
				dispatch(actions.pushRegistered())
			})
		}
	},

	reset: () => {
		return {
			type: constants.RESET
		}
	},

	notificationHandled: (notificationId) => {
		return {
			type: constants.HANDLE_NOTIFICATION,
			notificationId
		}
	}
}

export default actions