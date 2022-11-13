import React from 'react'
import { Platform, Dimensions, StyleSheet, StatusBar, View } from 'react-native'

import { colors } from 'redpine/app/services/globals'
import statusbar from 'redpine/app/services/statusbar'


const backgroundColor = colors.red

const getHeight = () => {
	const { width, height } = Dimensions.get('window')

	// iphone x / xr
	if (Platform.OS === 'ios' && (width >= 812 || height >= 812)) {
		return 45
	}

	return 20
}

class _StatusBar extends React.Component {
	state = {
		style: statusbar.styles.WHITE
	}

	componentDidMount() {
		statusbar.onChange(this._handleChange)
	}

	componentWillUnmount() {
		statusbar.removeListener(this._handleChange)
	}

	_handleChange = (style) => {
		if (this.state.style !== style) {
			this.setState({
				style
			})
		}
	}

	render() {
		const isWhite = this.state.style === statusbar.styles.WHITE

		return (
			<View style={[styles.bar, isWhite && { backgroundColor: 'white' }]}>
				<StatusBar backgroundColor={isWhite ? 'white' : backgroundColor} barStyle={isWhite ? 'dark-content' : 'light-content'} />
			</View>
		)
	}
}

const styles = StyleSheet.create({
	bar: {
		backgroundColor,
		height: getHeight(),
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		zIndex: 100
	}
})

export default _StatusBar