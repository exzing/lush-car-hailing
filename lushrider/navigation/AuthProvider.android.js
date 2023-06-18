import React, {createContext, useEffect, useMemo, useState} from 'react';
import auth from '@react-native-firebase/auth';
import GeoFire from 'geofire';
import database, {firebase} from '@react-native-firebase/database';
import Geocoder from 'react-native-geocoding';
import {keys} from '../env';
import {getCurrentLocation, locationPermission} from '../helper/helperFunction';
import {Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import moment from 'moment';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [signedInRider, setSignedInRider] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [currentAddress, setCurrentAddress] = useState('');
  const [deviceToken, setDeviceToken] = useState('');
  const [geoFireRiderRef, setGeoRiderRef] = useState('');
  const [authRiderRef, setAuthRiderRef] = useState('');
  const [profilePhone, setProfileNumber] = useState(null);
  const [profileName, setProfileName] = useState(null);
  const [dvehicleDetails, setDVehicleDetails] = useState(null);

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
        .catch(err => console.warn(err));
    } else {
      console.log('Permission not grantedd!');
    }
  };

  //isUserSignedIn?

  useEffect(() => {
    const isUserSignedIn = () => {
      firebase.auth().onAuthStateChanged(signedIn => {
        if (signedIn) {
          setSignedInRider(signedIn);
        } else {
          //No user is signed in
          setSignedInRider(null);
        }
      });
    };
    isUserSignedIn();
  }, []);

  useEffect(() => {
    const getVehicleDetails = async () => {
      let details;
      const vehicleDetailsRef = firebase
        .database()
        .ref('drivers/vehicle_details');

      vehicleDetailsRef.on('value', vdetailsSnap => {
        // console.log({snapshot: onlineDriversSnap});

        if (vdetailsSnap.exists()) {
          vdetailsSnap.forEach(childSnap => {
            const childData = childSnap.val();
            // console.log({vDetails: childData});
            // const model = childData?.carMMY[0];
            // const make = childData?.carMMY[1];
            // const year = childData?.carMMY[2];
            // const color = childData?.car_color;
            // const carFuel = childData?.car_fuel;
            // const carNumber = childData?.car_number;
            // const carType = childData?.car_type;

            details = {
              model: childData?.carMMY[0],
              make: childData?.carMMY[1],
              year: childData?.carMMY[2],
              color: childData?.car_color,
              carFuel: childData?.car_fuel,
              carNumber: childData?.car_number,
              carType: childData?.car_type,
            };
            setDVehicleDetails(details);
          });
        }
      });

      return details;
    };

    getVehicleDetails();
  }, []);

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
    requestPermission().then(permission => {
      permission &&
        messaging()
          .getToken()
          .then(async token => {
            console.log(token);

            if (token && signedInRider) {
              setDeviceToken(token);
              //update user realtime fdb with device token and userIdToken
              // await signedInRider?.updateProfile({
              //   displayName: profileName,
              //   phoneNumber: profilePhone,
              // });
              const _authRiderOnlineRef = firebase
                .database()
                .ref(`riders/riders_Id/${signedInRider?.uid}`);
              _authRiderOnlineRef.update({
                fcmDeviceTokens: token,
                userIdToken: await signedInRider?.getIdToken(true),
                uid: await signedInRider?.uid,
              });
            }
          })
          .catch(err => console.log(err));
    });
  }, [profileName, profilePhone, signedInRider]);

  // console.log({
  //   dvehicleDetails,
  // });

  const requestPermission = async () => {
    return await messaging().requestPermission();
  };
  const registerDevice = async () => {
    if (!firebase.messaging().isDeviceRegisteredForRemoteMessages) {
      await firebase.messaging().registerDeviceForRemoteMessages();
    }
  };

  useEffect(() => {
    if (signedInRider) {
      const _authRiderRef = firebase
        .database()
        .ref(`riders/${signedInRider.uid}`);

      const _authDriverRef = firebase.database().ref().child('drivers');

      const _geoFireRef = new GeoFire(
        firebase.database().ref('riders/riders_Id'),
      );

      setAuthRiderRef(_authRiderRef);
      setGeoRiderRef(_geoFireRef);
      // setAuthdriveRef(_authDriverRef)
    }
    _getCurrentPosition();
  }, [signedInRider]);

  const contextValues = useMemo(
    () => ({
      signedInRider,
      error,
      setSignedInRider,
      setProfileName,
      setProfileNumber,
      isLoading,
      currentAddress,
      currentPosition,
      deviceToken,
      authRiderRef,
      geoFireRiderRef,
      dvehicleDetails,
      login: async (email, password) => {
        setIsLoading(true);
        try {
          await auth()
            .signInWithEmailAndPassword(email, password)
            .then(async val => {
              setSignedInRider(val.user);

              setIsLoading(false);
            })
            .catch(err => {
              setError(err?.code);
              setIsLoading(false);
            });
        } catch (err) {}
      },
      register: async (email, password, userName, phone) => {
        setIsLoading(true);
        try {
          // Get the auth instance for the default app:

          await firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(async credential => {
              setSignedInRider(credential?.user);
              setProfileNumber(phone);
              setProfileName(userName);
              credential.user.sendEmailVerification();
              // await credential.user?.updateProfile({
              //   displayName: userName,
              //   phoneNumber: phone,
              // });
              const authRiderMap = {
                phone: phone,
                userName: userName,
                email: email,
                createdAt: moment(firebase.database.ServerValue.TIMESTAMP),
                userImg: null,
                id: credential?.user.uid,
                fcmDeviceTokens: deviceToken,
                userIdToken: await credential.user?.getIdToken(true),
                newJourneyDID: 'none',
                requestStatus: 'none',
              };

              requestPermission();
              const uid = credential?.user.uid;

              const newRiderRef = firebase.database().ref(`riders/${uid}`);

              const _authRidersIdRef = firebase
                .database()
                .ref(`riders/riders_Id/${uid}`);

              // _authRidersIdRef.set({
              //   userName: userName,
              //   phoneNumber: phone,
              // });

              newRiderRef.set(authRiderMap);
              // newRiderRef.push(authRiderMap)
              // newRiderRef.update({
              //   fcmDeviceTokens: deviceToken,
              //   userIdToken: await credential.user?.getIdToken(true),
              //   newJourneyDID: 'none',
              //   requestStatus: 'none',
              // });
              setAuthRiderRef(newRiderRef);
              // newDriverVehicleRef.set(vehicleMap);
              setIsLoading(false);
              console.log(credential.user, 'Rider Registered successfully!');
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
        } catch (e) {
          // console.log({logout_error: e});
        }
      },
    }),
    [
      authRiderRef,
      currentAddress,
      currentPosition,
      deviceToken,
      dvehicleDetails,
      error,
      geoFireRiderRef,
      isLoading,
      signedInRider,
    ],
  );

  return (
    <AuthContext.Provider
      value={contextValues}
      // value={{
      //   user,
      //   error,
      //   setUser,
      //   setProfileName,
      //   setProfileNumber,
      //   isLoading,
      //   currentAddress,
      //   currentPosition,
      //   deviceToken,
      //   authRiderRef,
      //   geoFireRiderRef,
      //   login: async (email, password) => {
      //     setIsLoading(true);
      //     try {
      //       await auth()
      //         .signInWithEmailAndPassword(email, password)
      //         .then(async val => {
      //           setUser(val.user);

      //           setIsLoading(false);
      //           // console.log(val.user, 'logged in successfully!');
      //         })
      //         .catch(err => {
      //           setError(err?.code);
      //           setIsLoading(false);
      //         });
      //     } catch (err) {}
      //   },
      //   // register(userName, pword, _phone, _email);
      //   register: async (
      //     email,
      //     password,
      //     userName,
      //     phone,
      //     // carModel,
      //     // carColour,
      //     // carReg,
      //   ) => {
      //     setIsLoading(true);
      //     try {
      //       // Get the auth instance for the default app:

      //       await firebase
      //         .auth()
      //         .createUserWithEmailAndPassword(email, password)
      //         .then(async credential => {
      //           // console.log({credential: credential});
      //           setUser(credential?.user);
      //           setProfileNumber(phone);
      //           setProfileName(userName);
      //           credential.user.sendEmailVerification();
      //           await credential.user?.updateProfile({
      //             displayName: userName,
      //             phoneNumber: phone,
      //           });
      //           const authRiderMap = {
      //             phone: phone,
      //             userName: userName,
      //             email: email,
      //             createdAt: firebase.database().getServerTime(),
      //             userImg: null,
      //             id: credential?.user.uid,
      //           };

      //           requestPermission();
      //           const uid = credential?.user.uid;

      //           const newRiderRef = firebase
      //             .database()
      //             .ref()
      //             .child(`riders/${uid}`);

      //           const _authRiderOnlineRef = firebase
      //             .database()
      //             .ref(`riders/riders_Id/${uid}`);

      //           _authRiderOnlineRef.set({
      //             userName: userName,
      //             phoneNumber: phone,
      //           });

      //           newRiderRef.set(authRiderMap);
      //           newRiderRef.update({
      //             fcmDeviceTokens: deviceToken,
      //             userIdToken: await credential.user?.getIdToken(true),
      //             newJourneyDID: 'none',
      //             requestStatus: 'none',
      //           });
      //           setAuthRiderRef(newRiderRef);
      //           // newDriverVehicleRef.set(vehicleMap);
      //           setIsLoading(false);
      //           console.log(credential.user, 'Rider Registered successfully!');
      //         })
      //         .catch(err => {
      //           setError(err.code);
      //           setIsLoading(false);
      //         });
      //     } catch (err) {
      //       setError(err.code);
      //     }
      //   },
      //   logout: async () => {
      //     try {
      //       await auth().signOut();
      //     } catch (e) {
      //       // console.log({logout_error: e});
      //     }
      //   },
      // }}
    >
      {children}
    </AuthContext.Provider>
  );
};
