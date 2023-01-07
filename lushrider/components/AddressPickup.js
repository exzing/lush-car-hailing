import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
// import {GOOGLE_MAP_KEY} from '../constants/googleMapKey';
import GOOGLE_MAP_KEY, {keys} from '../env';

const AddressPickup = ({placheholderText}) => {
  const onPressAddress = (data, details) => {
    // console.log("details==>>>>", details)

    let resLength = details.address_components;
    let zipCode = '';

    let filtersResCity = details.address_components.filter(val => {
      if (val.types.includes('locality') || val.types.includes('sublocality')) {
        return val;
      }
      if (val.types.includes('postal_code')) {
        let postalCode = val.long_name;
        zipCode = postalCode;
      }
      return false;
    });

    let dataTextCityObj =
      filtersResCity.length > 0
        ? filtersResCity[0]
        : details.address_components[
            resLength > 1 ? resLength - 2 : resLength - 1
          ];

    let cityText =
      dataTextCityObj.long_name && dataTextCityObj.long_name.length > 17
        ? dataTextCityObj.short_name
        : dataTextCityObj.long_name;

    // console.log("zip cod found", zipCode)
    // console.log("city namte", cityText)

    const lat = details.geometry.location.lat;
    const lng = details.geometry.location.lng;
    // fetchAddress(lat, lng, zipCode, cityText);
  };

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder={placheholderText}
        // minLength={2}
        autoFocus={false}
        enablePoweredByContainer={false}
        fetchDetails={true}
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          console.log(data, details);
        }}
        styles={{
          container: {
            // alignSelf: 'stretch',
            borderRadius: 16,
            paddingLeft: 10,
            paddingRight: 10,
          },
          textInput: {
            height: 46,
            color: 'grey',
            borderRadius: 16,
            borderWidth: 1,
            borderColor: 'gold',
            backgroundColor: 'white',
            fontSize: 18,
            paddingHorizontal: 15,
          },
        }}
        renderLeftButton={() => (
          <Image
            // source={require('path/custom/left-icon')}
            source={require('../assets/search.png')}
          />
        )}
        // styles={{
        //   textInputContainer: styles.containerStyle,
        //   textInput: styles.textInputStyle,
        // }}
        // styles={{
        //   textInputContainer: {
        //     backgroundColor: 'gold',
        //   },
        //   textInput: {
        //     height: 38,
        //     color: '#5d5d5d',
        //     fontSize: 16,
        //   },
        //   // predefinedPlacesDescription: {
        //   //   color: '#1faadb',
        //   // },
        // }}
        query={{
          key: keys.GOOGLE_MAP_APIKEY,
          language: 'en',
        }}
      />
      {/* <GooglePlacesAutocomplete
        placeholder={placheholderText}
        onPress={onPressAddress}
        fetchDetails={true}
        // onPress={onPressAddress}
        query={{
          key: GOOGLE_MAP_KEY,
          language: 'en',
        }}
        styles={{
          textInputContainer: styles.containerStyle,
          textInput: styles.textInputStyle,
        }} 
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerStyle: {
    backgroundColor: 'white',
  },
  textInputStyle: {
    height: 48,
    color: 'black',
    fontSize: 16,
    backgroundColor: '#f3f3f3',
  },
  textInputContainer: {
    backgroundColor: 'grey',
  },
});

export default AddressPickup;
