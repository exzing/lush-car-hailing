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
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  Camera,
  Polyline,
  Callout,
} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {keys} from '../env';
import {AuthContext} from '../navigation/AuthProvider';
import {calculateFares} from '../utils/EstimateFares';
// import * as Animatable from 'react-native-animatable';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import {getCurrentLocation, locationPermission} from '../helper/helperFunction';
// import Animated from 'react-native-reanimated';
// import PropTypes from 'prop-types';
// import Button from '../components/Button';
// import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
// import {theme} from '../styles/theme';
// import ModalActivityIndicator from '../components/ModalActivityIndicator';
// import ImageUploadMission from '../components/ImageUploadMission';
import RotateAnimation from '../components/RotateAnimation';
import {modalstyles} from '../styles/imageuploadmission';
import GeoFire from 'geofire';
import {firebase} from '@react-native-firebase/database';
// import Geolocation from 'react-native-geolocation-service';
// import {mapStyle} from '../styles/mapStyle';
// import {data} from '../utils/data';
import {getRegion} from '../rnchat/src/helpers/map';
// import moment from 'moment';
import {journeystyles} from '../rnchat/MarkerApp';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {TrackContext} from './GeoMarker';

const carMarker = require('../assets/car144.png');
// const carMarker = require('../assets/carMarker.png');

// const CompanyIcon = require('../assets/ic_launcher_round.png');
const userPhoto = require('../assets/users/user_icon.png');

const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 37.771707;
const LONGITUDE = -122.4053769;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export const Journey = ({route, navigation}) => {
  const {
    user,
    currentPosition,
    deviceToken,
    authDriverRef,
    riderOnlineRef,
    pickupMsg,
    destinationMsg,
    isNotifyDialogue,
    setIsNotifyDialogue,
    riderPhoneNumber,
    riderUserName,
    rideDuration,
    rideFare,
    rideDistance,
    destinationAddr,
    pickupAddr,
    rideDestination,
    rideLocation,
    destinationGeoMsg,
    pickupGeoMsg,
    fareMsg,
    distanceMsg,
    durationMsg,
  } = useContext(AuthContext);

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
  const [newPosition, setNewPosition] = useState({
    latitude: 37.12,
    longitude: -122.1,
    latitudeDelta: 0.0421,
    longitudeDelta: 0.0421,
  });
  const [curLoc, setCurLoc] = useState({
    latitude: 4.8993,
    longitude: 7.0149,
    // latitude: 30.7993,
    // longitude: 76.9149,
    latitudeDelta: 0.1922,
    longitudeDelta: 0.1421,
  });
  const [polyCoords, setPolyCoords] = useState();
  const [nearbyDriversLoc, setNearbyDriversLoc] = useState([]);
  const [nearbyDrivers, setNearbyDrivers] = useState([]);
  const mapRef = useRef();

  const cancelRideOrder = async () => {
    const canceOrderRef = firebase
      .database()
      .ref()
      .child(`riders/${user?.uid}/rideRequest`);

    await canceOrderRef.remove(res => {
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
      .child(`riders/${user?.uid}/rideRequest`);

    // const pickup = coordinates[0].latitude
    const pickupMap = {
      latitude: nearbyDriversLoc[0]?.latitude.toString(),
      longitude: nearbyDriversLoc[0]?.longitude.toString(),
    };

    const destinationMap = {
      latitude: nearbyDriversLoc[1]?.latitude.toString(),
      longitude: nearbyDriversLoc[1]?.longitude.toString(),
    };

    const rideMap = {
      createdAt: firebase.database().getServerTime(),
      // 'rider_name': currentUserInfo!.displayName,
      // 'rider_phone': currentUserInfo.phoneNumber,
      rider_email_address: user?.email,
      destination_address: route.params?.destination?.description,
      pickup_address: route.params?.origin?.description,
      location: pickupMap,
      destination: destinationMap,
      payment_method: 'cash',
      driver_id: 'waiting',
    };

    await riderRequestRef.set(rideMap, error => {
      // if (error) console.error(error);
      console.log({complete: error});
      if (error === null) {
        setIsLoading(false);
        setIsSetSuccess(true);
        // alert('Successfull!');
      }
    });

    // await riderRequestRef?.set(rideMap).then(res => console.log({res_: res}));

    setIsLoading(false);
  };
  const [profileIndex, setProfileIndex] = useState(0);
  const [profiles, setProfiles] = useState([]);
  const [dynamicLoc, setDynamicAddr] = useState([]);

  useEffect(() => {
    const getFares = (_distance, _duration) => {
      const fares = calculateFares(_distance, _duration);
      setCharge(parseFloat(fares));
      return fares;
    };

    // getFares(distance, duration);
  }, [distance, duration]);

  // get params
  useEffect(() => {
    const getRideParams = () => {
      console.log({
        rideDestination: rideDestination,
        rideLocation: rideLocation,
        destinationGeoMsg: destinationGeoMsg,
        pickupGeoMsg: pickupGeoMsg,
        // _Mylocation: location,
      });
      // if (!route.params) return;
      // console.log({route_params: route.params});
      // console.log({origin_desc: route?.params?.origin?.description});
      // console.log({origin_lat: route?.params?.origin?.location?.latitude});
      // console.log({origin_lng: route?.params?.origin?.location?.longitude});
      // console.log({dest_desc: route?.params?.destination?.description});
      // console.log({dest_lat: route?.params?.destination?.destination?.lat});
      // console.log({dest_lng: route?.params?.destination?.destination?.lng});

      setCoordinates([
        {
          latitude:
            Number(rideLocation?.latitude) ?? Number(pickupGeoMsg.latitude),
          longitude:
            Number(rideLocation?.longitude) ?? Number(pickupGeoMsg.longitude),
        },
        {
          latitude:
            Number(rideDestination?.latitude) ??
            Number(destinationGeoMsg.latitude),
          longitude:
            Number(rideDestination?.longitude) ??
            Number(destinationGeoMsg.longitude),
        },
      ]);
    };
    getRideParams();
  }, [
    destinationGeoMsg,
    pickupGeoMsg,
    rideDestination,
    rideDestination?.latitude,
    rideDestination?.longitude,
    rideLocation,
    rideLocation?.latitude,
    rideLocation?.longitude,
    route,
  ]);

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

  const getDrivers = id => {
    return firebase.database().ref('drivers_online').child(id).once('value');
  };

  useEffect(() => {
    const getProfiles = async (uid, _distance) => {
      const geoFireRef = new GeoFire(firebase.database().ref('drivers_online'));
      const userLocation = await geoFireRef.get(uid);
      console.log('userLocation:', userLocation);
      const geoQuery = geoFireRef.query({
        center: userLocation,
        radius: _distance, //km
      });
      geoQuery.on('key_entered', async (key, location, coverage) => {
        console.log(
          key + ' at ' + location + ' is ' + coverage + 'km from the center',
        );
        const drivers = await getDrivers(key);
        console.log('drivers:', drivers.val());
        const _profiles = [...profiles, drivers.val()];
        // this.setState({profiles});
        setProfiles(_profiles);
      });
    };

    // getProfiles(user.uid, 10);
  }, [user.uid, profiles, distance]);

  const nextCard = () => {
    setProfileIndex(profileIndex + 1);
  };

  const marker = null || undefined;

  //geo
  useEffect(() => {
    const updateUserGeoLocation = async () => {
      const geoFireRef = new GeoFire(
        firebase.database()?.ref('drivers').child('drivers_online'),
      );

      const _userLocation = await geoFireRef.get(user?.uid);
      console.log({_userLocation: _userLocation});
      if (!_userLocation) {
        return null;
      }
      const geoQuery = geoFireRef.query({
        center: _userLocation,
        radius: 5, //km
      });

      geoQuery.on('key_entered', async (_key, _location, _distance) => {
        console.log(
          _key + ' at ' + _location + ' is ' + _distance + 'km from the center',
        );
        firebase
          .database()
          .ref('drivers')
          .child('drivers_online')
          .on('value', snapshot => {
            let drivers = snapshot.val();
            console.log({drivers: drivers});
            snapshot.forEach(childSnap => {
              const childData = childSnap.val();
              console.log({
                coord_g: childData.g,
                coord_l: childData.l,
                lat: childData.l[0],
                lng: childData.l[1],
              });
              setNearbyDrivers([childData]);
            });
          });
      });
    };
    updateUserGeoLocation();
  }, [currentPosition, user]);

  console.log({
    rideDistance: rideDistance,
    isNotifyDialogue: isNotifyDialogue,
    pickupMsg: pickupMsg,
    destinationMsg: destinationMsg,
    nearbyDrivers: nearbyDrivers,
  });

  useEffect(() => {
    setNewPosition({
      latitude: currentPosition ? currentPosition.latitude : 0,
      longitude: currentPosition ? currentPosition.longitude : 0,
      // latitudeDelta: 0.0922,
      // longitudeDelta: 0.0421,
      latitudeDelta: 0.1421,
      longitudeDelta: 0.1621,
    });
  }, [mapRef, currentPosition]);

  return (
    <>
      <View style={modalstyles.container}>
        <View style={modalstyles.container}>
          <MapView
            ref={mapRef}
            // region={curLoc}
            region={getRegion(curLoc.latitude, curLoc.longitude, 5000)}
            style={StyleSheet.absoluteFill}
            showsUserLocation={true}
            zoomControlEnabled={true}
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            // customMapStyle={mapStyle}
          >
            <Marker
              title="I am here"
              pinColor="skyblue"
              description="My Destination Location"
              coordinate={coordinates[1]}
            />
            <Marker
              title="I am here"
              pinColor="purple"
              description="My Current= Location"
              coordinate={coordinates[0]}
            />
            {nearbyDrivers.map((geom, index) => {
              console.log({geom: geom});

              return (
                <Marker
                  // ref={mapRef}
                  key={index}
                  identifier={'marker_' + index}
                  image={carMarker}
                  // coordinate={{latitude: 4.3, longitude: 7.5}}
                  coordinate={{latitude: geom.l[0], longitude: geom.l[1]}}>
                  {/* coordinate={{latitude: geom[0], longitude: geom[1]}}> */}
                  <Callout>
                    <View>
                      {/* <Text>{text}</Text>
                    <Text style={{color: '#999'}}>
                      {moment(timestamp).fromNow()}
                    </Text> */}
                    </View>
                  </Callout>
                </Marker>
              );
            })}
            {/* {coordinates.map((coordinate, index) => (
              <Marker key={`coordinate_${index}`} coordinate={coordinate} />
            ))} */}

            {coordinates.length > 0 && (
              <MapViewDirections
                origin={
                  coordinates[0]
                    ? coordinates[0]
                    : {
                        latitude: position?.latitude,
                        longitude: position?.longitude,
                      }
                }
                destination={
                  coordinates[coordinates.length - 1]
                    ? coordinates[coordinates.length - 1]
                    : {
                        latitude: position?.latitude,
                        longitude: position?.longitude,
                      }
                }
                apikey={keys.GOOGLE_MAP_APIKEY}
                strokeWidth={6}
                strokeColor="blue"
                // resetOnChange={true}

                onStart={params => {
                  console.log(
                    `Started routing between "${params?.origin}" and "${params?.destination}"`,
                  );
                }}
                onReady={result => {
                  // setDistance(result.distance);
                  // setDuration(result.duration);
                  // // console.log({result_coord: result.coordinates});
                  // console.log(`Distance: ${result.distance} km`);
                  // console.log(`Duration: ${result.duration} min.`);

                  mapRef.current?.fitToCoordinates(result?.coordinates, {
                    edgePadding: {
                      right: width / 7,
                      bottom: height / 7,
                      left: width / 7,
                      top: height / 7,
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
        {(destinationMsg ?? destinationAddr) && (
          <>
            <View style={journeystyles.info}>
              <Image
                resizeMode="stretch"
                source={userPhoto}
                style={modalstyles.infoImage}
              />
              <View>
                <View style={{marginRight: 10, flexDirection: 'row'}}>
                  <Text style={journeystyles.riderName}>
                    {riderUserName ?? ''}
                  </Text>

                  <MaterialCommunityIcons.Button
                    name="phone-dial"
                    size={25}
                    backgroundColor="beige"
                    color="purple"
                    onPress={() => {}}
                  />
                </View>
                <View style={{flexDirection: 'row', marginTop: 12}}>
                  <View style={journeystyles.tag}>
                    <Text style={journeystyles.tagText}>
                      {durationMsg ?? rideDuration}
                    </Text>
                  </View>
                  <View style={journeystyles.tag}>
                    <Text style={journeystyles.tagText}>
                      {distanceMsg ?? rideDistance}
                    </Text>
                  </View>
                  <View style={journeystyles.tag}>
                    <Text style={journeystyles.tagText}>
                      {fareMsg ?? (rideFare && rideFare)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={journeystyles.rideTags}>
              <Text style={journeystyles.rideTagText}>🚖 To: </Text>
              <Text style={journeystyles.rideDestText}>
                {destinationMsg ?? destinationAddr}
              </Text>
            </View>
            <View style={journeystyles.rideTags}>
              <Text style={journeystyles.rideTagText}>🚖 From: </Text>
              <Text style={journeystyles.rideDestText}>
                {pickupMsg ?? pickupAddr}
              </Text>
            </View>
            <View style={journeystyles.mainDivider} />

            <View style={journeystyles.btnJourneyBox}>
              <TouchableOpacity
                onPress={() => {
                  // setModalVisible(true);
                }}>
                <LinearGradient
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  // colors={['#FACC6B', 'green', '#f9d29d', 'green', 'green']}
                  colors={[
                    'white',
                    'beige',
                    '#6536FF',
                    '#329BFF',
                    '#4C64FF',
                    '#6536FF',
                    '#8000FF',
                  ]}
                  style={journeystyles.btnJourney}>
                  <Text style={modalstyles.stakeButtonText}>Arrived</Text>
                </LinearGradient>
              </TouchableOpacity>
              {isCancel === true && (
                <TouchableOpacity
                  onPress={() => {
                    // setIsLoading(true);
                    // cancelRideOrder();
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
                    setSuccessModalVisible(true);
                  }}>
                  <View style={modalstyles.centeredView}>
                    <LinearGradient
                      colors={['beige', 'green', 'beige']}
                      start={{x: 0.7, y: 0}}
                      style={modalstyles.modal}>
                      <Text style={modalstyles.modalText}>
                        {isCancel === true
                          ? `🗑 Deleted Successfully! ❌`
                          : `🎉  Ride Info Captured Successfully! ✨`}
                        {/* ✨ Successful! ✨ */}
                      </Text>
                    </LinearGradient>
                  </View>
                </Modal>
              </View>
            )}
          </>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
