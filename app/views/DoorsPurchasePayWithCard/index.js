import React from 'react'
import { Linking, Platform, Text, StyleSheet, ScrollView, View, TouchableOpacity, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import { Decimal } from 'decimal.js'
import SquarePOS from 'react-native-square-pos'

import purchaseActions from 'redpine/app/services/purchase/actions'
import purchaseSelectors from 'redpine/app/services/purchase/selectors'
import environment from 'redpine/environment'


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
		margin: 10,
		width: '100%'
	}
})


class DoorsPurchasePayWithCard extends React.Component {
	STATES = {
		SQUARE_NOT_INSTALLED: 1,
		SQUARE_NOT_LOGGED_IN: 2,
		PAYMENT_CANCELLED: 3,
		UNKNOWN_ERROR: 4
	}

	state = {
		state: null,
		error: null
	}

	componentDidMount() {
		this.props.createCardTransaction()
		SquarePOS.configure({
			applicationId: environment.SQUARE_CLIENT_ID,
			callbackUrl: 'redpinemusic://square-pos-callback'
		})
	}

	_getTransactionId = () => {
		if (!environment.SQUARE_TRANSACTION_PREFIX) {
			throw "You need to set SQUARE_TRANSACTION_PREFIX in the environment!"
		}
		return `${environment.SQUARE_TRANSACTION_PREFIX}${this.props.cardTransaction.id}`
	}

	_downloadSquare = () => {
		if (Platform.OS === 'ios') {
			Linking.openURL('https://itunes.apple.com/us/app/square-point-of-sale-pos/id335393788')
		} else {
			Linking.openURL('https://play.google.com/store/apps/details?id=com.squareup&hl=en_CA')
		}
	}

	_attemptPayment = () => {
		const self = this
		this.setState({
			state: null,
			error: null
		})
		const note = this._getTransactionId()
		const amount = parseInt((new Decimal(this.props.cardTransaction.total)).times(new Decimal('100')).toFixed(0))
		const currency_code = this.props.show.timeslot.venue.currency.toUpperCase()

		SquarePOS.transaction(amount, currency_code, {
			tenderTypes: [
				'CARD'
			],
			note,
			autoReturn: 3200,
		}).then((result) => {
			const { transactionId, clientTransactionId } = result
			self.props.confirmCardTransaction(self.props.cardTransaction.id, transactionId, clientTransactionId)
			self.props.navigation.navigate('DoorsPurchaseConfirm')
		}).catch((err) => {
			const { errorCode } = err

			switch (errorCode) {
				case 'CANNOT_OPEN_SQUARE':
					self.setState({
						state: self.STATES.SQUARE_NOT_INSTALLED
					})
					break

				case 'NOT_LOGGED_IN':
					self.setState({
						state: self.STATES.SQUARE_NOT_LOGGED_IN
					})
					break

				case 'PAYMENT_CANCELLED':
					self.setState({
						state: self.STATES.PAYMENT_CANCELLED
					})
					break

				default:
					self.setState({
						state: self.STATES.UNKNOWN_ERROR,
						error: errorCode 
					})
					break
			}
		})
	}

	render() {
		if (this.props.creatingTransaction || !this.props.cardTransaction) {
			return (
				<View style={{flex: 1, alignItems: 'center', justifyContent: 'center' }}>
					<ActivityIndicator />
				</View>
			)
		}

		if (this.state.state === this.STATES.SQUARE_NOT_INSTALLED) {
			return (
				<View style={styles.wrapper}>
					<Text style={styles.notice}>Square POS is not installed.</Text>
					<Text style={styles.details}>You need to download Square POS, then log into your account. If you don't have an account, you need to contact RedPine. Afterwards, you can retry the transaction.</Text>
					<Button text='Download Square POS' onPress={this._downloadSquare} />
					<Button text='Retry Payment' onPress={this._attemptPayment} />
				</View>
			)
		}

	if (this.state.state === this.STATES.SQUARE_NOT_LOGGED_IN) {
			return (
				<View style={styles.wrapper}>
					<Text style={styles.notice}>You are not logged into Square POS.</Text>
					<Text style={styles.details}>You need to open the Square POS app and log into an account. If you don't have an account, you need to contact RedPine. Afterwards, you can retry the transaction.</Text>
					<Button text='Retry Payment' onPress={this._attemptPayment} />
				</View>
			)	
		}

		if (this.state.state === this.STATES.PAYMENT_CANCELLED) {
			return (
				<View style={styles.wrapper}>
					<Text style={styles.notice}>The payment was cancelled from Square POS.</Text>
					<Text style={styles.details}>The purchase has not been paid.</Text>
					<Button text='Retry Payment' onPress={this._attemptPayment} />
				</View>
			)
		}

		if (this.state.state === this.STATES.UNKNOWN_ERROR) {
			return (
				<View style={styles.wrapper}>
					<Text style={styles.notice}>The app encountered an unknown error{this.state.error ? `: ${this.state.error}.` : '.'}</Text>
					<Text style={styles.details}>Contact the RedPine team for more information.</Text>
					<Button text='Retry Payment' onPress={this._attemptPayment} />
				</View>
			)
		}

		return (
			<View style={styles.wrapper}>
				<Text style={styles.notice}>Process payment using Square POS.</Text>
				<Text style={styles.details}>Tap below to open the Square POS app. If you believe this payment has already been processed check for the transaction {this._getTransactionId()} in Square POS.</Text>
				<Button text='Process Payment' onPress={this._attemptPayment} />
			</View>
		)
	}
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20
	},
	notice: {
		fontSize: 20,
		fontWeight: 'bold',
		paddingBottom: 10,
		textAlign: 'center'
	},
	details: {
		padding: 20,
		textAlign: 'center'
	}
})

const mapStateToProps = (state) => ({
	cardTransaction: purchaseSelectors.selectCardTransaction(state),
	creatingTransaction: purchaseSelectors.selectCreatingTransaction(state),
	show: purchaseSelectors.selectShow(state),
})

const mapDispatchToProps = (dispatch) => ({
	createCardTransaction: () => {
		dispatch(purchaseActions.createCardTransaction())
	},
	confirmCardTransaction: (id, transactionId, clientTransactionId) => {
		dispatch(purchaseActions.confirmCardTransaction(id, transactionId, clientTransactionId))
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(DoorsPurchasePayWithCard)