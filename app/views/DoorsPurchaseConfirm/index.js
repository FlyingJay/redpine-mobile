import React from 'react'
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Image } from 'react-native'
import { connect } from 'react-redux'

import purchaseSelectors from 'redpine/app/services/purchase/selectors'
import purchaseActions from 'redpine/app/services/purchase/actions'

class DoorsPurchasePayWithCash extends React.Component {
	_handleBackToDoorsPress = (show) => {
		this.props.navigation.navigate('DoorsMain', {
			show
		})
	}

	render() {
		const { items, show, creatingTransaction, createError } = this.props
		const isValid = false

		if (creatingTransaction) {
			return (
				<View style={styles.wrapper}>
					<ActivityIndicator />
				</View>
			)
		}

		return (
			<View style={styles.wrapper}>
				{createError ? (
					<View style={styles.result}>
						<Text style={[styles.title, {color: 'red'}]}>Error</Text>
						<Image source={require('redpine/app/assets/cancel.png')} style={styles.image} />
						<Text style={styles.subtitle}>There was an error when adding the transaction.  If this was a Card transaction, please check Square POS to see if the transaction was successful.  If this was a Cash transaction, you'll need to try again.</Text>
					</View>
				) : (
					<View style={styles.result}>
						<Text style={[styles.title, {color: 'green'}]}>Success</Text>
						<Image source={require('redpine/app/assets/checkbox.png')} style={styles.image} />
						<Text style={styles.subtitle}>The transaction has been recorded</Text>
					</View>
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
		marginBottom: 40,
		textAlign: 'center'
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
	creatingTransaction: purchaseSelectors.selectCreatingTransaction(state),
	show: purchaseSelectors.selectShow(state),
	createError: purchaseSelectors.selectCreateError(state),
})

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(DoorsPurchasePayWithCash)