
import React from 'react'
import { TouchableOpacity, Image, View, StyleSheet, Text, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'

import actions from './actions'
import selectors from './selectors'
import { colors } from 'redpine/app/services/globals'


class DoorsScanResult extends React.Component {
	componentDidMount() {
		const code = this.props.navigation.getParam('code', null)
		this.props.validateCode(code)
	}

	_handleBackToDoorsPress = (show) => {
		this.props.navigation.navigate('DoorsMain', {
			show
		})
	}

	render() {
		const show = this.props.navigation.getParam('show', null)
		const { ticket, error, isLoading } = this.props

		const isValid = show && ticket ? show.id === ticket.pledge.campaign.id : false

		return (
			<View style={styles.wrapper}>
				{isLoading ? (
					<ActivityIndicator />
				) : (
					isValid ? (
						<View style={styles.result}>
							<Text style={[styles.title, {color: 'green'}]}>Success</Text>
							<Image source={require('redpine/app/assets/checkbox.png')} style={styles.image} />
							<Text style={styles.subtitle}>This ticket is valid for:</Text>
							{ticket.pledge.purchases.map((purchase) => (
								<Text>{purchase.quantity} x {purchase.item.name}</Text>
							))}
							<Text>This ticket has been scanned {ticket.scans.length} {ticket.scans.length === 1 ? 'time' : 'times'}</Text>
						</View>
					) : (
						<View style={styles.result}>
							<Text style={[styles.title, {color: 'red'}]}>Error</Text>
							<Image source={require('redpine/app/assets/cancel.png')} style={styles.image} />
							<Text style={styles.subtitle}>This ticket is not valid.</Text>
						</View>
					)
				)}
				<TouchableOpacity onPress={() => this._handleBackToDoorsPress(show)} style={styles.bottomButton}>
					<Text style={styles.bottomButtonText}>Return to doors</Text>
				</TouchableOpacity>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	image: {
		width: 100,
		height: 100,
		marginBottom: 20
	},
	result: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 20
	},
	subtitle: {
		marginBottom: 40
	},
	bottomButton: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		width: '100%',
		backgroundColor: 'black',
		padding: 20
	},
	bottomButtonText: {
		color: 'white',
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 18
	}
})

const mapStateToProps = (state) => ({
	isLoading: selectors.selectIsLoading(state),
	error: selectors.selectError(state),
	ticket: selectors.selectTicket(state),
})

const mapDispatchToProps = (dispatch) => ({
	validateCode: (code) => {
		dispatch(actions.validateCode(code))
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(DoorsScanResult)