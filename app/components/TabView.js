import React from 'react'
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import { TabView, SceneMap, TabBar, Text } from 'react-native-tab-view'
import Animated from 'react-native-reanimated'

import { colors } from 'redpine/app/services/globals'

class _TabView extends React.Component {
	state = {
		index: 0,
		routes: [],
	}

	static getDerivedStateFromProps = (nextProps, prevState) => {
		let routesAreSame = true

		if (nextProps.routes.length > -1 && prevState.routes.length > -1) {
			nextProps.routes.forEach((route, index) => {
				if (!prevState.routes[index]
					|| route.key !== prevState.routes[index].key
					|| route.title !== prevState.routes[index].title) {
					routesAreSame = false
				}
			})
		}

		if (!routesAreSame) {
			prevState.routes = nextProps.routes
		}

		if (nextProps.initialRoute !== null && !prevState.initialized) {
			prevState.initialized = true
			let initialRouteIndex = null
			nextProps.routes.forEach((route, index) => {
				if (route.key === nextProps.initialRoute) initialRouteIndex = index
			})
			if (initialRouteIndex) {
				prevState.index = initialRouteIndex
			}
		}

		return prevState
	}

	render() {
		return (
			<TabView
				navigationState={{
					index: this.state.index,
					routes: this.props.routes
				}}
				renderScene={this.props.renderScene}
				onIndexChange={index => this.setState({ index })}
				initialLayout={{
					width: Dimensions.get('window').width
				}}
				renderTabBar={props => (
					<TabBar 
						{...props} 
						scrollEnabled={this.props.scrollEnabled !== undefined ? this.props.scrollEnabled : true}
						tabStyle={styles.tab}
						labelStyle={styles.label}
						indicatorStyle={styles.indicator}
						style={styles.tabBar}
						contentContainerStyle={styles.contentContainer}
					/>
				)}
			/>
		)
	}
}

const styles = StyleSheet.create({
	tab: {
	},
	label: {
		color: colors.red,
		padding: 0,
		margin: 0
	},
	indicator: {
		backgroundColor: colors.red,
	},
	tabBar: {
		backgroundColor: 'white',
	},
	contentContainer: {
	}
})

export default _TabView
