import React from 'react'
import { ActivityIndicator, Alert, TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native'
import { connect } from 'react-redux'
import { RP_Campaign } from 'redpine-models'
import { SceneMap } from 'react-native-tab-view'

import TabView from 'redpine/app/components/TabView'
import { colors } from 'redpine/app/services/globals'
import authSelectors from 'redpine/app/services/auth/selectors'
import actions from './actions'
import selectors from './selectors'
import ShowInfo from './ShowInfo'
import WhosHere from './WhosHere'
import ReadyToPlay from './ReadyToPlay'
import TicketsMerch from './TicketsMerch'
import Documents from './Documents'
import Chat from './Chat'
import pushSelectors from 'redpine/app/services/push/selectors'
import pushActions from 'redpine/app/services/push/actions'


class ShowHub extends React.Component {
  state = {}

  _loadShow = () => {
    const showId = this.props.navigation.getParam('show', null)
    this.props.reset()
    if (showId !== null) {
      this.props.loadShow(showId)
    }
  }

  componentWillMount() {
    this._loadShow()
  }

  componentDidMount() {
    if (!this.props.pushRequested) {
      Alert.alert(
        "Allow notifications?",
        "We'll send you notifications when you receive messages and when your shows get updated.",
        [
          {
            text: 'No thanks..', onPress: () => {
              this.props.setPushRequested()
            }
          },
          { 
            text: 'Sure!', 
            onPress: () => {
              this.props.requestPushPermission()
            }
          },
        ],
      )
    }
  }

  render() {
  	const show = this.props.show
    const route = this.props.navigation.getParam('route', null)

    if (this.props.hasError) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontWeight: 'bold', marginBottom: 5}}>Failed to load show.</Text>
          <Text style={{textAlign: 'center', padding: 10}}>You might not have permission to access Show Hub for this show.</Text>
        </View>
      )
    }

    if (!show) return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator />
      </View>
    )

    return (
      <TabView 
        routes={[
          {
            key: 'showInfo',
            title: 'Show Info'
          },
          {
            key: 'whosHere',
            title: "Who's Here?"
          },
          {
            key: 'readyToPlay',
            title: 'Ready to Play',
          },
          {
            key: 'ticketsMerch',
            title: 'Tickets & Merch',
          },
          {
            key: 'showChat',
            title: 'Show Chat'
          },
          {
            key: 'documents',
            title: 'Documents',
          },
        ]}
        renderScene={SceneMap({
          showInfo: ShowInfo,
          readyToPlay: ReadyToPlay,
          whosHere: WhosHere,
          ticketsMerch: TicketsMerch,
          showChat: Chat,
          documents: Documents,
        })}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'black'
        }}
        initialRoute={route}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    paddingTop: 20
  },
  splashImage: {
    width: '100%',
    height: 200
  }
})

const mapStateToProps = (state, props) => {
  return {
    show: selectors.selectShow(state),
    pushRegistered: pushSelectors.selectPushRegistered(state),
    pushRequested: pushSelectors.selectPushRequested(state),
    hasError: selectors.selectHasError(state), 
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    reset: () => {
      dispatch(actions.resetPending())
    },
    loadShow: (id) => {
      dispatch(actions.getShow(id))
    },
    requestPushPermission: () => {
      dispatch(pushActions.requestPermission())
    },
    setPushRequested: () => {
      dispatch(pushActions.pushRequested())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowHub)