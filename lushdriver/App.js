/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-get-random-values';
import '@ethersproject/shims';
import React, {useEffect, useState} from 'react';

import {LogBox, StyleSheet} from 'react-native';

import {getDatabase, ref, onValue} from 'firebase/database';
import {initializeApp} from 'firebase/app';
import Routes from './navigation/Routes';
import {AuthProvider} from './navigation/AuthProvider';
import {NetWorkProvider} from './navigation/NetworkProvider';
import {Client} from 'xrpl';

const App = () => {
  LogBox.ignoreAllLogs();
  LogBox.ignoreLogs([
    "Warning: The provided value 'moz",
    "Warning: The provided value 'ms-stream",
  ]);

  useEffect(() => {
    const appUrl = initializeApp({
      databaseURL: 'https://exzingdb-default-rtdb.firebaseio.com',
    });
    const db = getDatabase(appUrl);
    const starCountRef = ref(db, 'riders/');
    onValue(starCountRef, snapshot => {
      const data = snapshot.val();
    });
  }, []);

  return (
    <NetWorkProvider>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </NetWorkProvider>
  );
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
