import React from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'

import Checklist from 'redpine/app/components/Checklist'
import purchaseSelectors from 'redpine/app/services/purchase/selectors'
import purchaseActions from 'redpine/app/services/purchase/actions'


class DoorsPurchaseHereToSee extends React.Component {
	componentDidMount() {
		this.props.resetHereToSee()
		this.props.resetItems()
	}

	_handleContinue = () => {
		this.props.navigation.navigate('DoorsPurchaseItems')
	}

	render() {
		const show = this.props.show || { bands: [] }
		const hereToSeeJS = this.props.hereToSee.toJS()
		let hasCheckedBand = false
		Object.keys(hereToSeeJS).forEach((key) => {
			if (hereToSeeJS[key]) hasCheckedBand = true
		})

		return (
			<View style={styles.wrapper}>
				<Text style={styles.heading}>Who are they here to see?</Text>
				<Checklist
					items={show.bands.map((band) => {
						return {
							title: band.band.name,
							value: this.props.hereToSee.get(band.id) === true,
							onChange: (value) => {
								this.props.setHereToSee(band.id, value)
							}
						}
					}).concat([{
						title: 'Everyone',
						value: this.props.hereToSeeEveryone,
						onChange: (value) => {
							this.props.setHereToSeeEveryone(value)
						}
					}])}
				/>
				{hasCheckedBand || this.props.hereToSeeEveryone ? (
					<TouchableOpacity style={styles.bottomButton} onPress={this._handleContinue}>
						<Text style={styles.bottomButtonText}>Continue</Text>
					</TouchableOpacity>
				) : null}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1
	},
	heading: {
		textAlign: 'center',
		paddingTop: 20,
		fontWeight: 'bold'
	},
	bottomButton: {
		backgroundColor: 'black',
		position: 'absolute',
		bottom: 0,
		width: '100%',
		padding: 20
	},
	bottomButtonText: {
		color: 'white',
		textAlign: 'center',
		fontSize: 20
	}
})

const mapStateToProps = (state) => ({
	hereToSee: purchaseSelectors.selectHereToSee(state),
	hereToSeeEveryone: purchaseSelectors.selectHereToSeeEveryone(state),
	show: purchaseSelectors.selectShow(state),
})

const mapDispatchToProps = (dispatch) => ({
	setShow: (show) => {
		dispatch(purchaseActions.setShow(show))
	},
	setHereToSee: (id, value) => {
		dispatch(purchaseActions.setHereToSee(id, value))
	},
	setHereToSeeEveryone: (value) => {
		dispatch(purchaseActions.setHereToSeeEveryone(value))
	},
	resetHereToSee: () => {
		dispatch(purchaseActions.resetHereToSee())
	},
	resetItems: () => {
		dispatch(purchaseActions.resetItems())
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(DoorsPurchaseHereToSee)