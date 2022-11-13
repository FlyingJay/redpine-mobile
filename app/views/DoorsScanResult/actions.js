import constants from './constants'


const actions = {
	loading: (isLoading) => {
		return {
			type: constants.IS_LOADING,
			isLoading
		}
	},

	ticket: (ticket) => {
		return {
			type: constants.TICKET,
			ticket
		}
	},

	error: (error) => {
		return {
			type: constants.ERROR,
			error
		}
	},

	validateCode: (code) => {
		return (dispatch, getState, api) => {
			dispatch(actions.loading(true))
			dispatch(actions.error(false))
			api.tickets
				.validate({ code }, {
					expand: 'scans,pledge,pledge.campaign,pledge.user,pledge.purchases,pledge.purchases.item'
				})
				.then((res) => {
					dispatch(actions.loading(false))
					dispatch(actions.ticket(res))
				})
				.catch((err) => {
					dispatch(actions.loading(false))
					dispatch(actions.error(true))
				})
		}
	}
}

export default actions