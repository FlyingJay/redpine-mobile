import React from 'react'
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import { Decimal } from 'decimal.js'

import purchaseSelectors from 'redpine/app/services/purchase/selectors'
import purchaseActions from 'redpine/app/services/purchase/actions'
import Checklist from 'redpine/app/components/Checklist'

class DoorsPurchasePayWithCash extends React.Component {
	state = {
		checked: false
	}

	_handleContinue = () => {
		this.props.createCashTransaction()
		this.props.navigation.navigate('DoorsPurchaseConfirm')
	}

	render() {
		const { items, show } = this.props
		const self = this
		let purchaseOptionsById = {}

		if (!show) return null

		show.purchase_options.forEach((option) => {
			purchaseOptionsById[option.id] = option
		})

		let total = new Decimal(0)

		items.keySeq().toArray().forEach((key) => {
			const quantity = new Decimal(items.get(key))
			const price = new Decimal(purchaseOptionsById[key].price)
			total = total.plus(price.times(quantity))
		})

		return (
			<View style={styles.wrapper}>
				<Text style={styles.heading}>Please confirm you have collected the following amount:</Text>
				<Text style={styles.total}>${total.toFixed(2)}</Text>
				<Checklist items={[
					{
						title: `I have collected $${total.toFixed(2)} and put it in the cash box`,
						value: self.state.checked,
						onChange: (checked) => {
							self.setState({ checked })
						}
					}
				]} />
				{self.state.checked ? (
					<TouchableOpacity style={styles.bottomButton} onPress={this._handleContinue}>
						<Text style={styles.bottomButtonText}>Confirm Purchase</Text>
					</TouchableOpacity>
				) : null}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1
	},
	heading: {
		textAlign: 'center',
		paddingTop: 20,
		fontWeight: 'bold',
		paddingBottom: 5,
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
		padding: 30
	},
	total: {
		textAlign: 'center',
		fontSize: 40,
		fontWeight: 'bold',
		paddingTop: 30
	},
	bottomButton: {
		backgroundColor: 'black',
		position: 'absolute',
		bottom: 0,
		width: '100%',
		padding: 20
	},
	bottomButtonText: {
		color: 'white',
		textAlign: 'center',
		fontSize: 20
	},
})

const mapStateToProps = (state) => ({
	show: purchaseSelectors.selectShow(state),
	items: purchaseSelectors.selectItems(state),
	hereToSee: purchaseSelectors.selectHereToSee(state),
	hereToSeeEveryone: purchaseSelectors.selectHereToSeeEveryone(state),
})

const mapDispatchToProps = (dispatch) => ({
	createCashTransaction: () => {
		dispatch(purchaseActions.createCashTransaction())
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(DoorsPurchasePayWithCash)