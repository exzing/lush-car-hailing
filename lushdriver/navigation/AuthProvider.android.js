/* eslint-disable no-unused-vars */
import React, {createContext, useEffect, useRef, useState} from 'react';
import auth from '@react-native-firebase/auth';
import GeoFire from 'geofire';
import database from '@react-native-firebase/database';
import {firebase} from '@react-native-firebase/database';
import Geocoder from 'react-native-geocoding';
import {keys} from '../env';
import {
  getCurrentLocation,
  locationPermission,
  WatchLocation,
} from '../helper/location';
import {Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage, {
  useAsyncStorage,
} from '@react-native-async-storage/async-storage';
import {initializeWallet} from '../datacenter/initialize';

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
  const [driversIdRef, setDriversIdRef] = useState(null);
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
  const [remoteMsg, setRemoteMsg] = useState('');
  const [pushedMessage, setPushedMessage] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [cFootprint, setCarbonFP] = useState('0');

  const _watchId = useRef(null);

  const {getItem, setItem} = useAsyncStorage('@remotemsgs');

  const _getCurrentPosition = async () => {
    Geocoder.init(keys.GOOGLE_MAP_APIKEY); // initialized with a valid API key
    const status = await locationPermission();
    if (status === 'granted') {
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
        .catch(_error => _error);
    } else {
    }
  };

  // initialize wallet and check internet
  useEffect(() => {
    initializeWallet()
      .then(data => {
        console.log({dataa: data});
        setWallet(data);
      })
      .catch(err => err);
  }, []);

  // drivers_online
  useEffect(() => {
    if (user) {
      const _driverRef = firebase.database().ref('drivers');

      const _driverOnlineRef = firebase
        .database()
        .ref('drivers')
        .child('drivers_online');

      const _driverIdRef = firebase
        .database()
        .ref('drivers')
        .child('drivers_Id');

      const _driverVehicleRef = firebase
        .database()
        .ref(`drivers/vehicle_details/${user?.uid}`);

      _driverVehicleRef.once('value', snapshot => {
        if (snapshot.exists()) {
          let snap_data = snapshot.val();
          let carbonFP = snap_data?.carbon_FP;
          console.log({snap_data});
          console.log({carbonFP});
          setCarbonFP(carbonFP);
        }
      });

      const _riderOnlineRef = firebase.database().ref('riders');
      const _geoFireRef = new GeoFire(_driverOnlineRef);

      setAuthDriverRef(_driverRef);
      setGeoDriverRef(_geoFireRef);
      setDriverOnlineRef(_driverOnlineRef);
      setRiderOnlineRef(_riderOnlineRef);
      setDriversIdRef(_driverIdRef);
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
  }, [deviceToken, user]);

  //remoteMsg
  useEffect(() => {
    const subscribeOnMsg = messaging().onMessage(async remoteMessage => {
      await messaging().subscribeToTopic('alldrivers');
      await messaging().subscribeToTopic('allriders');
      await messaging().subscribeToTopic('allusers');

      console.log({remoteMessage});
      setPushedMessage(remoteMessage);
      // const formatted_msg = JSON.stringify(remoteMessage)
      let message_body = remoteMessage.notification.body;
      let message_title = remoteMessage.notification.title;
      let message_pickup = remoteMessage.data.pickup;
      let message_dest = remoteMessage.data.destination;
      let message_pickupGeo = remoteMessage.data.pickupGeo;
      let message_destGeo = remoteMessage.data.destinationGeo;
      let message_fare = remoteMessage.data.fare;
      let message_phone = remoteMessage.data.riderPhone;
      let message_name = remoteMessage.data.riderName;
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
      setRiderPhoneNumber(message_phone);
      setRiderUserName(message_name);
    });

    return () => subscribeOnMsg();
  }, []);

  const requestPermission = async () => {
    return Platform.OS === 'ios' && (await messaging().requestPermission());
  };

  const registerDevice = async () => {
    return (
      Platform.OS === 'ios' &&
      (await firebase.messaging().registerDeviceForRemoteMessages())
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        error,
        setUser,
        isNotifyDialogue,
        pickupMsg,
        destinationMsg,
        isLoading,
        currentAddress,
        currentPosition,
        deviceToken,
        authDriverRef,
        driverOnlineRef,
        driversIdRef,
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
        pushedMessage,
        wallet,
        cFootprint,
        login: async (email, password) => {
          setIsLoading(true);
          try {
            await auth()
              .signInWithEmailAndPassword(email, password)
              .then(async val => {
                setUser(val.user);
                setIsLoading(false);
              })
              .catch(err => {
                setError(err.code);
                setIsLoading(false);
              });
          } catch (err) {}
        },

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
          carbonFP,
        ) => {
          setIsLoading(true);
          try {
            // Get the auth instance for the default app:

            await firebase
              .auth()
              .createUserWithEmailAndPassword(email, password)
              .then(async credential => {
                const uid = credential?.user.uid;
                setUser(credential.user);
                setProfileNumber(phone);
                setProfileName(userName);
                setCarbonFP(carbonFP);
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

                const authVehicleMap = {
                  car_type: carType,
                  car_color: carColour,
                  car_number: carReg,
                  car_fuel: carFuel,
                  carMMY: carMMY,
                  carbon_FP: carbonFP,
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
              })
              .catch(err => {
                setError(err.code);
                setIsLoading(false);
              });
          } catch (err) {
            setError(err.code);
          }
        },
        logout: async () => {
          try {
            await auth().signOut();
          } catch (e) {}
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};
