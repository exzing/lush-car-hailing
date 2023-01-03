import React, {createContext, useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/database';
import Geocoder from 'react-native-geocoding';
import {keys} from '../env';
import {
  getCurrentLocation,
  locationPermission,
  getPosition,
} from '../helper/helperFunction';
import messaging from '@react-native-firebase/messaging';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [position, setPosition] = useState(0);
  const [currentAddress, setCurrentAddress] = useState('');
  const [deviceToken, setDeviceToken] = useState('');
  const [authRiderRef, setAuthRiderRef] = useState('');
  const [profilePhone, setProfileNumber] = useState(null);
  const [profileName, setProfileName] = useState(null);
  const [geoFireRiderRef, setGeoRiderRef] = useState('');

  const _getCurrentPosition = async () => {
    Geocoder.init(keys.GOOGLE_MAP_APIKEY); // initialized with a valid API key
    const status = await locationPermission();
    if (status === 'granted') {
      const location = await getCurrentLocation();
      const _position = await getPosition();
      console.log('Location Permission granted!');
      console.log({currentLoc: location});
      // setCoordinates(loc);
      setCurrentPosition(location);
      setPosition(_position);
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
      console.log('Permission not grantedd!');
    }
  };

  useEffect(() => {
    const retrieveToken = async () => {
      const status = await messaging().requestPermission();
      console.log({status: status});
      if (status === 1) {
        messaging()
          .getToken()
          .then(async token => {
            console.log('_token=>>>', token);

            if (token && user) {
              setDeviceToken(token);

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
      } else {
        console.log('Error occured while requesting ios messaging permission!');
      }
    };
    // const iosMsgPermission = requestPermission();
    // console.log({iosMsgPermission: iosMsgPermission});

    retrieveToken();
  }, [authRiderRef, profileName, profilePhone, user]);

  useEffect(() => {
    if (user) {
      const _authRiderRef = firebase
        .database()
        .ref()
        .child(`riders/${user.uid}`);

      setAuthRiderRef(_authRiderRef);
    }
    _getCurrentPosition();
  }, [user]);

  console.log({Tpos: position, Tloc: currentPosition});
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        error,
        setProfileName,
        setProfileNumber,
        isLoading,
        currentAddress,
        currentPosition,
        deviceToken,
        position,
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

        //   try {
        //     await auth()
        //       .createUserWithEmailAndPassword(email, password)
        //       .then(() => {
        //         //Once the user creation has happened successfully, we can add the currentUser into firestore
        //         //with the appropriate details.
        //         // firestore()
        //         //   .collection('users')
        //         //   .doc(auth().currentUser.uid)
        //         firebase
        //           .database()
        //           .ref()
        //           .set({
        //             fname: '',
        //             lname: '',
        //             email: email,
        //             createdAt: firebase.database().getServerTime,
        //             userImg: null,
        //           })
        //           //ensure we catch any errors at this stage to advise us if something does go wrong
        //           .catch(error => {
        //             console.log(
        //               'Something went wrong with added user to firestore: ',
        //               error,
        //             );
        //           });
        //       })
        //       //we need to catch the whole sign up process if it fails too.
        //       .catch(error => {
        //         console.log('Something went wrong with sign up: ', error);
        //       });
        //   } catch (e) {
        //     console.log(e);
        //   }
        // },
        register: async (email, password, userName, phone) => {
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

                // requestPermission();
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
            console.log(e);
          }
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};
