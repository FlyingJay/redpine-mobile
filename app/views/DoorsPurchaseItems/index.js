import React from 'react'
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { Decimal } from 'decimal.js'

import purchaseSelectors from 'redpine/app/services/purchase/selectors'
import purchaseActions from 'redpine/app/services/purchase/actions'
import TicketsMerch from 'redpine/app/components/TicketsMerch'


class DoorsPurchaseItems extends React.Component {
	componentDidMount() {
		this.props.resetItems()
		if (!this.props.show) this.props.navigation.navigate('DoorsEntry')
	}

	_handlePressItem = (item) => {
		const { items, show } = this.props
		const currValue = items.get(item.id) || 0
		this.props.setItem(item.id, currValue + 1)
	}

	_handleRemoveItem = (itemId) => {
		const { items } = this.props
		const currValue = items.get(parseInt(itemId))
		this.props.setItem(itemId, currValue - 1)
	}

	_handleContinue = () => {
		this.props.navigation.navigate('DoorsPurchaseSummary')
	}

	render() {
		const { items, show } = this.props
		const itemsJS = items.toJS()
		let purchaseOptionsById = show ? show.purchase_options.reduce((acc, curr) => {
			acc[curr.id] = curr
			return acc
		}, {}) : {}
		let itemCount = 0

		items.keySeq().toArray().forEach((key) => {
			itemCount += items.get(key)
		})

		let totalPrice = new Decimal(0)

		items.keySeq().toArray().map((id) => {
			const quantity = items.get(id)
			const ticket = purchaseOptionsById[id]
			const price = (new Decimal(ticket.price)).times(quantity)
			totalPrice = totalPrice.plus(price)
		})

		return (
			<View style={styles.wrapper}>
				<Text style={styles.heading}>What items will they buy?</Text>
				<TicketsMerch 
					touchable={true} 
					onPressItem={(item) => this._handlePressItem(item)} 
					show={show} 
				/>
				{itemCount > 0 ? (
					<View style={styles.bottomArea}>
						<View style={styles.bottomAreaCart}>
							{items.keySeq().toArray().map((id) => {
								const quantity = items.get(id)
								const ticket = purchaseOptionsById[id]
								const price = (new Decimal(ticket.price)).times(quantity)
								if (quantity < 1) return
								return (
									<TouchableOpacity key={id} style={styles.cartLine} onPress={() => this._handleRemoveItem(id)}>
										<Text style={styles.cartLineText}>{ticket.name} x {quantity} (${price.toFixed(2)})</Text>
										<View style={styles.cancelButton}>
											<Text style={styles.cancelButtonInner}>—</Text>
										</View>
									</TouchableOpacity>
								)
							})}
						</View>
						<TouchableOpacity onPress={this._handleContinue} style={styles.bottomAreaSummary}>
							<Text style={styles.bottomAreaText}>Continue</Text>
							<Text style={styles.bottomAreaText}>${totalPrice.toFixed(2)}</Text>
						</TouchableOpacity>
					</View>
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
		borderBottomColor: '#eee'
	},
	bottomArea: {
		backgroundColor: 'black',
		position: 'absolute',
		bottom: 0,
		width: '100%',
		padding: 20
	},
	bottomAreaCart: {
	},
	cartLine: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 20
	},
	cartLineText: {
		color: 'white', 
	},
	cancelButton: {
		width: 30,
		height: 30,
		borderWidth: 1,
		borderColor: 'white',
		borderRadius: 20,
		alignItems: 'center',
		justifyContent: 'center'
	},
	cancelButtonInner: {
		color: 'white'
	},
	bottomAreaSummary: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderTopWidth: 1,
		borderTopColor: '#555',
		paddingTop: 20
	},
	bottomAreaText: {
		color: 'white',
		fontSize: 20
	},
})

const mapStateToProps = (state) => ({
	show: purchaseSelectors.selectShow(state),
	items: purchaseSelectors.selectItems(state),
})

const mapDispatchToProps = (dispatch) => ({
	setItem: (id, value) => dispatch(purchaseActions.setItem(id, value)),
	resetItems: () => dispatch(purchaseActions.resetItems()),
})

export default connect(mapStateToProps, mapDispatchToProps)(DoorsPurchaseItems)