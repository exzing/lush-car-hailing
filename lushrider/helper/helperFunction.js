import {showMessage} from 'react-native-flash-message';
import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import NotificationService from '../screens/NotificationService';
import Toast from 'react-native-simple-toast';
import {firebase} from '@react-native-firebase/database';
import {useContext} from 'react';
import {AuthContext} from '../navigation/AuthProvider.android';

export const getCurrentLocation = () =>
  new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        console.log({geoposition: position});
        const cords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          heading: position?.coords?.heading,
        };
        console;
        resolve(cords);
      },
      error => {
        reject(error.message);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 10000},
    );
  });

export const locationPermission = () =>
  new Promise(async (resolve, reject) => {
    if (Platform.OS === 'ios') {
      try {
        const permissionStatus = await Geolocation.requestAuthorization(
          'whenInUse',
        );
        if (permissionStatus === 'granted') {
          return resolve('granted');
        }
        reject('Permission not granted');
      } catch (error) {
        return reject(error);
      }
    }
    return PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    )
      .then(granted => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          resolve('granted');
        }
        return reject('Location Permission denied');
      })
      .catch(error => {
        console.log('Ask Location permission error: ', error);
        return reject(error);
      });
  });

export const _sendNotification = async ({token, data, status}) => {
  if (token !== 'none' && status === true) {
    let response = await NotificationService.sendSingleDeviceNotification(data);

    return response;
  }
};
// export const SendNotification = async ({
//   token,
//   status,
//   data,
//   setIsLoading,
//   setIsSuccess,
//   errormsg,
//   successmsg,
// }) => {
//   const {signedInRider} = useContext(AuthContext);
//   console.log({token, status});
//   if (token !== 'none' && status === true) {
//     // let notificationData = {
//     //   riderPhone: phoneNumber,
//     //   riderName: userName,
//     //   pickup: route.params?.origin?.description,
//     //   destination: route.params?.destination?.description,
//     //   fare: `₦ ${charge && charge.toFixed(0)}`,
//     //   distance: `${distance.toFixed(0)} Km`,
//     //   duration: `${duration.toFixed(0)} min`,
//     //   pickupGeo: {
//     //     latitude: route?.params?.origin?.location?.latitude,
//     //     longitude: route?.params?.origin?.location?.longitude,
//     //   },
//     //   destinationGeo: {
//     //     latitude: route?.params?.destination?.destination?.lat,
//     //     longitude: route?.params?.destination?.destination?.lng,
//     //   },
//     //   body: 'Ride with us lushly',
//     //   title: 'Ride Request Notification!',
//     //   token:
//     //     //retrieve from firebase (recipient)
//     //     driversToken, // recipient deviceToken (retrieve for fdb)
//     // };

//     console.log({data});
//     // setIsLoading(true);
//     await NotificationService.sendSingleDeviceNotification(data)
//       .then(res => {
//         if (res && res.status === 200) {
//           console.log({res});

//           setIsLoading(true);

//           Toast.showWithGravity(successmsg, Toast.LONG, Toast.TOP);
//           setIsSuccess(true);
//           //update riders db
//           const ridersRef = firebase
//             .database()
//             .ref()
//             .child(`riders/${signedInRider?.uid}`);

//           ridersRef.update({
//             orderedRide: 'initiated',
//           });
//         } else {
//           setIsLoading(false);
//           Toast.showWithGravity(errormsg, Toast.LONG, Toast.TOP);
//         }
//       })
//       .catch(error => {
//         setIsLoading(false);
//         Toast.showWithGravity(errormsg, Toast.LONG, Toast.TOP);
//       });
//   }

//   // if (driverStatus === 'none' || driverStatus === 'false') {
//   //   Toast.showWithGravity('Driver is offline!', Toast.LONG, Toast.TOP);
//   //   setIsLoading(false);
//   // }

//   // setIsLoading(false); // if driver accepts
// };

const showError = message => {
  showMessage({
    message,
    type: 'danger',
    icon: 'danger',
  });
};

const showSuccess = message => {
  showMessage({
    message,
    type: 'success',
    icon: 'success',
  });
};

export {showError, showSuccess};
