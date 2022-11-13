import React from 'react'
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { SceneMap } from 'react-native-tab-view'

import TabView from 'redpine/app/components/TabView'
import ShowList from 'redpine/app/components/ShowList'
import selectors from './selectors'
import actions from './actions'


let _navigation


class Upcoming extends React.Component {
  _handlePressShow = (show) => {
    _navigation.push('ShowHub', {
      show: show.id
    })
  }

  render() {
    const shows = this.props.shows

    return (
      <ShowList
        shows={shows}
        onRefresh={() => this.props.getShows()}
        refreshing={this.props.isLoading}
        onPressShow={this._handlePressShow}
        emptyText="You don't have any upcoming shows at your venues"
      />
    )
  }
}

const styles = StyleSheet.create({})



class Venues extends React.Component {
  componentDidMount() {
    this.props.getVenues()
  }

  render() {
    return (
      <FlatList
        onRefresh={this.props.getVenues}
        refreshing={this.props.venuesLoading || false}
        data={this.props.venues}
        renderItem={(item) => (
          <TouchableOpacity key={item.item.id} style={venueStyles.venueContainer}  onPress={() => {
            if (_navigation) _navigation.navigate('VenueHub', {
              venue: item.item
            })
          }}>
            <Image style={venueStyles.venueImage} source={{uri: item.item.picture}} />
            <View style={venueStyles.detailsContainer}>
              <Text style={venueStyles.venueTitle}>{item.item.title}</Text>
              <View style={venueStyles.button}>
                <Image style={venueStyles.calendar} source={require('redpine/app/assets/calendar.png')} /><Text>Booking Calendar</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={({highlighted}) => (
          <View style={venueStyles.separator} />
        )}
        ListEmptyComponent={() => (
          <View key="the only item" style={{
            padding: 20,
            alignItems: 'center',
            fontWeight: 'bold'
          }}>
            <Text style={{
              color: '#aaa'
            }}>You don't have any venues</Text>
          </View>
        )}
      />
    )
  }
}

const venueStyles = StyleSheet.create({
  separator: {
    width: '100%',
    height: 1,
    paddingTop: 1,
    paddingBottom: 1,
    backgroundColor: '#ddd'
  },
  venueImage: {
    width: 100,
    height: 100
  },
  venueContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  detailsContainer: {
    paddingLeft: 10
  },
  venueTitle: {
    fontWeight: 'bold'
  },
  calendar: {
    width: 15,
    height: 15,
    marginRight: 5
  },
  button: {
    marginTop: 5,
    flexDirection: 'row'
  }
})



const mapStateToProps = (state) => {
  return {
    shows: selectors.selectShows(state),
    isLoading: selectors.selectShowsLoading(state),
    venuesLoading: selectors.selectVenuesLoading(state),
    venues: selectors.selectVenues(state),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getShows: () => {
      dispatch(actions.getShows())
    },
    getVenues: () => {
      dispatch(actions.getVenues())
    }
  }
}

const ConnectedUpcoming = connect(mapStateToProps, mapDispatchToProps)(Upcoming)
const ConnectedVenues = connect(mapStateToProps, mapDispatchToProps)(Venues)

class MyVenues extends React.Component {
  componentDidMount() {
    _navigation = this.props.navigation
  }

  render() {
    return (
      <TabView 
        routes={[
          {
            key: 'venues',
            title: 'My Venues',
          },
          {
            key: 'upcoming',
            title: 'Upcoming Shows'
          },
        ]}
        renderScene={SceneMap({
          venues: ConnectedVenues,
          upcoming: ConnectedUpcoming,
        })}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'black'
        }}
        scrollEnabled={false}
      />
    )
  }
}

export default MyVenues