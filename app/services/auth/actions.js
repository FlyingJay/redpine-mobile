import constants from './constants'
import selectors from './selectors'
import pushActions from 'redpine/app/services/push/actions'
import pushSelectors from 'redpine/app/services/push/selectors'

const actions = {
	getUser: () => {
		return (dispatch, getState, api) => {
			api.me.query({
				expand: 'profile'
			}).then((user) => {
				dispatch(actions.setUser(user))
			})
		}
	},

	setUser: (user) => {
		return {
			type: constants.SET_USER,
			user
		}
	},

	setCredentials: (userId, token) => {
		return {
			type: constants.SET_CREDENTIALS,
			userId,
			token
		}
	},

	error: (error) => {
		return {
			type: constants.ERROR,
			error
		}
	},

	loggingIn: (isLoggingIn) => {
		return {
			type: constants.LOGGING_IN,
			isLoggingIn
		}
	},

	login: (username, password) => {
		return (dispatch, getState, api) => {
			dispatch(actions.loggingIn(true))
			dispatch(actions.error(null))
			api.logIn(username, password).then((res) => {
				dispatch(actions.setCredentials(api.user, api.token))
				dispatch(actions.getUser())
				setTimeout(() => {
					dispatch(actions.loggingIn(false))
				}, 5000)
			}).catch((err) => {
				dispatch(actions.error('Invalid username / password'))	
				dispatch(actions.loggingIn(false))
			})
		}
	},

	logout: () => {
		return (dispatch, getState, api) => {
			// token has to be deleted before logging out
			const state = getState()
			const token = pushSelectors.selectToken(state)
			const user = selectors.selectUser(state)

			if (user) {
				api.pushTokens.delete_by_token({ token }).then(() => {
					api.logOut()
					dispatch(actions.setUser(null))
					dispatch(actions.setCredentials(null, null))
				}).catch((err) => {
				})
			} else {
				api.logOut()
				dispatch(actions.setUser(null))
				dispatch(actions.setCredentials(null, null))
			}

			dispatch(pushActions.reset())
		}
	},
}

export default actions