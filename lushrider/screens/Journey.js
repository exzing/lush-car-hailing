import {firebase} from '@react-native-firebase/database';
import React, {Component, useContext, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {View} from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import MapView, {Marker, PROVIDER_GOOGLE, Camera} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {keys} from '../env';
import {AuthContext} from '../navigation/AuthProvider';
import {calculateFares} from '../utils/EstimateFares';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {getCurrentLocation, locationPermission} from '../helper/helperFunction';
import Animated from 'react-native-reanimated';
import PropTypes from 'prop-types';
import Button from '../components/Button';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {theme} from '../styles/theme';
import ModalActivityIndicator from '../components/ModalActivityIndicator';
import ImageUploadMission from '../components/ImageUploadMission';
import RotateAnimation from '../components/RotateAnimation';
import {modalstyles} from '../styles/imageuploadmission';
import NotificationService from './NotificationService';
import Toast from 'react-native-simple-toast';

const CompanyIcon = require('../assets/ic_launcher_round.png');

const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 37.771707;
const LONGITUDE = -122.4053769;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export const Journey = ({route, navigation}) => {
  const {user, authRiderRef} = useContext(AuthContext);
  const [coordinates, setCoordinates] = useState([
    {
      latitude: 4.3317876,
      longitude: 8.0054812,
    },
    {
      latitude: 4.471707,
      longitude: 8.0053769,
    },
  ]);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [charge, setCharge] = useState(0);
  const [dialogueOpen, setDialogueOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCancel, setIsCancel] = useState(false);
  const [region, setRegion] = useState(0);
  const [position, setPosition] = useState(0);
  const [isSetSuccess, setIsSetSuccess] = useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [rideInfo, setRideInfo] = useState(null);
  const [deviceToken, setDeviceToken] = useState(null);
  const [driverStatus, setDriverStatus] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [driverUID, setDriverUID] = useState(null);
  const [driverTokenID, setDriverTokenID] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [userName, setUserName] = useState(null);

  const mapRef = useRef();

  // get params
  useEffect(() => {
    if (!route.params) return;
    const getParams = () => {
      console.log({route_params: route.params});
      console.log({origin_desc: route?.params?.origin?.description});
      console.log({origin_lat: route?.params?.origin?.location?.latitude});
      console.log({origin_lng: route?.params?.origin?.location?.longitude});
      console.log({dest_desc: route?.params?.destination?.description});
      console.log({dest_lat: route?.params?.destination?.destination?.lat});
      console.log({dest_lng: route?.params?.destination?.destination?.lng});
      setCoordinates([
        {
          latitude: route?.params?.origin?.location?.latitude ?? 0,
          longitude: route?.params?.origin?.location?.longitude ?? 0,
        },
        {
          latitude: route?.params?.destination?.destination?.lat ?? 0,
          longitude: route?.params?.destination?.destination?.lng ?? 0,
        },
      ]);
    };
    getParams();
  }, [route]);

  //get fares
  useEffect(() => {
    const getFares = (_distance, _duration) => {
      const fares = calculateFares(_distance, _duration);
      setCharge(parseFloat(fares));
      return fares;
    };

    getFares(distance, duration);
  }, [distance, duration]);

  //modal timeout
  useEffect(() => {
    if (!isSetSuccess) return;

    const timeout = setTimeout(() => {
      setIsSetSuccess(false);
      if (isCancel === false) {
        setIsCancel(true);
      } else {
        setIsCancel(false);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  });

  // console.log({distance: distance});
  // console.log({fdb_deviceToken: deviceToken});
  // console.log({rideInfo: rideInfo});

  const cancelRideOrder = async () => {
    const canceOrderRef = firebase
      .database()
      .ref()
      .child(`riders/rideRequest/${user?.uid}`);

    canceOrderRef.remove(res => {
      if (res === null) {
        console.log({res: res});
        console.log('Operation Completed!');
        setIsLoading(false);
        setIsSetSuccess(true);
        // setDistance(0)
        setCoordinates([
          {latitude: 0.0, longitude: 0.0},
          {latitude: 0.0, longitude: 0.0},
        ]);
        // initializedMap();

        // navigation.goBack();
        // setIsCancel(false);
      }
      // res === null && setIsLoading(false) && setIsCancel(false);
    });

    // resetCoord();

    // && setDistance(0) && setDuration(0);

    // navigation.goBack();
    // navigation.navigate('Homely', {duration: 0, distance: 0});
  };

  const createRideOrder = async () => {
    // setDialogueOpen(true);
    // console.log({isLoading: isLoading});

    const riderRequestRef = firebase
      .database()
      .ref()
      .child(`riders/rideRequest/${user?.uid}`);

    const driversOnlineRef = firebase
      .database()
      .ref()
      .child('drivers/drivers_online')
      .once('value');

    const driversIdRef = firebase
      .database()
      .ref()
      .child('drivers/drivers_Id')
      .once('value');

    const pickupMap = {
      latitude: coordinates[0]?.latitude.toString(),
      longitude: coordinates[0]?.longitude.toString(),
    };

    const destinationMap = {
      latitude: coordinates[1]?.latitude.toString(),
      longitude: coordinates[1]?.longitude.toString(),
    };

    if ((await driversOnlineRef).exists()) {
      // const data = [snapshot.val()];
      (await driversOnlineRef).forEach(childSnap => {
        if (childSnap.exists()) {
          const childData = childSnap.val();
          console.log({_childData: childData});
          setDriverLocation(childData?.l);
          // location.push(childData?.l);
        }
      });
    }

    if ((await driversIdRef).exists()) {
      // const data = [snapshot.val()];
      (await driversIdRef).forEach(childSnap => {
        const childData = childSnap.val();

        setDeviceToken(childData?.fcmDeviceTokens);
        setDriverStatus(childData?.online);
        setDriverUID(childData?.uid);
        setDriverTokenID(childData?.userIdToken);
        setPhoneNumber(childData?.phoneNumber);
        setUserName(childData?.userName);
      });
    }
    // console.log({
    //   location: {
    //     latitude: location[0][0],
    //     longitude: location[0][1],
    //   },
    // });
    // console.log({driverTokenID: driverTokenID});
    // console.log({driverUID: driverUID});
    // console.log({driverStatus: driverStatus});
    // console.log({deviceToken: deviceToken});
    // console.log({phoneNumber: phoneNumber});
    // console.log({userName: userName});
    // console.log({driverLocation: driverLocation});

    const rideMap = {
      createdAt: firebase.database().getServerTime(),
      // 'rider_name': currentUserInfo!.displayName,
      // 'rider_phone': currentUserInfo.phoneNumber,
      riderId: user?.uid,
      rider_email_address: user?.email,
      destination_address: route.params?.destination?.description,
      pickup_address: route.params?.origin?.description,
      location: pickupMap,
      destination: destinationMap,
      payment_method: 'cash',
      fare: `₦ ${charge && charge.toFixed(0)}`,
      distance: `${distance.toFixed(0)} Km`,
      duration: `${duration.toFixed(0)} min`,

      driver_location: driverLocation,
      driver_uid: driverUID,
      drivertokenID: driverTokenID,
      driver_username: userName,
      driver_phone: phoneNumber,
    };

    // console.log({rideMap: rideMap});

    if (driverStatus === 'none' || driverStatus === false) {
      Toast.showWithGravity('Driver is offline!', Toast.LONG, Toast.TOP);
      setIsLoading(false);
      return;
    } else {
      await riderRequestRef.set(rideMap, async error => {
        // if (error) console.error(error);
        console.log({complete: error});
        if (error === null) {
          // await authRiderRef.update({
          //   newJourneyDID: 'waiting...',
          //   requestStatus: 'waiting...',
          // });
          setIsLoading(false);
          setIsSetSuccess(true);
          // alert('Successfull!');
        }
      });
    }
  };

  useEffect(() => {
    // if (!route.params) return;
    const fetchDriverInfo = async () => {
      await firebase
        .database()
        .ref('drivers')
        .child('drivers_Id')
        .on('value', snapshot => {
          if (snapshot.exists()) {
            snapshot.forEach(childSnapshot => {
              var childKey = childSnapshot.key;
              var childData = childSnapshot.val();
              // console.log({_fcmDeviceTokens: childData?.fcmDeviceTokens});
              console.log({driverID: childData?.userIdToken});
              console.log({driverUID: childData?.uid});
              console.log({online: childData?.online});
              console.log({phoneNumber: childData?.phoneNumber});
              console.log({userName: childData?.userName});
              setDeviceToken(childData?.fcmDeviceTokens);
              setDriverStatus(childData?.online);
              setDriverUID(childData?.uid);
              setDriverTokenID(childData?.userIdToken);
              setPhoneNumber(childData?.phoneNumber);
              setUserName(childData?.userName);

              // _deviceToken.push(childData?.userIdToken);
              // driversDetails.push(childData);
            });
          }
        });
    };

    // fetchDriverInfo();
  });

  // useEffect(() => {
  //   firebase
  //     .database()
  //     .ref('drivers')
  //     .child('drivers_online')
  //     .once('value', snapshot => {
  //       let location = [];
  //       if (snapshot.exists()) {
  //         const data = [snapshot.val()];
  //         snapshot.forEach(childSnap => {
  //           const childData = childSnap.val();
  //           // console.log({
  //           //   Dsnap: childData,
  //           //   g: childData.g,
  //           //   l: childData.l,
  //           //   lat: childData.l[0],
  //           //   lng: childData.l[1],
  //           // });
  //           location.push(childData.l);

  //           setDriverLocation({
  //             latitude: childData.l[0],
  //             longitude: childData.l[1],
  //           });
  //         });
  //       }
  //     });
  //   firebase.database().ref('drivers').child('drivers_online').off();
  // }, []);

  // console.log({driverStatus: driverStatus});
  // console.log({deviceToken: deviceToken});

  const sendNotification = async () => {
    // var wantedOrder = firebase
    //   .database()
    //   .ref('orders')
    //   .orderByChild('name')
    //    .limitToLast(2)
    //   .equalTo('yourText')
    //   .on('value');
    // setIsLoading(true);
    console.log({_deviceToks: deviceToken});
    console.log({_driverStatus: driverStatus});

    if (deviceToken !== 'none' && driverStatus === true) {
      console.log({_TdeviceToks: deviceToken});
      console.log({_TdriverStatus: driverStatus});
      let notificationData = {
        pickup: route.params?.origin?.description,
        destination: route.params?.destination?.description,
        fare: `₦ ${charge && charge.toFixed(0)}`,
        distance: `${distance.toFixed(0)} Km`,
        duration: `${duration.toFixed(0)} min`,
        pickupGeo: {
          latitude: route?.params?.origin?.location?.latitude,
          longitude: route?.params?.origin?.location?.longitude,
        },
        destinationGeo: {
          latitude: route?.params?.destination?.destination?.lat,
          longitude: route?.params?.destination?.destination?.lng,
        },
        body: 'data.body',
        title: 'Ride With Us!',
        token:
          //retrieve from firebase (recipient)
          deviceToken, // recipient deviceToken (retrieve for fdb)
      };
      console.log({_notificationData: notificationData});
      // setIsLoading(true);
      await NotificationService.sendSingleDeviceNotification(notificationData)
        .then(res => {
          if (res && res.status === 200) {
            console.log({res: res, status: res.status});
            // alert('Yep');
            setIsLoading(false);
            Toast.showWithGravity('Successful!', Toast.SHORT, Toast.TOP);
            setIsSetSuccess(true);
          } else {
            console.log('Error!');
            setIsLoading(false);
            Toast.showWithGravity(
              'An Error Occur, pls try again!',
              Toast.LONG,
              Toast.TOP,
            );
          }
        })
        .catch(error => {
          console.log({Error: error});
          setIsLoading(false);
          Toast.showWithGravity(
            'An Error Occur, pls try again!',
            Toast.LONG,
            Toast.TOP,
          );
        });
    }

    // if (driverStatus === 'none' || driverStatus === 'false') {
    //   Toast.showWithGravity('Driver is offline!', Toast.LONG, Toast.TOP);
    //   setIsLoading(false);
    // }

    setIsLoading(false);
  };

  //   return (
  //     <View style={modalstyles.container}>
  //       <View style={modalstyles.container}>
  //         <MapView
  //           initialRegion={{
  //             // latitude: LATITUDE,
  //             // longitude: LONGITUDE,
  //             latitude: coordinates[0].latitude,
  //             longitude: coordinates[0].longitude,
  //             latitudeDelta: LATITUDE_DELTA + 0.15,
  //             longitudeDelta: LONGITUDE_DELTA + 0.15,
  //             // latitudeDelta: LATITUDE_DELTA,
  //             // longitudeDelta: LONGITUDE_DELTA,
  //           }}
  //           style={StyleSheet.absoluteFill}
  //           // zoomControlEnabled={true}
  //           // zoomEnabled={true}
  //           showsUserLocation={true}
  //           ref={mapRef}
  //           provider={PROVIDER_GOOGLE} // remove if not using Google Maps
  //         >
  //           {coordinates.map(
  //             (coordinate, index) => (
  //               console.log({
  //                 coordinate_: coordinate,
  //                 index: index,
  //                 coordinates_: coordinates,
  //               }),
  //               (<Marker key={`coordinate_${index}`} coordinate={coordinate} />)
  //             ),
  //           )}

  //           {coordinates.length > 0 && (
  //             <MapViewDirections
  //               origin={coordinates[0]}
  //               destination={coordinates[1]}
  //               apikey={keys.GOOGLE_MAP_APIKEY}
  //               strokeWidth={6}
  //               strokeColor="hotpink"
  //               // resetOnChange={true}
  //               // optimizeWaypoints={true}
  //               onStart={params => {
  //                 console.log(
  //                   `Started routing between "${params.origin}" and "${params.destination}"`,
  //                 );
  //               }}
  //               onReady={result => {
  //                 setDistance(result.distance);
  //                 setDuration(result.duration);
  //                 // console.log({result_coord: result.coordinates});
  //                 console.log(`Distance: ${result.distance} km`);
  //                 console.log(`Duration: ${result.duration} min.`);

  //                 mapRef.current.fitToCoordinates(result.coordinates, {
  //                   edgePadding: {
  //                     right: width / 5,
  //                     bottom: height / 5,
  //                     left: width / 5,
  //                     top: height / 5,
  //                   },
  //                 });
  //               }}
  //               onError={errorMessage => {
  //                 console.log('GOT AN ERROR', errorMessage);
  //               }}
  //             />
  //           )}
  //         </MapView>
  //         {distance > 0 && (
  //           <>
  //             <View style={modalstyles.info}>
  //               <View>
  //                 <Text style={modalstyles.companyTitle}>Ride Summary</Text>
  //                 <View style={modalstyles.tags}>
  //                   <View style={modalstyles.tag}>
  //                     <Text style={modalstyles.tagText}>
  //                       {duration.toFixed(0)} min
  //                     </Text>
  //                   </View>
  //                   <View style={modalstyles.tag}>
  //                     <Text style={modalstyles.tagText}>
  //                       {distance.toFixed(0)} km
  //                     </Text>
  //                   </View>
  //                   <View style={modalstyles.tag}>
  //                     <Text style={modalstyles.tagText}>
  //                       ₦{charge && charge.toFixed(0)}
  //                     </Text>
  //                   </View>
  //                 </View>
  //               </View>
  //             </View>
  //             <View style={modalstyles.mainDivider} />

  //             {/* <View style={modalstyles.mainDivider} /> */}
  //             <View style={modalstyles.stakeUnstakeButtons}>
  //               {isCancel === false && (
  //                 <TouchableOpacity
  //                   onPress={() => {
  //                     setIsLoading(true);
  //                     // setIsSetSuccess(true);
  //                     createRideOrder();
  //                     // setIsLoading(false);
  //                     // console.log({distance: distance});
  //                   }}
  //                   // disabled={!isSetSuccess}
  //                 >
  //                   <LinearGradient
  //                     start={{x: 0, y: 0}}
  //                     end={{x: 1, y: 1}}
  //                     colors={['green', 'gold', 'green', 'gold', 'green']}
  //                     style={modalstyles.instagramButton}>
  //                     <Text style={modalstyles.stakeButtonText}>Order Ride</Text>
  //                   </LinearGradient>
  //                 </TouchableOpacity>
  //               )}
  //               {isCancel === true && (
  //                 <TouchableOpacity
  //                   onPress={() => {
  //                     setIsLoading(true);
  //                     // setIsSetSuccess(true);
  //                     cancelRideOrder();
  //                   }}>
  //                   <LinearGradient
  //                     start={{x: 0, y: 0}}
  //                     end={{x: 1, y: 1}}
  //                     colors={[
  //                       '#5851DB',
  //                       '#C13584',
  //                       '#E1306C',
  //                       '#FD1D1D',
  //                       '#F77737',
  //                     ]}
  //                     style={modalstyles.instagramButton}>
  //                     <Text style={modalstyles.stakeButtonText}>Cancel Ride</Text>
  //                   </LinearGradient>
  //                 </TouchableOpacity>
  //               )}
  //             </View>
  //             {isLoading === true && <RotateAnimation />}
  //             {isSetSuccess && (
  //               <View style={{flex: 1}}>
  //                 <Modal
  //                   animationType="slide"
  //                   transparent={true}
  //                   visible={true}
  //                   onRequestClose={() => {
  //                     // Alert.alert('Modal has been closed.');
  //                     setSuccessModalVisible(true);
  //                   }}>
  //                   <View style={modalstyles.centeredView}>
  //                     <LinearGradient
  //                       colors={['beige', 'green', 'beige']}
  //                       start={{x: 0.7, y: 0}}
  //                       // colors={['#191919', '#f9d29d', 'red']}
  //                       style={modalstyles.modal}>
  //                       <Text style={modalstyles.modalText}>
  //                         {isCancel === true
  //                           ? `🗑 Deleted Successfully! ❌`
  //                           : `🎉  Ride Info Captured Successfully! ✨`}
  //                         {/* ✨ Successful! ✨ */}
  //                       </Text>
  //                     </LinearGradient>
  //                   </View>
  //                 </Modal>
  //               </View>
  //             )}
  //           </>
  //         )}
  //       </View>
  //     </View>
  //   );

  return (
    <>
      <View style={modalstyles.container}>
        <View style={modalstyles.container}>
          <MapView
            initialRegion={{
              latitude: coordinates[0].latitude,
              longitude: coordinates[0].longitude,
              latitudeDelta: LATITUDE_DELTA + 0.15,
              longitudeDelta: LONGITUDE_DELTA + 0.15,
            }}
            style={StyleSheet.absoluteFill}
            // zoomControlEnabled={true}
            // zoomEnabled={true}
            showsUserLocation={true}
            ref={mapRef}
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          >
            {coordinates.map((coordinate, index) => (
              // console.log({
              //   coordinate_: coordinate,
              //   index: index,
              //   coordinates_: coordinates,
              // }),
              <Marker key={`coordinate_${index}`} coordinate={coordinate} />
            ))}

            {coordinates.length > 0 && (
              <MapViewDirections
                origin={
                  coordinates[0]
                    ? coordinates[0]
                    : {
                        latitude: position.latitude,
                        longitude: position.longitude,
                      }
                }
                destination={
                  coordinates[coordinates.length - 1]
                    ? coordinates[coordinates.length - 1]
                    : {
                        latitude: position.latitude,
                        longitude: position.longitude,
                      }
                }
                apikey={keys.GOOGLE_MAP_APIKEY}
                strokeWidth={6}
                strokeColor="hotpink"
                // resetOnChange={true}

                onStart={params => {
                  console.log(
                    `Started routing between "${params.origin}" and "${params.destination}"`,
                  );
                }}
                onReady={result => {
                  setDistance(result.distance);
                  setDuration(result.duration);
                  // console.log({result_coord: result.coordinates});
                  console.log(`Distance: ${result.distance} km`);
                  console.log(`Duration: ${result.duration} min.`);

                  mapRef.current.fitToCoordinates(result.coordinates, {
                    edgePadding: {
                      right: width / 5,
                      bottom: height / 5,
                      left: width / 5,
                      top: height / 5,
                    },
                  });
                }}
                onError={errorMessage => {
                  console.log('GOT AN ERROR', errorMessage);
                }}
              />
            )}
          </MapView>
        </View>
        {distance > 0 && (
          <>
            <View style={modalstyles.info}>
              {/* <Image
                resizeMode="stretch"
                source={CompanyIcon}
                style={modalstyles.infoImage}
              /> */}
              <View>
                <Text style={modalstyles.companyTitle}>Ride Summary</Text>

                <View style={modalstyles.tags}>
                  <View style={modalstyles.tag}>
                    <Text style={modalstyles.tagText}>
                      {duration.toFixed(0)} min
                    </Text>
                  </View>
                  <View style={modalstyles.tag}>
                    <Text style={modalstyles.tagText}>
                      {distance.toFixed(0)} km
                    </Text>
                  </View>
                  <View style={modalstyles.tag}>
                    <Text style={modalstyles.tagText}>
                      ₦{charge && charge.toFixed(0)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={modalstyles.mainDivider} />

            {/* <View style={modalstyles.mainDivider} /> */}
            <View style={modalstyles.stakeUnstakeButtons}>
              {isCancel === false && (
                <TouchableOpacity
                  onPress={() => {
                    setIsLoading(true);
                    // setIsSetSuccess(true);
                    createRideOrder();
                    sendNotification();
                    // setIsLoading(false);
                    // console.log({distance: distance});
                  }}
                  // disabled={!isSetSuccess}
                >
                  <LinearGradient
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    colors={['green', 'gold', 'green', 'gold', 'green']}
                    style={modalstyles.instagramButton}>
                    <Text style={modalstyles.stakeButtonText}>Order Ride</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
              {isCancel === true && (
                <TouchableOpacity
                  onPress={() => {
                    setIsLoading(true);
                    // setIsSetSuccess(true);
                    cancelRideOrder();
                  }}>
                  <LinearGradient
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    colors={[
                      '#5851DB',
                      '#C13584',
                      '#E1306C',
                      '#FD1D1D',
                      '#F77737',
                    ]}
                    style={modalstyles.instagramButton}>
                    <Text style={modalstyles.stakeButtonText}>Cancel Ride</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
            {isLoading === true && <RotateAnimation />}
            {isSetSuccess && (
              <View style={{flex: 1}}>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={true}
                  onRequestClose={() => {
                    // Alert.alert('Modal has been closed.');
                    setSuccessModalVisible(true);
                  }}>
                  <View style={modalstyles.centeredView}>
                    <LinearGradient
                      colors={['beige', 'green', 'beige']}
                      start={{x: 0.7, y: 0}}
                      // colors={['#191919', '#f9d29d', 'red']}
                      style={modalstyles.modal}>
                      <Text style={modalstyles.modalText}>
                        {isCancel === true
                          ? `🗑 Ride Order Cancelled! ❌`
                          : `🎉  Pls Wait While We Match You With a Nearby Driver! ✨`}
                        {/* ✨ Successful! ✨ */}
                      </Text>
                    </LinearGradient>
                  </View>
                </Modal>
              </View>
            )}

            {/* <View style={styles.bottomCard_}> */}
            {/* <Text>Where are you going..?</Text> */}
            {/* <TouchableOpacity onPress={initializedMap()} style={styles.inpuStyle}>
               <Text>Choose your location</Text>
                </TouchableOpacity> */}
            {/* </View> */}
          </>
        )}
      </View>
    </>
  );
};
