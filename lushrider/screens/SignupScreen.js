import React, {useContext, useState} from 'react';
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
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import SocialButton from '../components/SocialButton';
import {AuthContext} from '../navigation/AuthProvider';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Fontiso from 'react-native-vector-icons/Fontisto';
import GradientText from '../components/GradientText';
import MaskedView from '@react-native-masked-view/masked-view';
import Toast from 'react-native-simple-toast';

const SignupScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState();
  const [emailValidError, setEmailValidError] = useState('');
  const [phoneValidError, setPhoneValidError] = useState('');
  const [nameValidError, setNameValidError] = useState('');
  const [passwordValidError, setPasswordValidError] = useState('');

  const {register, error, isLoading, user} = useContext(AuthContext);

  const [data, setData] = React.useState({
    name: '',
    password: '',
    email: '',
    confirm_password: '',
    phone: '',
    check_textInputChange: false,
    secureTextEntry: true,
    confirm_secureTextEntry: true,
    isValidPassword: true,
    isValidPhone: true,
    isValidName: true,
  });

  const emailInputChange = val => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (val.length === 0) {
      setEmailValidError('email address must not be empty');
    } else if (reg.test(val) === false) {
      setEmailValidError('enter valid email address');
    } else if (reg.test(val) === true) {
      setEmailValidError('');
    }
    // console.log({emailInputChange: emailInputChange});
    if (emailValidError === '') {
      setData({
        ...data,
        // username: val,
        email: val,
        check_textInputChange: true,
      });
    } else {
      setData({
        ...data,
        // username: val,
        email: val,
        check_textInputChange: false,
      });
    }
  };

  const handlePhoneChange = val => {
    const reg =
      /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d+)\)?)[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/i;

    if (val.length === 0) {
      setPhoneValidError('phone number must not be empty');
    } else if (reg.test(val) === false) {
      setPhoneValidError('enter valid phone no; like, 09012341234');
    } else if (reg.test(val) === true) {
      setPhoneValidError('');
    }

    if (phoneValidError === '') {
      setData({
        ...data,
        phone: val,
        isValidPhone: true,
      });
    } else {
      setData({
        ...data,
        phone: val,
        isValidPhone: false,
      });
    }
  };
  const handleNameChange = val => {
    const reg = /^\w[\w.]{3,18}\w$/;
    if (val.length === 0) {
      setNameValidError('username must not be empty');
    } else if (reg.test(val) === false) {
      setNameValidError('enter valid username; words btw 5 and 20');
    } else if (reg.test(val) === true) {
      setNameValidError('');
    }

    // console.log({nameValidError: nameValidError});
    if (nameValidError === '') {
      setData({
        ...data,
        name: val,
        isValidName: true,
      });
    } else {
      setData({
        ...data,
        name: val,
        isValidName: false,
      });
    }
  };
  const handlePasswordChange = val => {
    const reg = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    if (val.length === 0) {
      setPasswordValidError('password must not be empty');
    } else if (reg.test(val) === false) {
      setPasswordValidError('enter valid password. Hint: @1aBa2');
    } else if (reg.test(val) === true) {
      setPasswordValidError('');
    }

    // console.log({passwordValidError: passwordValidError});
    if (passwordValidError === '') {
      setData({
        ...data,
        password: val,
        isValidPassword: true,
      });
    } else {
      setData({
        ...data,
        password: val,
        isValidPassword: false,
      });
    }
  };

  const handleConfirmPasswordChange = val => {
    setData({
      ...data,
      confirm_password: val,
    });
  };

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  const updateConfirmSecureTextEntry = () => {
    setData({
      ...data,
      confirm_secureTextEntry: !data.confirm_secureTextEntry,
    });
  };

  const handleInitialSignup = (_email, pword, userName, _phone) => {
    console.log({data: data, error: error});
    emailInputChange(_email) ||
      handleNameChange(userName) ||
      handlePasswordChange(pword) ||
      handlePhoneChange(_phone);

    console.log({
      userName: userName,
      isLoading,
      pword: pword,
      phone: _phone,
      email: _email,
    });
    //    register: async (email, password, userName, phone)
    if (_email && pword && userName && _phone) {
      register(_email, pword, userName, _phone);
      // navigation.navigate('VehicleDetails', {_email, pword, userName, _phone});
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#000000" barStyle="light-content" />
      <View style={styles.header}>
        {/* <Text style={styles.text_header}> Driver's Signup</Text> */}
        <GradientText style={styles.text_header}>Rider's Signup</GradientText>
      </View>

      <Animatable.View
        // animation="fadeInUpBig"
        style={styles.footer}>
        <ScrollView>
          {/* Username */}
          <Text style={styles.text_footer}>Username</Text>
          <View style={styles.action}>
            <FontAwesome name="user-o" color="#f9d29d" size={20} />
            <TextInput
              placeholder="enter username or full name"
              placeholderTextColor="grey"
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={val => {
                handleNameChange(val);
                setName(val);
              }}
            />
            {data.check_textInputChange ? (
              <Animatable.View animation="bounceIn">
                <Feather name="check-circle" color="#f9d29d" size={20} />
              </Animatable.View>
            ) : null}
          </View>
          {data.isValidName ? null : (
            <Animatable.View animation="fadeInLeft" duration={500}>
              <Text style={styles.errorMsg}>{nameValidError}</Text>
            </Animatable.View>
          )}
          {/* Email */}
          <Text style={styles.text_footer}>Email</Text>
          <View style={styles.action}>
            <Feather name="mail" color="#f9d29d" size={20} />
            <TextInput
              placeholder="enter valid email"
              placeholderTextColor="grey"
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={val => {
                emailInputChange(val);
                setEmail(val);
              }}
            />
            {data.check_textInputChange ? (
              <Animatable.View animation="bounceIn">
                <Feather name="check-circle" color="#f9d29d" size={20} />
              </Animatable.View>
            ) : null}
          </View>
          {data.isValidUser ? null : (
            <Animatable.View animation="fadeInLeft" duration={500}>
              <Text style={styles.errorMsg}>{emailValidError}</Text>
            </Animatable.View>
          )}
          {/* Phone */}

          <Text style={styles.text_footer}>Phone</Text>
          <View style={styles.action}>
            <Feather name="phone" color="#f9d29d" size={20} />
            <TextInput
              placeholder="enter valid phone number"
              placeholderTextColor="grey"
              secureTextEntry={data.secureTextEntry ? true : false}
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={val => {
                handlePhoneChange(val);
                setPhone(val);
              }}
            />
            <TouchableOpacity onPress={updateSecureTextEntry}>
              {data.secureTextEntry ? (
                <Feather name="eye-off" color="#f9d29d" size={20} />
              ) : (
                <Feather name="eye" color="#f9d29d" size={20} />
              )}
            </TouchableOpacity>
          </View>
          {data.isValidPhone ? null : (
            <Animatable.View animation="fadeInLeft" duration={500}>
              <Text style={styles.errorMsg}>{phoneValidError}</Text>
            </Animatable.View>
          )}

          {/* Password */}
          <Text style={styles.text_footer}>Password</Text>
          <View style={styles.action}>
            <Feather name="lock" color="#f9d29d" size={20} />
            <TextInput
              placeholder="enter password here"
              placeholderTextColor="grey"
              secureTextEntry={data.secureTextEntry ? true : false}
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={val => {
                handlePasswordChange(val);
                setPassword(val);
              }}
            />
            <TouchableOpacity onPress={updateSecureTextEntry}>
              {data.secureTextEntry ? (
                <Feather name="eye-off" color="#f9d29d" size={20} />
              ) : (
                <Feather name="eye" color="#f9d29d" size={20} />
              )}
            </TouchableOpacity>
          </View>
          {data.isValidPassword ? null : (
            <Animatable.View animation="fadeInLeft" duration={500}>
              <Text style={styles.errorMsg}>{passwordValidError}</Text>
            </Animatable.View>
          )}

          {/* Terms of Service */}
          <View style={styles.textPrivate}>
            <Text style={styles.color_textPrivate}>
              By signing up you agree to our
            </Text>
            <Text style={[styles.color_textPrivate, {fontWeight: 'bold'}]}>
              {' '}
              Terms of service
            </Text>
            <Text style={styles.color_textPrivate}> and</Text>
            <Text style={[styles.color_textPrivate, {fontWeight: 'bold'}]}>
              {' '}
              Privacy policy
            </Text>
          </View>
          {!error ? null : (
            <Animatable.View animation="fadeInLeft" duration={1000}>
              <Text style={styles.errorMsg}>
                {data.check_textInputChange && error.toString()}
              </Text>
              {/* <Animatable.Text animation={fadeIn} >Fade me in</Animatable.Text> */}
            </Animatable.View>
          )}
          {/* Loader */}
          {/* {isLoading === true ? (
            <View style={styles.preloader}>
              <ActivityIndicator size="large" color="gold" />
              Toast.showWithGravity(`Welcome $
              {user ? user.displayName : user.email}!`, Toast.LONG, Toast.TOP);
            </View>
          ) : (
            ''
          )} */}
          {isLoading && (
            <View style={styles.preloader}>
              <ActivityIndicator size="large" color="gold" />
              {Toast.showWithGravity(`Welcome!`, Toast.LONG, Toast.TOP)}
            </View>
          )}

          <View style={styles.button}>
            {/* Continue Button */}
            <TouchableOpacity
              style={styles.signIn}
              // onPress={() => {}}
              onPress={() => {
                handleInitialSignup(
                  data.email,
                  data.password,
                  data.name,
                  data.phone,
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

            {/* Navigate to Signin Button */}
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[
                styles.signIn,
                {
                  borderColor: '#f9d29d',
                  borderWidth: 1,
                  marginTop: 15,
                },
              ]}>
              <Text
                style={[
                  styles.textSign,
                  {
                    color: '#f9d29d',
                  },
                ]}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animatable.View>
    </View>
  );
};

export default SignupScreen;

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
    paddingHorizontal: 90,
    paddingBottom: 50,
  },
  text_footer: {
    color: '#f9d29d',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
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
const styles_ = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafd',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    // fontFamily: 'Kufam-SemiBoldItalic',
    //fontFamily: 'AntDesign',
    fontSize: 28,
    marginBottom: 10,
    color: '#051d5f',
  },
  navButton: {
    marginTop: 15,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
    //fontFamily: 'AntDesign',
  },
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 35,
    justifyContent: 'center',
  },
  color_textPrivate: {
    fontSize: 13,
    fontWeight: '400',
    //fontFamily: 'AntDesign',
    color: 'grey',
  },
});
