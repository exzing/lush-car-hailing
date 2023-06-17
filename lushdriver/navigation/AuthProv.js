import React, {
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import auth from '@react-native-firebase/auth';
import GeoFire from 'geofire';
import database, {firebase} from '@react-native-firebase/database';
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
// import {serverTimestamp} from 'firebase/firestore';
import moment from 'moment';
import {serverTimestamp} from 'firebase/database';
import {initializeWallet} from '../datacenter/initialize';
import NetInfo from '@react-native-community/netinfo';
import {
  useWallet,
  useCreateWallet,
  useIsConnected,
} from '@nice-xrpl/react-xrpl';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [currentAddress, setCurrentAddress] = useState('');
  const [deviceToken, setDeviceToken] = useState('');
  const [geoFireDriverRef, setGeoDriverRef] = useState('');
  const [authDriverRef, setAuthDriverRef] = useState('');
  const [authDriverVehicleRef, setAuthDriverVehicleRef] = useState('');
  const [driverOnlineRef, setDriverOnlineRef] = useState(null);
  const [driversIdRef, setDriversIdRef] = useState(null);
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
  const [pushedMessage, setPushedMessage] = useState(null);
  const [wallet, setWallet] = useState(null);
  // const [carbonFP, setCarbonFP] = useState('0');

  const _watchId = useRef(null);

  const _getCurrentPosition = async () => {
    Geocoder.init(keys.GOOGLE_MAP_APIKEY); // initialized with a valid API key
    const status = await locationPermission();
    if (status === 'granted') {
      console.log('Location Permission granted!');
      const location = await getCurrentLocation();
      console.log({currLocation: location});
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
  // console.log({connectionStatus});
  // console.log({
  //   time1: moment(firebase.database.ServerValue.TIMESTAMP),
  //   time2: serverTimestamp().toMillis(),
  // });

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

      const _riderOnlineRef = firebase.database().ref('riders');
      const _geoFireRef = new GeoFire(_driverOnlineRef);

      setAuthDriverRef(_driverRef);
      setGeoDriverRef(_geoFireRef);
      setDriverOnlineRef(_driverOnlineRef);
      setDriversIdRef(_driverIdRef);
      setRiderOnlineRef(_riderOnlineRef);
    }
    _getCurrentPosition();
  }, [user]);

  // initialize wallet and check internet
  useEffect(() => {
    initializeWallet()
      .then(data => {
        console.log({dataa: data});
        setWallet(data);
      })
      .catch(err => err);
  }, []);
  // riders_online

  useEffect(() => {
    firebase
      .database()
      .ref('riders')
      // .child('riders_online')
      .once('value', snapshot => {
        if (snapshot.exists()) {
          const data = [snapshot.val()];
          console.log({riders_online: data});
          snapshot.forEach(childSnap => {
            const childData = childSnap.val();

            // setRiderPhoneNumber(childData?.phoneNumber);
            // setRiderUserName(childData?.userName);
          });
        }
      });
  }, []);

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

  // rideRequest
  useEffect(() => {
    firebase
      .database()
      .ref('riders')
      .child('rideRequest')
      .once('value', snapshot => {
        if (snapshot.exists()) {
          const data = [snapshot.val()];
          console.log({riderRequests: data});
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

  //token
  useEffect(() => {
    requestPermission().then(permission => {
      permission &&
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
          });
    });
  }, [deviceToken, profilePhone, user, profileName]);

  const requestPermission = async () => {
    return await messaging().requestPermission();
  };

  const registerDevice = async () => {
    return (
      Platform.OS === 'ios' &&
      (await firebase.messaging().registerDeviceForRemoteMessages())
    );
  };

  const contextValues = useMemo(
    () => ({
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
        // carbonFP,
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
              setUser(credential?.user);
              setProfileNumber(phone);
              setProfileName(userName);
              credential?.user.sendEmailVerification();
              await credential.user?.updateProfile({
                displayName: userName,
                phoneNumber: phone,
              });
              const authDriverMap = {
                phone: phone,
                userName: userName,
                email: email,
                createdAt: moment(firebase.database.ServerValue.TIMESTAMP),
                userImg: null,
                id: uid,
                fcmDeviceTokens: deviceToken,
                userIdToken: await credential.user?.getIdToken(true),
                newJourneyDID: 'none',
                requestStatus: 'none',
              };

              const _authDriverRef = firebase.database().ref(`drivers/${uid}`);
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
                // carbon_FP: carbonFP,
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
                email: email,
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
        } catch (err) {
          setError(err.code);
        }
      },
      logout: async () => {
        try {
          await auth().signOut();
        } catch (e) {
          console.log({logout_error: e});
        }
      },
    }),
    [
      authDriverRef,
      currentAddress,
      currentPosition,
      destinationAddr,
      destinationGeoMsg,
      destinationMsg,
      deviceToken,
      distanceMsg,
      driverOnlineRef,
      driversIdRef,
      durationMsg,
      error,
      fareMsg,
      geoFireDriverRef,
      isLoading,
      isNotifyDialogue,
      pickupAddr,
      pickupGeoMsg,
      pickupMsg,
      pushedMessage,
      rideDestination,
      rideDistance,
      rideDuration,
      rideFare,
      rideLocation,
      riderOnlineRef,
      riderPhoneNumber,
      riderUserName,
      user,
      wallet,
    ],
  );
  return (
    <AuthContext.Provider value={contextValues}>
      {children}
    </AuthContext.Provider>
  );

  // return (
  //   <AuthContext.Provider
  //     value={{
  //       user,
  //       error,
  //       setUser,
  //       setIsNotifyDialogue,
  //       setProfileName,
  //       setProfileNumber,
  //       isNotifyDialogue,
  //       pickupMsg,
  //       destinationMsg,
  //       isLoading,
  //       currentAddress,
  //       currentPosition,
  //       watchedPosition,
  //       deviceToken,
  //       authDriverRef,
  //       driverOnlineRef,
  //       riderOnlineRef,
  //       geoFireDriverRef,
  //       riderPhoneNumber,
  //       riderUserName,
  //       rideDuration,
  //       rideFare,
  //       rideDistance,
  //       rideDestination,
  //       rideLocation,
  //       destinationAddr,
  //       pickupAddr,
  //       destinationGeoMsg,
  //       pickupGeoMsg,
  //       fareMsg,
  //       distanceMsg,
  //       durationMsg,
  //       watchID,
  //       login: async (email, password) => {
  //         setIsLoading(true);
  //         try {
  //           await auth()
  //             .signInWithEmailAndPassword(email, password)
  //             .then(async val => {
  //               setUser(val.user);
  //               setIsLoading(false);
  //               console.log(val.user, 'logged in successfully!');
  //             })
  //             .catch(err => {
  //               setError(err);
  //               setIsLoading(false);
  //               console.log({error_message: err.message});
  //               console.log({error_code: err.code});
  //             });
  //         } catch (error) {
  //           console.log({error: error});
  //         }
  //       },
  //       // register(userName, pword, _phone, _email);
  //       register: async (
  //         email,
  //         password,
  //         userName,
  //         phone,
  //         carType,
  //         carColour,
  //         carReg,
  //         carFuel,
  //         carMMY,
  //       ) => {
  //         setIsLoading(true);
  //         try {
  //           // Get the auth instance for the default app:

  //           await firebase
  //             .auth()
  //             .createUserWithEmailAndPassword(email, password)
  //             .then(async credential => {
  //               console.log({credential: credential});
  //               const uid = credential?.user.uid;
  //               setUser(credential.user);
  //               setProfileNumber(phone);
  //               setProfileName(userName);
  //               credential.user.sendEmailVerification();
  //               await credential.user?.updateProfile({
  //                 displayName: userName,
  //                 phoneNumber: phone,
  //               });
  //               const authDriverMap = {
  //                 phone: phone,
  //                 userName: userName,
  //                 email: email,
  //                 createdAt: firebase.database().getServerTime(),
  //                 userImg: null,
  //                 id: uid,
  //               };

  //               const _authDriverRef = firebase
  //                 .database()
  //                 .ref(`drivers/${uid}`);
  //               // .child(`drivers/${uid}`);

  //               const _authOnlineDriverRef = firebase
  //                 .database()
  //                 .ref(`drivers/drivers_online/${uid}`);

  //               console.log({newUser: user});

  //               const authVehicleMap = {
  //                 car_type: carType,
  //                 car_color: carColour,
  //                 car_number: carReg,
  //                 car_fuel: carFuel,
  //                 carMMY: carMMY,
  //               };

  //               const _authDriverVehicleRef = firebase
  //                 .database()
  //                 .ref(`drivers/vehicle_details/${uid}`);

  //               const _authDriverIdRef = firebase
  //                 .database()
  //                 .ref(`drivers/drivers_Id/${uid}`);

  //               _authDriverIdRef.set({
  //                 userName: userName,
  //                 phoneNumber: phone,
  //                 newJourneyRID: 'none',
  //                 requestStatus: 'none',
  //               });

  //               await _authDriverRef.set(authDriverMap);

  //               setAuthDriverRef(_authDriverRef);

  //               await _authDriverVehicleRef.set(authVehicleMap);
  //               setAuthDriverVehicleRef(_authDriverVehicleRef);
  //               setIsLoading(false);
  //               console.log(credential.user, 'Driver Registered successfully!');
  //             })
  //             .catch(err => {
  //               setError(err);
  //               setIsLoading(false);
  //               console.log({error_message: err.message});
  //               console.log({error_code: err.code});
  //             });
  //         } catch (error) {
  //           if (error.code === 'auth/email-already-in-use') {
  //             console.log('That email address is already in use!');
  //           } else if (error.code === 'auth/invalid-email') {
  //             console.log('That email address is invalid!');
  //           } else {
  //             console.log(error);
  //           }
  //           setError(error.code);
  //           // if (error.code === 'auth/invalid-email') {
  //           //   console.log('That email address is invalid!');
  //           // }
  //           // console.log(error);
  //         }
  //       },
  //       logout: async () => {
  //         try {
  //           await auth().signOut();
  //         } catch (e) {
  //           console.log({logout_error: e});
  //         }
  //       },
  //     }}>
  //     {children}
  //   </AuthContext.Provider>
  // );
};
