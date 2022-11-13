import { fromJS } from 'immutable'

const root = (state) => {
	return state.doorcodeService
}

const selectors = {
	selectDoorCodes: (state) => root(state).get('doorCodes'),
	selectIsLoading: (state) => root(state).get('isLoading'),
	selectIsChecking: (state) => root(state).get('isChecking'),
	selectDoorCodeAccess: (state) => fromJS(root(state).get('doorCodeAccess')),
	selectAddDoorCodeStatus: (state) => fromJS(root(state).get('addDoorCodeStatus')),
	selectIsCheckingExisting: (state) => root(state).get('isCheckingExisting')
}

export default selectors