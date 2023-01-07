import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Platform,
  Button,
  Modal,
  Pressable,
  Dimensions,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';
import {useTheme} from '@react-navigation/native';

import Swiper from 'react-native-swiper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import StarRating from '../components/StarRating';
import {keys} from '../env';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Screen from '../components/Screen';
import tw from 'tailwind-react-native-classnames';
import Geolocation from 'react-native-geolocation-service';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import {theme} from '../styles/theme';
import {getCurrentLocation, locationPermission} from '../helper/helperFunction';
import Geocoder from 'react-native-geocoding';
import {AuthContext} from '../navigation/AuthProvider';
import Toast from 'react-native-simple-toast';
import RotateAnimation from '../components/RotateAnimation';
// import Modal from 'react-native-modal';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const HomeScreen = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const theme = useTheme();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [text, setText] = useState('');
  const [copySuccess, setCopySuccess] = useState(null);
  const [isEmptyField, setIsEmptyField] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [initialPickup, setInitialPickup] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const UploadMission = require('../assets/image_upload_mission_test.png');
  const CompanyIcon = require('../assets/ic_launcher_round.png');

  // return (
  //   <ScrollView style={styles.container}>
  //     <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
  //     {/* <View style={styles.sliderContainer}>
  //       <Swiper
  //         autoplay
  //         horizontal={false}
  //         height={200}
  //         activeDotColor="#FF6347">
  //         <View style={styles.slide}>
  //           <Image
  //             source={require('../assets/banners/car-banner1.jpg')}
  //             resizeMode="cover"
  //             style={styles.sliderImage}
  //           />
  //         </View>
  //         <View style={styles.slide}>
  //           <Image
  //             source={require('../assets/banners/car-banner2.jpg')}
  //             resizeMode="cover"
  //             style={styles.sliderImage}
  //           />
  //         </View>
  //         <View style={styles.slide}>
  //           <Image
  //             source={require('../assets/banners/car-banner3.jpg')}
  //             resizeMode="cover"
  //             style={styles.sliderImage}
  //           />
  //         </View>
  //       </Swiper>
  //     </View> */}

  //     <View style={styles.categoryContainer}>
  //       <TouchableOpacity
  //         style={styles.categoryBtn}
  //         onPress={() =>
  //           navigation.navigate('CardListScreen', {title: 'Body Wash'})
  //         }>
  //         <View style={styles.categoryIcon}>
  //           <Ionicons name="car-sport" size={35} color="#FF6347" />
  //         </View>
  //         <Text style={styles.categoryBtnTxt}>Body Wash</Text>
  //       </TouchableOpacity>
  //       <TouchableOpacity
  //         style={styles.categoryBtn}
  //         onPress={() =>
  //           navigation.navigate('CardListScreen', {title: 'Interior Cleansing'})
  //         }>
  //         <View style={styles.categoryIcon}>
  //           <MaterialCommunityIcons
  //             name="car-multiple"
  //             size={35}
  //             color="#FF6347"
  //           />
  //         </View>
  //         <Text style={styles.categoryBtnTxt}>Interior Cleansing</Text>
  //       </TouchableOpacity>
  //       <TouchableOpacity style={styles.categoryBtn} onPress={() => {}}>
  //         <View style={styles.categoryIcon}>
  //           <MaterialCommunityIcons name="car-wash" size={35} color="#FF6347" />
  //         </View>
  //         <Text style={styles.categoryBtnTxt}>Snacks Corner</Text>
  //       </TouchableOpacity>
  //     </View>
  //     <View style={[styles.categoryContainer, {marginTop: 10}]}>
  //       <TouchableOpacity style={styles.categoryBtn} onPress={() => {}}>
  //         <View style={styles.categoryIcon}>
  //           <Fontisto name="hotel" size={35} color="#FF6347" />
  //         </View>
  //         <Text style={styles.categoryBtnTxt}>Hotels</Text>
  //       </TouchableOpacity>
  //       <TouchableOpacity style={styles.categoryBtn} onPress={() => {}}>
  //         <View style={styles.categoryIcon}>
  //           <Ionicons name="md-restaurant" size={35} color="#FF6347" />
  //         </View>
  //         <Text style={styles.categoryBtnTxt}>Dineouts</Text>
  //       </TouchableOpacity>
  //       <TouchableOpacity style={styles.categoryBtn} onPress={() => {}}>
  //         <View style={styles.categoryIcon}>
  //           <MaterialIcons name="expand-more" size={35} color="#FF6347" />
  //         </View>
  //         <Text style={styles.categoryBtnTxt}>Show More</Text>
  //       </TouchableOpacity>
  //     </View>

  //     <View style={styles.cardsWrapper}>
  //       <Text
  //         style={{
  //           alignSelf: 'center',
  //           fontSize: 18,
  //           fontWeight: 'bold',
  //           color: '#333',
  //         }}>
  //         Recently Viewed
  //       </Text>
  //       <View style={styles.card}>
  //         <View style={styles.cardImgWrapper}>
  //           <Image
  //             source={require('../assets/banners/food-banner2.jpg')}
  //             resizeMode="cover"
  //             style={styles.cardImg}
  //           />
  //         </View>
  //         <View style={styles.cardInfo}>
  //           <Text style={styles.cardTitle}>Amazing Food Place</Text>
  //           <StarRating ratings={4} reviews={99} />
  //           <Text style={styles.cardDetails}>
  //             Amazing description for this amazing place
  //           </Text>
  //         </View>
  //       </View>
  //       <View style={styles.card}>
  //         <View style={styles.cardImgWrapper}>
  //           <Image
  //             source={require('../assets/banners/food-banner3.jpg')}
  //             resizeMode="cover"
  //             style={styles.cardImg}
  //           />
  //         </View>
  //         <View style={styles.cardInfo}>
  //           <Text style={styles.cardTitle}>Amazing Food Place</Text>
  //           <StarRating ratings={4} reviews={99} />
  //           <Text style={styles.cardDetails}>
  //             Amazing description for this amazing place
  //           </Text>
  //         </View>
  //       </View>
  //       <View style={styles.card}>
  //         <View style={styles.cardImgWrapper}>
  //           <Image
  //             source={require('../assets/banners/food-banner4.jpg')}
  //             resizeMode="cover"
  //             style={styles.cardImg}
  //           />
  //         </View>
  //         <View style={styles.cardInfo}>
  //           <Text style={styles.cardTitle}>Amazing Food Place</Text>
  //           <StarRating ratings={4} reviews={99} />
  //           <Text style={styles.cardDetails}>
  //             Amazing description for this amazing place
  //           </Text>
  //         </View>
  //       </View>
  //     </View>
  //   </ScrollView>
  // );
  const pickupRef = useRef();
  const destRef = useRef(null);

  const _getCurrentPosition = async () => {
    Geocoder.init(keys.GOOGLE_MAP_APIKEY); // initialized with a valid API key
    const status = await locationPermission();
    if (status === 'granted') {
      const location = await getCurrentLocation();
      console.log('Location Permission granted!');
      // console.log({currentLoc: location});
      // setCoordinates(loc);
      setCurrentPosition(location);
      const geom = [location.latitude, location.longitude];
      // // https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=YOUR_API_KEY
      // const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${geom}&key=${keys.GOOGLE_MAP_APIKEY}`;
      // // `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${destination}&key=${apiKey}&location=${this.props.latitude}, ${this.props.longitude}&radius=2000`;
      // try {
      //   const result = await fetch(apiUrl);
      //   const json = await result.json();
      //   console.log({json: json.results[0]});
      //   // this.setState({
      //   //   predictions: json.predictions,
      //   // });
      // } catch (err) {
      //   console.log('L', err);
      // }
      Geocoder.from({
        latitude: location.latitude,
        longitude: location.longitude,
      })
        .then(addressJson => {
          // console.log({addressJson: addressJson});
          // console.log({addressJson_res: addressJson.results[0]});
          // console.log({
          //   addressComp: addressJson.results[0].address_components[0],
          // });
          const _location = addressJson.results[0].formatted_address;
          setInitialPickup(_location);
          pickupRef.current?.setAddressText(_location);

          setOrigin({
            location: location,
            description: _location,
          });

          console.log('location_', _location);
        })
        .catch(error => console.warn(error));
    } else {
      console.log('Permission not grantedd!');
    }
  };

  // console.log({currentPosition_: currentPosition});

  const setInitialAddr = async () => {
    if (!currentPosition) return;
    // pickupRef?.current.setAddressText(currentPosition.);
    // Geocoder.init(keys.GOOGLE_MAP_APIKEY); // use a valid API key
    // console.log({Geocoder: Geocoder});
    // console.log({currentPosition: currentPosition});
    // Geocoder.from({
    //   latitude: currentPosition.latitude,
    //   longitude: currentPosition.longitude,
    // })
    //   .then(json => {
    //     var location = json.results[0].geometry.location;
    //     console.log('location_', location);
    //   })
    //   .catch(error => console.warn(error));

    // location object
    // Geocoder.from({
    //   latitude: currentPosition.latitude,
    //   longitude: currentPosition.longitude,
    // }).then(addressJson => {
    //   // const status = addressJson;
    //   console.log({addressJson:addressJson})
    //   // if (!addressJson) return;
    //   console.log({status: addressJson.status});
    //   if (addressJson && addressJson.status === 'OK') {
    //     console.log({
    //       _addressJson: addressJson.results[0].formatted_address,
    //       _addressComp: addressJson.results[0].address_components[0],
    //     });
    //     // const initialPickup = addressJson.results[0].formatted_address;
    //     // pickupRef.current?.setAddressText(initialPickup);
    //   }

    //   setOrigin({
    //     latitude: currentPosition.latitude,
    //     longitude: currentPosition.longitude,
    //   });
    // });

    // console.log({refText_: pickupRef.current?.getAddressText()});
  };

  useEffect(() => {
    _getCurrentPosition();
    // console.log({refText: ref.current?.getAddressText()});
    // ref.current?.setAddressText('');
  }, []);

  useEffect(() => {
    // console.log({isLoading: isLoading, user: user});
  });

  // Clear copy success style after 5 sec.
  useEffect(() => {
    if (!isEmptyField) return;

    const timeout = setTimeout(() => {
      setIsEmptyField(false);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [isEmptyField]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  // console.log({text: text});

  // return (
  //   <Screen style={tw`bg-black h-full`}>
  //     <StatusBar backgroundColor="#000000" barStyle="light-content" />
  //     <View style={styles.centeredView}>
  //       <GooglePlacesAutocomplete
  //         ref={ref}
  //         placeholder=" 🚖 Enter Pickup Location"
  //         textInputProps={{
  //           placeholderTextColor: 'white',
  //           returnKeyType: 'search',
  //           onChangeText: val => {
  //             console.log(val);
  //             setText(val);
  //           },
  //         }}
  //         //   textInputProps={{
  //         //     onChangeText: (text) => { console.log(text) }
  //         // }}
  //         nearbyPlacesAPI="GooglePlacesSearch"
  //         debounce={400}
  //         onPress={(data, details = null) => {
  //           console.log({data_: data, details_: details});
  //           // dispatch(
  //           setOrigin({
  //             location: details.geometry.location,
  //             description: data.description,
  //           });
  //           // );
  //           // dispatch(setDestination(null));
  //         }}
  //         // currentLocation={true}
  //         minLength={2}
  //         fetchDetails={true}
  //         returnKeyType={'search'}
  //         onFail={error => console.error(error)}
  //         query={{
  //           key: keys.GOOGLE_MAP_APIKEY,
  //           language: 'en',
  //         }}
  //         styles={{
  //           container: styles.container,
  //           textInput: styles.textInput,
  //           row: styles.row,
  //           textResultDescription: styles.textResultDescription,
  //           // containerResultRow: styles.containerResultRow,
  //         }}
  //         // renderLeftButton={() => (
  //         //   <Image
  //         //     // source={require('path/custom/left-icon')}
  //         //     source={require('../assets/location.png')}
  //         //   />
  //         // )}
  //         enablePoweredByContainer={false}
  //       />
  //       <LinearGradient
  //         colors={['black', '#f9d29d', '#f9d29d']}
  //         // start={{x: 0, y: 0.7}}
  //         end={{x: 1, y: 0.7}}
  //         // start={{x: 0.7, y: 0}}
  //         // colors={['#191919', '#f9d29d', 'red']}
  //         style={styles.modal}></LinearGradient>
  //       <Image
  //         resizeMode="stretch"
  //         source={CompanyIcon}
  //         style={styles.infoImage}
  //       />
  //     </View>
  //   </Screen>
  // );

  return (
    <Screen style={tw`bg-black h-full`}>
      <StatusBar backgroundColor="#000000" barStyle="light-content" />
      <View style={tw`p-5`}>
        <View style={tw`mb-3`}>
          <GooglePlacesAutocomplete
            ref={pickupRef}
            placeholder=" 🚖 Enter Pickup Location"
            textInputProps={{
              placeholderTextColor: 'white',
              returnKeyType: 'search',
              onChangeText: val => {
                // console.log(val);
                // setText(val);
              },
            }}
            renderRightButton={() => (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => {
                  pickupRef.current?.setAddressText('');
                }}>
                <Ionicons
                  name={'close-circle-outline'}
                  color={'red'}
                  size={20}
                />
              </TouchableOpacity>
            )}
            nearbyPlacesAPI="GooglePlacesSearch"
            debounce={400}
            onPress={(data, details = null) => {
              // console.log({origin_data: data, origin_details: details});
              console.log({
                origin: origin,
                pickupRef: pickupRef.current?.getAddressText(),
                initialPickup: initialPickup,
              });
              // dispatch(
              setOrigin({
                location: details.geometry.location || currentPosition,
                description:
                  data.description || pickupRef.current?.getAddressText(),
              });

              // );
              // dispatch(setDestination(null));
            }}
            // currentLocation={true}
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
              row: styles.row,
              textResultDescription: styles.textResultDescription,
              // containerResultRow: styles.containerResultRow,
            }}
            enablePoweredByContainer={false}
          />
          <GooglePlacesAutocomplete
            ref={destRef}
            placeholder="🚀 Enter Destination"
            textInputProps={{
              placeholderTextColor: 'white',
              returnKeyType: 'search',
            }}
            renderRightButton={
              () => (
                // ref.current?.getAddressText() ? (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => {
                    destRef.current?.setAddressText('');
                    setDestination('');
                  }}>
                  <Ionicons
                    name={'close-circle-outline'}
                    color={'red'}
                    size={20}
                  />
                </TouchableOpacity>
              )
              // ) : null
            }
            nearbyPlacesAPI="GooglePlacesSearch"
            debounce={400}
            onPress={(data, details = null) => {
              // console.log({dest_data: data, dest_details: details});
              // dispatch(
              setDestination({
                destination: details.geometry.location,
                description: data.description,
              });
              // );
              // dispatch(setDestination(null));
            }}
            editable={true}
            autoFocus={true}
            // getDefaultValue={}
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
              row: styles.row,
              // containerResultRow: styles.containerResultRow,
            }}
            enablePoweredByContainer={false}
          />
        </View>
      </View>
      <View style={styles.bottomCard}>
        <Animatable.View animation="fadeInUpBig" style={[styles.footer, {}]}>
          <TouchableOpacity
            // ref={ref}
            style={styles.signIn}
            onPress={() => {
              // console.log({
              //   origin: origin,
              //   destination: destination,
              //   pickupRef: pickupRef.current?.getAddressText(),
              //   initialPickup: initialPickup,
              //   destRef: destRef.current?.getAddressText(),
              //   currentPosition: currentPosition,
              // });
              setIsLoading(true);
              if (!origin) {
                setOrigin({
                  location: currentPosition,
                  description: initialPickup,
                });
              }

              console.log({
                origin: origin,
                destination: destination,
                pickupRef: pickupRef.current?.getAddressText(),
                initialPickup: initialPickup,
                destRef: destRef.current?.getAddressText(),
              });

              if (
                !origin ||
                !destination ||
                pickupRef.current?.getAddressText() === '' ||
                destRef.current?.getAddressText() === ''
              ) {
                setIsEmptyField(true);
                // navigation.navigate('SearchScreenModal');
              } else {
                navigation.navigate('MyMap', {origin, destination});
                navigation.navigate('MyMap', {
                  screen: 'Map',
                  params: {origin, destination},
                });
              }
              destRef.current?.setAddressText('');
              // setIsLoading(false);
            }}>
            <LinearGradient
              colors={['#191919', '#f9d29d']}
              style={styles.signIn}>
              <FontAwesome
                name="search"
                color="#f9d29d"
                // color={colors.text}
                size={20}
              />
              <Text
                style={[
                  styles.textSign,
                  {
                    color: '#fff',
                  },
                ]}>
                Search Destination
              </Text>
            </LinearGradient>
            <LinearGradient
              colors={['black', '#f9d29d', '#f9d29d']}
              start={{x: 0.7, y: 0}}
              // end={{x: 1, y: 0.7}}
              // start={{x: 0.5, y: 0}}
              // colors={['#191919', '#f9d29d', 'red']}
              style={styles.modal}></LinearGradient>
          </TouchableOpacity>
        </Animatable.View>
        <Image
          resizeMode="stretch"
          source={CompanyIcon}
          style={styles.infoImage}
        />
      </View>
      {/* {isLoading === true && <RotateAnimation />} */}
      {isLoading && (
        <View style={styles.preloader}>
          {/* <ActivityIndicator size="large" color="gold" /> */}
          {Toast.showWithGravity(
            `Connecting you with the best ride options...
              `,
            Toast.LONG,
            Toast.TOP,
          )}
        </View>
      )}
      {isEmptyField && (
        <View style={{flex: 1}}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={true}
            onRequestClose={() => {
              // Alert.alert('Modal has been closed.');
              setModalVisible(true);
            }}>
            <View style={styles.centeredView}>
              <LinearGradient
                colors={['black', '#f9d29d', 'green']}
                start={{x: 0.7, y: 0}}
                // colors={['#191919', '#f9d29d', 'red']}
                style={styles.modal}>
                <Text style={styles.modalText}>❗Please Enter Location!</Text>
              </LinearGradient>
              {/* <Image
                resizeMode="stretch"
                source={CompanyIcon}
                style={styles.infoImage}
              /> */}
            </View>
          </Modal>
        </View>
      )}
    </Screen>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 0,
    borderRadius: 16,
    paddingLeft: 10,
    paddingRight: 10,
    borderColor: 'gold',
  },
  clearButton: {
    top: 12,
  },
  companyInfoContainer: {
    marginTop: '-8%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: theme.APP_COLOR_1,
  },
  companyInfoContentContainer: {
    paddingBottom: '10%',
  },
  info: {
    paddingVertical: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoImage: {
    width: 80,
    height: 80,
    // marginRight: 22,
    // paddingTop: 30,
    top: 222,
    alignSelf: 'center',
  },
  compantTitle: {
    fontSize: 16,
    lineHeight: 24,
    //fontFamily: 'AntDesign',
    color: theme.COLORS.BACKGROUND,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    marginBottom: '70%',
    paddingHorizontal: '40%',
  },
  textResultDescription: {
    fontSize: 10,
    marginTop: 2,
    color: 'red',
  },
  tags: {
    marginTop: 9,
    flexDirection: 'row',
  },
  tag: {
    marginRight: 8,
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 10.5,
    backgroundColor: theme.COLORS.DARK_PURPLE,
  },
  tagText: {
    fontSize: 12,
    lineHeight: 14,
    //fontFamily: 'AntDesign',
    color: theme.COLORS.WHITE,
    textTransform: 'uppercase',
  },
  mainDivider: {
    height: 2,
    backgroundColor: theme.APP_COLOR_2,
  },
  rewardContainer: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    justifyContent: 'center',
  },
  rewardTitle: {
    fontSize: 16,
    lineHeight: 14,
    //fontFamily: 'AntDesign',
    color: theme.COLORS.WHITE,
    textTransform: 'uppercase',
  },
  rewardItem: {
    flexWrap: 'wrap',
    marginTop: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardCover: {
    height: '50%',
    width: '100%',
    borderRadius: 16,
    marginTop: '70%',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: '190%',
    bottom: 70,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    //fontFamily: 'AntDesign',
    color: 'red',
    textTransform: 'uppercase',
    // fontWeight: 'bold',
  },
  icon: {
    textAlign: 'center',
    fontSize: 40,
    fontWeight: 'bold',
    // width: '50%',
    // height: '50%',
    paddingBottom: 74,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modal: {
    // width: '100%',
    // height: '100%',
    // marginTop: '50%',
    height: deviceHeight,
    width: deviceWidth,
    marginTop: '90%',
    position: 'absolute',
    top: 70,
    left: 0,
    backgroundColor: '#f9d29d',
    // colors={['#191919', '#f9d29d']}
    justifyContent: 'center',
    borderRadius: 20,
    // flexDirection: 'row',
  },
  linearGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    width: '50%',
    height: '50%',
    marginTop: '50%',
  },
  bottomModalView: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalView: {
    // margin: 20,
    backgroundColor: 'gold',
    borderRadius: 20,
    // padding: 50,
    height: 200,
    width: 380,
    paddingTop: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textInput: {
    fontSize: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f9d29d',
    backgroundColor: 'grey',
    color: 'white',
  },
  row: {
    // {['#191919', '#f9d29d']}
    backgroundColor: 'grey',
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderRadius: 5,
    paddingLeft: 5,

    // color: 'gold'
  },
  containerResultRow: {
    flex: 1,
    height: 55,
    justifyContent: 'center',
    paddingHorizontal: 15,
    backgroundColor: 'white',
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
    alignSelf: 'center',
    flexDirection: 'row',
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
  textInput_: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    paddingTop: 9,
    color: '#05375a',
  },
  sliderContainer: {
    height: 200,
    width: '90%',
    marginTop: 10,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 8,
  },

  wrapper: {},

  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: 8,
  },
  sliderImage: {
    height: '100%',
    width: '100%',
    alignSelf: 'center',
    borderRadius: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    marginTop: 25,
    marginBottom: 10,
  },
  categoryBtn: {
    flex: 1,
    width: '30%',
    marginHorizontal: 0,
    alignSelf: 'center',
  },
  categoryIcon: {
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: 70,
    height: 70,
    backgroundColor: '#fdeae7' /* '#FF6347' */,
    borderRadius: 50,
  },
  categoryBtnTxt: {
    alignSelf: 'center',
    marginTop: 5,
    color: '#de4f35',
  },
  cardsWrapper: {
    marginTop: 20,
    width: '90%',
    alignSelf: 'center',
  },
  card: {
    height: 100,
    marginVertical: 10,
    flexDirection: 'row',
    shadowColor: '#999',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  cardImgWrapper: {
    flex: 1,
  },
  cardImg: {
    height: '100%',
    width: '100%',
    alignSelf: 'center',
    borderRadius: 8,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
  },
  cardInfo: {
    flex: 2,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#fff',
  },
  cardTitle: {
    fontWeight: 'bold',
  },
  cardDetails: {
    fontSize: 12,
    color: '#444',
  },
});

const styles_ = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'gold',
  },
  bottomModalView: {
    justifyContent: 'flex-end',
    margin: 20,
  },
  button: {
    width: '50%',
    borderRadius: 10,
    borderWidth: 2,
    borderStyle: 'solid',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'limegreen',
  },
  buttonText: {
    fontWeight: 'bold',
  },
  modal: {
    width: '100%',
    height: '100%',
    marginTop: '50%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'solid',
    backgroundColor: 'gold',
  },
  modalText: {
    fontSize: 20,
  },
});
