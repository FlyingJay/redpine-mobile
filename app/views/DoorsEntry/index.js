import React from 'react'
import { SceneMap } from 'react-native-tab-view'

import TabView from 'redpine/app/components/TabView'
import MyShows from './MyShows'
import DoorCodes from './DoorCodes'
import navigationProxy from './navigationProxy'


class DoorsEntry extends React.Component {
	componentDidMount() {
		navigationProxy.setNavigation(this.props.navigation)
	}
	
	render() {
		return (
			<TabView 
				routes={[
					{
						key: 'myShows',
						title: 'My Shows',
					},
					{
						key: 'doorCodes',
						title: 'Door Codes',
					}
				]}
				renderScene={SceneMap({
					myShows: MyShows,
					doorCodes: DoorCodes
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

export default DoorsEntry