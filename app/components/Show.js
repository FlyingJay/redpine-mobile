import React from 'react'
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native'
import Models from 'redpine-models'

import Tag from 'redpine/app/components/Tag'
import helpers from 'redpine/app/services/helpers'


class Show extends React.Component {
	render() {
		const bands_string = this.props.bands.join(', ')
		const date = helpers.localTimeFromUTC(this.props.start_time, this.props.time_offset).format('MMM Do, YYYY') || 'Date TBD'
		const start_time = helpers.localTimeFromUTC(this.props.start_time, this.props.time_offset).format('LT') || ''
		const end_time = helpers.localTimeFromUTC(this.props.end_time, this.props.time_offset).format('LT') || ''
		const time_string = start_time && start_time + ' - ' + end_time || 'Time TBD'
		const s = Models.enums.CAMPAIGN_STATUS
		let statuses = {}
		statuses[s.PENDING_APPROVAL] = 'Pending Approval',
		statuses[s.IN_PROGRESS] = 'In Progress',
		statuses[s.SUCCESSFUL] = 'Successful',
		statuses[s.FINISHED] = 'Finished',
		statuses[s.FAILED] = 'Failed',
		statuses[s.CANCELLED] = 'Cancelled',
		statuses[s.REJECTED] = 'Rejected',
		statuses[s.PENDING_FOREVER] = 'Pending Forever'
		let status_string = statuses[this.props.status]

		return (
			<TouchableOpacity style={styles.wrapper} onPress={() => this.props.onPress(this.props.id)}>
				{/*<Image source={{uri: this.props.picture}} style={styles.image} />*/}
				<View style={styles.right}>
					<Text style={styles.title} numberOfLines={2}>{this.props.title}</Text>
					<Text style={styles.featuring} numberOfLines={2}>Featuring: {bands_string}</Text>
					<View style={styles.tags}>
						<Tag text={status_string} textStyle={[styles.tag, styles.tagBold]} />
						<Tag text={date} textStyle={styles.tag} />
						<Tag text={time_string} textStyle={styles.tag} />
					</View>
				</View>
				<View style={styles.arrowWrap}>
					<Image style={styles.arrow} source={require('redpine/app/assets/arrow-right.png')} />
				</View>
			</TouchableOpacity>
		)
	}
}

const styles = StyleSheet.create({
	wrapper: {
		height: 170,
		flex: 1,
		flexDirection: 'row',
		backgroundColor: 'white'
	},
	image: {
		width: 75,
		height: '100%',
		alignSelf: 'center'
	},
	right: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		padding: 10
	},
	title: {
		fontSize: 20,
		color: 'black',
		fontWeight: 'normal'
	},
	arrow: {
		width: 20,
		height: 20,
	},
	arrowWrap: {
		width: 30,
		flexDirection: 'column',
		justifyContent: 'center'
	},
	tags: {
		alignItems: 'flex-start',
		paddingTop: 10,
		flexDirection: 'row',
		flexWrap: 'wrap',
		width: '80%'
	},
	tag: {
		marginBottom: 2,
		marginRight: 2
	},
	tagBold: {
		fontWeight: 'bold'
	}
})

export default Show