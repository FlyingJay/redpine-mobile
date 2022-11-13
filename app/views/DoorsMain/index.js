import React from 'react'
import { TouchableOpacity, View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import DeviceInfo from 'react-native-device-info'

import purchaseSelectors from 'redpine/app/services/purchase/selectors'
import purchaseActions from 'redpine/app/services/purchase/actions'


class Button extends React.Component {
	render() {
		return (
			<TouchableOpacity onPress={this.props.onPress} style={buttonStyles.wrapper}>
				<Text style={buttonStyles.text}>{this.props.text}</Text>
			</TouchableOpacity>
		)
	}
}

const buttonStyles = StyleSheet.create({
	wrapper: {
		borderWidth: 1,
		borderColor: '#555',
		alignItems: 'center',
		padding: 20,
		margin: 10
	}
})


class DoorsMain extends React.Component {
	componentDidMount() {
		const show = this.props.navigation.getParam('show', null)

		// we reload the show, to make sure we have the appropriate data
		// for the whole purchase flow
		this.props.getShow(show.id)
	}

	_handleGetDoorCode = (show) => {
		this.props.navigation.navigate('DoorsGetCode', {
			show
		})
	}

	_handleScanTicket = (show) => {
		this.props.navigation.navigate('DoorsScan', {
			show
		})
	}

	_handlePurchaseItems = (show) => {
		this.props.navigation.navigate('DoorsPurchaseHereToSee')
	}

	render() {
		const show = this.props.navigation.getParam('show', null)
		if (!show) this.props.navigation.navigate('DoorsEntry')
		return this.props.show === null ? (
			<View style={styles.wrapper}>
				<ActivityIndicator />
			</View>
		) : (
			<View style={styles.wrapper}>
				<View style={styles.heading}>
					<Text style={styles.subtitle}>You're doing doors for:</Text>
					<Text style={styles.title}>{show.title}</Text>
				</View>
				<View style={styles.buttons}>
					<Button text='Scan ticket' onPress={() => this._handleScanTicket(show)} />
					<Button text='Sell items' onPress={() => this._handlePurchaseItems(show)} />
				</View>
				<View style={styles.buttons}>
					<Text style={styles.subtitle}>Need to share doors with someone else?</Text>
					<Button text='Get door code' onPress={() => this._handleGetDoorCode(show)} />
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		justifyContent: 'space-around'
	},
	heading: {
		alignItems: 'center'
	},
	subtitle: {
		fontWeight: 'bold',
		paddingBottom: 10,
		textAlign: 'center'
	},
	title: {
		fontSize: 20
	}
})

const mapStateToProps = (state) => ({
	show: purchaseSelectors.selectShow(state),
})

const mapDispatchToProps = (dispatch) => ({
	getShow: (id) => {
		dispatch(purchaseActions.getShow(id))
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(DoorsMain)