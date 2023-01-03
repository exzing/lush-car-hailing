import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  StyleSheet,
  ScrollView,
  TextInput,
  StatusBar,
  ActivityIndicator,
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
// import {useTheme} from 'react-native-paper';

// import FormInput from '../components/FormInput';
// import FormButton from '../components/FormButton';
// import SocialButton from '../components/SocialButton';
import {AuthContext} from '../navigation/AuthProvider';
import Toast from 'react-native-simple-toast';
// import SimpleLottie from '../components/SimpleLottie';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [emailValidError, setEmailValidError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [data, setData] = useState({
    username: '',
    password: '',
    email: '',
    // isLoading: false,
    check_textInputChange: false,
    secureTextEntry: true,
    isValidUser: true,
    isValidPassword: true,
  });

  //   createUserWithEmailAndPassword(auth, email, password)
  //   .then((userCredential) => {
  //     // Signed in
  //     const user = userCredential.user;
  //     // ...
  //   })
  //   .catch((error) => {
  //     const errorCode = error.code;
  //     const errorMessage = error.message;
  //     // ..
  //   });
  // auth_signup_password.js

  const {login, googleLogin, fbLogin, user, error, isLoading} =
    useContext(AuthContext);

  const emailInputChange = val => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (val.length === 0) {
      setEmailValidError('email address must not be empty');
    } else if (reg.test(val) === false) {
      setEmailValidError('enter valid email address');
    } else if (reg.test(val) === true) {
      setEmailValidError('');
    }

    if (val.trim().length >= 0 && reg.test(val) === true) {
      setData({
        ...data,
        username: val,
        email: val,
        check_textInputChange: true,
        isValidUser: true,
        // isLoading: false,
      });
    } else {
      setData({
        ...data,
        username: val,
        email: val,
        check_textInputChange: false,
        isValidUser: false,
        isLoading: true,
      });
    }
  };

  const handlePasswordChange = val => {
    if (val.trim().length >= 6) {
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

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  const handleValidUser = val => {
    if (val.trim().length >= 4) {
      setData({
        ...data,
        isValidUser: true,
      });
    } else {
      setData({
        ...data,
        isValidUser: false,
      });
    }
  };

  const loginHandle = (userName, pword) => {
    console.log({data: data, error: error});
    emailInputChange(userName) && handlePasswordChange(pword);
    console.log({userName: userName, isLoading});
    if (userName && pword) {
      login(userName, password);
    }
  };

  const fadeIn = {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  };

  // return (
  //   <ScrollView contentContainerStyle={styles.container}>
  //     <Image
  //       source={require('../assets/rn-social-logo.png')}
  //       style={styles.logo}
  //     />
  //     <Text style={styles.text}>RN Social App</Text>

  //     <FormInput
  //       labelValue={email}
  //       onChangeText={userEmail => setEmail(userEmail)}
  //       placeholderText="Email"
  //       iconType="user"
  //       keyboardType="email-address"
  //       autoCapitalize="none"
  //       autoCorrect={false}
  //     />

  //     <FormInput
  //       labelValue={password}
  //       onChangeText={userPassword => setPassword(userPassword)}
  //       placeholderText="Password"
  //       iconType="lock"
  //       secureTextEntry={true}
  //     />

  //     <FormButton
  //       buttonTitle="Sign In"
  //       onPress={() => login(email, password)}
  //     />

  //     <TouchableOpacity style={styles.forgotButton} onPress={() => {}}>
  //       <Text style={styles.navButtonText}>Forgot Password?</Text>
  //     </TouchableOpacity>

  //     {Platform.OS === 'android' ? (
  //       <View>
  //         <SocialButton
  //           buttonTitle="Sign In with Facebook"
  //           btnType="facebook"
  //           color="#4867aa"
  //           backgroundColor="#e6eaf4"
  //           // onPress={() => fbLogin()}
  //         />

  //         <SocialButton
  //           buttonTitle="Sign In with Google"
  //           btnType="google"
  //           color="#de4d41"
  //           backgroundColor="#f5e7ea"
  //           // onPress={() => googleLogin()}
  //         />
  //       </View>
  //     ) : null}

  //     <TouchableOpacity
  //       style={styles.forgotButton}
  //       onPress={() => navigation.navigate('Signup')}>
  //       <Text style={styles.navButtonText}>
  //         Don't have an acount? Create here
  //       </Text>
  //     </TouchableOpacity>
  //   </ScrollView>
  // );
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#000000" barStyle="light-content" />
      <View style={styles.header}>
        <Image
          source={require('../assets/ic_launcher_round.png')}
          style={styles_.logo}
        />
        <Image source={require('../assets/car144.png')} />
      </View>
      <Text style={styles_.text}>Welcome back</Text>
      <Animatable.View
        animation="fadeInUpBig"
        style={[
          styles.footer,
          {
            // backgroundColor: colors.background
          },
        ]}>
        <View>
          <Text
            style={[
              styles.text_footer,
              {
                color: '#f9d29d',
                // color: colors.text
              },
            ]}>
            Username
          </Text>
          <View style={styles.action}>
            <FontAwesome
              name="user-o"
              color="#f9d29d"
              // color={colors.text}
              size={20}
            />
            <TextInput
              placeholder="enter username or email "
              placeholderTextColor="grey"
              style={[
                styles.textInput,
                {
                  color: 'white',
                  // color: colors.text
                },
              ]}
              autoCapitalize="none"
              onChangeText={val => {
                emailInputChange(val);
                setEmail(val);
                // onChangeText={userEmail => setEmail(userEmail)}
              }}
              // onEndEditing={e => handleValidUser(e.nativeEvent.text)}
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
        </View>

        <View>
          <Text
            style={[
              styles.text_footer,
              {
                // color: colors.text,
                color: '#f9d29d',
                marginTop: 35,
              },
            ]}>
            Password
          </Text>
          <View style={styles.action}>
            <Feather
              name="lock"
              // color={colors.text}
              color="#f9d29d"
              size={20}
            />
            <TextInput
              placeholder="enter password"
              placeholderTextColor="grey"
              secureTextEntry={data.secureTextEntry ? true : false}
              style={[
                styles.textInput,
                {
                  color: 'white',
                  // color: colors.text
                },
              ]}
              autoCapitalize="none"
              onChangeText={val => {
                handlePasswordChange(val);
                setPassword(val);
              }}
              // onChangeText={val => handlePasswordChange(val)}
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
              <Text style={styles.errorMsg}>
                Password must be 6 characters long.
              </Text>
            </Animatable.View>
          )}

          <TouchableOpacity>
            <Text style={{color: '#f9d29d', marginTop: 15}}>
              Forgot password?
            </Text>
          </TouchableOpacity>
        </View>
        {!error ? null : (
          <Animatable.View animation="fadeInLeft" duration={1000}>
            <Text style={styles.errorMsg}>
              {data.check_textInputChange && error.toString()}
            </Text>
            {/* <Animatable.Text animation={fadeIn} >Fade me in</Animatable.Text> */}
          </Animatable.View>
        )}
        {/* {isLoading === true ? (
          <View style={styles.preloader}>
            <ActivityIndicator size="large" color={'gold'} />
            Toast.showWithGravity(`Welcome Back $
            {user ? user.displayName : user.email}!`, Toast.LONG, Toast.TOP);
          </View>
        ) : (
          ''
        )} */}
        {isLoading && (
          <View style={styles.preloader}>
            <ActivityIndicator size="large" color="gold" />
            {Toast.showWithGravity(
              `Welcome Back
              ${user ? user.displayName : user?.email}!`,
              Toast.LONG,
              Toast.TOP,
            )}
          </View>
        )}

        <View style={styles.button}>
          <TouchableOpacity
            style={styles.signIn}
            onPress={() => {
              // setIsLoading(true);
              // login(email, password);
              loginHandle(data.email, data.password);
              // setIsLoading(false);
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
                Sign In
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Signup')}
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
              Don't have an account? Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  );
};

export default LoginScreen;

const styles_ = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  logo: {
    height: 100,
    width: 100,
    // resizeMode: 'cover',
    // justifyContent: 'space-evenly',
    // paddingHorizontal: 20,
    marginLeft: 60,
  },
  text: {
    // fontFamily: 'Kufam-SemiBoldItalic',
    //fontFamily: 'AntDesign',
    fontSize: 28,
    marginBottom: 10,
    color: '#ffff',
    justifyContent: 'center',
    paddingHorizontal: 100,
  },
  navButton: {
    marginTop: 15,
  },
  forgotButton: {
    marginVertical: 35,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
    //fontFamily: 'AntDesign',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    // justifyContent: 'center',
    // alignItems: 'center',
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
  header: {
    flex: 1,
    justifyContent: 'space-evenly',
    paddingHorizontal: 90,
    paddingBottom: 50,
  },
  footer: {
    flex: 3,
    backgroundColor: '#000000',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
    //fontFamily: 'AntDesign',
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
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
});
