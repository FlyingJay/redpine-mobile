import { connect } from 'react-redux'
import React from 'react'
import firebase from 'react-native-firebase'
import { AppState, Platform } from 'react-native'

import navigation from 'redpine/app/services/navigation'
import actions from './actions'
import selectors from './selectors'


const notificationChannelId = 'notifications'


class PushProvider extends React.Component {
  componentDidMount() {
    this._checkForNotificationPermissions()
    AppState.addEventListener('change', this._handleAppStateChange)

    // notification received in foreground
    this.notificationDisplayedListener = firebase.notifications().onNotification((notification) => {
      if (Platform.OS === 'android') {
        notification.android.setChannelId(notificationChannelId)
        notification.show_in_foreground = true
      }
      firebase.notifications().displayNotification(notification)
    })

    // notification opened from background
    this.notificationListener = firebase.notifications().onNotificationOpened(({action, notification}) => {
      this._handlePressNotification(notification)
    })

    this._checkForNotificationOpen()

    if (Platform.OS === 'android') {
      const channel = new firebase.notifications.Android.Channel(
          notificationChannelId,
          'RedPine Notifications',
          firebase.notifications.Android.Importance.Max
        )
        .setDescription('RedPine Notifications');
        
      firebase.notifications().android.createChannel(channel);
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange)
    this.notificationDisplayedListener()
    this.notificationListener()
  }

  _handleShowHubNotification = (data) => {
    const showId = data.showId
    navigation.push('ShowHub', {
      show: parseInt(showId),
      route: data.route || null
    })
  }

  _handlePressNotification = (notification) => {
    const lastNotification = this.props.lastNotification
    if (lastNotification !== notification.notificationId) {
      this.props.notificationHandled(notification.notificationId)
      const data = notification.data
      switch (data.type) {
        case "SHOW_HUB":
          this._handleShowHubNotification(data)
          break

        default:
          break
      }
    }
  }

  _checkForNotificationPermissions = () => {
    this.props.checkPermission()
  }

  _checkForNotificationOpen = () => {
    firebase.notifications().getInitialNotification().then(notificationOpen => {
      if (notificationOpen) {
        this._handlePressNotification(notificationOpen.notification)
      }
    })
  }

  _handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'active') {
      this._checkForNotificationPermissions()
      this._checkForNotificationOpen()
    }
  }

  render() {
    return null
  }
}

const mapStateToProps = (state) => ({
  lastNotification: selectors.selectLastNotification(state)
})

const mapDispatchToProps = (dispatch) => ({
  notificationHandled: (notificationId) => {
    dispatch(actions.notificationHandled(notificationId))
  },
  checkPermission: () => {
    dispatch(actions.checkPermission())
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(PushProvider)