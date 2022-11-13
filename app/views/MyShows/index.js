import React from 'react'
import { FlatList, View, Text, StyleSheet, Image } from 'react-native'
import { connect } from 'react-redux'
import Models from 'redpine-models'
import { SceneMap } from 'react-native-tab-view'

import navigation from 'redpine/app/services/navigation'
import ShowList from 'redpine/app/components/ShowList'
import TabView from 'redpine/app/components/TabView'
import authSelectors from 'redpine/app/services/auth/selectors'
import showActions from 'redpine/app/services/shows/actions'
import showSelectors from 'redpine/app/services/shows/selectors'


let _navigation = null


class ShowSection extends React.Component {
  _handlePressShow = (show) => {
    _navigation.navigate('ShowHub', {
      show: show.id
    })
  }
}


class Upcoming extends ShowSection {
  render() {
    const shows = this.props.shows.filter(show => {
      return (Date.parse(show.timeslot.end_time) - Date.now()) > 1000 * 60 * 60 * 24
    }).sort((a, b) => {
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
        onPressShow={this._handlePressShow}
        emptyText="You don't have any upcoming shows"
      />
    )
  }
}

class Past extends ShowSection {
  render() {
    const shows = this.props.shows.filter(show => {
      return (Date.parse(show.timeslot.end_time) - Date.now()) < 1000 * 60 * 60 * 24
    })

    return (
      <ShowList
        shows={shows}
        onRefresh={() => this.props.getShows()}
        refreshing={this.props.isLoading}
        onPressShow={this._handlePressShow}
        emptyText="You haven't played any shows"
      />
    )
  }
}


const styles = StyleSheet.create({
})

const mapStateToProps = (state) => {
  return {
    isLoading: showSelectors.selectArtistShowsLoading(state),
    shows: showSelectors.selectArtistShows(state),
    user: authSelectors.selectUser(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getShows: () => {
      dispatch(showActions.getArtistShows())
    }
  }
}

const ConnectedUpcoming = connect(mapStateToProps, mapDispatchToProps)(Upcoming)
const ConnectedPast = connect(mapStateToProps, mapDispatchToProps)(Past)


class MyShows extends React.Component {
  componentDidMount() {
    _navigation = this.props.navigation
  }

  render() {
    return (
      <TabView 
        routes={[
          {
            key: 'upcoming',
            title: 'Upcoming Shows'
          },
          {
            key: 'past',
            title: "Past Shows"
          }
        ]}
        renderScene={SceneMap({
          upcoming: ConnectedUpcoming,
          past: ConnectedPast,
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


export default MyShows