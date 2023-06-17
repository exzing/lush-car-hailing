/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
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
import RotateAnimation from '../components/RotateAnimation';
import {modalstyles} from '../styles/imageupload';
import GeoFire from 'geofire';
import {firebase} from '@react-native-firebase/database';
import {getRegion} from '../rnchat/src/helpers/map';
import {journeystyles} from '../rnchat/MarkerApp';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const carMarker = require('../assets/car144.png');
const goldcar = require('../assets/goldcar.png');

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

  const [profileIndex, setProfileIndex] = useState(0);
  const [profiles, setProfiles] = useState([]);
  const [dynamicLoc, setDynamicAddr] = useState([]);

  // useEffect(() => {
  //   const getFares = (_distance, _duration) => {
  //     const fares = calculateFares(_distance, _duration);
  //     setCharge(parseFloat(fares));
  //     return fares;
  //   };

  //   // getFares(distance, duration);
  // }, [distance, duration]);

  // get params
  useEffect(() => {
    try {
      console.log({
        rideDestination,
        rideLocation,
        destinationGeoMsg,
        pickupGeoMsg,
        // _Mylocation: location,
      });
      if (
        !rideLocation &&
        !pickupGeoMsg &&
        !rideDestination &&
        !destinationGeoMsg &&
        !pickupAddr &&
        !destinationAddr &&
        !rideFare &&
        !fareMsg &&
        !distanceMsg
      ) {
        return;
      }
      setCoordinates([
        {
          latitude: Number(JSON.parse(pickupGeoMsg)?.latitude) || 0.0,
          // Number(rideLocation?.latitude),
          longitude: Number(JSON.parse(pickupGeoMsg)?.longitude) || 0.0,
          // Number(rideLocation?.longitude)
        },
        {
          latitude: Number(JSON.parse(destinationGeoMsg)?.latitude) || 0.0,
          // Number(rideDestination?.latitude),
          longitude: Number(JSON.parse(destinationGeoMsg)?.longitude) ?? 0.0,
          // Number(rideDestination?.longitude),
        },
      ]);
    } catch (error) {}
  }, [
    destinationAddr,
    destinationGeoMsg,
    distanceMsg,
    fareMsg,
    pickupAddr,
    pickupGeoMsg,
    rideDestination,
    rideFare,
    rideLocation,
  ]);

  //modal timeout
  useEffect(() => {
    if (!isSetSuccess) {
      return;
    }

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
    rideDistance,
    isNotifyDialogue,
    pickupMsg,
    destinationMsg,
    nearbyDrivers,
    pickupAddr,
    destinationAddr,
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

  // console.log({newPosition, coordinates});
  console.log({
    // lat: JSON.parse(destinationGeoMsg)?.latitude,
    // long: JSON.parse(destinationGeoMsg)?.longitude,
    lat: destinationGeoMsg?.latitude,
    long: Number(JSON.stringify(destinationGeoMsg))?.longitude,
    lat2: destinationGeoMsg?.latitude,
    long2: destinationGeoMsg?.longitude,
    coordinates,
    riderUserName,
  });
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
            {coordinates[0] && coordinates[1] && (
              <>
                <Marker
                  title="I am here"
                  pinColor="skyblue"
                  description="My Destination Location"
                  coordinate={{
                    latitude: coordinates[1]?.latitude || 4.331,
                    longitude: coordinates[1]?.longitude || 8.005,
                  }}
                  // coordinate={{
                  //   latitude: 4.3317876,
                  //   longitude: 8.0054812,
                  // }}
                />
                <Marker
                  title="I am here"
                  pinColor="purple"
                  description="My Current Location"
                  // coordinate={coordinates[0]}
                  coordinate={{
                    latitude: coordinates[0]?.latitude || 4.471,
                    longitude: coordinates[0]?.longitude || 8.005,
                  }}
                  // latitude: 4.471707,
                  // longitude: 8.0053769,
                />
              </>
            )}
            {nearbyDrivers &&
              nearbyDrivers?.map((geom, index) => {
                console.log({geom: geom});

                return (
                  <Marker
                    // ref={mapRef}
                    anchor={{x: 0.5, y: 0.6}}
                    key={index}
                    identifier={'marker_' + index}
                    // image={carMarker}
                    coordinate={{
                      latitude: geom.l[0],
                      longitude: geom.l[1],
                    }}
                    flat
                    style={{
                      ...(currentPosition?.heading !== -1 && {
                        transform: [
                          {
                            rotate: `${currentPosition?.heading}deg`,
                          },
                        ],
                      }),
                    }}>
                    <Image
                      resizeMode="contain"
                      style={{
                        height: 40,
                        width: 40,
                        // top: 20,
                        transform: [
                          {
                            rotate: '270deg',
                            // rotate: coords.heading === undefined ? '0deg' : `${coords.heading}deg`,
                          },
                        ],
                      }}
                      source={goldcar}
                    />
                  </Marker>
                );
              })}

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
                      {fareMsg ?? rideFare}
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
                  <Text style={modalstyles.stakeButtonText}>Got a Rider</Text>
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
