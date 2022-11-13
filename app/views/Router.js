import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { createStackNavigator } from 'react-navigation'

import navigation from 'redpine/app/services/navigation'
import { colors } from 'redpine/app/services/globals'

import Dashboard from './Dashboard'
import DoorsEntry from './DoorsEntry'
import DoorsGetCode from './DoorsGetCode'
import DoorsMain from './DoorsMain'
import DoorsPurchaseConfirm from './DoorsPurchaseConfirm'
import DoorsPurchaseHereToSee from './DoorsPurchaseHereToSee'
import DoorsPurchaseItems from './DoorsPurchaseItems'
import DoorsPurchasePayWithCard from './DoorsPurchasePayWithCard'
import DoorsPurchasePayWithCash from './DoorsPurchasePayWithCash'
import DoorsPurchaseSummary from './DoorsPurchaseSummary'
import DoorsScan from './DoorsScan'
import DoorsScanResult from './DoorsScanResult'
import Logout from './Logout'
import MyShows from './MyShows'
import MyVenues from './MyVenues'
import ShowHub from './ShowHub'
import VenueHub from './VenueHub'


class HeaderBackImage extends React.Component {
  render() {
    return <Image source={require('redpine/app/assets/ios-arrow-back.png')} style={styles.backImage} />
  }
}


class DrawerButton extends React.Component {
  _handleMenuPress = () => {
    navigation.toggleDrawer()
  }

  render() {
    return (
      <TouchableOpacity style={styles.menuButton} onPress={this._handleMenuPress}>
        <Image source={require('redpine/app/assets/menu.png')} style={styles.menuImage} />
      </TouchableOpacity>
    )
  }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({

})

const ConnectedDrawerButton = connect(mapStateToProps, mapDispatchToProps)(DrawerButton)


const styles = StyleSheet.create({
  menuImage: {
    width: 20,
    height: 20,
  },
  menuButton: {
    padding: 20
  },
  backImage: {
    width: 20,
    height: 20,
    marginLeft: 5,
    marginRight: 5
  }
})

const defaultOptions = {
  headerRight: <ConnectedDrawerButton />,
  headerBackTitleStyle: {
    color: 'white',
  },
  headerBackImage: <HeaderBackImage />,
  headerStyle: {
    backgroundColor: colors.red
  },
  headerTitleStyle: {
    color: 'white'
  }
}


export default createStackNavigator({
  Dashboard: {
    screen: Dashboard,
    navigationOptions: Object.assign({}, defaultOptions, {
      title: 'Dashboard',
    })
  },
  DoorsGetCode: {
    screen: DoorsGetCode,
    navigationOptions: Object.assign({}, defaultOptions, {
      title: 'Doors',
      headerBackTitle: null
    })
  },
  DoorsMain: {
    screen: DoorsMain,
    navigationOptions: Object.assign({}, defaultOptions, {
      title: 'Doors',
      headerBackTitle: null
    })
  },
  DoorsPurchaseConfirm: {
    screen: DoorsPurchaseConfirm,
    navigationOptions: Object.assign({}, defaultOptions, {
      title: 'Doors',
      headerBackTitle: null,
      headerLeft: null
    })
  },
  DoorsEntry: {
    screen: DoorsEntry,
    navigationOptions: Object.assign({}, defaultOptions, {
      title: 'Doors',
      headerBackTitle: null
    })
  },
  DoorsPurchaseHereToSee: {
    screen: DoorsPurchaseHereToSee,
    navigationOptions: Object.assign({}, defaultOptions, {
      title: 'Purchase',
      headerBackTitle: null
    })
  },
  DoorsPurchaseItems: {
    screen: DoorsPurchaseItems,
    navigationOptions: Object.assign({}, defaultOptions, {
      title: 'Purchase',
      headerBackTitle: null
    })
  },
  DoorsPurchasePayWithCard: {
    screen: DoorsPurchasePayWithCard,
    navigationOptions: Object.assign({}, defaultOptions, {
      title: 'Purchase',
      headerBackTitle: null
    })
  },
  DoorsPurchasePayWithCash: {
    screen: DoorsPurchasePayWithCash,
    navigationOptions: Object.assign({}, defaultOptions, {
      title: 'Purchase',
      headerBackTitle: null
    })
  },
  DoorsPurchaseSummary: {
    screen: DoorsPurchaseSummary,
    navigationOptions: Object.assign({}, defaultOptions, {
      title: 'Purchase',
      headerBackTitle: null
    })
  },
  DoorsScan: {
    screen: DoorsScan,
    navigationOptions: Object.assign({}, defaultOptions, {
      title: 'Scan Ticket'
    })
  },
  DoorsScanResult: {
    screen: DoorsScanResult,
    navigationOptions: Object.assign({}, defaultOptions, {
      title: 'Scan Result'
    })
  },
  MyVenues: {
    screen: MyVenues,
    navigationOptions: Object.assign({}, defaultOptions, {
      title: 'My Venues',
    })
  },
  MyShows: {
    screen: MyShows,
    navigationOptions: Object.assign({}, defaultOptions, {
      title: 'My Shows',
    })
  },
  ShowHub: {
    screen: ShowHub,
    navigationOptions: Object.assign({}, defaultOptions, {
      title: 'Show Hub',
    })
  },
  VenueHub: {
    screen: VenueHub,
    navigationOptions: Object.assign({}, defaultOptions, {
      title: 'Booking Calendar'
    })
  },
  Logout: {
    screen: Logout
  },
})