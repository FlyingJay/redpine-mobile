import { fromJS } from 'immutable'
import constants from './constants'

export const initialState = fromJS({
})

export const reducer = (state = initialState, action) => {
	switch (action.type) {
		default:
			return state
	}
}

export default reducer