import { fromJS } from 'immutable'

const root = (state) => {
	return state.purchaseService
}

const selectors = {
	selectHereToSee: (state) => fromJS(root(state).get('hereToSee')),
	selectHereToSeeEveryone: (state) => root(state).get('hereToSeeEveryone'),
	selectShow: (state) => root(state).get('show'),
	selectItems: (state) => fromJS(root(state).get('items')),
	selectCreatingTransaction: (state) => root(state).get('creatingTransaction'),
	selectCreateError: (state) => root(state).get('createError'),
	selectCardTransaction: (state) => root(state).get('cardTransaction'),
}

export default selectors