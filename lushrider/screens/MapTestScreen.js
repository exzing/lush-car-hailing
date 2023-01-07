import React, {useEffect, useRef, useState} from 'react';
import MapView, {PROVIDER_GOOGLE, Marker, Callout} from 'react-native-maps';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TextInput,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {getCurrentLocation, locationPermission} from '../helper/helperFunction';
import Geolocation from 'react-native-geolocation-service';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import MapViewDirections from 'react-native-maps-directions';
import {keys} from '../env';

const mapDarkStyle = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#212121',
      },
    ],
  },
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#212121',
      },
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'administrative.country',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#bdbdbd',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#181818',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#1b1b1b',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#2c2c2c',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#8a8a8a',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [
      {
        color: '#373737',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#3c3c3c',
      },
    ],
  },
  {
    featureType: 'road.highway.controlled_access',
    elementType: 'geometry',
    stylers: [
      {
        color: '#4e4e4e',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#000000',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#3d3d3d',
      },
    ],
  },
];

const mapStandardStyle = [
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
];

const MapTestScreen = ({navigation, route}) => {
  const theme = useTheme();
  const screen = Dimensions.get('window');
  const ASPECT_RATIO = screen.width / screen.height;
  const LATITUDE_DELTA = 0.04;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  const [position, setPosition] = useState({
    latitude: 10,
    longitude: 10,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  });
  const mapRef = useRef();
  const markerRef = useRef();

  useEffect(() => {
    const _position = async () => {
      const status = await locationPermission();
      if (status === 'granted') {
        const loc = await getCurrentLocation();
        // console.log('Permission grantedd!');
        setPosition(loc);
      } else {
        console.log('Permission not grantedd!');
      }
    };
    _position();
  });

  const destinationCords = {
    latitude: position.latitude - 0.01,
    longitude: position.longitude - 0.01,
  };

  const origin = {latitude: 4.8718456, longitude: 7.0296002};
  const _origin = {latitude: position.latitude, longitude: position.longitude};
  const destination = {latitude: 4.865707, longitude: 7.0253769};
  const GOOGLE_MAPS_APIKEY = '…';

  // useEffect(() => {
  //   Geolocation.getCurrentPosition(pos => {
  //     const crd = pos.coords;
  //     setPosition({
  //       latitude: crd.latitude,
  //       longitude: crd.longitude,
  //       latitudeDelta: 0.0421,
  //       longitudeDelta: 0.0421,
  //     });
  //   }).catch(err => {
  //     console.log(err);
  //   });
  // }, []);

  useEffect(() => {
    const getParams = () => {
      console.log({origin_desc: route.params.origin.description});
      console.log({origin_lat: route.params.origin.location.lat});
      console.log({origin_lng: route.params.origin.location.lng});

      console.log({dest_desc: route.params.destination.description});
      console.log({dest_lat: route.params.destination.destination.lat});
      console.log({dest_lng: route.params.destination.destination.lng});
    };
    // getParams();
  });
  // LOG  {"destination": {"description": "Rumuodara, Port Harcourt, Nigeria", "destination": {"lat": 4.8633799, "lng": 7.032226}}}
  // LOG  {"origin": {"description": "Woji, Port Harcourt, Nigeria", "location": {"lat": 4.8283388, "lng": 7.057910799999999}}}
  // LOG  {"destination": {"description": "Rumuodara, Port Harcourt, Nigeria", "destination": {"lat": 4.8633799, "lng": 7.032226}}}
  return (
    <>
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          showsUserLocation={true}
          customMapStyle={theme.dark ? mapDarkStyle : mapStandardStyle}
          initialRegion={{
            latitude: position.latitude,
            longitude: position.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}>
          <Marker
            coordinate={{
              latitude: position.latitude,
              longitude: position.longitude,
            }}
          />
          {/* {Object.keys(destination).length > 0 && (
            <Marker coordinate={destination} />
          )} */}
          <MapViewDirections
            origin={_origin}
            destination={destination}
            apikey={keys.GOOGLE_MAP_APIKEY}
            strokeWidth={6}
            strokeColor="red"
            optimizeWaypoints={true}
            onStart={params => {
              console.log(
                `Started routing between "${params.origin}" and "${params.destination}"`,
              );
            }}
            onReady={result => {
              console.log(`Distance: ${result.distance} km`);
              console.log(`Duration: ${result.duration} min.`);
              // fetchTime(result.distance, result.duration),
              mapRef.current.fitToCoordinates(result.coordinates, {
                edgePadding: {
                  // right: 30,
                  // bottom: 300,
                  // left: 30,
                  // top: 100,
                },
              });
            }}
            onError={errorMessage => {
              // console.log('GOT AN ERROR');
            }}
          />
        </MapView>
      </View>
    </>
  );
};

export default MapTestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    // borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
    //fontFamily: 'AntDesign',
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    paddingTop: 9,
    color: '#05375a',
  },
  map: {
    height: '100%',
  },
  // Callout bubble
  bubble: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 6,
    borderColor: '#ccc',
    borderWidth: 0.5,
    padding: 15,
    width: 150,
  },
  // Arrow below the bubble
  arrow: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#fff',
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -32,
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#007a87',
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -0.5,
    // marginBottom: -15
  },
  // Character name
  name: {
    fontSize: 16,
    marginBottom: 5,
  },
  // Character image
  image: {
    width: '100%',
    height: 80,
  },
  bottomCard: {
    // backgroundColor: 'gold',
    width: '100%',
    // height: 50,
    padding: 50,
    borderTopEndRadius: 24,
    borderTopStartRadius: 24,
    // borderTopColor: 'gold',
  },
  inpuStyle: {
    backgroundColor: 'white',
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    height: 48,
    justifyContent: 'center',
    marginTop: 16,
  },
});
