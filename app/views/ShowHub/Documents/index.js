import React from 'react'
import { Linking, Image, Alert, TouchableOpacity, ScrollView, View, Text, StyleSheet, Platform } from 'react-native'
import { connect } from 'react-redux'

import selectors from '../selectors'


class Document extends React.Component {
	_handleDocumentPress = (document) => {
		Alert.alert(
			'Data Usage Warning',
			'You may incur data charges from your mobility provider if you download a large document over the mobile network. It is recommended to download documents over WiFi.  RedPine assumes no responsibility for incurred charges.',
			[
				{text: 'Download document', onPress: () => {
					Linking.openURL(document.document)
				}},
				{text: 'Cancel', style: 'cancel'}
			]
		)
	}

	render() {
		const { document } = this.props

		return (
			<TouchableOpacity 
				style={styles.document} 
				onPress={() => this._handleDocumentPress(this.props.document)}
			>
				<Text style={styles.documentTitle}>{document.name}</Text>
			</TouchableOpacity>
		)
	}
}


class Documents extends React.Component {
	render() {
		const { show, setLocalFilePathForDocument, localDocuments } = this.props
		const documents = show.documents
		return (
			<ScrollView style={styles.container}>
				<Text style={styles.heading}>
					{documents.length === 0 
						? 'There are no documents uploaded to this show'
						: 'The following documents have been uploaded to this show.  Tap them to download.  To add a document, use the website.'}</Text>
				{documents.map((document) => (
					<Document 
						key={document.id} 
						document={document}
						setLocalFilePathForDocument={setLocalFilePathForDocument}
					/>
				))}
			</ScrollView>
		)
	}
}


const styles = StyleSheet.create({
	container: {
		padding: 10,
	},
	heading: {
		paddingTop: 20,
		paddingBottom: 20,
		paddingLeft: 10,
		paddingRight: 10,
		textAlign: 'center',
		color: '#555'
	},
	document: {
		borderColor: '#eee',
		borderWidth: 1,
		padding: 10,
		marginBottom: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		flexWrap: 'wrap',
	},
	documentTitle: {
		flexWrap: 'wrap'
	},
})

const mapStateToProps = (state, props) => ({
	show: selectors.selectShow(state),
})

const mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(Documents)