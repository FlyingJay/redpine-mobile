/*

Provides navigation when props isn't provided to component.
See https://reactnavigation.org/docs/en/navigating-without-navigation-prop.html

This should only be used in the DrawerComponent.

With all other components, use this.props.navigation.

*/

import { StackActions, NavigationActions, DrawerActions } from 'react-navigation'

let _navigator = null

const methods = {
	set: (ref) => {
		_navigator = ref
	},

	toggleDrawer: () => {
		if (_navigator) {
			_navigator.dispatch(
				DrawerActions.toggleDrawer()
			)
		}
	},

	push: (routeName, params) => {
		if (_navigator) {
			_navigator.dispatch(
				StackActions.push({
					routeName,
					params
				})
			)
		}
	}
}

export default methods