let navigation

// we're using a tab view, which doesn't allow you to pass down props..

export default {
	setNavigation: (_navigation) => {
		navigation = _navigation;
	},
	getNavigation: () => {
		return navigation;
	}
}