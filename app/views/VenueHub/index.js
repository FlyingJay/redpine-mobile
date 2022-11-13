import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Agenda } from 'react-native-calendars'
import Models from 'redpine-models'
import moment from 'moment'
import { connect } from 'react-redux'

import selectors from './selectors'
import actions from './actions'
import { colors } from 'redpine/app/services/globals'


class BookingCalendar extends React.Component {
	state = {
		items: {}
	}

	componentDidMount() {
		this.props.clearState()
	}

	render() {
		// const venue = this.props.navigation.getParam('venue', null)
		const venue = this.props.navigation.getParam('venue', {
			title: 'lol',
			events: []
		})

		if (!venue) return null
		const Venue = Models.RP_Venue(venue)

		let allItems = {}

		venue.events.forEach((event) => {
			const startTime = Venue.localTimeFromUTC(event.start_time)
			const endTime = Venue.localTimeFromUTC(event.end_time)
			const startDate = startTime.format('YYYY-MM-DD')
			const endDate = endTime.format('YYYY-MM-DD')
			if (!allItems[startDate]) allItems[startDate] = []
			allItems[startDate].push({
				title: event.title,
				type: 'Event'
			})
		})

		this.props.campaigns.forEach((campaign) => {
			const startTime = Venue.localTimeFromUTC(campaign.timeslot.start_time)
			const endTime = Venue.localTimeFromUTC(campaign.timeslot.end_time)
			const startDate = startTime.format('YYYY-MM-DD')
			const endDate = endTime.format('YYYY-MM-DD')
			if (!allItems[startDate]) allItems[startDate] = []
			allItems[startDate].push({
				title: campaign.title,
				type: campaign.is_open_mic ? 'Open Mic' : 'Show',
				showHub: campaign.id
			})
		})

		this.props.openings.forEach((opening) => {
			const startTime = Venue.localTimeFromUTC(opening.timeslot.start_time)
			const endTime = Venue.localTimeFromUTC(opening.timeslot.end_time)
			const startDate = startTime.format('YYYY-MM-DD')
			const endDate = endTime.format('YYYY-MM-DD')
			if (!allItems[startDate]) allItems[startDate] = []
			allItems[startDate].push({
				title: opening.title,
				type: 'Opportunity'
			})
		})

		let datesSearched = this.props.datesSearched
		if (datesSearched.toArray) datesSearched = datesSearched.toArray()

		datesSearched.forEach(ddd => {
			const startDate = moment(ddd[0])
			const endDate = moment(ddd[1])

			while (startDate.isBefore(endDate)) {
				let dd = startDate.format('YYYY-MM-DD')
				if (!allItems[dd]) allItems[dd] = []
				startDate.add(1, 'day')
			}
		})

		return (
			<Agenda
				refreshing={this.props.isLoading}
				items={this.props.isLoading ? [] : allItems}
				loadItemsForMonth={(day) => {
					const nextMonth = moment(day.dateString)
					nextMonth.add(1, 'month')
					const prevMonth = moment(day.dateString)
					prevMonth.subtract(1, 'month')
					this.props.fetchEvents(venue.id, prevMonth.format('YYYY-MM-DD'), nextMonth.format('YYYY-MM-DD'))
				}}
				renderItem={(item, firstItemInDay) => (
					<TouchableOpacity style={styles.itemView} onPress={() => this.props.navigation.navigate('ShowHub', {
						show: item.showHub
					})} disabled={item.showHub === undefined}>
						<Text style={styles.itemTitle}>{item.title}</Text>
						<View style={styles.itemTags}>
							{item.type ? (
								<View style={[styles.itemType, styles['itemType' + item.type]]}>
									<Text style={styles.itemTypeText}>{item.type}</Text>
								</View>
							) : null}
						</View>
					</TouchableOpacity>
				)}
				renderDay={(day, item) => {
					if (!day) {
						return <View style={styles.day} />
					}

					const mom = moment(day.dateString)
					const isToday = mom.isSame(new Date(), 'day')

					return (
						<View style={styles.day}>
							<Text style={[styles.dayOfMonth, isToday && styles.bold]}>{mom.format('DD')}</Text>
							<Text style={[styles.dayOfWeek, isToday && styles.bold]}>{mom.format('ddd')}</Text>
						</View>
					)
				}}
				rowHasChanged={(r1, r2) => r1.title != r2.title || r1.type != r2.type}
				style={{
					flex: 1
				}}
				renderEmptyDate={() => (
					<View style={styles.itemView} />
				)}
				theme={{
					agendaDayTextColor: 'black',
					agendaDayNumColor: 'black',
					agendaTodayColor: 'black',
					agendaKnobColor: 'black',
					selectedDayBackgroundColor: colors.red,
					todayTextColor: colors.red,
					dotColor: colors.red
				}}
			/>
		)
	}

	timeToString(time) {
		const date = new Date(time);
		return date.toISOString().split('T')[0];
	}
}

const styles = StyleSheet.create({
	bold: {
		fontWeight: 'bold',
	},
	noEventsView: {

	},
	noEventsText: {
		marginTop: 50,
		color: '#555'
	},
	day: {
		width: 50,
		justifyContent: 'center'
	},
	dayOfWeek: {
		textAlign: 'center'
	},
	dayOfMonth: {
		fontSize: 20,
		textAlign: 'center'
	},
	itemView: {
		paddingTop: 10,
		paddingBottom: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#ddd',
		minHeight: 50
	},
	itemTitle: {
		fontWeight: 'bold',
		paddingRight: 5
	},
	itemType: {
		backgroundColor: '#777',
		color: 'white',
		padding: 2,
		borderRadius: 10,
		marginTop: 5,
	},
	itemTypeText: {
		color: 'white',
		paddingLeft: 4,
		paddingRight: 4
	},
	itemTags: {
		flexDirection: 'row'
	},
	'itemTypeShow': {
		backgroundColor: '#F56363'
	},
	'itemTypeOpen Mic': {
		backgroundColor: '#FF9000'
	},
	'itemTypeOpportunity': {
		backgroundColor: '#5DDC5D'
	},
	'itemTypeEvent / Hold': {
		backgroundColor: '#999999'
	}
})

const mapStateToProps = (state) => ({
	campaigns: selectors.selectCampaigns(state),
	openings: selectors.selectOpenings(state),
	isLoading: selectors.selectIsLoading(state),
	datesSearched: selectors.selectDatesSearched(state),
})

const mapDispatchToProps = (dispatch) => ({
	fetchEvents: (venue, startDate, endDate) => {
		dispatch(actions.fetchEvents(venue, startDate, endDate))
	},

	clearState: () => {
		dispatch(actions.clearState())
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(BookingCalendar)