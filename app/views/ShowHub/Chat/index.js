import React from 'react'
import { Platform, ActivityIndicator, Animated, Keyboard, SafeAreaView, TouchableWithoutFeedback, TouchableOpacity, ScrollView, View, Text, TextInput, StyleSheet, KeyboardAvoidingView } from 'react-native'
import moment from 'moment'
import { connect } from 'react-redux'

import device from 'redpine/app/services/device'
import { colors } from 'redpine/app/services/globals'
import actions from '../actions'
import selectors from '../selectors'
import authSelectors from 'redpine/app/services/auth/selectors'


class Message extends React.Component {
	render() {
		const { message } = this.props
		const sender = message.sender
		const system = message.is_system
		const time = moment(message.created_date).subtract(new Date().getTimezoneOffset(), 'minutes').format('MMMM DD hh:mm A') || null
		const title = system ? 'System Notice' : `${sender.first_name} ${sender.last_name}`

		return (
			<View style={messageStyles.wrapper}>
				<View style={messageStyles.top}>
					<Text style={[messageStyles.sender, system && messageStyles.systemColor]}>{title}</Text>
					<Text style={messageStyles.time}>{time}</Text>
				</View>
				<Text style={[messageStyles.text, system && messageStyles.systemColor]}>{message.text}</Text>
			</View>
		)
	}
}

const messageStyles = StyleSheet.create({
	wrapper: {
		marginBottom: 20,
		borderTopWidth: 1,
		borderTopColor: '#eee',
		paddingTop: 20
	},
	systemColor: {
		color: '#999'
	},
	top: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 5
	},
	time: {
		fontSize: 12,
		color: '#999'
	},
	sender: {
		fontWeight: 'bold'
	},
	text: {

	}
})


class Chat extends React.Component {
	constructor(props) {
		super(props)
		this.keyboardPadding = new Animated.Value(0)
	}

	state = {
		message: '',
		keyboardOpen: false
	}

	componentDidMount() {
		this.keyboardWillShowListener = Keyboard.addListener(
			'keyboardWillShow',
			this._keyboardWillShow
		)
		this.keyboardWillHideListener = Keyboard.addListener(
			'keyboardWillHide',
			this._keyboardWillHide
		)
	}

	componentWillUnmount() {
		this.keyboardWillShowListener.remove()
		this.keyboardWillHideListener.remove()

    	if (this.pollInterval) {
	      clearInterval(this.pollInterval)
	    }
	}

	_getKeyboardPadding = () => {
		// this might need to be changed for other devices
		return Platform.OS === 'android' ? 0 : 115
	}

	_keyboardWillShow = (event) => {
		const toValue = this._getKeyboardPadding()
		Animated.timing(this.keyboardPadding, {
			duration: event.duration,
			toValue
		}).start()
		this.setState({
			keyboardOpen: true
		})

		if (this.scrollViewRef) setTimeout(() => {
			this.scrollViewRef.scrollToEnd()
		}, event.duration + 100)
	}

	_keyboardWillHide = (event) => {
		Animated.timing(this.keyboardPadding, {
			duration: event.duration,
			toValue: 0
		}).start()
		this.setState({
			keyboardOpen: false
		})
	}

	_handleMessageChange = (message) => {
		this.setState({
			message
		})
	}

	_handleChatPress = () => {
		if (this.messageInput) {
			this.messageInput.focus()
		}
	}

	_handleMessageSubmit = () => {
		const message = this.state.message
		this.setState({
			message: ''
		})

		this.messageInput.clear()

		this.props.sendMessage({
			campaign: this.props.show.id,
			sender: this.props.user.id,
			text: message
		})

		if (this.scrollViewRef) setTimeout(() => {
			this.scrollViewRef.scrollToEnd()
		}, 100)
	}

	_handleDismiss = () => {
		if (this.state.keyboardOpen) {
			Keyboard.dismiss()
		}
	}

	_startPolling = () => {
		if (this.props.show && !this.pollInterval) {
			const showId = this.props.show.id
			this.props.fetchMessages(showId)
			this.pollInterval = setInterval(() => {
				this.props.pollMessages(showId)
			}, 10000)
		}
	}

	render() {
		// temporaryMessage is a placeholder so that the message feels like it's sent instantly
		// it gets replaced on the next poll (when the sent message is returned, and added to the list).
		
		this._startPolling()
		const { messages, temporaryMessage } = this.props
		const numMessages = messages.size === 0 ? messages.size : messages.length

		const WrapperViewComponent = Platform.OS === 'android' ? View : KeyboardAvoidingView

		return (
			<WrapperViewComponent behavior="padding" style={styles.keyboardView} enabled>
				<TouchableWithoutFeedback disabled={!this.state.keyboardOpen} onPress={this._handleDismiss}>
					<Animated.View style={[styles.inner, {marginBottom: this.keyboardPadding}]}>
						<ScrollView 
							style={styles.messages} 
							contentContainerStyle={styles.messagesContentContainer}
							ref={(ref) => {
								if (ref) {
									this.scrollViewRef = ref
									ref.scrollToEnd()
								}
							}}
						>
							<View style={{justifyContent: 'flex-end', flex: 1}}>
								{numMessages === 0 ? (
									<Text style={styles.noMessages}>No one has written anything yet</Text>
								) : (
									messages.map((message, index) => <Message key={message.id + ' ' + index} message={message} />)
								)}
								{temporaryMessage ? (
									<Message key={'tmp'} message={Object.assign(temporaryMessage, {sender: this.props.user})} />
								) : null}
							</View>
						</ScrollView>
						<View style={[styles.chatBoxWrap, {
							paddingBottom: device.isIPhoneX() ? 25 : 0
						}]}>
							<TouchableOpacity onPress={this._handleChatPress} style={styles.chatBox}>
								<TextInput 
									onChangeText={this._handleMessageChange}
									style={styles.sendMessage}
									placeholder={'Send a message'}
									ref={(ref) => this.messageInput = ref }
									maxLength={500}
								/>
								{this.state.message.length > 0 ? (
									<TouchableOpacity onPress={this._handleMessageSubmit} style={styles.sendButton}>
										<Text style={styles.sendButtonText}>Send</Text>
									</TouchableOpacity>
								) : null}
							</TouchableOpacity>
						</View>
					</Animated.View>
				</TouchableWithoutFeedback>
			</WrapperViewComponent>
		)
	}
}

const styles = StyleSheet.create({
	chatBoxWrap: {
		borderTopWidth: 1,
		borderTopColor: '#eee'
	},
	chatBox: {
		margin: 10,
		backgroundColor: 'white',
		borderColor: '#ddd',
		borderWidth: 1,
		padding: 10,
		borderRadius: 10,
		justifyContent: 'center',
	},
	inner: {
		flex: 1,
	},
	sendMessage: {
		width: '80%'
	},
	sendButton: {
		position: 'absolute',
		right: 10,
		flexShrink: 0,
		alignSelf: 'flex-end',
	},
	sendButtonText: {
		color: '#555',
		fontWeight: 'bold'
	},
	keyboardView: {
		flex: 1,
	},
	messages: {
	},
	messagesContentContainer: {
		paddingLeft: 10,
		paddingRight: 10,
	},
	noMessages: {
		textAlign: 'center',
		color: '#555',
		paddingTop: 30
	},
	wrapper: {
		padding: 10,
		flex: 1,
	}
})

const mapStateToProps = (state, props) => {
  return {
    user: authSelectors.selectUser(state),
    show: selectors.selectShow(state),
    messages: selectors.selectMessages(state),
    temporaryMessage: selectors.selectTemporaryMessage(state),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchMessages: (showId) => {
      dispatch(actions.fetchMessages(showId))
    },
    pollMessages: (showId) => {
      dispatch(actions.pollMessages(showId))
    },
    sendMessage: (payload) => {
      dispatch(actions.sendMessage(payload))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat)
