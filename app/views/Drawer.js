import React from 'react'
import { SafeAreaView, TouchableOpacity, TouchableHighlight, View, Text, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { NavigationActions, StackActions } from 'react-navigation'

import authActions from 'redpine/app/services/auth/actions'
import authSelectors from 'redpine/app/services/auth/selectors'


class Drawer extends React.Component {
	_renderButton(text, handler) {
		return (
			<TouchableOpacity 
				style={styles.button}
				onPress={handler}
				color='#ffffff'
			>
				<Text style={styles.buttonText}>{text}</Text>
			</TouchableOpacity>
		)
	}

	_navigate(routeName) {
		const { navigate, closeDrawer  } = this.props.navigation
		navigate(routeName)
		setTimeout(() => {
			closeDrawer()
		}, 0)
	}

	_logout() {
		const resetAction = StackActions.reset({
			index: 0,
			actions: [NavigationActions.navigate({
				routeName: 'Logout'
			})]
		})
		this.props.navigation.dispatch(resetAction)
	}

	render() {
		if (!this.props.user) return null
		const {is_artist, is_venue} = this.props.user.profile
		return (
			<SafeAreaView style={styles.wrapper}>
				<View style={styles.top}>
					{this._renderButton('Dashboard', () => this._navigate('Dashboard'))}
					{is_artist ? this._renderButton('My Shows', () => this._navigate('MyShows')) : null}
					{is_venue ? this._renderButton('My Venues', () => this._navigate('MyVenues')) : null}
					{this._renderButton('Doors', () => this._navigate('DoorsEntry'))}
				</View>
				<View style={styles.bottom}>
					{this._renderButton('Logout', () => {
						this._logout()
					})}
				</View>
			</SafeAreaView>
		)
	}
}

const mapStateToProps = (state) => ({
	user: authSelectors.selectUser(state),
})

const mapDispatchToProps = (dispatch) => ({
	logout: () => {
		dispatch(authActions.logout())
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(Drawer)

const styles = StyleSheet.create({
	wrapper: {
		backgroundColor: '#ffffff',
		height: '100%',
		width: '100%',
		position: 'absolute',
		right: 0,
	},
	button: {
		backgroundColor: '#ffffff',
		paddingTop: 5,
		paddingBottom: 5,
		paddingLeft: 10
	},
	buttonText: {
		fontSize: 20,
		backgroundColor: '#ffffff'
	},
	bottom: {
		position: 'absolute',
		bottom: 20,
		width: '100%',
		flex: 1,
	}, 
	top: {
		paddingTop: 10
	}
})