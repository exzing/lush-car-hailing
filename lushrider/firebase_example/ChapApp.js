import React, {Component} from 'react';
import {
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  StatusBar,
  Keyboard,
  StyleSheet,
  View,
  Text,
} from 'react-native';
// import {MaterialIcons} from '@expo/vector-icons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MapView, {Marker, Callout} from 'react-native-maps';
import {getRegion} from './map';
// import * as Location from 'expo-location';
// import * as Permissions from 'expo-permissions';
// import firebase from './src/config/firebase';
import {firebase} from '@react-native-firebase/database';
import moment from 'moment';
import {AuthContext} from '../navigation/AuthProvider.android';

export default class ChatApp extends Component {
  static contextType = AuthContext;
  state = {
    location: {
      latitude: null,
      longitude: null,
    },
    messageText: null,
    sendButtonActive: false,
    messages: [],
    currentLocation: this.context.currentPosition,
  };

  componentDidMount() {
    this.getLocation();

    firebase
      .database()
      .ref('messages')
      .limitToLast(2)
      .on('child_added', data => {
        let messages = [...this.state.messages, data.val()];

        this.setState({messages}, () => {
          let {latitude, longitude} = [...messages].pop();

          this.map.animateToRegion(getRegion(latitude, longitude, 16000));

          if (this.marker !== undefined) {
            setTimeout(() => {
              this.marker.showCallout();
            }, 100);
          }
        });
      });
  }

  onChangeText(messageText) {
    this.setState({
      messageText: messageText,
      sendButtonActive: messageText.length > 0,
    });
  }

  onSendPress() {
    if (this.state.sendButtonActive) {
      firebase
        .database()
        .ref('messages')
        .push({
          text: this.state.messageText,
          latitude: this.state.location.latitude,
          longitude: this.state.location.longitude,
          timestamp: firebase.database.ServerValue.TIMESTAMP,
        })
        .then(() => {
          this.setState({messageText: null});

          ToastAndroid.show('Your message has been sent!', ToastAndroid.SHORT);

          Keyboard.dismiss();
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  getLocation = async () => {
    // let {status} = await Permissions.askAsync(Permissions.LOCATION);
    const location = this.state.currentLocation;
    console.log({location});
    if (location) {
      // let location = await Location.getCurrentPositionAsync({});

      this.setState({
        location: {
          latitude: location?.latitude,
          longitude: location?.longitude,
          // latitude: location.coords.latitude,
          // longitude: location.coords.longitude,
        },
      });

      this.map.animateToRegion(
        getRegion(location?.latitude, location?.longitude, 16000),
      );
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Type your message here"
            onChangeText={messageText => this.onChangeText(messageText)}
            value={this.state.messageText}
          />
          <View
            style={{
              ...styles.sendButton,
              ...(this.state.sendButtonActive ? styles.sendButtonActive : {}),
            }}>
            <TouchableOpacity onPress={this.onSendPress.bind(this)}>
              <MaterialIcons name="send" size={32} color="#fe4027" />
            </TouchableOpacity>
          </View>
        </View>
        <MapView
          ref={ref => (this.map = ref)}
          style={styles.map}
          initialRegion={getRegion(48.860831, 2.341129, 160000)}>
          {this.state.messages.map((message, index) => {
            let {latitude, longitude, text, timestamp} = message;

            return (
              <Marker
                ref={ref => (this.marker = ref)}
                key={index}
                identifier={'marker_' + index}
                coordinate={{latitude, longitude}}>
                <Callout>
                  <View>
                    <Text>{text}</Text>
                    <Text style={{color: '#999'}}>
                      {moment(timestamp).fromNow()}
                    </Text>
                  </View>
                </Callout>
              </Marker>
            );
          })}
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  inputWrapper: {
    width: '100%',
    position: 'absolute',
    padding: 10,
    top: StatusBar.currentHeight,
    left: 0,
    zIndex: 100,
  },
  input: {
    height: 46,
    paddingVertical: 10,
    paddingRight: 50,
    paddingLeft: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 6,
    // borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  sendButton: {
    position: 'absolute',
    top: 17,
    right: 20,
    opacity: 0.4,
  },
  sendButtonActive: {
    opacity: 1,
  },
});
