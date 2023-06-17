/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
  TextInput,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';

import {AuthContext} from '../navigation/AuthProvider';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontiso from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import GradientText from '../components/GradientText';
import {
  SelectList,
  MultipleSelectList,
} from 'react-native-dropdown-select-list';
import {
  otherCarData,
  colorType,
  fuelType,
  vehicleType,
  initialCOe,
} from '../utils/data';

const VehicleDetailsScreen = ({navigation, route}) => {
  const [carReg, setCarReg] = useState('');
  const [carFuelValidError, setCarFuelValidError] = useState('');
  const [carColourValidError, setCarColourValidError] = useState('');
  const [carRegValidError, setRegNoValidError] = useState('');
  const [carMMYValidError, setMMYValidError] = useState('');
  const [carTypeValidError, setTypeValidError] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selected, setSelected] = React.useState([]);
  const [selectedFuel, setSelectedFuel] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [carbonFP, setCarbonFP] = useState(0);

  useEffect(() => {
    const estimatedCarbonFP = () => {
      const value =
        selectedFuel === 'Diesel' && selectedType === 'SmallDieselCar'
          ? initialCOe.Diesel1L + initialCOe.SmallDieselCar1Km
          : selectedFuel === 'Diesel' && selectedType === 'MediumDieselCar'
          ? initialCOe.Diesel1L + initialCOe.MediumDieselCar1Km
          : selectedFuel === 'Diesel' && selectedType === 'LargeDieselCar'
          ? initialCOe.Diesel1L + initialCOe.LargeDieselCar1Km
          : selectedFuel === 'Petrol' && selectedType === 'SmallPetrolCar'
          ? initialCOe.Petrol1L + initialCOe.SmallPetrolCar1Km
          : selectedFuel === 'Petrol' && selectedType === 'MediumPetrolCar'
          ? initialCOe.Petrol1L + initialCOe.MediumPetrolCar1Km
          : selectedFuel === 'Petrol' && selectedType === 'LargePetrolCar'
          ? initialCOe.Petrol1L + initialCOe.LargePetrolCar1Km
          : selectedFuel === 'LPG' && selectedType === 'MediumLPGCar'
          ? initialCOe.Petrol1L + initialCOe.MediumLPGCar1Km
          : selectedFuel === 'LPG' && selectedType === 'LargeLPGCar'
          ? initialCOe.Petrol1L + initialCOe.LargeLPGCar1Km
          : 0;

      setCarbonFP(value.toFixed(2));
      console.log({value: value});
      return value;
    };

    estimatedCarbonFP();
  }, [carbonFP, selectedFuel, selectedType]);

  const {register, error, isLoading} = useContext(AuthContext);
  const [data, setData] = React.useState({
    check_textInputChange: false,
    secureTextEntry: true,
    confirm_secureTextEntry: true,
    isValidCarFuel: false,
    isValidCarColour: false,
    isValidCarReg: false,
    isValidCarType: false,
    isValidCarMMY: false,
  });

  const carFuelInputChange = val => {
    console.log({val: val});
    if (val === '') {
      setCarFuelValidError('car fuel must not be empty');
    } else {
      setCarFuelValidError('');
    }
  };
  const carMMYInputChange = val => {
    console.log({selectedMMY: val});
    if (val === []) {
      setMMYValidError('Pls select values for Model, Make and Year');
    } else {
      setMMYValidError('');
    }
  };
  const carTypeInputChange = val => {
    console.log({typeVal: val});
    if (val === '') {
      setTypeValidError('car type must not be empty');
    } else {
      setTypeValidError('');
    }
  };
  const carColourInputChange = val => {
    if (val === '') {
      setCarColourValidError('vehicle color must not be empty');
    } else {
      setCarColourValidError('');
    }
  };
  const carRegInputChange = val => {
    if (val === '') {
      setRegNoValidError('Reg. no. must not be empty');
    } else {
      setRegNoValidError('');
    }
    if (carRegValidError === '') {
      setData({
        ...data,
        isValidCarReg: false,
      });
      setCarReg(val);
    } else {
      setData({
        ...data,
        isValidCarReg: true,
      });
      setCarReg('');
    }
  };

  const handleFinalSignup = (
    _email,
    _pword,
    _userName,
    _phone,
    _carFuel,
    _carColour,
    _carType,
    _carMMY,
    _carReg,
    _carbonFP,
  ) => {
    carFuelInputChange(_carFuel) ||
      carColourInputChange(_carColour) ||
      carTypeInputChange(_carType) ||
      carMMYInputChange(_carMMY) ||
      carRegInputChange(_carReg);

    if (
      _email &&
      _pword &&
      _userName &&
      _phone &&
      _carFuel &&
      _carColour &&
      _carType &&
      _carMMY &&
      _carReg &&
      _carbonFP
    ) {
      register(
        _email,
        _pword,
        _userName,
        _phone,
        _carType,
        _carColour,
        _carReg,
        _carFuel,
        _carMMY,
        _carbonFP,
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#000000" barStyle="light-content" />
      <View style={styles.header}>
        {/* <Text style={styles.text_header}> Driver's Signup</Text> */}
        <GradientText style={styles.text_header}>
          Driver's Vehicle Details & Carbon FootPrint
        </GradientText>
      </View>

      <Animatable.View style={styles.footer}>
        <ScrollView>
          {/* Car Model */}
          <Text
            style={{
              color: 'green',
              fontSize: 18,
              paddingBottom: 22,
              paddingTop: 12,
            }}>
            <MaterialCommunityIcons name="foot-print" color="green" size={29} />{' '}
            Carbon FootPrint
          </Text>

          <View style={styles.action}>
            <Text style={styles.textInput}>
              {carbonFP}
              Kg COe
            </Text>
          </View>

          {/* Car Make, Model, Year */}
          <Text style={styles.text_footer}>
            {' '}
            <Fontiso name="car" color="#f9d29d" size={17} /> Model, Make & Year
          </Text>
          <MultipleSelectList
            setSelected={val => setSelected(val)}
            data={otherCarData}
            save="value"
            label="Categories"
            inputStyles={{
              color: 'white',
            }}
            boxStyles={{
              borderRadius: 18,
            }}
            // dropdownStyles={{
            //   backgroundColor: 'white',
            // }}
            arrowicon={
              <FontAwesome name="chevron-down" size={12} color={'white'} />
            }
            closeicon={
              <FontAwesome name="chevron-up" size={12} color={'white'} />
            }
            searchicon={<FontAwesome name="search" size={12} color={'white'} />}
            search={true}
            checkBoxStyles={{
              borderColor: '#f9d29d',
            }}
            dropdownItemStyles={{
              color: '#f9d29d',
            }}
            dropdownTextStyles={{
              color: 'white',
            }}
            disabledItemStyles={{backgroundColor: '#000000'}}
            disabledTextStyles={{color: 'white'}}
            // badgeTextStyles={{
            //   color: 'white',
            // }}
          />
          {!selected && (
            <Animatable.View animation="fadeInLeft" duration={500}>
              <Text style={styles.errorMsg}>{carMMYValidError}</Text>
            </Animatable.View>
          )}
          {/* Car Type */}
          <Text style={styles.text_footer}>
            {' '}
            <MaterialIcons name="electric-car" color="#f9d29d" size={15} /> Type
          </Text>
          <SelectList
            setSelected={val => setSelectedType(val)}
            data={vehicleType}
            save="value"
            inputStyles={{
              color: 'white',
            }}
            dropdownTextStyles={{
              color: 'white',
            }}
            arrowicon={
              <FontAwesome name="chevron-down" size={12} color={'white'} />
            }
            searchicon={<FontAwesome name="search" size={12} color={'white'} />}
            search={true}
            // boxStyles={{borderRadius: 12}} //override default styles
            // defaultOption={{key: 15631, value: 'SmallPetrolCar'}}
            //override default styles
            boxStyles={{
              borderRadius: 12,
              // backgroundColor: '#f9d29d',
              // backgroundColor: '#171717',
            }}
            dropdownStyles={
              {
                // borderRadius: 12,
                // backgroundColor: '#f9d29d',
              }
            }
          />
          {!selectedType && (
            <Animatable.View animation="fadeInLeft" duration={500}>
              <Text style={styles.errorMsg}>{carTypeValidError}</Text>
            </Animatable.View>
          )}
          {/* Fuel Type */}
          <Text style={styles.text_footer}>
            {' '}
            <MaterialCommunityIcons
              name="fuel"
              color="#f9d29d"
              size={17}
            />{' '}
            Fuel
          </Text>
          <SelectList
            setSelected={val => setSelectedFuel(val)}
            data={fuelType}
            save="value"
            inputStyles={{
              color: 'white',
            }}
            arrowicon={
              <FontAwesome name="chevron-down" size={12} color={'white'} />
            }
            searchicon={<FontAwesome name="search" size={12} color={'white'} />}
            search={true}
            boxStyles={{
              borderRadius: 12,
            }}
            dropdownTextStyles={{
              color: 'white',
            }}
          />
          {!selectedFuel && (
            <Animatable.View animation="fadeInLeft" duration={500}>
              <Text style={styles.errorMsg}>{carFuelValidError}</Text>
            </Animatable.View>
          )}
          {/* Color */}
          <Text style={styles.text_footer}>
            <Icon name="color-fill" color="#f9d29d" size={20} />
            Color
          </Text>
          <SelectList
            setSelected={value => setSelectedColor(value)}
            data={colorType}
            save="value"
            inputStyles={{
              color: 'white',
            }}
            arrowicon={
              <FontAwesome name="chevron-down" size={12} color={'white'} />
            }
            searchicon={<FontAwesome name="search" size={12} color={'white'} />}
            search={true}
            boxStyles={{
              borderRadius: 12,
            }}
            dropdownTextStyles={{
              color: 'white',
            }}
          />
          {!selectedColor && (
            <Animatable.View animation="fadeInLeft" duration={500}>
              <Text style={styles.errorMsg}>{carColourValidError}</Text>
            </Animatable.View>
          )}
          {/* Car Reg */}
          <Text style={styles.text_footer}>
            {' '}
            <FontAwesome name="registered" color="#f9d29d" size={17} /> Car
            Registration
          </Text>
          <View style={styles.action}>
            <TextInput
              placeholder="Enter valid registration number"
              placeholderTextColor="white"
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={val => {
                carRegInputChange(val);
              }}
            />
          </View>
          {!data.isValidCarReg ? null : (
            <Animatable.View animation="fadeInLeft" duration={500}>
              <Text style={styles.errorMsg}>{carRegValidError}</Text>
            </Animatable.View>
          )}

          {!error ? null : (
            <Animatable.View animation="fadeInLeft" duration={1000}>
              <Text style={styles.errorMsg}>
                {data.check_textInputChange && error.toString()}
              </Text>
            </Animatable.View>
          )}
          {/* Loader */}
          {isLoading === true ? (
            <View style={styles.preloader}>
              <ActivityIndicator size="large" color="gold" />
            </View>
          ) : (
            ''
          )}

          <View style={styles.button}>
            {/* Continue Button */}
            <TouchableOpacity
              style={styles.signIn}
              onPress={() => {
                handleFinalSignup(
                  route && route.params._email,
                  route && route.params.pword,
                  route && route.params.userName,
                  route && route.params._phone,
                  selectedFuel,
                  selectedColor,
                  selectedType,
                  selected,
                  carReg,
                  carbonFP,
                );
              }}>
              <LinearGradient
                colors={['#191919', '#f9d29d']}
                style={styles.signIn}>
                <Text
                  style={[
                    styles.textSign,
                    {
                      color: '#fff',
                    },
                  ]}>
                  Continue
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animatable.View>
    </View>
  );
};

export default VehicleDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    // paddingHorizontal: 20,
    paddingTop: -70,
    paddingBottom: -40,
    // bottom: 12,
    textAlign: 'center',
  },
  footer: {
    flex: Platform.OS === 'ios' ? 3 : 5,
    backgroundColor: '#000000',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0000',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
    alignSelf: 'center',
    // paddingHorizontal: 90,
    paddingBottom: 20,
  },
  text_footer: {
    color: '#f9d29d',
    fontSize: 18,
    paddingBottom: 12,
    paddingTop: 12,
  },
  action: {
    flexDirection: 'row',
    marginTop: -5,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    // paddingBottom: -5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#fff',
  },
  button: {
    alignItems: 'center',
    marginTop: 50,
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
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  color_textPrivate: {
    color: 'white',
  },
});
