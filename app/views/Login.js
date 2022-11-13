import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Linking, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'

import authActions from 'redpine/app/services/auth/actions'
import authSelectors from 'redpine/app/services/auth/selectors'

class Login extends React.Component {
  state = {
    username: '',
    password: ''
  }

  componentDidMount() {
    this.props.reset()
  }

  _handleForgotPassword() {
    Linking.openURL('https://app.redpinemusic.com/forgot-password')
  }

  _handleSignup() {
    Linking.openURL('https://app.redpinemusic.com/register')
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior={'padding'} enabled>
        <Image source={require('redpine/app/assets/logo.png')} style={styles.logo} />
        <TextInput 
          placeholder={"Username"}
          onChangeText={(username) => this.setState({username})}
          onFocus={() => this.props.clearErrors()}
          style={styles.input}
          spellCheck={false}
          autoCapitalize={'none'}
        />
        <TextInput
          placeholder={"Password"} 
          onChangeText={(password) => this.setState({password})}
          onFocus={() => this.props.clearErrors()}
          secureTextEntry={true}
          style={styles.input}
          spellCheck={false} 
          autoCapitalize={'none'}
        />
        {this.props.isLoggingIn ? (
          <ActivityIndicator style={styles.indicator} />
        ) : (
          <TouchableOpacity 
            style={styles.button}
            onPress={() => this.props.login(this.state.username, this.state.password)}
          >
            <Text>Login</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.error}>{this.props.error}</Text>
        <View style={styles.footer}>
          <TouchableOpacity onPress={this._handleForgotPassword}>
            <Text>Forgot your password?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._handleSignup}>
            <Text>Don't have an account?</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  logo: {
    height: 100,
    width: 100,
    marginBottom: 50
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  error: {
    color: 'red'
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    width: '80%',
    paddingTop: 20,
    paddingBottom: 10
  },
  button: {
    width: '100%',
    alignItems: 'center',
    padding: 20
  },
  indicator: {
    padding: 20
  },
  footer: {
    position: 'absolute',
    bottom: 25
  }
});

const mapStateToProps = (state) => {
  return {
    error: authSelectors.selectError(state),
    isLoggingIn: authSelectors.selectLoggingIn(state),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    reset: () => {
      dispatch(authActions.loggingIn(false))
    },
    login: (username, password) => {
      dispatch(authActions.login(username, password))
    },
    clearErrors: () => {
    	dispatch(authActions.error(null))
    }, 
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)