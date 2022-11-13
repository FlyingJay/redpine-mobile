import { fromJS } from 'immutable'
import constants from './constants'

export const initialState = fromJS({
	hereToSee: {},
	hereToSeeEveryone: false,
	show: null,
	items: {},
	creatingTransaction: false,
	createError: false,
	cardTransaction: null,
})

export const reducer = (state = initialState, action) => {
	switch (action.type) {
		case constants.SET_HERE_TO_SEE:
			return state
				.setIn(['hereToSee', action.id], action.value)
				.set('hereToSeeEveryone', false)

		case constants.SET_HERE_TO_SEE_EVERYONE:
			return state
				.set('hereToSeeEveryone', action.value)
				.set('hereToSee', fromJS({}))

		case constants.RESET_HERE_TO_SEE:
			return state
				.set('hereToSee', fromJS({}))
				.set('hereToSeeEveryone', false)

		case constants.SET_SHOW:
			return state
				.set('show', action.show)

		case constants.RESET_ITEMS:
			return state
				.set('items', fromJS({}))
				.set('cardTransaction', null)

		case constants.SET_ITEM:
			return state
				.setIn(['items', action.id], action.value)

		case constants.CREATING_TRANSACTION:
			return state
				.set('creatingTransaction', action.value)

		case constants.CREATE_ERROR:
			return state
				.set('createError', action.value )

		case constants.SET_CARD_TRANSACTION:
			return state
				.set('cardTransaction', action.result)

		default:
			return state
	}
}

export default reducer