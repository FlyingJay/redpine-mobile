
import React from 'react'
import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native'


class Item extends React.Component {
	render() {
		const { item, type, onPress, touchable } = this.props
		return (
			<TouchableOpacity disabled={touchable === false} style={itemStyles.item} onPress={() => onPress(item)}>
				<View style={itemStyles.top}>
					<Text style={itemStyles.title}>{item.name}</Text>
					<Text style={itemStyles.type}>{type}</Text>
				</View>
				<Text style={itemStyles.description}>{item.description}</Text>
				<View style={itemStyles.tags}>
					<Text style={itemStyles.tag}>${item.price}</Text>
					<Text style={itemStyles.tag}>{item.quantity} left</Text>
				</View>
			</TouchableOpacity>
		)
	}
}


const itemStyles = StyleSheet.create({
	item: {
		borderWidth: 1,
		borderColor: '#eee',
		padding: 10,
		marginBottom: 10
	},
	top: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		flex: 1,
	},
	title: {
		fontWeight: 'bold',
		fontSize: 20,
	},
	type: {
		color: '#aaa',
		flexShrink: 0
	},
	description: {},
	tags: { 
		marginTop: 10,
		flexDirection: 'row'
	},
	tag: {
		backgroundColor: '#eee',
		padding: 10,
		paddingTop: 5,
		paddingBottom: 5,
		marginRight: 5
	}
})


class TicketsMerch extends React.Component {
	render() {
		const { show } = this.props
		const purchase_options = show && show.purchase_options || []

		const ticket_options = purchase_options.filter(option => { return option.is_ticket === true })
		const merch_options = purchase_options.filter(option => { return option.is_ticket === false })

		return (
			<ScrollView style={styles.wrapper}>
				{ticket_options.map((ticket) => (
					<Item 
						onPress={(item) => this.props.onPressItem(item)}
						key={ticket.id} 
						item={ticket} 
						type='Ticket' 
						touchable={this.props.touchable}
					/>
				))}
				{merch_options.map((merch) => (
					<Item
						onPress={this.props.onPressItem}
						key={merch.id}
						item={merch}
						type='Merch'
						touchable={this.props.touchable}
					/>
				))}
			</ScrollView>
		)
	}
}

const styles = StyleSheet.create({
	wrapper: {
		padding: 10,
	},
	stats: {
		paddingTop: 20,
		paddingBottom: 20,
		flex: 1,
		flexDirection: 'row',
		width: '100%',
	},
	statItem: {
		flexGrow: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	attendees: {
		fontSize: 25
	},
	raised: {
		fontSize: 20
	},
})

export default TicketsMerch