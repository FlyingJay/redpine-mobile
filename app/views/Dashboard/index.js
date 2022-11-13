import React from 'react'
import { Platform, NativeModules, RefreshControl, ScrollView, TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native'
import { connect } from 'react-redux'
import { RP_Campaign } from 'redpine-models'

import navigation from 'redpine/app/services/navigation'
import authSelectors from 'redpine/app/services/auth/selectors'
import showActions from 'redpine/app/services/shows/actions'
import showSelectors from 'redpine/app/services/shows/selectors'
import ShowList from 'redpine/app/components/ShowList'
import StatusBar from 'redpine/app/components/StatusBar'
import { colors } from 'redpine/app/services/globals'
import device from 'redpine/app/services/device'

class Dashboard extends React.Component {
  state = {
    initialized: false
  }

  static navigationOptions = {
    header: null,
  }

  static loadData(props) {
    if (!props.user) return null
    const {is_artist, is_venue} = props.user.profile
    if (is_artist) {
      props.getArtistShows()
    }
    if (is_venue) {
      props.getVenuePendingShows()
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (!props.user) return null
    if (!state.initialized && props.user.profile) {
      Dashboard.loadData(props)
      state.initialized = true
    }
    return state
  }

  _handleShowPress = (show) => {
    this.props.navigation.push('ShowHub', {
      show: show.id
    })
  }

  _onRefresh = () => {
    Dashboard.loadData(this.props)
  }

  render() {
    if (!this.props.user) return null
    const {is_artist, is_venue} = this.props.user.profile
    const artistInvitations = this.props.artistShows && this.props.user ? (
      this.props.artistShows
        .filter((campaign) => (
          RP_Campaign(campaign).isSelling() 
          && RP_Campaign(campaign).hasOpenInviteToUserAct(this.props.user)
        ))
    ) : []
    const venueInvitations = this.props.venuePendingShows.filter(campaign => ((Date.parse(campaign.funding_end) - Date.now()) > 0 ))
    const noNotifications = (
      artistInvitations.length === 0
      && venueInvitations.length === 0
    )

    return (
      <View 
        style={[styles.container, {
          paddingTop: device.isIPhoneX() ? 50 : 30
        }]}
      >
        <View style={styles.topWrapper}>
          <View style={styles.top}>
            <Image source={require('redpine/app/assets/logo.png')} style={styles.logo} />
            <TouchableOpacity style={styles.menuButton} onPress={() => navigation.toggleDrawer()}>
              <Image source={require('redpine/app/assets/menu-black.png')} style={styles.menuImage} />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          style={[styles.contentContainer, Platform.OS === 'android' && styles.contentContainerAndroid]}
          refreshControl={
            <RefreshControl
              refreshing={(
                this.props.isLoadingArtistShows 
                || this.props.isLoadingVenuePendingShows
              )}
              onRefresh={this._onRefresh}
            />
          }
        >
          <View style={styles.links}>
            {this.props.user.profile.is_artist ? (
              <TouchableOpacity 
                onPress={() => this.props.navigation.push('MyShows')}
                style={styles.linkChild}>
                <Image 
                  source={require('redpine/app/assets/shows.png')} 
                  style={styles.icon} 
                />
                <Text style={styles.iconText}>My Shows</Text>
              </TouchableOpacity>
            ) : null}
            {this.props.user.profile.is_venue ? (
              <TouchableOpacity 
                style={styles.linkChild}
                onPress={() => this.props.navigation.push('MyVenues')}>
                <Image
                  source={require('redpine/app/assets/venues.png')}
                  style={styles.icon}
                />
                <Text style={styles.iconText}>My Venues</Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity 
              style={styles.linkChild}
              onPress={() => this.props.navigation.push('DoorsEntry')}>
              <Image
                source={require('redpine/app/assets/doors.png')}
                style={styles.icon}
              />
              <Text style={styles.iconText}>Doors</Text>
            </TouchableOpacity>
          </View>
          {artistInvitations.length ? (
            <View style={styles.section}>
              <Text style={styles.title}>You've been invited to play {artistInvitations.length === 1 ? 'a show' : 'some shows'}!</Text>
              <View style={styles.showListWrapper}>
                <ShowList shows={artistInvitations} onPressShow={this._handleShowPress} />
              </View>
            </View>
          ) : null}
          {venueInvitations.length ? (
            <View style={styles.section}>
              <Text style={styles.title}>You have {venueInvitations.length === 1 ? 'a request' : 'some requests'} to play at {venueInvitations.length === 1 ? 'one of ' : ''} your venues!</Text>
              <View style={styles.showListWrapper}>
                <ShowList shows={venueInvitations} onPressShow={this._handleShowPress} />
              </View>
            </View>
          ) : null}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
  },
  topWrapper: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10
  },
  logo: {
    width: 25,
    height: 25,
    marginLeft: 5
  },
  menuButton: {
    padding: 10,
  },
  menuImage: {
    width: 20,
    height: 20,
  },
  contentContainer: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  contentContainerAndroid: {
    marginLeft: 20
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white'
  },
  links: {
    width: '100%',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 20
  },
  icon: {
    width: 35,
    height: 35,
    marginRight: 20
  },
  iconText: {
    fontSize: 20,
  },
  text: {
    textAlign: 'center',
    color: 'white',
    paddingBottom: 20,
  },
  linkChild: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 25,
    paddingLeft: 20,
    shadowOffset:{  width: 1,  height: 1,  },
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 1,
    backgroundColor: 'white',
    elevation: 1,
    borderRadius: 5,
    marginRight: 5
  },
  section: {
    borderTopWidth: 0,
    borderTopColor: '#eee',
    paddingTop: 10,
    backgroundColor: '#555',
    shadowOffset:{  width: 1,  height: 1,  },
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 2,
    borderRadius: 5,
    marginRight: 5,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 20
  },
  showListWrapper: {
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: '#eee',
    borderBottomWidth: 1
  }
})

const mapStateToProps = (state) => {
  return {
    user: authSelectors.selectUser(state),
    artistShows: showSelectors.selectArtistShows(state),
    venuePendingShows: showSelectors.selectVenuePendingShows(state),
    isLoadingArtistShows: showSelectors.selectArtistShowsLoading(state),
    isLoadingVenuePendingShows: showSelectors.selectVenuePendingShowsLoading(state),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getArtistShows: () => {
      dispatch(showActions.getArtistShows())
    },
    getVenuePendingShows: () => {
      dispatch(showActions.getVenuePendingShows())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)