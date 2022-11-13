const root = (state) => {
	return state.doorsScanResult
}

const selectors = {
	selectIsLoading: (state) => root(state).get('isLoading'),
	selectError: (state) => root(state).get('error'),
	selectTicket: (state) => root(state).get('ticket'),
}

export default selectors