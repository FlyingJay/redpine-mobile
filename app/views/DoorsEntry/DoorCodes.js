import React from 'react'
import { RefreshControl, ScrollView, TouchableOpacity, TouchableWithoutFeedback, View, Text, StyleSheet, TextInput, Keyboard } from 'react-native'
import { connect } from 'react-redux'

import ShowList from 'redpine/app/components/ShowList'
import doorcodeActions from 'redpine/app/services/doorcode/actions'
import doorcodeSelectors from 'redpine/app/services/doorcode/selectors'
import navigationProxy from './navigationProxy'


class DoorCodes extends React.Component {
	state = {
		editing: false,
		doorCode: '',
	}

	componentDidMount() {
		Keyboard.addListener('keyboardDidShow', this._keyboardDidShow)
		Keyboard.addListener('keyboardWillHide', this._keyboardWillHide)
		this.props.checkExistingDoorcodes()
	}

	componentWillUnmount() {
		Keyboard.removeListener('keyboardDidShow', this._keyboardDidShow)
		Keyboard.removeListener('keyboardWillHide', this._keyboardWillHide)
	}

	_keyboardDidShow = () => {
		this.setState({
			editing: true
		})
	}

	_keyboardWillHide = () => {
		this.setState({
			editing: false
		})
	}

	_onRefresh = () => {
		this.props.checkExistingDoorcodes()
	}

	_handleDoorCodeChange = (doorCode) => {
		if (doorCode.length === 6) {
			Keyboard.dismiss()
			this.props.checkDoorcode(doorCode)
			const self = this
			let checkInterval = setInterval(() => {
				if (!self.props.isChecking) {
					self.setState({
						doorCode: ''
					})
					clearInterval(checkInterval)
				}
			}, 500)
		}
		this.setState({ 
			doorCode
		})
	}

	render() {
		const { doorCodeAccess, isChecking } = this.props
		let shows = doorCodeAccess.valueSeq().toArray()
			.map(value => value.get('campaign').toJS())
			.filter(show => {
				return (Date.parse(show.timeslot.end_time) - Date.now()) > 1000 * 60 * 60 * 24 // any ending in the last day
			}).sort((a, b) => {
				const aTime = Date.parse(a.timeslot.end_time)
				const bTime = Date.parse(b.timeslot.end_time)

				if (aTime > bTime) return 1
				if (bTime > aTime) return -1
				return 0
			})


		return (
			<TouchableWithoutFeedback onPress={() => {
				if (this.state.editing) {
					Keyboard.dismiss()
				}
			}} style={styles.outer}>
				<ScrollView
					refreshControl={
						<RefreshControl
							refreshing={this.props.isCheckingExisting}
							onRefresh={this._onRefresh}
						/>
					}
				>
					<View style={styles.wrapper}>
						<Text style={styles.heading}>Have a door code?</Text>
						<TouchableOpacity onPress={() => {
							if (!this.state.editing && this.doorCodeRef) {
								this.doorCodeRef.focus()
							}
						}} style={styles.doorCodeWrapper}>
							<TextInput 
								ref={(ref) => this.doorCodeRef = ref}
								style={styles.subheading} 
								placeholder={'Enter it here to access doors'} 
								placeholderTextColor='#555'
								keyboardType={'number-pad'}
								maxLength={6}
								onChangeText={this._handleDoorCodeChange}
								value={this.state.doorCode}
							/>
						</TouchableOpacity>
						{this.props.addDoorCodeStatus === true ? (
							<Text style={styles.success}>Success! You can now access doors for the show below.</Text>
						) : null}
						{this.props.addDoorCodeStatus === false ? (
							<Text style={styles.failure}>That door code didn't work...</Text>
						) : null}
					</View>
					<ShowList
						shows={shows}
						onRefresh={() => null}
						refreshing={this.props.isChecking}
						onPressShow={(show) => navigationProxy.getNavigation().navigate('DoorsMain', {
							show
						})}
					/>
				</ScrollView>
			</TouchableWithoutFeedback>
		)
	}
}

const styles = StyleSheet.create({
	outer: {
	},
	wrapper: {
		alignItems: 'center'
	},
	heading: {
		fontWeight: 'bold',
		textAlign: 'center',
		paddingTop: 20,
		paddingBottom: 10
	},
	subHeading: {
		textAlign: 'center',
		marginTop: 10,
		color: '#555',
	},
	doorCodeWrapper: {
		borderWidth: 1,
		borderColor: '#555',
		borderRadius: 10,
		padding: 20,
		width: 300,
		alignItems: 'center'
	},
	success: {
		fontWeight: 'bold',
		padding: 20,
		textAlign: 'center',
		color: 'green'
	},
	failure: {
		fontWeight: 'bold',
		padding: 20,
		textAlign: 'center',
		color: 'red'
	}
})

const mapStateToProps = (state) => ({
	isChecking: doorcodeSelectors.selectIsChecking(state),
	doorCodeAccess: doorcodeSelectors.selectDoorCodeAccess(state),
	addDoorCodeStatus: doorcodeSelectors.selectAddDoorCodeStatus(state),
	isCheckingExisting: doorcodeSelectors.selectIsCheckingExisting(state),
})

const mapDispatchToProps = (dispatch) => ({
	checkDoorcode: (doorCode) => {
		dispatch(doorcodeActions.checkDoorcode(doorCode))
	},
	checkExistingDoorcodes: () => {
		dispatch(doorcodeActions.checkExistingDoorcodes())
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(DoorCodes)