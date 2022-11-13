
import React from 'react'
import { StyleSheet, ScrollView, View, Text } from 'react-native'
import { RP_Campaign } from 'redpine-models'
import { connect } from 'react-redux'

import authSelectors from 'redpine/app/services/auth/selectors'
import selectors from '../selectors'


class Item extends React.Component {
	render() {
		const { item, type } = this.props
		return (
			<View style={itemStyles.item}>
				<View style={itemStyles.top}>
					<Text style={itemStyles.title}>{item.name}</Text>
					<Text style={itemStyles.type}>{type}</Text>
				</View>
				<Text style={itemStyles.description}>{item.description}</Text>
				<View style={itemStyles.tags}>
					<Text style={itemStyles.tag}>${item.price}</Text>
					<Text style={itemStyles.tag}>{item.quantity} left</Text>
				</View>
			</View>
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
		const { show, user } = this.props
		const timeslot = show.timeslot
		const Campaign = RP_Campaign(show)
	    const is_selling          = Campaign.isSelling()
	    const is_creator          = Campaign.userIsCreator(user)
		const is_crowdfunded 	  = Campaign.isCrowdfunded()
		const total_pledged       = Number(show && show.total_pledged || 0).toFixed(2)
		const tickets_sold        = show && show.tickets_sold || 0    
		const goal_amount         = Number(timeslot && timeslot.asking_price || 0).toFixed(2)
		const goal_count          = timeslot && timeslot.min_headcount || 0
		const sales_count_string  = is_crowdfunded ? `${tickets_sold} / ${goal_count}` : `${tickets_sold}`
		const sales_amount_string = is_crowdfunded ? `${total_pledged} / ${goal_amount}` : `${total_pledged}`
		const sales_count_label   = is_crowdfunded ? 'Headcount / Attendance Goal' : 'Headcount'
		const sales_amount_label  = is_crowdfunded ? 'Total Sales / Show Expenses' : 'Total Sales'

		const purchase_options = show && show.purchase_options || []
		const is_active = is_selling && is_creator

		const ticket_options = purchase_options.filter(option => { return option.is_ticket === true })
		const merch_options = purchase_options.filter(option => { return option.is_ticket === false })

		const has_tickets = (ticket_options.length > 0)
		const has_merch = (merch_options.length > 0)

		return (
			<ScrollView style={styles.wrapper}>
				<View style={styles.stats}>
					<View style={styles.statItem}>
						<Text style={styles.attendees}>{sales_count_string}</Text>
						<Text style={styles.statLabel}>{sales_count_label}</Text>
					</View>
					<View style={styles.statItem}>
						<Text style={styles.raised}>${sales_amount_string}</Text>
						<Text style={styles.statLabel}>{sales_amount_label}</Text>
					</View>
				</View>
				{ticket_options.map((ticket) => <Item key={ticket.id} item={ticket} type='Ticket' />)}
				{merch_options.map((merch) => <Item key={merch.id} item={merch} type='Merch' />)}
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

const mapStateToProps = (state) => ({
	show: selectors.selectShow(state),
	user: authSelectors.selectUser(state),
})

const mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(TicketsMerch)