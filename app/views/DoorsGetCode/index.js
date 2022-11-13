import React from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import { fromJS } from 'immutable'

import doorcodeActions from 'redpine/app/services/doorcode/actions'
import doorcodeSelectors from 'redpine/app/services/doorcode/selectors'


class DoorsGetCode extends React.Component {
	componentDidMount() {
		const showId = this.getShowId()
		const doorCode = this.getDoorCode()

		if (!doorCode) {
			this.props.getDoorCode(showId)
		}
	}

	getDoorCode = () => {
		const doorCodes = fromJS(this.props.doorCodes)
		const showId = this.getShowId()

		if (doorCodes) {
			return doorCodes.get(showId) || doorCodes.get(showId.toString())
		}
		return null
	}

	getShowId = () => {
		const show = this.props.navigation.getParam('show', null)
		return show.id
	}

	render() {
		const doorCode = this.getDoorCode()

		return (
			<View style={styles.wrapper}>
				{this.props.isLoading ? (
					<ActivityIndicator />
				) : (
					<Text style={styles.doorCode}>{doorCode}</Text>
				)}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	doorCode: {
		fontSize: 30
	}
})

const mapStateToProps = (state) => ({
	doorCodes: doorcodeSelectors.selectDoorCodes(state),
	isLoading: doorcodeSelectors.selectIsLoading(state)
})

const mapDispatchToProps = (dispatch) => ({
	getDoorCode: (showId) => {
		dispatch(doorcodeActions.getDoorCode(showId))
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(DoorsGetCode)