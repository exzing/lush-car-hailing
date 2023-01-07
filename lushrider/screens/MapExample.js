import React, {Component, useState} from 'react';
import {Dimensions, StyleSheet, View, Text} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

import MapViewDirections from 'react-native-maps-directions';

const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 37.771707;
const LONGITUDE = -122.4053769;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const GOOGLE_MAPS_APIKEY = 'AIzaSyDNaKE-KYiemHsLIWpjRaZ8MpkZ7T3TkHE';

import {NativeModules} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {keys} from '../env';
import {getCurrentLocation} from '../helper/helperFunction';
const reactNativeVersion = NativeModules.PlatformConstants.reactNativeVersion;
const reactNativeVersionString = reactNativeVersion
  ? `${reactNativeVersion.major}.${reactNativeVersion.minor}.${
      reactNativeVersion.patch
    }${reactNativeVersion.prerelease ? ' pre-release' : ''}`
  : '';

// const reactNativeMapsVersion =
//   require('../node_modules/react-native-maps/package.json').version;
// const reactNativeMapsDirectionsVersion =
//   require('../node_modules/react-native-maps-directions/package.json').version;

const styles = StyleSheet.create({
  versionBox: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  versionText: {
    padding: 4,
    backgroundColor: '#FFF',
    color: '#000',
  },
});

export const MapExample_ = () => {
  const [coordinates, setCoordinates] = useState([
    'Twitter HQ, Market Street, San Francisco, CA, USA',
    'Apple Park Visitor Center',
  ]);

  const onMapPress = e => {
    this.setState({
      coordinates: [...this.state.coordinates, e.nativeEvent.coordinate],
    });
  };

  const onReady = result => {
    MapView.fitToCoordinates(result.coordinates, {
      edgePadding: {
        right: width / 10,
        bottom: height / 10,
        left: width / 10,
        top: height / 10,
      },
    });
  };

  const onError = errorMessage => {
    console.log(errorMessage); // eslint-disable-line no-console
  };

  const setDistance = (distance, duration_in_traffic) => {
    // console.log('setDistance');
    this.setState({
      distance: parseFloat(distance),
      durationInTraffic: parseInt(duration_in_traffic),
    });
  };

  return (
    <View style={StyleSheet.absoluteFill}>
      <MapView
        initialRegion={{
          latitude: LATITUDE,
          longitude: LONGITUDE,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        style={StyleSheet.absoluteFill}
        // ref={c => (mapView = c)} // eslint-disable-line react/jsx-no-bind
        onPress={onMapPress}>
        <MapViewDirections
          origin={this.state.coordinates[0]}
          destination={
            this.state.coordinates[this.state.coordinates.length - 1]
          }
          waypoints={this.state.coordinates.slice(1, -1)}
          mode="DRIVING"
          apikey={GOOGLE_MAPS_APIKEY}
          language="en"
          strokeWidth={4}
          strokeColor="black"
          onStart={params => {
            console.log(
              `Started routing between "${params.origin}" and "${
                params.destination
              }"${
                params.waypoints.length
                  ? ' using waypoints: ' + params.waypoints.join(', ')
                  : ''
              }`,
            );
          }}
          onReady={onReady}
          onError={errorMessage => {
            console.log(errorMessage);
          }}
          resetOnChange={false}
        />
      </MapView>
    </View>
  );
};
class MapExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      coordinates: [
        'Twitter HQ, Market Street, San Francisco, CA, USA',
        'Apple Park Visitor Center',
      ],
    };

    this.mapView = null;
  }

  onMapPress = e => {
    this.setState({
      coordinates: [...this.state.coordinates, e.nativeEvent.coordinate],
    });
  };

  onReady = result => {
    this.mapView.fitToCoordinates(result.coordinates, {
      edgePadding: {
        right: width / 10,
        bottom: height / 10,
        left: width / 10,
        top: height / 10,
      },
    });
  };

  onError = errorMessage => {
    console.log(errorMessage); // eslint-disable-line no-console
  };

  setDistance(distance, duration_in_traffic) {
    // console.log('setDistance');
    this.setState({
      distance: parseFloat(distance),
      durationInTraffic: parseInt(duration_in_traffic),
    });
  }

  render() {
    return (
      <>
        <>
          {/* <GooglePlacesAutocomplete
      placeholder="Enter Location"
      minLength={2}
      autoFocus={false}
      returnKeyType={'default'}
      fetchDetails={true}
      styles={{
        textInputContainer: {
          backgroundColor: 'grey',
        },
        textInput: {
          height: 38,
          color: '#5d5d5d',
          fontSize: 16,
        },
        predefinedPlacesDescription: {
          color: '#1faadb',
        },
      }}
    /> */}
          {/* <GooglePlacesAutocomplete
      placeholder="Search"
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log('data, details', data, details);
      }}
      query={{
        key: keys,
        language: 'en',
      }}
    /> */}
        </>
        <View style={StyleSheet.absoluteFill}>
          <MapView
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: LATITUDE,
              longitude: LONGITUDE,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}
            style={StyleSheet.absoluteFill}
            ref={c => (this.mapView = c)} // eslint-disable-line react/jsx-no-bind
            onPress={this.onMapPress}>
            <MapViewDirections
              origin={this.state.coordinates[0]}
              destination={
                this.state.coordinates[this.state.coordinates.length - 1]
              }
              waypoints={this.state.coordinates.slice(1, -1)}
              mode="DRIVING"
              apikey={GOOGLE_MAPS_APIKEY}
              language="en"
              strokeWidth={4}
              strokeColor="black"
              onStart={params => {
                console.log(
                  `Started routing between "${params.origin}" and "${
                    params.destination
                  }"${
                    params.waypoints.length
                      ? ' using waypoints: ' + params.waypoints.join(', ')
                      : ''
                  }`,
                );
              }}
              onReady={this.onReady}
              onError={errorMessage => {
                console.log(errorMessage);
              }}
              resetOnChange={false}
            />
          </MapView>
          {/* <View style={styles.versionBox}>
      <Text style={styles.versionText}>
        RN {reactNativeVersionString}, RNM: {reactNativeMapsVersion}, RNMD:{' '}
        {reactNativeMapsDirectionsVersion}
      </Text>
    </View> */}
        </View>
      </>
    );
  }
}

export default MapExample;
