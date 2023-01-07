import React, {createContext, useEffect, useState} from 'react';
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
import {getCurrentLocation, locationPermission} from '../helper/helperFunction';
import {Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [currentAddress, setCurrentAddress] = useState('');
  const [deviceToken, setDeviceToken] = useState('');
  const [driversToken, setDriversToken] = useState('');
  const [driverStatus, setDriverStatus] = useState(null);
  const [geoFireRiderRef, setGeoRiderRef] = useState('');
  const [authRiderRef, setAuthRiderRef] = useState('');
  const [profilePhone, setProfileNumber] = useState(null);
  const [profileName, setProfileName] = useState(null);

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
          setCurrentAddress(_location);
          // pickupRef.current?.setAddressText(_location);

          // setOrigin({
          //   location: location,
          //   description: _location,
          // });

          // console.log('location_:', _location);
        })
        .catch(error => console.warn(error));
    } else {
      console.log('Permission not grantedd!');
    }
  };

  // useEffect(() => {
  //   const fetchDriverInfo = async () => {
  //     await firebase
  //       .database()
  //       .ref('drivers')
  //       .child('drivers_Id')
  //       .once('value', snapshot => {
  //         if (snapshot.exists()) {
  //           snapshot.forEach(childSnapshot => {
  //             var childKey = childSnapshot.key;
  //             var childData = childSnapshot.val();
  //             console.log({_fcmDeviceTokens: childData?.fcmDeviceTokens});
  //             // console.log({userIdToken: childData?.userIdToken});
  //             // console.log({online: childData?.online});
  //             setDriversToken(childData?.fcmDeviceTokens);
  //             setDriverStatus(childData?.online);
  //             // _deviceToken.push(childData?.userIdToken);
  //             // driversDetails.push(childData);
  //           });
  //         }
  //       });
  //   };

  //   fetchDriverInfo();
  // });

  useEffect(() => {
    requestPermission();
    messaging()
      .getToken()
      .then(async token => {
        console.log('_token=>>>', token);

        if (token && user) {
          setDeviceToken(token);
          //update user realtime fdb with device token and userIdToken
          // await user?.updateProfile({
          //   displayName: profileName,
          //   phoneNumber: profilePhone,
          // });
          const _authRiderOnlineRef = firebase
            .database()
            .ref(`riders/riders_online/${user?.uid}`);
          _authRiderOnlineRef &&
            _authRiderOnlineRef.update({
              fcmDeviceTokens: token,
              userIdToken: await user?.getIdToken(true),
              uid: await user?.uid,
              // newJourneyDID: 'none',
              // requestStatus: 'none',
            });
        }
      });
  }, [authRiderRef, profileName, profilePhone, user]);

  const requestPermission = async () => {
    return Platform.OS === 'ios' && (await messaging().requestPermission());
  };
  const registerDevice = async () => {
    return (
      Platform.OS === 'ios' &&
      (await firebase.messaging().registerDeviceForRemoteMessages())
    );
  };

  useEffect(() => {
    if (user) {
      const _authRiderRef = firebase
        .database()
        .ref()
        .child(`riders/${user.uid}`);

      const _authDriverRef = firebase.database().ref().child('drivers');

      const _geoFireRef = new GeoFire(
        firebase.database().ref('riders/riders_online'),
      );

      setAuthRiderRef(_authRiderRef);
      setGeoRiderRef(_geoFireRef);
    }
    _getCurrentPosition();
  }, [user]);

  // console.log({
  //   currentPosition_: currentPosition,
  //   currentAddress_: currentAddress,
  //   deviceToken_: deviceToken,
  // });
  console.log({profileName: profileName});
  return (
    <AuthContext.Provider
      value={{
        user,
        error,
        setUser,
        setProfileName,
        setProfileNumber,
        isLoading,
        currentAddress,
        currentPosition,
        deviceToken,
        // driverStatus,
        // driversToken,
        authRiderRef,
        geoFireRiderRef,
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
          // carModel,
          // carColour,
          // carReg,
        ) => {
          setIsLoading(true);
          try {
            // Get the auth instance for the default app:

            await firebase
              .auth()
              .createUserWithEmailAndPassword(email, password)
              .then(async credential => {
                console.log({credential: credential});
                setUser(credential?.user);
                setProfileNumber(phone);
                setProfileName(userName);
                credential.user.sendEmailVerification();
                await credential.user?.updateProfile({
                  displayName: userName,
                  phoneNumber: phone,
                });
                const authRiderMap = {
                  phone: phone,
                  userName: userName,
                  email: email,
                  createdAt: firebase.database().getServerTime(),
                  userImg: null,
                  id: credential?.user.uid,
                };

                requestPermission();
                const uid = credential?.user.uid;

                const newRiderRef = firebase
                  .database()
                  .ref()
                  .child(`riders/${uid}`);

                const _authRiderOnlineRef = firebase
                  .database()
                  .ref(`riders/riders_online/${uid}`);

                _authRiderOnlineRef.set({
                  userName: userName,
                  phoneNumber: phone,
                });

                newRiderRef.set(authRiderMap);
                newRiderRef.update({
                  fcmDeviceTokens: deviceToken,
                  userIdToken: await credential.user?.getIdToken(true),
                  newJourneyDID: 'none',
                  requestStatus: 'none',
                });
                setAuthRiderRef(newRiderRef);
                // newDriverVehicleRef.set(vehicleMap);
                setIsLoading(false);
                console.log(credential.user, 'Rider Registered successfully!');
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
