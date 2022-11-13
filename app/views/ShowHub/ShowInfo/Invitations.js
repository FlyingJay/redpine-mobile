import React from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native'

import { colors } from 'redpine/app/services/globals'


class Invitation extends React.Component {
  render() {
    return (
      <View style={styles.invitation}>
        <Text style={styles.invitationText}>{this.props.text}</Text>
        {this.props.children}
      </View>
    )
  }
}


class OpenInvitation extends React.Component {
  render() {
    return (
      <Invitation text={this.props.text}>
        <View style={styles.invitationActions}>
          {this.props.isLoading ? (
            <View style={styles.invitationActionLoading}>
              <ActivityIndicator 
                color="white" 
              />
            </View>
          ) : null}
          <TouchableOpacity 
            style={styles.invitationButton}
            onPress={this.props.onAccept}>
            <Text style={styles.invitationButtonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.invitationButton}
            onPress={this.props.onReject}>
            <Text style={styles.invitationButtonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      </Invitation>
    )
  }
}

class Invitations extends React.Component {
  _confirm = (message) => {
    return new Promise((resolve, reject) => {
      Alert.alert('Please Confirm', message, [
        {
          text: 'Yes',
          onPress: () => resolve()
        },
        {
          text: 'No',
          style: 'cancel',
          onPress: () => reject()
        }
      ])
    })
  }

  render() {
    const { show } = this.props
    const isInFuture = (Date.parse(show.timeslot.start_time) - Date.now()) > 0
    const artistInvitations = show.bands.filter(band => (
      (isInFuture ? band.is_accepted !== false : band.is_accepted === true)
      && band.band.artists.filter(artist => (
        artist.is_accepted 
        && artist.user.id === this.props.user.id
      )).length > 0
    ))

    const canAcceptInvitation = (Date.parse(show.funding_end) - Date.now()) > 0
    const isVenueManager = show.timeslot.venue.managers.map((manager) => manager.manager.id).indexOf(this.props.user.id) > -1

    return (
      <View style={styles.invitations}>
        {artistInvitations.map((invitation) => (
          invitation.is_accepted ? (
            <Invitation 
              key={invitation.id} 
              text={`${invitation.band.name} ${isInFuture ? 'is playing' : 'played'} this show`} 
            />
          ) : (
            <OpenInvitation
              key={invitation.id}
              text={`${invitation.band.name} has been invited to play this show`}
              isLoading={this.props.campaignBandsUpdating ? this.props.campaignBandsUpdating[invitation.id] : false}
              onAccept={() => {
                this._confirm(`You are accepting the invitation for ${invitation.band.name} to play at ${show.title}.\n\nDo you want to continue?`)
                  .then(() => {
                    this.props.respondToArtistInvitation(invitation, true)
                  })
              }}
              onReject={() => {
                this._confirm(`${invitation.band.name} won't play at ${show.title}?\n\nAre you sure?`)
                  .then(() => {
                    this.props.respondToArtistInvitation(invitation, false)
                  })
              }}
            />
          )
        ))}
        {isVenueManager ? (
          show.is_venue_approved === true ? (
            <Invitation
              text={`This show ${isInFuture ? 'is happening' : 'happened'} at ${show.timeslot.venue.title}`}
            />
          ) : (
            show.is_venue_approved === null && canAcceptInvitation ? (
              <OpenInvitation 
                key={show.id}
                text={`Would you like to host this show at ${show.timeslot.venue.title}?`}
                isLoading={this.props.venueInvitationsUpdating ? this.props.venueInvitationsUpdating[show.id] : false}
                onAccept={() => {
                  this._confirm(`${show.title} will happen at your venue ${show.timeslot.venue.title}.\n\nAre you sure?`)
                    .then(() => {
                      this.props.respondToVenueInvitation(show, true)
                    })
                }}
                onReject={() => {
                  this._confirm(`You are not allowing ${show.title} to happen at ${show.timeslot.venue.title}.\n\nAre you sure?`)
                    .then(() => {
                      this.props.respondToVenueInvitation(show, false)
                    })
                }}
              />
            ) : null
          )
        ) : null}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  invitations: {
    width: '100%',
    backgroundColor: '#555'
  },
  invitation: {
    backgroundColor: '#555',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
    flexWrap: 'wrap',
  },
  invitationText: {
    color: 'white',
    textAlign: 'center'
  },
  invitationActions: {
    flexDirection: 'row',
    position: 'relative',
  },
  invitationActionLoading: {
    position: 'absolute',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#555',
    zIndex: 1,
    top: 0, 
    left: 0,
    right: 0,
    bottom: 0,
  },
  invitationButton: {
    padding: 10,
    opacity: 1,
  },
  invitationButtonText: {
    fontWeight: 'bold',
    color: 'white'
  },
  invitationImage: {
    width: 15,
    height: 15,
  },
})


export default Invitations