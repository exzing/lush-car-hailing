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

const ProfileScreen = ({navigation, route}) => {
  const {user, logout} = useContext(AuthContext);
  const userPhoto = require('../assets/users/user_icon.png');

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  const getUser = async () => {
    await firebase
      .database()
      .ref('drivers')
      .once('value', snapshot => {
        console.log({drivers: snapshot.val()});
        setUserData(snapshot.val());
      });
  };

  useEffect(() => {
    getUser();

    navigation.addListener('focus', () => setLoading(!loading));
  }, []);

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
        <Text style={styles.aboutUser}>
          {userData ? userData.about || 'No details added.' : ''}
        </Text>
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
                  navigation.navigate('EditProfile');
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'beige',
    padding: 20,
  },
  userImage: {
    width: 150,
    height: 150,
    // marginRight: 22,
    // paddingTop: 30,
    // top: 12,
    alignSelf: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  aboutUser: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  userBtnWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  userBtn: {
    borderColor: '#f9d29d',
    borderWidth: 4,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
  },
  userBtnTxt: {
    color: '#000000',
  },
  userInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  userInfoItem: {
    justifyContent: 'center',
  },
  userInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  userInfoSubTitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
