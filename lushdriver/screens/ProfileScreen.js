/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';

import {AuthContext} from '../navigation/AuthProvider';

import {firebase} from '@react-native-firebase/auth';
import {Divider} from 'react-native-paper';
import {DisplayBox} from '../components/DisplayBox';
import {styles} from '../styles/profile';

const ProfileScreen = ({navigation, route}) => {
  const {user, logout, wallet} = useContext(AuthContext);
  const userPhoto = require('../assets/users/user_icon.png');

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [isFocused, setIsFocused] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      await firebase
        .database()
        .ref('drivers')
        .once('value', snapshot => {
          console.log({drivers: snapshot.val()});
          setUserData(snapshot.val());
        });
    };
    getUser();

    navigation.addListener('focus', () => setLoading(!loading));
  }, [loading, navigation]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'beige'}}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}
        showsVerticalScrollIndicator={false}>
        <Image
          resizeMode="stretch"
          source={userPhoto}
          style={styles.userImage}
        />
        <Text style={styles.userName}>
          {user ? user?.displayName : 'Test User'}
        </Text>

        <Divider />

        {/* <Text style={styles.aboutUser}>
          {userData ? userData.about || 'No details added.' : ''}
        </Text> */}
        <View style={styles.userBtnWrapper}>
          {route.params ? (
            <>
              <TouchableOpacity style={styles.userBtn} onPress={() => {}}>
                <Text style={styles.userBtnTxt}>Message</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.userBtn} onPress={() => {}}>
                <Text style={styles.userBtnTxt}>Follow</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.userBtn}
                onPress={() => {
                  {
                  }
                  // navigation.navigate('EditProfile');
                }}>
                <Text style={styles.userBtnTxt}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.userBtn} onPress={() => logout()}>
                <Text style={styles.userBtnTxt}>Logout</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
