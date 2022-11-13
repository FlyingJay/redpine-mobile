import React from 'react'
import thunk from 'redux-thunk'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { Platform, StyleSheet, Text, View, AppState } from 'react-native';
import { persistStore, persistReducer } from 'redux-persist'
import { fromJS } from 'immutable'
import storage from 'redux-persist/lib/storage'
import { createAppContainer } from 'react-navigation'
import { connect, Provider } from 'react-redux'


import RedPineAPIClient from 'redpine-api-client'
import Environment from 'redpine/environment'
import routes from 'redpine/app/routes'
import Loading from 'redpine/app/views/Loading'
import authSelectors from 'redpine/app/services/auth/selectors'
import authActions from 'redpine/app/services/auth/actions'
import navigation from 'redpine/app/services/navigation'
import StatusBar from 'redpine/app/components/StatusBar'
import PushProvider from 'redpine/app/services/push'
import statusbar from 'redpine/app/services/statusbar'

const api = new RedPineAPIClient(`${Environment.API_BASE_URL}/v1`)



// build store

// services
import {initialState as authServiceInitialState, reducer as AuthServiceReducer} from 'redpine/app/services/auth/reducer'
import {initialState as doorcodeServiceInitialState, reducer as DoorcodeServiceReducer} from 'redpine/app/services/doorcode/reducer'
import {initialState as purchaseServiceInitialState, reducer as PurchaseServiceReducer} from 'redpine/app/services/purchase/reducer'
import {initialState as pushServiceInitialState, reducer as PushServiceReducer} from 'redpine/app/services/push/reducer'
import {initialState as showsServiceInitialState, reducer as ShowsServiceReducer} from 'redpine/app/services/shows/reducer'

// views
import {initialState as doorsScanResultInitialState, reducer as DoorsScanResultReducer } from 'redpine/app/views/DoorsScanResult/reducer'
import {initialState as myShowsInitialState, reducer as MyShowsReducer} from 'redpine/app/views/MyShows/reducer'
import {initialState as myVenuesInitialState, reducer as MyVenuesReducer} from 'redpine/app/views/MyVenues/reducer'
import {initialState as showHubInitialState, reducer as ShowHubReducer} from 'redpine/app/views/ShowHub/reducer'
import {initialState as venueHubInitialState, reducer as VenueHubReducer} from 'redpine/app/views/VenueHub/reducer'


const initialStateMap = {

  // services
  authService: authServiceInitialState,
  doorcodeService: doorcodeServiceInitialState,
  purchaseService: purchaseServiceInitialState,
  pushService: pushServiceInitialState,
  showsService: showsServiceInitialState,

  // views
  doorsScanResult: doorsScanResultInitialState,
  shows: myShowsInitialState,
  venues: myVenuesInitialState,
  showHub: showHubInitialState,
  venueHub: venueHubInitialState,
}

const reducerMap = {

  // services
  authService: AuthServiceReducer,
  doorcodeService: DoorcodeServiceReducer,
  pushService: PushServiceReducer,
  purchaseService: PurchaseServiceReducer,
  showsService: ShowsServiceReducer,

  // views
  doorsScanResult: DoorsScanResultReducer,
  shows: MyShowsReducer,
  venues: MyVenuesReducer,
  showHub: ShowHubReducer,
  venueHub: VenueHubReducer,
}

const reducers = persistReducer({
    key: 'root',
    storage,
    stateReconciler: (stateFromDisk) => {
      // stateFromDisk is just a JS object, but our reducers
      // are "immutable" objects; need to modify so the rest 
      // of our code understands.
      let reducerRoot = initialStateMap

      Object.keys(stateFromDisk).forEach((key) => {
        let state = initialStateMap[key]

        if (state && stateFromDisk[key]) {
          Object.keys(stateFromDisk[key]).forEach((k2) => {
            state = state.set(k2, stateFromDisk[key][k2])
          })
        }

        reducerRoot[key] = state
      })
      return reducerRoot
    }
  }, 
  combineReducers(reducerMap)
)

const store = createStore(
  reducers,
  applyMiddleware(
    thunk.withExtraArgument(api)
  )
)


class AuthProvider extends React.Component {
  state = {
    view: 'loading',
    statusBar: 0
  }

  componentDidMount() {
    const self = this

    // load data saved on the device
    const persistor = persistStore(store, null, () => {
      const state = store.getState()
      const auth = state.authService
      const userId = auth.get('userId')
      const token = auth.get('token')
      const user = auth.get('user')
      if (userId && token && user) {
        api.token = token
        api.user = userId
        this.setState({view: 'authenticated'})
      } else {
        this.setState({view: 'unauthenticated'})
      }
    })

    // handle session expired
    api.addEventListener(api.EVENTS.SESSION_EXPIRED, () => {
      self.props.handleSessionExpired()
    })

    if (Environment.PURGE_DATA) {
      persistor.purge()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isLoggedIn && this.state.view === 'unauthenticated') {
      this.setState({view: 'authenticated'})
    } else if (!nextProps.isLoggedIn && this.state.view === 'authenticated') {
      this.setState({view: 'unauthenticated'})
    }
  }

  render() {
    let self = this
    if (this.state.view === 'loading') {
      return (
        <Provider store={store}>
          <Loading />
        </Provider>
      )
    } else {
      let Component = createAppContainer(routes[this.state.view])
      let persistenceKey = Environment.PERSIST_ROUTES ? 'NavigationState' : null
      return (
        <Provider store={store}>
          <StatusBar />
          <Component 
            ref={(ref) => navigation.set(ref)} 
            persistenceKey={persistenceKey} 
            onNavigationStateChange={(prevState, currentState) => {
              try {
                if (currentState.routes[0].key === 'Router' && currentState.routes[0].routes.length > 1) {
                  statusbar.setStyle(statusbar.styles.RED)
                } else {
                  statusbar.setStyle(statusbar.styles.WHITE)
                }
              } catch (err) {
              }
            }}
          />
          <PushProvider />
        </Provider>
      )
    }
  }
}



const mapStateToProps = (state) => ({
  isLoggedIn: authSelectors.selectIsLoggedIn(state),
  user: authSelectors.selectUser(state)
})

const mapDispatchToProps = (dispatch) => ({
  handleSessionExpired: () => {
    dispatch(authActions.logout())
  }
})

const ConnectedAuthProvider = connect(mapStateToProps, mapDispatchToProps)(AuthProvider)

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedAuthProvider />
      </Provider>
    )
  }
}