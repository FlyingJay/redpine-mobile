const root = (state) => {
	return state.authService
}

const selectors = {
	selectError: (state) => root(state).get('error'),
	selectLoggingIn: (state) => root(state).get('loggingIn'),
	selectUser: (state) => root(state).get('user'),
	selectIsLoggedIn: (state) => root(state).get('user') !== null,
	selectUserId: (state) => root(state).get('userId'),
	selectToken: (state) => root(state).get('token'),
}

export default selectors