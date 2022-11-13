import React from 'react';
import { Platform, StyleSheet, Text, View, TextInput, Image, TouchableHighlight, Linking, ActivityIndicator } from 'react-native'


class Loading extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Image source={require('redpine/app/assets/logo.png')} style={styles.logo} />
      </View>
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
    backgroundColor: 'white'
  },
});

export default Loading