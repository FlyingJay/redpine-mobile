import React from 'react'
import { StyleSheet, View, Text } from 'react-native'


class Tag extends React.Component {
	render() {
		return (
			<Text style={[styles.text, this.props.textStyle]}>{this.props.text}</Text>
		)
	}
}

const styles = StyleSheet.create({
	text: {
		color: 'white',
		backgroundColor: '#555',
		padding: 5,
		borderRadius: 5,
		fontSize: 10
	}
})

export default Tag