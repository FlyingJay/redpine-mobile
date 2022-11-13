import React from 'react'
import { Linking, TouchableOpacity, ScrollView, View, Text, StyleSheet } from 'react-native'
import { connect } from 'react-redux'

import selectors from '../selectors'


class Button extends React.Component {
	render() {
		return (
			<TouchableOpacity style={styles.externalButton} onPress={this.props.onPress}>
				<Text>{this.props.label}</Text>
			</TouchableOpacity>
		)
	}
}


class Participant extends React.Component {
	render() {
		let open = (url) => Linking.openURL(url)
		let buttons = []
		let keys = ['bandcamp', 'facebook', 'soundcloud', 'spotify', 'twitter', 'website']
		let item = this.props.item

		return (
			<View style={styles.participant}>
				<View style={styles.top}>
					<Text style={styles.title}>{this.props.title}</Text>
					<Text style={styles.participantTypeText}>{this.props.type}</Text>
				</View>
				<Text>{this.props.description}</Text>
				{keys.length > 0 ? (
					<View style={styles.externalButtons}>
						{keys.map((key) => {
							if (item[key]) {
								return (
									<Button 
										key={key} 
										onPress={() => open(item[key])} 
										label={key.substr(0,1).toUpperCase() + key.substr(1)}
									/>
								)
							} else {
								return null
							}
						})}
					</View>
				) : null}
			</View>
		)
	}
}


class WhosHere extends React.Component {
	render() {
		const { show } = this.props
		const venue = show.timeslot.venue
		const managers = venue.managers.map((manager) => `${manager.manager.first_name} ${manager.manager.last_name}`)

		return (
			<ScrollView style={styles.wrapper}>
				<Participant
					title={venue.title}
					description={`Managed by ${managers.join(', ')}`}
					type={`Venue`}
					item={venue}
				/>
				{show.bands.map((band) => {
					const members = band.band.artists.map((artist) => `${artist.user.first_name} ${artist.user.last_name}`)
					return (
						<Participant
							key={band.id}
							title={band.band.name}
							description={`Performed by ${members.join(', ')}`}
							type={'Performer'}
							item={band.band}
						/>
					)
				})}
			</ScrollView>
		)
	}
}

const styles = StyleSheet.create({
	wrapper: {
		padding: 20
	},
	top: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		flex: 1
	},
	participantTypeText: {
		flexShrink: 0,
		color: '#aaa'
	},
	participant: {
		borderColor: '#ddd',
		borderWidth: 1,
		marginBottom: 10,
		padding: 10
	},
	title: {
		fontWeight: 'bold',
		fontSize: 20,
		flexShrink: 1,
		marginBottom: 5
	},
	externalButtons: {
		flexDirection: 'row',
		marginTop: 10
	},
	externalButton: {
		padding: 5,
		marginRight: 5,
		backgroundColor: '#eee'
	}
})

const mapStateToProps = (state) => ({
	show: selectors.selectShow(state),
})

const mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(WhosHere)