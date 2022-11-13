import React from 'react'
import { View, StyleSheet, FlatList, Text } from 'react-native'
import Models from 'redpine-models'

import helpers from 'redpine/app/services/helpers'
import Show from './Show'

class ShowList extends React.Component {
  render() {
    let items = [], keys = []
    const enums = Models.enums.CAMPAIGN_STATUS
    const displayedStatuses = [
      enums.PENDING_APPROVAL,
      enums.IN_PROGRESS,
      enums.SUCCESSFUL,
      enums.FINISHED
    ]

    this.props.shows
      .map((show) => {
        return {
          key: show.id.toString(),
          title: show.title,
          id: show.id,
          picture: helpers.safeGet(show, 'timeslot.venue.picture', null),
          start_time: show.timeslot.start_time,
          end_time: show.timeslot.end_time,
          venue_name: helpers.safeGet(show, 'timeslot.venue.title', null),
          bands: helpers.safeGet(show, 'bands', []).map((band) => {
            return band.band.name
          }),
          time_offset: helpers.safeGet(show, 'timeslot.venue.utc_offset', '0'),
          status: Models.RP_Campaign(show).status()
        }
      })
      .forEach((show) => {
        if (keys.indexOf(show.key) === -1 && displayedStatuses.indexOf(show.status) > -1) {
          items.push(show)
          keys.push(show.key)
        }
      })

    if (items.length === 0) {
      return (
        <FlatList
          style={{backgroundColor: 'white'}}
          data={[{}]}
          renderItem={() => (
            <View key="the only item" style={{
              padding: 20,
              alignItems: 'center',
              fontWeight: 'bold'
            }}>
              <Text style={{
                color: '#aaa'
              }}>{this.props.emptyText || null}</Text>
            </View>
          )}
          onRefresh={this.props.onRefresh}
          refreshing={this.props.refreshing || false}
        />
      )
    }

    return (
      <FlatList
        style={{backgroundColor: 'white'}}
        data={items}
        renderItem={({item}) => {
          return (
            <Show onPress={(showId) => {
              const show = this.props.shows.reduce((agg, show) => {
                if (show.id === showId) return show
                return agg
              }, null)

              if (show && this.props.onPressShow) {
                this.props.onPressShow(show)
              }
            }} {...item} />
          )
        }}
        ItemSeparatorComponent={({highlighted}) => (
          <View style={styles.separator} />
        )}
        onRefresh={this.props.onRefresh}
        refreshing={this.props.refreshing || false}
      />
    )
  }
}

const styles = StyleSheet.create({
  separator: {
    width: '100%',
    height: 1,
    paddingTop: 1,
    paddingBottom: 1,
    backgroundColor: '#eee'
  }
})

export default ShowList