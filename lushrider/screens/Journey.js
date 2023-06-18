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
import {journeystyles, modalstyles} from '../styles/modalStyles';
import NotificationService from './NotificationService';
import Toast from 'react-native-simple-toast';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CompanyIcon = require('../assets/ic_launcher_round.png');

const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 37.771707;
const LONGITUDE = -122.4053769;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export const Journey = ({route, navigation}) => {
  const {signedInRider, authRiderRef, dvehicleDetails} =
    useContext(AuthContext);
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
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [rideInfo, setRideInfo] = useState(null);
  const [driversToken, setDriversToken] = useState(null);
  const [driverStatus, setDriverStatus] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [driverUID, setDriverUID] = useState(null);
  const [driverTokenID, setDriverTokenID] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [userName, setUserName] = useState(null);
  const [driverRequest, setDriverRequest] = useState(null);
  const [driverPhone, setDriverPhone] = useState(null);
  const [driverName, setDriverName] = useState(null);
  const [isDriverFound, setIsDriverFound] = useState(false);
  const [orderedRide, setOrderedRide] = useState(null);

  const mapRef = useRef();
  const dummyPhoto = require('../assets/users/user_icon.png');

  // console.log({orderedRide});
  // get params
  useEffect(() => {
    if (!route.params) {
      return;
    }
    const getParams = () => {
      // console.log({route_params: route.params});
      // console.log({origin_desc: route?.params?.origin?.description});
      // console.log({origin_lat: route?.params?.origin?.location?.latitude});
      // console.log({origin_lng: route?.params?.origin?.location?.longitude});
      // console.log({dest_desc: route?.params?.destination?.description});
      // console.log({dest_lat: route?.params?.destination?.destination?.lat});
      // console.log({dest_lng: route?.params?.destination?.destination?.lng});
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
    if (!isSuccess) {
      return;
    }

    const timeout = setTimeout(() => {
      setIsSuccess(false);
      if (isCancel === false) {
        setIsCancel(true);
      } else {
        setIsCancel(false);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  });

  useEffect(() => {
    const driverFound = async () => {
      if (driverRequest === 'accepted!') {
        setIsDriverFound(true);
        Toast.showWithGravity('Found a Driver', Toast.LONG, Toast.CENTER);
        setIsLoading(false);
      } else {
        setIsDriverFound(false);
      }
      // driverRequest === 'accepted!'f
      // ? Toast.showWithGravity(
      //     'Found a Driver!!!',
      //     Toast.LONG,
      //     Toast.TOP,
      //   ) && setIsLoading(false)
      // : null
    };
    driverFound();
  }, [driverRequest]);

  console.log({isDriverFound, driverRequest});

  useEffect(() => {
    const checkDriversOnline = async () => {
      const driversOnlineRef = firebase
        .database()
        .ref('drivers/drivers_online');

      driversOnlineRef.on('value', onlineDriversSnap => {
        // console.log({snapshot: onlineDriversSnap});
        if (onlineDriversSnap.exists()) {
          onlineDriversSnap.forEach(childSnap => {
            const childData = childSnap.val();
            // console.log({onlineDrivers: childData});
            setDriverLocation(childData?.l);
          });
        }
      });
    };

    checkDriversOnline();
  }, []);

  useEffect(() => {
    const checkRiders = async () => {
      const authRidersRef = firebase
        .database()
        .ref(`riders/${signedInRider?.uid}`); // drivers + riderId not correct
      authRidersRef.on('value', snap => {
        const data = snap.val();
        console.log({
          // Tdata: data,
        });
        setOrderedRide(data?.orderedRide);
        setPhoneNumber(data?.phone);
        setUserName(data?.userName);
      });
    };

    checkRiders();
  }, [signedInRider?.uid]);

  useEffect(() => {
    const checkAllDriversId = async () => {
      const allDriverRef = firebase.database().ref('drivers/drivers_Id');
      // .limitToFirst(1);
      // .orderByChild('online');
      // .equalTo('true');

      allDriverRef.on('value', allDriversSnap => {
        // console.log({snapshot: allDriversSnap});
        allDriversSnap.forEach(childSnap => {
          // childData?.online === 'true'
          //   ? console.log('YEA')
          //   : console.log('NOPE');
          const childData = childSnap.val();
          // [childData].map((value, index) => {
          //   let val = value;
          //   let email = val?.email;
          //   console.log({email});
          // });
          // let values = childData?.online === true;
          // data.filter
          const online = childData?.online;
          const uid = childData?.uid;
          const username = childData?.userName;
          const token = childData?.fcmDeviceTokens;
          const requestStatus = childData?.requestStatus;

          console.log({online, uid, username, token, requestStatus});
          if (online === true) {
            console.log('A driver is online...');
            setDriversToken(token);
            setDriverStatus(online);
            setDriverUID(childData?.uid);
            setDriverTokenID(childData?.userIdToken);
            setDriverRequest(childData?.requestStatus);
            setDriverPhone(childData?.phoneNumber);
            setDriverName(childData?.userName);
            // console.log({token});
          }
        });
      });
    };

    checkAllDriversId();
  }, []);

  const cancelRideOrder = async () => {
    const cancelOrderRef = firebase
      .database()
      .ref()
      .child(`riders/rideRequest/${signedInRider?.uid}`);
    const ridersRef = firebase
      .database()
      .ref()
      .child(`riders/${signedInRider?.uid}`);

    //remover ride request
    cancelOrderRef
      .remove(res => {
        if (res === null) {
          console.log({res: res});
          console.log('Operation Completed!');
          setIsLoading(false);
          setIsSuccess(true);
          // setDistance(0)
          setCoordinates([
            {latitude: 0.0, longitude: 0.0},
            {latitude: 0.0, longitude: 0.0},
          ]);
          setIsDriverFound(false);
        }
      })
      .catch(err => err);

    //update rider db
    ridersRef.update({
      orderedRide: 'cancelled',
    });

    // resetCoord();

    // && setDistance(0) && setDuration(0);

    // navigation.goBack();
    // navigation.navigate('Homely', {duration: 0, distance: 0});
  };

  const createRideOrder = async () => {
    const riderRequestRef = firebase
      .database()
      .ref()
      .child(`riders/rideRequest/${signedInRider?.uid}`);

    const pickupMap = {
      latitude: coordinates[0]?.latitude.toString(),
      longitude: coordinates[0]?.longitude.toString(),
    };

    const destinationMap = {
      latitude: coordinates[1]?.latitude.toString(),
      longitude: coordinates[1]?.longitude.toString(),
    };

    const rideMap = {
      createdAt: firebase.database().getServerTime(),
      rider_name: userName,
      rider_phone: phoneNumber,
      riderId: signedInRider?.uid,
      rider_email_address: signedInRider?.email,
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
      // driver_username: userName,
      // driver_phone: phoneNumber,
    };

    // console.log({rideMap: rideMap});

    if (driverStatus === 'none' || driverStatus === false) {
      // setIsLoading(true);
      Toast.showWithGravity('Driver is offline!', Toast.LONG, Toast.TOP);
      setIsLoading(false);
    } else {
      await riderRequestRef.set(rideMap, async error => {
        // if (error) console.error(error);
        console.log({complete: error});
        if (error === null) {
          setIsLoading(true);
          setIsSuccess(true);
          const ridersRef = firebase
            .database()
            .ref()
            .child(`riders/${signedInRider?.uid}`);

          ridersRef.update({
            orderedRide: 'initiated',
          });
        }
      });
    }
  };

  useEffect(() => {
    console.log({
      driverStatus,
      driversToken,
      driverPhone,
      driverName,
      driverRequest,
    });
  }, [
    driversToken,
    driverStatus,
    driverTokenID,
    driverUID,
    driverPhone,
    driverName,
    driverRequest,
  ]);

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

  const notifyCancelRequest = async () => {
    console.log({driversToken});
    console.log({driverStatus});

    if (driversToken !== 'none' && driverStatus === true) {
      let notificationData = {
        abortMessage: '😢 Driver Cancelled!',
        body: 'Ride with us lushly',
        title: 'Ride Cancellation Notification!',
        token:
          //retrieve from firebase (recipient)
          driversToken, // recipient deviceToken (retrieve for fdb)
      };
      console.log({notificationData});
      // setIsLoading(true);
      await NotificationService.sendSingleDeviceNotification(notificationData)
        .then(res => {
          if (res && res.status === 200) {
            console.log({res: res, status: res.status});

            // setIsLoading(true);

            Toast.showWithGravity(
              'Cancel Notification Successfully Sent!',
              Toast.SHORT,
              Toast.TOP,
            );
            setIsSuccess(true);
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
  };
  const notifyRideRequest = async () => {
    // var wantedOrder = firebase
    //   .database()
    //   .ref('orders')
    //   .orderByChild('name')
    //    .limitToLast(2)
    //   .equalTo('yourText')
    //   .on('value');
    // setIsLoading(true);
    console.log({driversToken});
    console.log({driverStatus});

    if (driversToken !== 'none' && driverStatus === true) {
      let notificationData = {
        riderPhone: phoneNumber,
        riderName: userName,
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
        body: 'Ride with us lushly',
        title: 'Ride Request Notification!',
        token:
          //retrieve from firebase (recipient)
          driversToken, // recipient deviceToken (retrieve for fdb)
      };
      console.log({notificationData});
      // setIsLoading(true);
      await NotificationService.sendSingleDeviceNotification(notificationData)
        .then(res => {
          if (res && res.status === 200) {
            console.log({res: res, status: res.status});

            setIsLoading(true);

            Toast.showWithGravity(
              'Ride Notification Successfully Sent!',
              Toast.LONG,
              Toast.TOP,
            );
            setIsSuccess(true);
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
  };

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

                  // console.log(`Distance: ${result.distance} km`);
                  // console.log(`Duration: ${result.duration} min.`);

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
              <View>
                <Text style={modalstyles.companyTitle}>Ride Summary</Text>
                <View style={journeystyles.rideTags}>
                  <Text style={journeystyles.rideTagText}>🚖 To: </Text>
                  <Text style={journeystyles.rideDestText}>
                    {route.params?.destination?.description}
                  </Text>
                </View>
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
            {/* <View style={modalstyles.mainDivider} /> */}

            <View style={modalstyles.stakeUnstakeButtons}>
              {isCancel === false && (
                <TouchableOpacity
                  onPress={() => {
                    setIsLoading(true);

                    createRideOrder();

                    notifyRideRequest();
                  }}
                  // disabled={!isSetSuccess}
                >
                  <LinearGradient
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    colors={[
                      'gold',
                      'green',
                      'green',
                      'green',
                      'green',
                      'gold',
                    ]}
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
                    notifyCancelRequest();
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
            {isDriverFound && (
              <>
                <View style={{flexDirection: 'row', borderWidth: 2}}>
                  <View style={{paddingHorizontal: 5}}>
                    <Text style={{...journeystyles.tagText, color: 'green'}}>
                      {dvehicleDetails && dvehicleDetails?.model}
                    </Text>
                    <Text style={{...journeystyles.tagText, color: 'green'}}>
                      {dvehicleDetails && dvehicleDetails?.make}
                    </Text>
                    <Text style={{...journeystyles.tagText, color: 'green'}}>
                      {`${dvehicleDetails && dvehicleDetails?.color} colour `}
                    </Text>
                    <Text
                      style={{
                        ...journeystyles.tagText,
                        color: 'green',
                        fontWeight: 'bold',
                      }}>
                      {`REG:${dvehicleDetails && dvehicleDetails?.carNumber}  `}
                    </Text>
                  </View>
                  <View>
                    <Image
                      resizeMode="stretch"
                      source={dummyPhoto}
                      style={modalstyles.driverImage}
                    />
                    <Text style={{...journeystyles.tagText, color: 'green'}}>
                      {driverName ?? ''}
                    </Text>
                  </View>
                  <View style={{marginRight: 10, flexDirection: 'column'}}>
                    {/* <Text style={journeystyles.riderName}> */}

                    <MaterialCommunityIcons.Button
                      name="phone-dial"
                      size={25}
                      backgroundColor="beige"
                      color="green"
                      onPress={() => {}}
                      style={{
                        // bottom: 30,
                        bottom: 5,
                        // alignItems: 'center',
                      }}
                    />
                  </View>
                  <View style={{paddingTop: 5}}>
                    <Text
                      style={{
                        ...journeystyles.tagText,
                        color: 'green',
                        fontWeight: 'bold',
                      }}>
                      {`10mins to Arrive `}
                    </Text>
                  </View>
                </View>
              </>
            )}
            {isLoading === true && <RotateAnimation />}
            {isSuccess && (
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
