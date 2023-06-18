/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import {firebase} from '@react-native-firebase/database';
import {initializeApp} from 'firebase/app';
import {getDatabase, onValue, ref} from 'firebase/database';
import React, {useEffect} from 'react';
import {LogBox, StyleSheet} from 'react-native';
// import {FirebaseOptions_android, FirebaseOptions_ios} from './firebase_config';

import {AuthProvider} from './navigation/AuthProvider';
import Routes from './navigation/Routes';
import LoginScreen from './screens/LoginScreen';

const App = () => {
  // Ignore log notification by message:
  LogBox.ignoreLogs(['Error on GMAPS route request: ZERO_RESULTS']);
  LogBox.ignoreLogs(['Error on GMAPS route request: NOT_FOUND']);

  const setupFirebase = async () => {
    try {
      // if (!firebase.apps.length) {
      // await firebase.initializeApp(FirebaseOptions_ios);
      // await firebase.initializeApp(FirebaseOptions_android);
      // } else {
      await firebase.app(); // if already initialized, use that one
      // }
    } catch (error) {
      console.log({error: error});
    }
  };

  useEffect(() => {
    setupFirebase();
  }, []);

  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
  // return (
  //   <AuthProvider>
  //     <LoginScreen />
  //   </AuthProvider>
  // );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
