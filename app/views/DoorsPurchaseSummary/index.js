import React from 'react'
import { Linking, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { Decimal } from 'decimal.js'

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

class DoorsPurchaseSummary extends React.Component {
	_payWithCash = () => {
		this.props.navigation.navigate('DoorsPurchasePayWithCash')
	}

	_payWithCard = () => {
		this.props.navigation.navigate('DoorsPurchasePayWithCard')
	}

	render() {
		const { items, show } = this.props
		const itemKeys = items.keySeq().toArray()
		if (!items) return 
		let purchaseOptionsById = show ? show.purchase_options.reduce((acc, curr) => {
			acc[curr.id] = curr
			return acc
		}, {}) : {}
		let itemCount = 0

		itemKeys.forEach((key) => {
			itemCount += items.get(key)
		})

		let totalPrice = new Decimal(0)

		itemKeys.map((id) => {
			const quantity = items.get(id)
			const ticket = purchaseOptionsById[id]
			const price = (new Decimal(ticket.price)).times(quantity)
			totalPrice = totalPrice.plus(price)
		})

		return (
			<View style={styles.wrapper}>
				<Text style={styles.heading}>Order summary</Text>
				<View style={styles.summary}>
					{itemKeys.map((key) => {
						const quantity = items.get(key)
						const ticket = purchaseOptionsById[key]
						const cost = (new Decimal(ticket.price)).times(quantity)
						if (quantity < 1) return
						return (
							<View key={key} style={styles.orderLine}>
								<Text style={styles.orderText}>{ticket.name} x {quantity}</Text>
								<Text style={styles.orderText}>${cost.toFixed(2)}</Text>
							</View>
						)
					})}
					<View style={styles.orderLine}>
						<Text style={styles.totalText}>Total</Text>
						<Text style={styles.totalText}>${totalPrice.toFixed(2)}</Text>
					</View>
				</View>
				<View style={styles.buttons}>
					<Button text={'Pay with Cash'} onPress={this._payWithCash} />
					<Button text={'Pay with Card'} onPress={this._payWithCard} />
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	wrapper: {
	},
	heading: {
		textAlign: 'center',
		paddingTop: 20,
		fontWeight: 'bold',
		paddingBottom: 20,
		fontSize: 20
	},
	buttons: {

	},
	summary: {
		padding: 20
	},
	orderLine: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	orderText: {
		color: 'black',
		fontSize: 20,
		marginBottom: 10
	},
	itemText: {
		fontSize: 20
	},
	totalText: {
		fontWeight: 'bold',
		fontSize: 20
	}
})

const mapStateToProps = (state) => ({
	items: purchaseSelectors.selectItems(state),
	show: purchaseSelectors.selectShow(state)
})

const mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(DoorsPurchaseSummary)