import React, {Component, useContext} from 'react';
import {
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  StatusBar,
  Keyboard,
  StyleSheet,
  View,
  Text,
  Dimensions,
  Switch,
  PermissionsAndroid,
  Platform,
  Image,
} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MapView, {
  Marker,
  Callout,
  Polyline,
  AnimatedRegion,
} from 'react-native-maps';
import {getRegion} from './src/helpers/map';
// import firebase from './src/config/firebase';
// import moment from 'moment';
import {AuthContext} from '../navigation/AuthProvider';
import {getCurrentLocation, locationPermission} from '../helper/helperFunction';
import {firebase} from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import GeoFire from 'geofire';
import {theme} from '../styles/theme';
import LinearGradient from 'react-native-linear-gradient';
import {_styles} from '../screens/HomeScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import haversine from 'haversine';

const carMarker = require('../assets/car144.png');
const LATITUDE = 4.78825;
const LONGITUDE = 7.4324;

export default class MarkerApp extends Component {
  // const {currentAddress, currentPosition, user} = useContext(AuthContext);
  static contextType = AuthContext;
  state = {
    location: {
      latitude: null,
      longitude: null,
    },
    routeCoordinates: [],
    distanceTravelled: 0,
    prevLatLng: {},
    coordinate: new AnimatedRegion({
      latitude: LATITUDE,
      longitude: LONGITUDE,
      latitudeDelta: 0,
      longitudeDelta: 0,
    }),
    user: auth().currentUser,
    messageText: null,
    sendButtonActive: false,
    messages: [],
    drivers: [],
    driversNearby: [],
    ageRangeValues: [18, 24],
    distanceValue: [5],
    radius: 25,
    online: false,

    profileIndex: 0,
    profiles: [],
    modalVisible: false,
    isLoading: false,
    destinationMsg: this.context.destinationMsg,
    pickupMsg: this.context.pickupMsg,
    setIsNotifyDialogue: this.context.setIsNotifyDialogue,
    isNotifyDialogue: this.context.isNotifyDialogue,
    riderUserName: this.context.riderUserName,
    riderPhoneNumber: this.context.riderPhoneNumber,
    rideDuration: this.context.rideDuration,
    rideDistance: this.context.rideDistance,
    rideFare: this.context.rideFare,
    currentPosition: this.context.currentPosition,
    watchedPosition: this.context.watchedPosition,
    watchedID: this.context.watchedID,
  };

  // const {
  //   user,
  //   deviceToken,
  //   authDriverRef,
  //   riderOnlineRef,
  //   pickupMsg,
  //   destinationMsg,
  //   isNotifyDialogue,
  //   setIsNotifyDialogue,
  // } = useContext(AuthContext);

  componentDidMount() {
    this.requestCameraPermission();
    // const {radius} = this.state;
    // console.log({radius: radius});
    // this.updateDriverLocation(radius);
    // console.log({props: this.props});
    console.log({context: this.context});
    this.setState({isNotifyDialogue: this.state.isNotifyDialogue});
    console.log({_destMsg: this.context.destinationMsg});
    console.log({_pickupMsg: this.context.pickupMsg});
    console.log({_isNotifyDialogue: this.context.isNotifyDialogue});
    console.log({_riderUserName: this.context.riderUserName});
    console.log({_riderPhoneNumber: this.context.riderPhoneNumber});
    console.log({_riderDuration: this.context.rideDuration});
    console.log({_rideFare: this.context.rideFare});
    console.log({_rideDistance: this.context.rideDistance});
    console.log({_currentPosition: this.context.currentPosition});
    console.log({_watchedPosition: this.context.watchedPosition});
    console.log({_watchID: this.context.watchID});

    this.updateDriverLocation();
    // this.handleNearbyLoc();
    this.getDriver();
    // geoFireRef.set(this.state?.user.uid, [lat, long]);
    // const userLocation = geoFireRef.get(this.state?.user.uid);
    // console.log('userLocation:', userLocation);
    // const geoQuery = geoFireRef.query({
    //   center: userLocation,
    //   radius: 15, //km
    // });
    // geoQuery.on('key_entered', async (_key, _location, _distance) => {
    //   console.log(
    //     _key + ' at ' + _location + ' is ' + _distance + 'km from the center',
    //   );
    // });
    // firebase
    //   .database()
    //   .ref('messages')
    //   // .limitToLast(2)
    //   .on('child_added', data => {
    //     let messages = [...this.state.messages, data.val()];
    //     this.setState({messages}, () => {
    //       let {latitude, longitude} = [...messages].pop();
    //       this.map.animateToRegion(getRegion(latitude, longitude, 16000));
    //       if (this.marker !== undefined) {
    //         setTimeout(() => {
    //           this.marker.showCallout();
    //         }, 100);
    //       }
    //     });
    //   });
  }

  onChangeText(messageText) {
    this.setState({
      messageText: messageText,
      sendButtonActive: messageText.length > 0,
    });
  }

  handleNearbyLoc() {
    firebase
      .database()
      .ref('messages')
      .once('value', snapshot => {
        // console.log({snapshot: snapshot.val()});
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

  // getUser = uid => {
  //   return firebase.database().ref('users').child(uid).once('value');
  // };

  // getProfiles = async (uid, distance) => {
  //   const geoFireRef = new GeoFire(firebase.database()?.ref('drivers_online'));
  //   const userLocation = await geoFireRef.get(uid);
  //   console.log('userLocation', userLocation);
  //   const geoQuery = geoFireRef.query({
  //     center: userLocation,
  //     radius: distance, //km
  //   });
  //   geoQuery.on('key_entered', async (uid, location, distance) => {
  //     console.log(
  //       uid + ' at ' + location + ' is ' + distance + 'km from the center',
  //     );
  //     const user = await this.getDriver(uid);
  //     console.log({user: user.val()});
  //     const profiles = [...this.state.profiles, user.val()];
  //     this.setState({profiles});
  //   });
  // };

  async getDriver(uid) {
    await firebase
      .database()
      .ref('drivers')
      .child('drivers_online')
      .once('value', snapshot => {
        snapshot.forEach(childSnapshot => {
          var childKey = childSnapshot.key;
          var childData = childSnapshot.val();

          console.log({
            _childKey: childKey,
            // _childData: childData,
            _g: childData.g,
            _l: childData.l,
            _fcmDeviceTokens: childData.fcmDeviceTokens,
          });
        });
      });
    // const driversInfo = await firebase
    //   .database()
    //   .ref('drivers')
    //   .child('drivers_online')
    //   .once('value');
    // console.log({driversInfo: driversInfo});
    // driversInfo.forEach(childSnapshot => {
    //   var childKey = childSnapshot.key;
    //   var childData = childSnapshot.val();

    //   console.log({
    //     childKey: childKey,
    //     childData: childData,
    //     g: childData.g,
    //     l: childData.l,
    //   });
    // });

    // return driversInfo;
  }

  updateDriverLocation = async radius => {
    // let {status} = await Permissions.askAsync(Permissions.LOCATION);
    let status = await locationPermission();
    console.log({status: status});
    if (status === 'granted') {
      // let location = await Location.getCurrentPositionAsync({});

      this.setState({
        latitude: this.context.currentPosition?.latitude,
        longitude: this.context.currentPosition?.longitude,
        error: null,
      });

      const {coordinate} = this.state;
      const {routeCoordinates, distanceTravelled} = this.state;
      const {latitude, longitude} = this.state.watchedPosition;

      const newCoordinate = {
        latitude,
        longitude,
      };

      console.log({newCoordinate});

      if (Platform.OS === 'android') {
        if (this.marker) {
          this.marker.animateMarkerToCoordinate(newCoordinate, 16000);
          // this.marker._component.animateMarkerToCoordinate(newCoordinate, 500);
        }
      } else {
        coordinate.timing(newCoordinate).start();
      }

      this.setState({
        latitude,
        longitude,
        routeCoordinates: routeCoordinates?.concat([newCoordinate]),
        distanceTravelled: distanceTravelled + this.calcDistance(newCoordinate),
        prevLatLng: newCoordinate,
      });

      // let location = await getCurrentLocation();
      // console.log({_thisLoc: location});
      // this.setState({
      //   location: {
      //     latitude: location.latitude,
      //     longitude: location.longitude,
      //   },
      // });

      // this.map.animateToRegion(getRegion(latitude, longitude, 16000));

      // add to firebase db ref
      const geoFireRef = new GeoFire(
        firebase.database()?.ref('drivers').child('drivers_online'),
      );
      // const geoFireRef = new GeoFire(
      //   firebase.database().ref(`drivers/${this.state?.user?.uid}/online`),
      // );
      console.log({geoFireRef: geoFireRef});
      console.log({_user: this.state?.user});
      console.log({_uid: this.state.user?.uid});
      // console.log('updating geofire data for', user.uid);
      const userLocation_ = await geoFireRef.get(this.state.user?.uid);
      console.log({_userLocation: userLocation_});
      if (!userLocation_) {
        return null;
      }

      const geoQuery = geoFireRef.query({
        center: userLocation_,
        radius: 10, //km
      });

      // const {key_, loc, _dist} = geoQuery.on('key_entered');
      geoQuery.on('key_entered', async (_key, _location, _distance) => {
        console.log(
          _key + ' at ' + _location + ' is ' + _distance + 'km from the center',
        );
        console.log({_location: _location});
        firebase
          .database()
          .ref('drivers')
          .child('drivers_online')
          .on('value', snapshot => {
            // if (snapshot.exists()) {}
            // console.log({snapshot: snapshot.val()});
            let drivers = [...this.state.drivers, snapshot.val()];
            let driversNearby = [...this.state.driversNearby, _location];
            console.log({
              // drivers: drivers,
              // coord_g: drivers[0].g,
              // lat: drivers[0].l[0],
              // lng: drivers[0].l[1],
              // driversNearby: driversNearby[0],
              driversNearby_lat: driversNearby[0][0],
              driversNearby_lng: driversNearby[0][1],
            });
            this.setState({drivers, driversNearby}, () => {
              // let {latitude, longitude} = [...drivers].pop();
              // let latitude = drivers[0].l[0];
              // let longitude = drivers[0].l[1];
              let latitude = driversNearby[0][0];
              let longitude = driversNearby[0][1];
              console.log({lat: latitude, lng: longitude});

              // this.map.animateToRegion(getRegion(latitude, longitude, 16000));

              if (this.marker !== undefined) {
                setTimeout(() => {
                  this.marker.showCallout();
                }, 100);
              }
            });
          });
        // this.setState({_location});
        // const driversNearby = [this.state.driversNearby, _location];
        // this.setState({driversNearby}, () => {
        // let {latitude, longitude} = [...drivers].pop();
        // let latitude = nearbyDrivers[0].l[0];
        // let longitude = nearbyDrivers[0].l[1];
        // this.map.animateToRegion(getRegion(latitude, longitude, 16000));
        // if (this.marker !== undefined) {
        //   setTimeout(() => {
        //     this.marker.showCallout();
        //   }, 100);
        // }
        // });
      });
    }
  };

  calcDistance = newLatLng => {
    const {prevLatLng} = this.state;
    return haversine(prevLatLng, newLatLng) || 0;
  };

  requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Location Access Permission',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      console.log({cameraPerm: granted});
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  render() {
    // console.log({props: this.props.user});
    const {ageRangeValues, distanceValue, online} = this.state;

    // return (
    //   <View style={styles.container}>
    //     {/* <View style={styles.profile}>
    //       <CircleImage facebookID={id} size={120} />
    //       <Text style={{fontSize: 20}}>{'first_name'}</Text>
    //       <Text style={{fontSize: 15, color: 'darkgrey'}}>{'bio'}</Text>
    //     </View> */}
    //     <View style={styles.label}>
    //       <Text>Distance</Text>
    //       <Text style={{color: 'darkgrey'}}>{distanceValue}km</Text>
    //     </View>
    //     <Slider
    //       style={{width: 200, height: 40}}
    //       minimumValue={0}
    //       maximumValue={1}
    //       minimumTrackTintColor="#FFFFFF"
    //       maximumTrackTintColor="#000000"
    //     />
    //     {/* <Slider
    //       min={1}
    //       max={30}
    //       values={distanceValue}
    //       onValuesChange={val => this.setState({distanceValue: val})}
    //     /> */}
    //     <View style={styles.label}>
    //       <Text>Age Range</Text>
    //       <Text style={{color: 'darkgrey'}}>{ageRangeValues.join('-')}</Text>
    //     </View>
    //     {/* <Slider
    //       min={18}
    //       max={70}
    //       values={ageRangeValues}
    //       onValuesChange={val => this.setState({ageRangeValues: val})}
    //     /> */}
    //   </View>
    // );

    return (
      <View style={journeystyles.container}>
        {/* <View style={styles.inputWrapper}>
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
        </View> */}
        <MapView
          ref={ref => (this.map = ref)}
          style={journeystyles.map}
          initialRegion={getRegion(4.860831, 7.341129, 160000)}
          showsMyLocationButton={true}
          showsUserLocation={true}
          zoomControlEnabled={true}>
          {/* {this.state.driversNearby.map((geo, index) => {
            // console.log({geo: geo});
          })} */}
          {this.state.driversNearby.map((geom, index) => {
            // console.log({lat: geom.l[0], lng: geom.l[1]});
            console.log({geom: geom});
            // console.log({index: index});
            // console.log({message: message});
            // let {latitude, longitude, text, timestamp} = geom;

            return (
              <>
                <Marker
                  ref={ref => (this.marker = ref)}
                  key={index}
                  identifier={'marker_' + index}
                  image={carMarker}
                  // coordinate={{latitude: 4.3, longitude: 7.5}}
                  coordinate={{latitude: geom[0], longitude: geom[1]}}>
                  {/* coordinate={{latitude: geom[0], longitude: geom[1]}}> */}
                  <Callout>
                    <View>
                      {/* <Text>{text}</Text>
    <Text style={{color: '#999'}}>
      {moment(timestamp).fromNow()}
    </Text> */}
                    </View>
                  </Callout>
                </Marker>
                {/* <Polyline
                  coordinates={this.state.routeCoordinates}
                  strokeWidth={5}
                /> */}
                <Marker.Animated
                  ref={marker => {
                    this.marker = marker;
                  }}
                  coordinate={this.state.coordinate}>
                  <Image source={carMarker} />
                </Marker.Animated>
              </>
            );
          })}
        </MapView>
        {this.context && (
          <View>
            <View style={journeystyles.modalView}>
              <View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={journeystyles.riderName}>
                    {this.state.riderUserName}
                  </Text>
                  <Text style={journeystyles.riderName}>
                    {this.state.rideDuration}
                  </Text>
                  {/* <Text style={styles.riderName}>
                    {this.state.riderPhoneNumber}
                  </Text> */}
                  <View style={{marginRight: 10}}>
                    <MaterialCommunityIcons.Button
                      name="phone-dial"
                      size={15}
                      backgroundColor="beige"
                      color="green"
                      onPress={() => {}}
                    />
                  </View>
                </View>
                <View style={journeystyles.rideTags}>
                  <Text style={journeystyles.rideTagText}>🚖 To: </Text>
                  <Text style={journeystyles.rideDestText}>
                    {this.state.destinationMsg}
                  </Text>
                </View>
                <View style={journeystyles.rideTags}>
                  <Text style={journeystyles.rideTagText}>🚖 From: </Text>
                  <Text style={journeystyles.rideDestText}>
                    {this.state.pickupMsg}
                  </Text>
                </View>
                <LinearGradient
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  colors={['green', 'gold', 'green']}
                  style={journeystyles.gradArrived}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({isLoading: true});
                      // setIsLoading(true);
                      // !isOnline ? goOnline() : goOffline();
                    }}
                    style={journeystyles.btnArrived}>
                    <Text style={_styles.signUpTxt}>Arrived</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>

              {/* <Text style={{alignContent: 'center'}}>Jonny</Text> */}
            </View>
          </View>
        )}
      </View>
    );
  }
}

export const journeystyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopColor: theme.COLORS.DARK_PURPLE,
    borderWidth: 2,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    // backgroundColor: 'beige',
    // backgroundColor: theme.COLORS.BACKGROUND,
    // paddingBottom: '5%',
  },
  btnJourneyBox: {
    // marginTop: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // width: Dimensions.get('screen').width,
  },
  btnJourney: {
    // paddingHorizontal: 40,
    // paddingVertical: 10,
    // width: 150,
    width: Dimensions.get('screen').width * 0.78,
    height: 52,
    borderRadius: 30,
    margin: 20,
    alignSelf: 'center',
    top: 12,
  },
  tag: {
    marginRight: 8,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: 'white',
    // borderBottomColor: 'beige',
    // borderTopColor: 'beige',
    borderWidth: 1,
  },
  tagText: {
    fontSize: 15,
    lineHeight: 18,
    fontFamily: 'Lato-Regular',
    color: theme.COLORS.DARK_PURPLE,
    // textTransform: 'uppercase',
  },
  riderName: {
    fontSize: 26,
    lineHeight: 38,
    fontFamily: 'Lato-Regular',
    color: theme.COLORS.DARK_PURPLE,
    // textTransform: 'uppercase',
    // textAlign: 'justify',
    // alignSelf: 'flex-end',
    // alignItems: 'stretch',
    alignContent: 'space-around',
    marginHorizontal: 52,
  },
  rideDestText: {
    fontSize: 14,
    lineHeight: 18,
    textDecorationLine: 'underline',
    // fontFamily: 'Lato-Regular',
    // color: 'green',
    textAlign: 'center',
    fontFamily: 'Moon-Bold',
    // textTransform: 'uppercase',
    color: theme.COLORS.DARK_BLUE,
    // paddingLeft: 22,
    // textTransform: 'uppercase',
  },
  rideTags: {
    marginTop: 9,
    // marginBottom: 9,
    flexDirection: 'row',
    // alignItems: 'stretch',
  },
  rideTag: {
    marginRight: 8,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10.5,
    backgroundColor: 'green',
  },
  rideTagText: {
    fontSize: 18,
    lineHeight: 18,
    fontFamily: 'Lato-Regular',
    color: theme.COLORS.GREY,
    paddingLeft: 22,
    // textTransform: 'uppercase',
  },
  mainDivider: {
    // height: 0.2,
    backgroundColor: theme.COLORS.PURPLE,
  },
  gradArrived: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    // marginHorizontal: 20,
    top: Dimensions.get('screen').height * 0.06,
  },
  btnArrived: {
    alignItems: 'center',
    // justifyContent: 'center',
    // paddingRight: 152,
    backmainDividergroundColor: 'white',
    width: Dimensions.get('screen').width * 0.58,
    // height: Dimensions.get('screen').height * 0.06,
    // top: Dimensions.get('screen').height * 0.06,
    // height: 52,
    borderRadius: 30,
    margin: 2.5,
    opacity: 0.8,
    // marginHorizontal: 20,
  },
  modalView: {
    top: Dimensions.get('screen').height * 0.25,
    width: Dimensions.get('screen').width,
    // height: Dimensions.get('screen').height * 0.16,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopColor: theme.COLORS.DARK_PURPLE,
    // borderBottomColor: '#f9d29d',
    backgroundColor: 'beige',
    // opacity: 0.7,
    borderWidth: 4,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  switch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 20,
    // width: Dimensions.get('screen').width * 0.56,
  },
  slider: {
    // flex: 1,
    paddingTop: '120%',
    height: 40,
    width: Dimensions.get('screen').width * 0.56,
    // alignItems: 'stretch',
    // justifyContent: 'center',
    // marginLeft: 20,
    // marginRight: 20,
  },
  inputLabel: {
    fontSize: 10,
    lineHeight: 11.5,
    fontFamily: 'Moon-Bold',
    textTransform: 'uppercase',
    color: theme.COLORS.DARK_BLUE,
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
    // borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#ccc',
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
