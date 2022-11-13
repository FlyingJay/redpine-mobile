import React from 'react'
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native'
import { connect } from 'react-redux'

import environment from 'redpine/environment'
import ShowList from 'redpine/app/components/ShowList'
import showActions from 'redpine/app/services/shows/actions'
import showSelectors from 'redpine/app/services/shows/selectors'
import venueActions from 'redpine/app/views/MyVenues/actions'
import venueSelectors from 'redpine/app/views/MyVenues/selectors'
import { colors } from 'redpine/app/services/globals'
import navigationProxy from './navigationProxy'


class DoorsEntry extends React.Component {
	render() {
		const isLoading = this.props.venueShowsLoading || this.props.isLoading
		const shows = this.props.shows
			.concat(this.props.venueShows)
			.filter(show => {
				return (Date.parse(show.timeslot.end_time) - Date.now()) > 1000 * 60 * 60 * 24 // any ending in the last day
			})
			.sort((a, b) => {
				const aTime = Date.parse(a.timeslot.end_time)
				const bTime = Date.parse(b.timeslot.end_time)

				if (aTime > bTime) return 1
				if (bTime > aTime) return -1
				return 0
			})

		return (
			<ShowList
				shows={shows}
				onRefresh={() => this.props.getShows()}
				refreshing={this.props.isLoading}
				onPressShow={(show) => navigationProxy.getNavigation().navigate('DoorsMain', {
					show
				})}
				emptyText="You don't have access to any shows"
			/>
		)
	}
}

const styles = StyleSheet.create({
	button: {
		backgroundColor: colors.blue,
		padding: 20
	},
	buttonText: {
		textAlign: 'center',
		color: 'white'
	}
})

const mapStateToProps = (state) => ({
	isLoading: showSelectors.selectArtistShowsLoading(state),
	shows: showSelectors.selectArtistShows(state),
	venueIsLoading: venueSelectors.selectShowsLoading(state),
	venueShows: venueSelectors.selectShows(state)
})

const mapDispatchToProps = (dispatch) => ({
	getShows: () => {
		dispatch(showActions.getArtistShows())
      	dispatch(venueActions.getShows())
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(DoorsEntry)