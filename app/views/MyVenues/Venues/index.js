import React from 'react'
import { connect } from 'react-redux'
import { FlatList, View, Text, StyleSheet, Image, TouchableHighlight } from 'react-native'

import actions from '../actions'
import selectors from '../selectors'

class Venues extends React.Component {
  componentDidMount() {
    this.pros.getVenues()
  }
  
  render() {
    return (
      <FlatList
      	onRefresh={this.props.getVenues()}
      	refreshing={true}
        data={this.props.venues}
        renderItem={(item) => (
          <View key={item.item.id} style={styles.venueContainer}>
            <Image style={styles.venueImage} source={{uri: item.item.picture}} />
            <View style={styles.detailsContainer}>
              <Text style={styles.venueTitle}>{item.item.title}</Text>
              <TouchableHighlight onPress={this.props.navigation.navigate('VenueHub')}>
                <Text>Booking Calendar</Text>
              </TouchableHighlight>
            </View>
          </View>
        )}
        ItemSeparatorComponent={({highlighted}) => (
          <View style={styles.separator} />
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

const styles = StyleSheet.create({
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
  }
})

const mapStateToProps = (state) => ({
	refreshing: selectors.selectVenuesLoading(state),
  venues: selectors.selectVenues(state),
})

const mapDispatchToProps = (dispatch) => ({
	getVenues: () => {
    dispatch(actions.getVenues())
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(Venues)