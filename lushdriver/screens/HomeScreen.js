import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Platform,
  Button,
  Modal,
  Pressable,
  Dimensions,
  TouchableHighlight,
  Switch,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {keys} from '../env';
// import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Screen from '../components/Screen';
import tw from 'tailwind-react-native-classnames';
// import Geolocation from 'react-native-geolocation-service';
import * as Animatable from 'react-native-animatable';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import {theme} from '../styles/theme';
import {getCurrentLocation, locationPermission} from '../helper/helperFunction';
import Geocoder from 'react-native-geocoding';
import {AuthContext} from '../navigation/AuthProvider';
import messaging from '@react-native-firebase/messaging';
import NotificationService from '../components/NotificationService';
import {DisplayPushNotify} from './DisplayPushNotify';
import RotateAnimation from '../components/RotateAnimation';
import {modalstyles} from '../styles/imageuploadmission';
import GeoFire from 'geofire';
import {firebase} from '@react-native-firebase/database';
import VIForegroundService from '@voximplant/react-native-foreground-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const HomeScreen = ({navigation, route}) => {
  const theme = useTheme();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [text, setText] = useState('');
  const [copySuccess, setCopySuccess] = useState(null);
  const [isEmptyField, setIsEmptyField] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  // const [currentPosition, setCurrentPosition] = useState(0);
  const [initialPickup, setInitialPickup] = useState('');
  const [messages, setMessages] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [isOnlineModalVisible, setIsOnlineModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCancel, setIsCancel] = useState(false);
  const [newDriveRef, setNewDriveRef] = useState('');

  const [forceLocation, setForceLocation] = useState(true);
  const [highAccuracy, setHighAccuracy] = useState(true);
  const [locationDialog, setLocationDialog] = useState(true);
  const [significantChanges, setSignificantChanges] = useState(false);
  const [observing, setObserving] = useState(false);
  const [foregroundService, setForegroundService] = useState(false);
  const [useLocationManager, setUseLocationManager] = useState(false);
  const [location, setLocation] = useState(null);
  const [driverId, setDriverId] = useState(null);
  const [driverUserId, setDriverUserId] = useState(null);
  const [requestStatus, setRequestStatus] = useState(null);
  const [riderId, setRiderId] = useState(null);
  const [rideRequest, setRideRequest] = useState(null);
  const [journeyStatus, setJourneyStatus] = useState(null);

  // authDriverRef,
  // authDriverVehicleRef,
  const {
    user,
    currentPosition,
    authDriverRef,
    geoFireDriverRef,
    deviceToken,
    riderOnlineRef,
  } = useContext(AuthContext);

  const UploadMission = require('../assets/image_upload_mission_test.png');
  const CompanyIcon = require('../assets/ic_launcher_round.png');

  // return (
  //   <ScrollView style={styles.container}>
  //     <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
  //     {/* <View style={styles.sliderContainer}>
  //       <Swiper
  //         autoplay
  //         horizontal={false}
  //         height={200}
  //         activeDotColor="#FF6347">
  //         <View style={styles.slide}>
  //           <Image
  //             source={require('../assets/banners/car-banner1.jpg')}
  //             resizeMode="cover"
  //             style={styles.sliderImage}
  //           />
  //         </View>
  //         <View style={styles.slide}>
  //           <Image
  //             source={require('../assets/banners/car-banner2.jpg')}
  //             resizeMode="cover"
  //             style={styles.sliderImage}
  //           />
  //         </View>
  //         <View style={styles.slide}>
  //           <Image
  //             source={require('../assets/banners/car-banner3.jpg')}
  //             resizeMode="cover"
  //             style={styles.sliderImage}
  //           />
  //         </View>
  //       </Swiper>
  //     </View> */}

  //     <View style={styles.categoryContainer}>
  //       <TouchableOpacity
  //         style={styles.categoryBtn}
  //         onPress={() =>
  //           navigation.navigate('CardListScreen', {title: 'Body Wash'})
  //         }>
  //         <View style={styles.categoryIcon}>
  //           <Ionicons name="car-sport" size={35} color="#FF6347" />
  //         </View>
  //         <Text style={styles.categoryBtnTxt}>Body Wash</Text>
  //       </TouchableOpacity>
  //       <TouchableOpacity
  //         style={styles.categoryBtn}
  //         onPress={() =>
  //           navigation.navigate('CardListScreen', {title: 'Interior Cleansing'})
  //         }>
  //         <View style={styles.categoryIcon}>
  //           <MaterialCommunityIcons
  //             name="car-multiple"
  //             size={35}
  //             color="#FF6347"
  //           />
  //         </View>
  //         <Text style={styles.categoryBtnTxt}>Interior Cleansing</Text>
  //       </TouchableOpacity>
  //       <TouchableOpacity style={styles.categoryBtn} onPress={() => {}}>
  //         <View style={styles.categoryIcon}>
  //           <MaterialCommunityIcons name="car-wash" size={35} color="#FF6347" />
  //         </View>
  //         <Text style={styles.categoryBtnTxt}>Snacks Corner</Text>
  //       </TouchableOpacity>
  //     </View>
  //     <View style={[styles.categoryContainer, {marginTop: 10}]}>
  //       <TouchableOpacity style={styles.categoryBtn} onPress={() => {}}>
  //         <View style={styles.categoryIcon}>
  //           <Fontisto name="hotel" size={35} color="#FF6347" />
  //         </View>
  //         <Text style={styles.categoryBtnTxt}>Hotels</Text>
  //       </TouchableOpacity>
  //       <TouchableOpacity style={styles.categoryBtn} onPress={() => {}}>
  //         <View style={styles.categoryIcon}>
  //           <Ionicons name="md-restaurant" size={35} color="#FF6347" />
  //         </View>
  //         <Text style={styles.categoryBtnTxt}>Dineouts</Text>
  //       </TouchableOpacity>
  //       <TouchableOpacity style={styles.categoryBtn} onPress={() => {}}>
  //         <View style={styles.categoryIcon}>
  //           <MaterialIcons name="expand-more" size={35} color="#FF6347" />
  //         </View>
  //         <Text style={styles.categoryBtnTxt}>Show More</Text>
  //       </TouchableOpacity>
  //     </View>

  //     <View style={styles.cardsWrapper}>
  //       <Text
  //         style={{
  //           alignSelf: 'center',
  //           fontSize: 18,
  //           fontWeight: 'bold',
  //           color: '#333',
  //         }}>
  //         Recently Viewed
  //       </Text>
  //       <View style={styles.card}>
  //         <View style={styles.cardImgWrapper}>
  //           <Image
  //             source={require('../assets/banners/food-banner2.jpg')}
  //             resizeMode="cover"
  //             style={styles.cardImg}
  //           />
  //         </View>
  //         <View style={styles.cardInfo}>
  //           <Text style={styles.cardTitle}>Amazing Food Place</Text>
  //           <StarRating ratings={4} reviews={99} />
  //           <Text style={styles.cardDetails}>
  //             Amazing description for this amazing place
  //           </Text>
  //         </View>
  //       </View>
  //       <View style={styles.card}>
  //         <View style={styles.cardImgWrapper}>
  //           <Image
  //             source={require('../assets/banners/food-banner3.jpg')}
  //             resizeMode="cover"
  //             style={styles.cardImg}
  //           />
  //         </View>
  //         <View style={styles.cardInfo}>
  //           <Text style={styles.cardTitle}>Amazing Food Place</Text>
  //           <StarRating ratings={4} reviews={99} />
  //           <Text style={styles.cardDetails}>
  //             Amazing description for this amazing place
  //           </Text>
  //         </View>
  //       </View>
  //       <View style={styles.card}>
  //         <View style={styles.cardImgWrapper}>
  //           <Image
  //             source={require('../assets/banners/food-banner4.jpg')}
  //             resizeMode="cover"
  //             style={styles.cardImg}
  //           />
  //         </View>
  //         <View style={styles.cardInfo}>
  //           <Text style={styles.cardTitle}>Amazing Food Place</Text>
  //           <StarRating ratings={4} reviews={99} />
  //           <Text style={styles.cardDetails}>
  //             Amazing description for this amazing place
  //           </Text>
  //         </View>
  //       </View>
  //     </View>
  //   </ScrollView>
  // );
  const pickupRef = useRef();
  const destRef = useRef(null);
  const watchId = useRef(null);

  // useEffect(() => {
  //   return () => {
  //     removeLocationUpdates();
  //   };
  // }, [removeLocationUpdates]);

  // useEffect(() => {
  //   getFCMToken();
  //   requestPermission();
  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //     console.log('remoteMessage', JSON.stringify(remoteMessage));
  //     DisplayNotification(remoteMessage);
  //     // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  //   });
  //   return unsubscribe;
  // }, []);

  // const getFCMToken = () => {
  //   messaging()
  //     .getToken()
  //     .then(token => {
  //       console.log('token=>>>', token);
  //     });
  // };

  const requestPermission = async () => {
    const authStatus = await messaging().requestPermission();
  };

  const sendNotification = async () => {
    let notificationData = {
      title: 'NEW RIDE REQUEST',
      // body: 'this is my first notification',
      body: {
        dest: 'Ovu close PHC',
        priority: 'high',
        ride_id: 'cHWhO4o6T9yziFU',
        status: 'done',
      },
      token:
        'cHWhO4o6T9yziFUiHEaxkc:APA91bFWQ68_UpNeqspuNCdMOFEQPYPzYmpsImfuSCSj6ilB9e9iHt9i7Kh4vK5E6tEqSmd5FwbE3g9AFCALk4iEFeFFSygkgF6Ym-XW_bEVZxfmmeIIkFi8vJFEWoYs5GwgPcmxtV2N',
    };
    await NotificationService.sendSingleDeviceNotification(notificationData);
  };

  const sendMultiNotification = async () => {
    let notificationData = {
      title: 'First Multi Device Notification',
      body: 'sending to multiple devices',
      token: [
        'cHWhO4o6T9yziFUiHEaxkc:APA91bFWQ68_UpNeqspuNCdMOFEQPYPzYmpsImfuSCSj6ilB9e9iHt9i7Kh4vK5E6tEqSmd5FwbE3g9AFCALk4iEFeFFSygkgF6Ym-XW_bEVZxfmmeIIkFi8vJFEWoYs5GwgPcmxtV2N',
      ],
    };
    await NotificationService.sendMultiDeviceNotification(notificationData);
  };

  // useEffect(() => {
  //   setMessages([
  //     {
  //       _id: 1,
  //       text: 'Hello developer',
  //       createdAt: new Date(),
  //       user: {
  //         _id: 2,
  //         name: 'React Native',
  //         avatar: 'https://placeimg.com/140/140/any',
  //       },
  //     },
  //   ]);
  // }, []);

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
  }, []);

  const _getCurrentPosition = async () => {
    Geocoder.init(keys.GOOGLE_MAP_APIKEY); // initialized with a valid API key
    const status = await locationPermission();
    if (status === 'granted') {
      const location = await getCurrentLocation();
      console.log('Location Permission granted!');
      console.log({currentLoc: location});
      // setCoordinates(loc);
      setCurrentPosition(location);
      Geocoder.from({
        latitude: location.latitude,
        longitude: location.longitude,
      })
        .then(addressJson => {
          const _location = addressJson.results[0].formatted_address;
          setInitialPickup(_location);
          pickupRef.current?.setAddressText(_location);

          setOrigin({
            location: location,
            description: _location,
          });
        })
        .catch(error => console.warn(error));
    } else {
      console.log('Permission not grantedd!');
    }
  };

  // console.log({currentPosition_: currentPosition});

  const setInitialAddr = async () => {
    if (!currentPosition) return;
    // pickupRef?.current.setAddressText(currentPosition.);
    // Geocoder.init(keys.GOOGLE_MAP_APIKEY); // use a valid API key
    // console.log({Geocoder: Geocoder});
    console.log({currentPosition: currentPosition});
    // Geocoder.from({
    //   latitude: currentPosition.latitude,
    //   longitude: currentPosition.longitude,
    // })
    //   .then(json => {
    //     var location = json.results[0].geometry.location;
    //     console.log('location_', location);
    //   })
    //   .catch(error => console.warn(error));

    // location object
    // Geocoder.from({
    //   latitude: currentPosition.latitude,
    //   longitude: currentPosition.longitude,
    // }).then(addressJson => {
    //   // const status = addressJson;
    //   console.log({addressJson:addressJson})
    //   // if (!addressJson) return;
    //   console.log({status: addressJson.status});
    //   if (addressJson && addressJson.status === 'OK') {
    //     console.log({
    //       _addressJson: addressJson.results[0].formatted_address,
    //       _addressComp: addressJson.results[0].address_components[0],
    //     });
    //     // const initialPickup = addressJson.results[0].formatted_address;
    //     // pickupRef.current?.setAddressText(initialPickup);
    //   }

    //   setOrigin({
    //     latitude: currentPosition.latitude,
    //     longitude: currentPosition.longitude,
    //   });
    // });

    console.log({refText_: pickupRef.current?.getAddressText()});
  };

  // useEffect(() => {
  //   const subscribeOnMsg = messaging().onMessage(async remoteMessage => {
  //     await messaging().subscribeToTopic('alldrivers');
  //     await messaging().subscribeToTopic('allriders');
  //     await messaging().subscribeToTopic('allusers');
  //     // Get the message body
  //     let message_body = remoteMessage.notification.body;

  //     // Get the message title
  //     let message_title = remoteMessage.notification.title;

  //     // Get message image
  //     let avatar = remoteMessage.notification.android.imageUrl;

  //     // Append the message to the current messages state
  //     setMessages(messages =>
  //       GiftedChat.append(messages, {
  //         _id: Math.round(Math.random() * 1000000),
  //         text: message_body,
  //         createdAt: new Date(),
  //         user: {
  //           _id: 2,
  //           name: 'PartyB',
  //           avatar: avatar,
  //         },
  //       }),
  //     );
  //     // Show an alert to the user
  //     alert(message_title, message_body);
  //     console.log({message_title: message_title});
  //   });

  //   return subscribeOnMsg;
  // }, [messages]);

  // useEffect(() => {
  //   _getCurrentPosition();
  //   // ref.current?.setAddressText('');
  // }, []);

  // Clear modal style after 5 sec.

  //modal timeout
  // useEffect(() => {
  //   if (!isOnline) {return null;}

  //   const timeout = setTimeout(() => {
  //     setIsOnline(false);
  //     if (isCancel === false) {
  //       setIsCancel(true);
  //     } else {
  //       setIsCancel(false);
  //     }
  //   }, 5000);

  //   return () => clearTimeout(timeout);
  // });

  const ModalApp = () => {
    const [modalVisible, setModalVisible] = useState(false);
    return (
      <View style={_styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <View style={_styles.centeredView}>
            <View style={_styles.modalView}>
              <Text style={_styles.modalText}>Hello World!</Text>
              <Pressable
                style={[_styles.button, _styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={_styles.textStyle}>Hide Modal</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <Pressable
          style={[_styles.button, _styles.buttonOpen]}
          onPress={() => setModalVisible(true)}>
          <Text style={_styles.textStyle}>Show Modal</Text>
        </Pressable>
      </View>
    );
  };

  // const storeData = async value => {
  //   try {
  //     const onlineStorage = await AsyncStorage.getItem('@online_key');

  //     if (onlineStorage) {
  //       console.log({onlineStorage: onlineStorage, isOnline: isOnline});
  //       setIsOnline(onlineStorage === 'true' ? false : true);
  //       // setIsOnline(!onlineStorage);
  //     } else {
  //       AsyncStorage.setItem('@online_key', `${isOnline}`);
  //       // setIsOnline(true);
  //       console.log({onlineStorage_: onlineStorage, isOnline_: isOnline});
  //     }
  //   } catch (e) {
  //     // saving error
  //   }
  // };

  useEffect(() => {
    // if (!isEmptyField) return;

    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 15000);

    return () => clearTimeout(timeout);
  }, [isEmptyField]);

  useEffect(() => {
    // const _riderOnlineRef = firebase.database().ref('riders');
    if (riderOnlineRef) {
      riderOnlineRef.on('value', snap => {
        const data = snap.val();
        // console.log({rider_snap: data});
        snap?.forEach(async childSnapshot => {
          var childKey = childSnapshot?.key;
          var childData = childSnapshot?.val();
          // console.log({RchildKey: childKey});
          // console.log({rideRequest: childData.rideRequest});
          // console.log({Remail: childData.email});
          // console.log({childData: childData});
          // console.log({riderUserIdToken: childData.userIdToken});
          // console.log({driver_id: childData?.rideRequest?.driver_id});
          setRiderId(childData?.userIdToken);
          // setDriverId(childData?.rideRequest?.driver_id);
          // setRideRequest(childData?.rideRequest);
        });
      });
    }
  }, [riderOnlineRef]);

  useEffect(() => {
    if (authDriverRef) {
      const _authDriverRef = firebase.database().ref(`drivers/${user?.uid}`);
      const _authDriverIdRef = firebase
        .database()
        .ref(`drivers/drivers_Id/${user?.uid}`);

      _authDriverRef.on('value', async snap => {
        const data = snap.val();
        const newJourney = data?.newJourneyRID;
        // const _driverUserId = snap.val().userIdToken;
        // const _requestStatus = snap.val().requestStatus;
        // setDriverUserId(_driverUserId);
        // setRequestStatus(_requestStatus);
        // console.log({data: data});
        // console.log({newJourney: newJourney}); //..E38A
        // console.log({riderId: riderId});
        if (
          newJourney === 'waiting...' ||
          newJourney === riderId
          // newJourney === 'accepted!'
        ) {
          setJourneyStatus(newJourney);
          // alert('waiting...');
          setIsOnline(true);
          await _authDriverIdRef.update({
            online: true,
          });
        } else {
          // alert('none');
          setIsOnline(false);
          await _authDriverIdRef.update({
            online: false,
          });
        }
      });
    }
  }, [authDriverRef, isOnline, riderId, user]);

  // console.log({_riderId: riderId});

  const toggleAvailability = async () => {
    const onlineStorage = await AsyncStorage.getItem('@online_key');
    AsyncStorage.setItem('@online_key', `${isOnline}`);
    setIsOnline(previousState => !previousState);
    // console.log({onlineStorage: onlineStorage, isOnline: isOnline});
  };

  // useEffect(() => {
  //   console.log({
  //     authDRef: authDriverRef,
  //     geoFireDriverRef: geoFireDriverRef,
  //     deviceToken: deviceToken,
  //     riderOnlineRef: riderOnlineRef,
  //   });
  // });

  const goOnline = async () => {
    if (currentPosition && authDriverRef && geoFireDriverRef && user) {
      const _authDriverRef = firebase.database().ref(`drivers/${user.uid}`);
      const _authDriverIdRef = firebase
        .database()
        .ref(`drivers/drivers_Id/${user?.uid}`);
      console.log('updating geofire data for', user.uid);

      const lat = currentPosition.latitude;
      const long = currentPosition.longitude;
      console.log({lat: lat, long: long, useruid: user.uid});

      await geoFireDriverRef.set(user.uid, [lat, long]).then(value => {
        console.log({value: value});
      });
      await _authDriverIdRef.update({
        online: true,
      });
      await _authDriverRef
        .update({
          newJourneyRID: 'waiting...',
          requestStatus: 'none',
        })
        .then(value => {
          console.log({_value: value});
          if (value === null) {
            // setIsOnline(true);
            setIsOnline(previousState => !previousState);
            setModalVisible(!modalVisible);
            // setIsLoading(false);
          }
        });
      setIsLoading(false);
      Toast.showWithGravity(
        ` 🤝 Thank You ${user.displayName}. Expect a ride request now!`,
        Toast.LONG,
        Toast.TOP,
      );
      // navigation.navigate('MyMap', {
      //   screen: 'Map',
      //   params: {currentPosition, isOnline},
      // });
    }
    // getLocationUpdates();
  };
  const goOffline = async () => {
    if (currentPosition && authDriverRef && geoFireDriverRef && user) {
      const _authDriverRef = firebase.database().ref(`drivers/${user.uid}`);
      const _authDriverIdRef = firebase
        .database()
        .ref(`drivers/drivers_Id/${user?.uid}`);
      await geoFireDriverRef.remove(user.uid, ref => {
        console.log('0ffRef:', ref);
        // if (ref === null) {
        //   setIsLoading(false);
        //   setIsOnline(false);
        //   setModalVisible(!modalVisible);
        // }
      });
      await _authDriverIdRef.update({
        online: false,
      });
      await _authDriverRef
        .update({
          newJourneyRID: 'none',
          requestStatus: 'none',
        })
        .then(offValue => {
          console.log({offValue: offValue});
          if (offValue === null) {
            setIsLoading(false);
            // setIsOnline(false);
            setIsOnline(previousState => !previousState);
            setModalVisible(!modalVisible);
          }
        });
      console.log({isOnline: isOnline});
    }
  };

  // const getLocationUpdates = async () => {
  //   if (!currentPosition) {
  //     return;
  //   }
  //   console.log({geocurrentPosition: currentPosition});

  //   if (Platform.OS === 'android' && foregroundService) {
  //     await startForegroundService();
  //   }

  //   setObserving(true);

  //   watchId.current = Geolocation.watchPosition(
  //     position => {
  //       setLocation(position);
  //       console.log({geoposition: position});
  //     },
  //     error => {
  //       setLocation(null);
  //       console.log(error);
  //     },
  //     {
  //       accuracy: {
  //         android: 'high',
  //         ios: 'best',
  //       },
  //       enableHighAccuracy: highAccuracy,
  //       distanceFilter: 0,
  //       interval: 5000,
  //       fastestInterval: 2000,
  //       // forceRequestLocation: forceLocation,
  //       // forceLocationManager: useLocationManager,
  //       // showLocationDialog: locationDialog,
  //       // useSignificantChanges: significantChanges,
  //     },
  //   );
  // };

  // const removeLocationUpdates = useCallback(() => {
  //   if (watchId.current !== null) {
  //     stopForegroundService();
  //     Geolocation.clearWatch(watchId.current);
  //     watchId.current = null;
  //     setObserving(false);
  //   }
  // }, [stopForegroundService]);

  // const startForegroundService = async () => {
  //   if (Platform.Version >= 26) {
  //     await VIForegroundService.createNotificationChannel({
  //       id: 'locationChannel',
  //       name: 'Location Tracking Channel',
  //       description: 'Tracks location of user',
  //       enableVibration: false,
  //     });
  //   }

  //   return VIForegroundService.startService({
  //     channelId: 'locationChannel',
  //     id: 420,
  //     title: appConfig.displayName,
  //     text: 'Tracking location updates',
  //     icon: 'ic_launcher',
  //   });
  // };

  // const stopForegroundService = useCallback(() => {
  //   VIForegroundService.stopService().catch(err => err);
  // }, []);

  return (
    <Screen style={tw`bg-black h-full`}>
      <StatusBar backgroundColor="#000000" barStyle="light-content" />
      <View style={tw`p-5`}></View>
      <View style={styles.bottomCard}>
        <Animatable.View animation="fadeInUpBig" style={[styles.footer, {}]}>
          <View style={styles.switchcontainer}>
            <Switch
              trackColor={{false: 'grey', true: '#6536FF'}}
              thumbColor={isOnline ? '#f9d29d' : 'grey'}
              // trackColor={{false: '#767577', true: '#81b0ff'}}
              // thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleAvailability}
              value={isOnline}
            />
            <Text style={{color: isOnline ? '#f9d29d' : 'white'}}>
              {isOnline ? 'Online' : 'Offline'}{' '}
            </Text>
          </View>
          {isLoading === true && <RotateAnimation />}
          <View>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(true);
              }}>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                // colors={['#FACC6B', 'green', '#f9d29d', 'green', 'green']}
                colors={[
                  '#f9d29d',
                  '#f9d29d',
                  '#6536FF',
                  '#329BFF',
                  '#4C64FF',
                  '#6536FF',
                  '#8000FF',
                ]}
                style={modalstyles.instagramButton}>
                <Text style={modalstyles.stakeButtonText}>Availability</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                // alert('Modal has been closed.');
                setModalVisible(!modalVisible);
              }}>
              <Text style={_styles.modalTitle}>
                {!isOnline
                  ? 'Go Online and Start Riding?'
                  : 'Go Offline and Stop Riding?'}
              </Text>
              <View style={_styles.modalInfo}>
                <LinearGradient
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  colors={['green', 'gold', 'green']}
                  style={_styles.btnSignUpLG}>
                  <TouchableOpacity
                    onPress={() => {
                      setIsLoading(true);
                      !isOnline ? goOnline() : goOffline();
                    }}
                    style={_styles.signUpButton}>
                    <Text style={_styles.signUpTxt}>Yes</Text>
                  </TouchableOpacity>
                </LinearGradient>
                <LinearGradient
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  colors={['purple', 'gold', 'purple']}
                  // colors={['#7CFFCB', '#7CFFCB', 'green', '#7CFFCB', 'green']}
                  style={_styles.btnSignUpLG}>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(!modalVisible);
                      setIsLoading(false);
                    }}
                    style={_styles.signUpButton}>
                    <Text style={_styles.signUpTxt}>No</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </Modal>
          </View>

          <LinearGradient
            colors={['black', '#f9d29d', '#f9d29d']}
            start={{x: 0.7, y: 0}}
            // end={{x: 1, y: 0.7}}
            // start={{x: 0.5, y: 0}}
            // colors={['#191919', '#f9d29d', 'red']}
            style={styles.modal}>
            <DisplayPushNotify />
          </LinearGradient>
        </Animatable.View>
        <Image
          resizeMode="stretch"
          source={CompanyIcon}
          style={styles.infoImage}
        />
      </View>
    </Screen>
  );
};

export default HomeScreen;

export const _styles = StyleSheet.create({
  modalInfo: {
    top: Dimensions.get('screen').width * 1.09,
    paddingVertical: 110,
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
  modalTitle: {
    fontSize: 16,
    // lineHeight: 54,
    paddingTop: 22,
    top: Dimensions.get('screen').width * 1.09,
    // fontFamily: 'Lato-Bold',
    color: theme.COLORS.PURPLE,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  modalBtn: {
    width: Dimensions.get('screen').width * 0.28,
    height: 52,
    borderRadius: 30,
    margin: 20,
    // backgroundColor: 'transparent',
    // alignSelf: 'baseline',
  },
  btnNo: {
    width: Dimensions.get('screen').width * 0.28,
    height: 52,
    borderRadius: 30,
    margin: 20,
  },
  btNoGradient: {
    height: 44,
    width: 300,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  btnYes: {
    width: Dimensions.get('screen').width * 0.28,
    height: 52,
    borderRadius: 30,
    margin: 20,
    opacity: 0.7,
  },
  btnNoText: {
    fontSize: 18,
    // fontFamily: 'Lato-Bold',
    color: theme.COLORS.WHITE,
    textTransform: 'uppercase',
    marginTop: 10,
    // justifyContent: 'center',
    // alignItems: 'center',
    textAlign: 'center',
  },
  btnYesText: {
    fontSize: 18,
    // fontFamily: 'Lato-Bold',
    color: theme.COLORS.WHITE,
    textTransform: 'uppercase',
    marginTop: 10,
    // justifyContent: 'center',
    // alignItems: 'center',
    textAlign: 'center',
  },
  signUpTxt: {
    fontSize: 18,
    // fontFamily: 'Lato-Bold',
    color: theme.COLORS.BLACK,
    textTransform: 'uppercase',
  },
  btnSignUpLG: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    marginHorizontal: 20,
  },
  btnAvailability: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FACC6B',
    // backgroundColor: '#f9d29d',
    width: Dimensions.get('screen').width * 0.38,
    height: Dimensions.get('screen').height * 0.06,
    // height: 52,
    borderRadius: 30,
    // margin: 2.5,
    marginLeft: 122,
    marginTop: 12,
    opacity: 0.8,
  },
  signUpButton: {
    // margin: 1,
    // width: 200,
    // borderRadius: 10,
    // paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    width: Dimensions.get('screen').width * 0.38,
    height: Dimensions.get('screen').height * 0.06,
    // height: 52,
    borderRadius: 30,
    margin: 2.5,
    opacity: 0.8,
    // marginHorizontal: 20,
  },
  centeredView: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    marginTop: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'white',
    // width: Dimensions.get('screen').width * 0.88,
    // height: Dimensions.get('screen').height * 0.78,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    // height: Dimensions.get('screen').height * 0.28,
  },
  modalView: {
    flexDirection: 'row',
    // paddingRight: 120,
    backgroundColor: 'white',
    borderRadius: 20,
    top: Dimensions.get('screen').height * 0.58,

    // width: Dimensions.get('screen').width * 0.88,
    // padding: 35,
    // alignItems: 'center',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    height: 50,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'gold',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginTop: 15,
    textAlign: 'center',
  },
});
const styles = StyleSheet.create({
  container: {
    flex: 0,
    borderRadius: 16,
    paddingLeft: 10,
    paddingRight: 10,
    borderColor: 'gold',
  },
  switch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 20,
    // width: Dimensions.get('screen').width * 0.56,
  },
  switchcontainer: {
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButton: {
    top: 12,
  },
  companyInfoContainer: {
    marginTop: '-8%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: theme.APP_COLOR_1,
  },
  companyInfoContentContainer: {
    paddingBottom: '10%',
  },
  info: {
    paddingVertical: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoImage: {
    width: 80,
    height: 80,
    // marginRight: 22,
    // paddingTop: 30,
    top: 102,
    alignSelf: 'center',
  },
  compantTitle: {
    fontSize: 16,
    lineHeight: 24,
    // fontFamily: 'Lato-Bold',
    color: theme.COLORS.BACKGROUND,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    marginBottom: '70%',
    paddingHorizontal: '40%',
  },
  textResultDescription: {
    fontSize: 10,
    marginTop: 2,
    color: 'red',
  },
  tags: {
    marginTop: 9,
    flexDirection: 'row',
  },
  tag: {
    marginRight: 8,
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 10.5,
    backgroundColor: theme.COLORS.DARK_PURPLE,
  },
  tagText: {
    fontSize: 12,
    lineHeight: 14,
    // fontFamily: 'Lato-Bold',
    color: theme.COLORS.WHITE,
    textTransform: 'uppercase',
  },
  mainDivider: {
    height: 2,
    backgroundColor: theme.APP_COLOR_2,
  },
  rewardContainer: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    justifyContent: 'center',
  },
  rewardTitle: {
    fontSize: 16,
    lineHeight: 14,
    // fontFamily: 'Lato-Bold',
    color: theme.COLORS.WHITE,
    textTransform: 'uppercase',
  },
  rewardItem: {
    flexWrap: 'wrap',
    marginTop: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardCover: {
    height: '50%',
    width: '100%',
    borderRadius: 16,
    marginTop: '70%',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: '190%',
    bottom: 70,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    // fontFamily: 'Lato-Bold',
    color: 'red',
    textTransform: 'uppercase',
    // fontWeight: 'bold',
  },
  icon: {
    textAlign: 'center',
    fontSize: 40,
    fontWeight: 'bold',
    // width: '50%',
    // height: '50%',
    paddingBottom: 74,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modal: {
    // width: '100%',
    // height: '100%',
    // marginTop: '50%',
    height: deviceHeight,
    width: deviceWidth,
    marginTop: '90%',
    position: 'absolute',
    top: 70,
    left: 0,
    backgroundColor: '#f9d29d',
    // colors={['#191919', '#f9d29d']}
    justifyContent: 'center',
    borderRadius: 20,
    // flexDirection: 'row',
  },
  linearGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    width: '50%',
    height: '50%',
    marginTop: '50%',
  },
  bottomModalView: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalView: {
    // margin: 20,
    backgroundColor: 'gold',
    borderRadius: 20,
    // padding: 50,
    height: 200,
    width: 380,
    paddingTop: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textInput: {
    fontSize: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f9d29d',
    backgroundColor: 'grey',
    color: 'white',
  },
  row: {
    // {['#191919', '#f9d29d']}
    backgroundColor: 'grey',
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderRadius: 5,
    paddingLeft: 5,

    // color: 'gold'
  },
  containerResultRow: {
    flex: 1,
    height: 55,
    justifyContent: 'center',
    paddingHorizontal: 15,
    backgroundColor: 'white',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    // borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
    // fontFamily: 'Lato-Bold',
  },
  textInput_: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    paddingTop: 9,
    color: '#05375a',
  },
  sliderContainer: {
    height: 200,
    width: '90%',
    marginTop: 10,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 8,
  },

  wrapper: {},

  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: 8,
  },
  sliderImage: {
    height: '100%',
    width: '100%',
    alignSelf: 'center',
    borderRadius: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    marginTop: 25,
    marginBottom: 10,
  },
  categoryBtn: {
    flex: 1,
    width: '30%',
    marginHorizontal: 0,
    alignSelf: 'center',
  },
  categoryIcon: {
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: 70,
    height: 70,
    backgroundColor: '#fdeae7' /* '#FF6347' */,
    borderRadius: 50,
  },
  categoryBtnTxt: {
    alignSelf: 'center',
    marginTop: 5,
    color: '#de4f35',
  },
  cardsWrapper: {
    marginTop: 20,
    width: '90%',
    alignSelf: 'center',
  },
  card: {
    height: 100,
    marginVertical: 10,
    flexDirection: 'row',
    shadowColor: '#999',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  cardImgWrapper: {
    flex: 1,
  },
  cardImg: {
    height: '100%',
    width: '100%',
    alignSelf: 'center',
    borderRadius: 8,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
  },
  cardInfo: {
    flex: 2,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#fff',
  },
  cardTitle: {
    fontWeight: 'bold',
  },
  cardDetails: {
    fontSize: 12,
    color: '#444',
  },
});

const styles_ = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'gold',
  },
  bottomModalView: {
    justifyContent: 'flex-end',
    margin: 20,
  },
  button: {
    width: '50%',
    borderRadius: 10,
    borderWidth: 2,
    borderStyle: 'solid',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'limegreen',
  },
  buttonText: {
    fontWeight: 'bold',
  },
  modal: {
    width: '100%',
    height: '100%',
    marginTop: '50%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'solid',
    backgroundColor: 'gold',
  },
  modalText: {
    fontSize: 20,
  },
});
