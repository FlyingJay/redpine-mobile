import React from 'react'
import { Image, TouchableOpacity, ScrollView, View, Text, StyleSheet } from 'react-native'


const checkboxOutline = require('redpine/app/assets/checkbox-outline.png')
const checkboxChecked = require('redpine/app/assets/checkbox.png')


class Checkbox extends React.Component {
	render() {
		const image = this.props.value ? checkboxChecked : checkboxOutline
		return (
			<TouchableOpacity style={styles.checkboxWrapper} onPress={() => this.props.onChange(!this.props.value)}>
				<Image source={image} style={styles.checkboxImage} />
				<Text style={styles.checkboxText}>{this.props.title}</Text>
			</TouchableOpacity>
		)
	}
}


// item:
// - title
// - value
// - onChange
// ** these are the times when type checking / definitions would be useful
// ** is the tradeoff worth it?  not sure.
class Checklist extends React.Component {
	render() {
		return (
			<ScrollView style={styles.wrapper}>
				{this.props.items.map((item, index) => (
					<Checkbox key={index} {...item} />
				))}
			</ScrollView>
		)
	}
}


const styles = StyleSheet.create({
	wrapper: {
		padding: 20
	},
	checkboxWrapper: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		marginBottom: 10,
		borderColor: '#eee',
		borderWidth: 1,
		padding: 10
	},
	checkboxImage: {
		width: 30,
		height: 30,
		opacity: 0.5,
		marginRight: 20
	},
	checkboxText: {
		fontSize: 20,
		fontWeight: 'bold',
		paddingRight: 40
	}
})

export default Checklist