import React, {createContext, useEffect, useRef, useState} from 'react';
import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
// import {GoogleSignin} from '@react-native-community/google-signin';
// import {LoginManager, AccessToken} from 'react-native-fbsdk';
// import firebase from '@react-native-firebase/app';
import GeoFire from 'geofire';
import database from '@react-native-firebase/database';
import {firebase} from '@react-native-firebase/database';
import Geocoder from 'react-native-geocoding';
import {keys} from '../env';
import {
  getCurrentLocation,
  locationPermission,
  WatchLocation,
} from '../helper/helperFunction';
import {Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import Geolocation from 'react-native-geolocation-service';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [watchedPosition, setWatchedPosition] = useState(undefined);
  const [currentAddress, setCurrentAddress] = useState('');
  const [deviceToken, setDeviceToken] = useState('');
  const [geoFireDriverRef, setGeoDriverRef] = useState('');
  const [authDriverRef, setAuthDriverRef] = useState('');
  const [authDriverVehicleRef, setAuthDriverVehicleRef] = useState('');
  const [driverOnlineRef, setDriverOnlineRef] = useState(null);
  const [riderOnlineRef, setRiderOnlineRef] = useState(null);
  const [profilePhone, setProfileNumber] = useState(null);
  const [profileName, setProfileName] = useState(null);
  const [isNotifyDialogue, setIsNotifyDialogue] = useState(false);
  const [fareMsg, setFareMsg] = useState(null);
  const [distanceMsg, setDistanceMsg] = useState(null);
  const [durationMsg, setDurationMsg] = useState(null);
  const [pickupMsg, setPickupMsg] = useState(null);
  const [destinationMsg, setDestinationMsg] = useState(null);
  const [pickupGeoMsg, setPickupGeoMsg] = useState(null);
  const [destinationGeoMsg, setDestinationGeoMsg] = useState(null);
  const [pickupAddr, setPickupAddr] = useState(null);
  const [destinationAddr, setDestinationAddr] = useState(null);
  const [riderPhoneNumber, setRiderPhoneNumber] = useState(null);
  const [riderUserName, setRiderUserName] = useState(null);
  const [rideDuration, setRideDuration] = useState(0);
  const [rideFare, setRideFare] = useState(0);
  const [rideDistance, setRideDistance] = useState(0);
  const [rideDestination, setRideDestination] = useState(null);
  const [rideLocation, setRideLocation] = useState(null);
  const [watchID, setWatchID] = useState(null);

  const _watchId = useRef(null);

  const _getCurrentPosition = async () => {
    Geocoder.init(keys.GOOGLE_MAP_APIKEY); // initialized with a valid API key
    const status = await locationPermission();
    if (status === 'granted') {
      console.log('Location Permission granted!');
      const location = await getCurrentLocation();
      setCurrentPosition(location);
      Geocoder.from({
        latitude: location.latitude,
        longitude: location.longitude,
      })
        .then(addressJson => {
          const _location = addressJson.results[0].formatted_address;
          setCurrentAddress(_location);
        })
        .catch(error => console.warn(error));
    } else {
    }
  };

  // drivers_online
  useEffect(() => {
    if (user) {
      const _driverRef = firebase.database().ref('drivers');

      const _driverOnlineRef = firebase
        .database()
        .ref('drivers')
        .child('drivers_online');

      const _riderOnlineRef = firebase.database().ref('riders');
      const _geoFireRef = new GeoFire(_driverOnlineRef);

      setAuthDriverRef(_driverRef);
      setGeoDriverRef(_geoFireRef);
      setDriverOnlineRef(_driverOnlineRef);
      setRiderOnlineRef(_riderOnlineRef);
    }
    _getCurrentPosition();
  }, [user]);

  // riders_online
  useEffect(() => {
    firebase
      .database()
      .ref('riders')
      .child('riders_online')
      .once('value', snapshot => {
        if (snapshot.exists()) {
          const data = [snapshot.val()];
          snapshot.forEach(childSnap => {
            const childData = childSnap.val();

            setRiderPhoneNumber(childData?.phoneNumber);
            setRiderUserName(childData?.userName);
          });
        }
      });
  }, []);

  // rideRequest
  useEffect(() => {
    // if (user && deviceToken) {
    firebase
      .database()
      .ref('riders')
      .child('rideRequest')
      .once('value', snapshot => {
        if (snapshot.exists()) {
          const data = [snapshot.val()];
          snapshot.forEach(childSnap => {
            const childData = childSnap.val();

            setRideDuration(childData?.duration);
            setRideFare(childData?.fare);
            setRideDistance(childData?.distance);
            setRideLocation(childData?.location);
            setRideDestination(childData?.destination);
            setDestinationAddr(childData?.destination_address);
            setPickupAddr(childData?.pickup_address);
          });
        }
      });
    // }
  }, [deviceToken, user]);

  //token
  useEffect(() => {
    requestPermission();
    messaging()
      .getToken()
      .then(async token => {
        if (token && user && user?.uid) {
          setDeviceToken(token);
          const _authDriverIdRef = firebase
            .database()
            .ref(`drivers/drivers_Id/${user?.uid}`);

          _authDriverIdRef.update({
            fcmDeviceTokens: token,
            userIdToken: await user?.getIdToken(true),
            uid: await user?.uid,
            // UserName: profileName,
            // phoneNumber: profilePhone,
            // online: 'none',
          });
        }
        const subscribeOnMsg = messaging().onMessage(async remoteMessage => {
          await messaging().subscribeToTopic('alldrivers');
          await messaging().subscribeToTopic('allriders');
          await messaging().subscribeToTopic('allusers');

          // const formatted_msg = JSON.stringify(remoteMessage)
          let message_body = remoteMessage.notification.body;
          let message_title = remoteMessage.notification.title;
          let message_pickup = remoteMessage.data.pickup;
          let message_dest = remoteMessage.data.destination;
          let message_pickupGeo = remoteMessage.data.pickupGeo;
          let message_destGeo = remoteMessage.data.destinationGeo;
          let message_fare = remoteMessage.data.fare;
          let message_distance = remoteMessage.data.distance;
          let message_duration = remoteMessage.data.duration;
          let avatar = remoteMessage.notification.android.imageUrl;

          // Show an alert to the user
          // alert(message_pickup, message_dest);
          setIsNotifyDialogue(true);
          setPickupMsg(message_pickup);
          setDestinationMsg(message_dest);
          setPickupGeoMsg(message_pickupGeo);
          setDestinationGeoMsg(message_destGeo);
          setFareMsg(message_fare);
          setDistanceMsg(message_distance);
          setDurationMsg(message_duration);
        });

        return subscribeOnMsg;
      });
  }, [deviceToken, profilePhone, user, profileName]);

  const requestPermission = async () => {
    return Platform.OS === 'ios' && (await messaging().requestPermission());
  };

  const registerDevice = async () => {
    return (
      Platform.OS === 'ios' &&
      (await firebase.messaging().registerDeviceForRemoteMessages())
    );
  };

  // console.log({
  //   // _watchedPosition: watchedPosition,
  //   // _watchId: _watchId,
  //   currentPosition_: currentPosition,
  //   // currentAddress_: currentAddress,
  //   // authUser: user,
  //   __fareMsg: fareMsg,
  //   __distanceMsg: distanceMsg,
  //   __durationMsg: durationMsg,
  //   __destinationMsg: destinationMsg,
  //   __pickupMsg: pickupMsg,
  //   __destinationGeoMsg: destinationGeoMsg,
  //   __pickupGeoMsg: pickupGeoMsg,
  //   __riderPhoneNumber: riderPhoneNumber,
  //   __riderUserName: riderUserName,
  //   __rideDuration: rideDuration,
  //   __rideFare: rideFare,
  //   __location: rideLocation,
  //   __destination: rideDestination,
  //   __pickupAddr: pickupAddr,
  //   __destinationAddr: destinationAddr,
  //   _isNotifyDialogue: isNotifyDialogue,
  // });

  // console.log({profileName: profileName, profilePhone: profilePhone});
  return (
    <AuthContext.Provider
      value={{
        user,
        error,
        setUser,
        setIsNotifyDialogue,
        setProfileName,
        setProfileNumber,
        isNotifyDialogue,
        pickupMsg,
        destinationMsg,
        isLoading,
        currentAddress,
        currentPosition,
        watchedPosition,
        deviceToken,
        authDriverRef,
        driverOnlineRef,
        riderOnlineRef,
        geoFireDriverRef,
        riderPhoneNumber,
        riderUserName,
        rideDuration,
        rideFare,
        rideDistance,
        rideDestination,
        rideLocation,
        destinationAddr,
        pickupAddr,
        destinationGeoMsg,
        pickupGeoMsg,
        fareMsg,
        distanceMsg,
        durationMsg,
        watchID,
        login: async (email, password) => {
          setIsLoading(true);
          try {
            await auth()
              .signInWithEmailAndPassword(email, password)
              .then(async val => {
                setUser(val.user);
                setIsLoading(false);
                console.log(val.user, 'logged in successfully!');
              })
              .catch(err => {
                setError(err);
                setIsLoading(false);
                console.log({error_message: err.message});
                console.log({error_code: err.code});
              });
          } catch (error) {
            console.log({error: error});
          }
        },
        // register(userName, pword, _phone, _email);
        register: async (
          email,
          password,
          userName,
          phone,
          carType,
          carColour,
          carReg,
          carFuel,
          carMMY,
        ) => {
          setIsLoading(true);
          try {
            // Get the auth instance for the default app:

            await firebase
              .auth()
              .createUserWithEmailAndPassword(email, password)
              .then(async credential => {
                console.log({credential: credential});
                const uid = credential?.user.uid;
                setUser(credential.user);
                setProfileNumber(phone);
                setProfileName(userName);
                credential.user.sendEmailVerification();
                await credential.user?.updateProfile({
                  displayName: userName,
                  phoneNumber: phone,
                });
                const authDriverMap = {
                  phone: phone,
                  userName: userName,
                  email: email,
                  createdAt: firebase.database().getServerTime(),
                  userImg: null,
                  id: uid,
                };

                const _authDriverRef = firebase
                  .database()
                  .ref(`drivers/${uid}`);
                // .child(`drivers/${uid}`);

                const _authOnlineDriverRef = firebase
                  .database()
                  .ref(`drivers/drivers_online/${uid}`);

                console.log({newUser: user});

                const authVehicleMap = {
                  car_type: carType,
                  car_color: carColour,
                  car_number: carReg,
                  car_fuel: carFuel,
                  carMMY: carMMY,
                };

                const _authDriverVehicleRef = firebase
                  .database()
                  .ref(`drivers/vehicle_details/${uid}`);

                const _authDriverIdRef = firebase
                  .database()
                  .ref(`drivers/drivers_Id/${uid}`);

                _authDriverIdRef.set({
                  userName: userName,
                  phoneNumber: phone,
                  newJourneyRID: 'none',
                  requestStatus: 'none',
                });

                await _authDriverRef.set(authDriverMap);

                setAuthDriverRef(_authDriverRef);

                await _authDriverVehicleRef.set(authVehicleMap);
                setAuthDriverVehicleRef(_authDriverVehicleRef);
                setIsLoading(false);
                console.log(credential.user, 'Driver Registered successfully!');
              })
              .catch(err => {
                setError(err);
                setIsLoading(false);
                console.log({error_message: err.message});
                console.log({error_code: err.code});
              });
          } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
              console.log('That email address is already in use!');
            } else if (error.code === 'auth/invalid-email') {
              console.log('That email address is invalid!');
            } else {
              console.log(error);
            }
            setError(error.code);
            // if (error.code === 'auth/invalid-email') {
            //   console.log('That email address is invalid!');
            // }
            // console.log(error);
          }
        },
        logout: async () => {
          try {
            await auth().signOut();
          } catch (e) {
            console.log({logout_error: e});
          }
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};
