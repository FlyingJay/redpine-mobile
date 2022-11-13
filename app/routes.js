// import { Navigation } from 'react-native-navigation'
import { Provider } from 'react-redux'

import { createDrawerNavigator, createStackNavigator } from 'react-navigation'

import Router from 'redpine/app/views/Router'
import Loading from 'redpine/app/views/Loading'
import Login from 'redpine/app/views/Login'
import VenueHub from 'redpine/app/views/VenueHub'

import NavigationDrawer from 'redpine/app/views/Drawer'

import React from 'react'
import { View, Text } from 'react-native'


const navigation = {
	authenticated: createDrawerNavigator({
		Router: {
			screen: Router
		}
	}, {
		drawerType: 'slide', 
		drawerPosition: 'right',
		drawerLockMode: 'locked-closed',
		edgeWidth: 1,
		contentOptions: {
			activeBackgroundColor: '#ffffff',
			inactiveBackgroundColor: '#ffffff',
			activeTintColor: 'black',
			itemsContainerStyle: {
				backgroundColor: 'white'
			},
			itemStyle: {
				backgroundColor: 'white'
			},
			labelStyle: {
				backgroundColor: 'white'
			}
		},
		contentComponent: NavigationDrawer
	}),
	unauthenticated: createStackNavigator({
		Login: {
			screen: Login
		}
	}, {
		headerMode: 'none',
		navigationOptions: {
			headerVisible: false
		}
	})
}

export default navigation
