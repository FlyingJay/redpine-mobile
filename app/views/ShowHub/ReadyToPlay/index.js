import React from 'react'
import { Image, TouchableOpacity, ScrollView, View, Text, StyleSheet } from 'react-native'
import { connect } from 'react-redux'

import actions from '../actions'
import selectors from '../selectors'
import Checklist from 'redpine/app/components/Checklist'


class ReadyToPlay extends React.Component {
	render() {
		const { show } = this.props

		if (!show) {
			return null
		}


		return (
				<Checklist
					items={[
						{
							title: "Facebook Event Page",
							value: show.has_event_page,
							onChange: value => this.props.updateCheckList(show.id, 'has_event_page', value)
						},
						{
							title: "Determine Set Order",
							value: show.has_set_order,
							onChange: value => this.props.updateCheckList(show.id, 'has_set_order', value)
						},
						{
							title: "Discuss Doors",
							value: show.has_door_plan,
							onChange: value => this.props.updateCheckList(show.id, 'has_door_plan', value)
						},
						{
							title: "Discuss Sound Tech",
							value: show.has_sound_plan,
							onChange: value => this.props.updateCheckList(show.id, 'has_sound_plan', value)
						},
						{
							title: "Discuss Equipment",
							value: show.has_equipment_plan,
							onChange: value => this.props.updateCheckList(show.id, 'has_equipment_plan', value)
						}
					]}
				/>
		)
	}
}

const mapStateToProps = (state) => ({
	show: selectors.selectShow(state),
})

const mapDispatchToProps = (dispatch) => ({
	updateCheckList: (showId, key, value) => {
		const update = {
			[key]: value
		}
		dispatch(actions.updateShow(showId, update))
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(ReadyToPlay)