import React from 'react'
import { TouchableOpacity, Image, ScrollView, View, Text, StyleSheet } from 'react-native'
import { RP_Campaign } from 'redpine-models'
import { connect } from 'react-redux'
import { withNavigation } from 'react-navigation'

import selectors from '../selectors'
import actions from '../actions'
import Invitations from './Invitations'
import authSelectors from 'redpine/app/services/auth/selectors'
import helpers from 'redpine/app/services/helpers'

class Button extends React.Component {
	render() {
		return (
			<TouchableOpacity 
				style={buttonStyles.wrapper} 
				onPress={this.props.onPress}
			>
				<View style={buttonStyles.text}>
					<Text style={buttonStyles.title}>{this.props.title}</Text>
					<Text style={buttonStyles.description}>{this.props.description}</Text>
				</View>
				<View style={buttonStyles.arrowWrapper}>
					<Image source={require('redpine/app/assets/arrow-right.png')} style={buttonStyles.arrowRight} />
				</View> 
			</TouchableOpacity>
		)
	}
}

const buttonStyles = StyleSheet.create({
	wrapper: {
		margin: 10,
		borderColor: '#ddd',
		borderWidth: 1,
		padding: 10,
		marginBottom: 0,
		flexDirection: 'row',
		alignItems: 'center', 
	},
	text: {
		flexGrow: 1,
	},
	title: {
		fontWeight: 'bold',
		fontSize: 20,
		marginBottom: 10
	},
	arrowWrapper: {
		width: 30,
		flexShrink: 0
	},
	arrowRight: {
		width: 20,
		height: 20,
	}
})

class ShowInfo extends React.Component {
	render() {
		const { jumpTo, show, user } = this.props
		const timeslot = show.timeslot
		const date = helpers.localTimeFromUTC(timeslot.start_time, timeslot.venue.utc_offset).format('MMM Do') || 'Date TBD'
		const time = helpers.localTimeFromUTC(timeslot.start_time, timeslot.venue.utc_offset).format('LT') || ''
		const title = show.title

		return (
			<ScrollView>
				<Invitations
					show={show}
					user={user} 
					campaignBandsUpdating={this.props.campaignBandsUpdating}
					respondToArtistInvitation={this.props.respondToArtistInvitation}
					respondToVenueInvitation={this.props.respondToVenueInvitation}
					venueInvitationsUpdating={this.props.venueInvitationsUpdating}
				/>
				<View style={styles.details}>
					{show.picture ? (<Image source={{uri: show.picture}} style={styles.showImage} />) : null}
					<Text style={styles.title}>{title}</Text>
					<Text>{show.description}</Text>
					<View style={styles.detailTags}>
						<View style={styles.detailTag}>
							<Text>{date}</Text>
						</View>
						<View style={styles.detailTag}>
							<Text>{time}</Text>
						</View>
					</View>
				</View>
				<View style={styles.buttons}>
					<Button
						title={'Who\'s here?'}
						description='Who is helping to organize the show?'
						onPress={() => jumpTo('whosHere')}
					/>
					<Button
						title={'Ready to play?'}
						description='Check the show checklist.'
						onPress={() => jumpTo('readyToPlay')}
					/>
					<Button
						title={'Tickets & Merch'}
						description={'How are sales?'}
						onPress={() => jumpTo('ticketsMerch')}
					/>
					<Button
						title={'Show Chat'}
						description={'Discuss the show with co-organizers'}
						onPress={() => jumpTo('showChat')}
					/>
					<Button
						title={'Documents'}
						description={'View uploaded documents'}
						onPress={() => jumpTo('documents')}
					/>
					<Button
						title={'Doors'}
						description={'Manage doors when it\'s showtime!'}
						onPress={() => {
							this.props.navigation.navigate('DoorsMain', {
								show
							})
						}}
					/>
				</View>
			</ScrollView>
		)
	}
}

const styles = StyleSheet.create({
	details: {
		alignItems: 'center',
		padding: 40
	},
	showImage: {
		width: 150,
		height: 150,
		borderRadius: 75,
		marginBottom: 20
	},
	title: {
		fontWeight: 'bold'
	},
	detailTags: {
		flexDirection: 'row',
	},
	detailTag: {
		margin: 10
	},
	buttons: {
		marginBottom: 40
	}
})

const mapStateToProps = (state, props) => {
  return {
    user: authSelectors.selectUser(state),
    campaignBandsUpdating: selectors.selectCampaignBandsUpdating(state),
    show: selectors.selectShow(state),
    venueInvitationsUpdating: selectors.selectVenueInvitationsUpdating(state),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    respondToArtistInvitation: (invitation, is_accepted) => {
      dispatch(actions.updateCampaignBand(invitation.id, {
        id: invitation.id,
        campaign: invitation.campaign,
        is_accepted
      }))
    },
    respondToVenueInvitation: (invitation, is_accepted) => {
      if (is_accepted) {
        dispatch(actions.venueConfirmShow(invitation.id))
      } else {
        dispatch(actions.venueDenyShow(invitation.id))
      }
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(ShowInfo))