import { fromJS } from 'immutable'

const root = (state) => {
	return state.pushService
}

const selectors = {
	selectPushRegistered: (state) => root(state).get('pushRegistered'),
	selectPushRequested: (state) => root(state).get('pushRequested'),
	selectToken: (state) => root(state).get('token'),
	selectLastNotification: (state) => fromJS(root(state).get('lastNotification')),
}

export default selectors