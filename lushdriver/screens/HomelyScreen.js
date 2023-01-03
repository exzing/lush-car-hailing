import React, {useState} from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import Screen from '../components/Screen';
import tw from 'tailwind-react-native-classnames';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {keys} from '../env';
import {useDispatch} from 'react-redux';
import {setDestination, setOrigin} from '../redux/slices/navSlice';

const HomelyScreen = () => {
  const dispatch = useDispatch();
  const [origin, setOrigin] = useState('');

  return (
    <Screen style={tw`bg-white h-full`}>
      <View style={tw`p-5`}>
        <View style={tw`mb-3`}>
          <GooglePlacesAutocomplete
            placeholder="Where from?"
            nearbyPlacesAPI="GooglePlacesSearch"
            debounce={400}
            onPress={(data, details = null) => {
              console.log({data_: data, details_: details});
              // dispatch(
              setOrigin({
                location: details.geometry.location,
                description: data.description,
              }),
                // );
                dispatch(setDestination(null));
            }}
            minLength={2}
            fetchDetails={true}
            returnKeyType={'search'}
            onFail={error => console.error(error)}
            query={{
              key: keys.GOOGLE_MAP_APIKEY,
              language: 'en',
            }}
            styles={{
              container: styles.container,
              textInput: styles.textInput,
            }}
            renderLeftButton={() => (
              <Image
                // source={require('path/custom/left-icon')}
                source={require('../assets/location.png')}
              />
            )}
            enablePoweredByContainer={false}
          />
          <GooglePlacesAutocomplete
            placeholder="Where to?"
            nearbyPlacesAPI="GooglePlacesSearch"
            debounce={400}
            onPress={(data, details = null) => {
              console.log({data: data, details: details});
              // dispatch(
              setDestination({
                destination: details.geometry.location,
                description: data.description,
              });
              // );
              // dispatch(setDestination(null));
            }}
            minLength={2}
            fetchDetails={true}
            returnKeyType={'search'}
            onFail={error => console.error(error)}
            query={{
              key: keys.GOOGLE_MAP_APIKEY,
              language: 'en',
            }}
            styles={{
              container: styles.container,
              textInput: styles.textInput,
            }}
            renderLeftButton={() => (
              <Image
                // source={require('path/custom/left-icon')}
                source={require('../assets/destination.png')}
              />
            )}
            enablePoweredByContainer={false}
          />
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  logo: {
    height: 50,
    width: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  // styles={{
  container: {
    flex: 0,
    borderRadius: 16,
    paddingLeft: 10,
    paddingRight: 10,
  },
  textInput: {
    fontSize: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'gold',
    backgroundColor: 'white',
  },
  // }}
});

export default HomelyScreen;
