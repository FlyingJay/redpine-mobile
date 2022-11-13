import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { connect } from 'react-redux'
import { RNCamera } from 'react-native-camera'


class DoorsScan extends React.Component {
	_handleBarCodeRead = async data => {
		const code = data.data
		const show = this.props.navigation.getParam('show', null)
		this.props.navigation.navigate('DoorsScanResult', {
			show,
			code
		})
	}

	render() {
		return (
			<View style={styles.wrapper}>
				<RNCamera
					ref={(cam) => {
						this.camera = cam
					}}
					style={styles.preview}
					type={RNCamera.Constants.Type.back}
					flashMode={RNCamera.Constants.FlashMode.off}
					permissionDialogTitle={'Enable camera'}
					permissionDialogMessage={'We need permission to scan ticket barcodes'}
					captureAudio={false}
					onBarCodeRead={this._handleBarCodeRead}
				/>
				<View style={styles.targetWrap}>
					<View style={styles.target} />
					<Text style={styles.targetText}>Scan the barcode on the ticket</Text>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	preview: {
		flex: 1,
	},
	wrapper: {
		flex: 1
	},
	targetWrap: {
		position: 'absolute',
		top: 0,
		width: '100%',
		height: '100%',
		left: 0,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.3)'
	},
	target: {
		borderColor: 'white',
		borderWidth: 1,
		height: 200,
		width: 200,
	},
	targetText: {
		color: 'white',
		paddingTop: 10
	}
})

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(DoorsScan)