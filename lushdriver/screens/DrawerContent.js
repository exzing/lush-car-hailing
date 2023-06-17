import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {
  useTheme,
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from 'react-native-paper';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// import {AuthContext} from '../components/context';
import {AuthContext} from '../navigation/AuthProvider';
import {firebase} from '@react-native-firebase/database';
// import { firebase } from '@react-native-firebase/auth';

export function DrawerContent(props) {
  const paperTheme = useTheme();
  const {user, logout, driversIdRef} = useContext(AuthContext);
  const userPhoto = require('../assets/users/user_icon.png');
  const [profileName, setProfileName] = useState(null);
  const [profilePhone, setProfilePhone] = useState(null);
  const [profileEmail, setProfileEmail] = useState(null);

  useEffect(() => {
    const checkSignIn = async () => {
      // if (driversIdRef) {
      const authDriversRef = firebase.database().ref(`drivers/${user?.uid}`);
      authDriversRef.on('value', snap => {
        console.log({profileSnap: snap});

        if (snap.exists()) {
          const email = snap.val()?.email;
          const username = snap.val()?.userName;
          const phonenum = snap.val()?.phone;
          console.log({email, username, phonenum});
          setProfileEmail(email);
          setProfileName(username);
          setProfilePhone(phonenum);
        }
      });
      // }
    };
    checkSignIn();
  }, [driversIdRef, user?.uid]);

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={{flexDirection: 'row', marginTop: 15}}>
              {/* <Avatar.Image
                source={{
                  // uri: 'https://api.adorable.io/avatars/50/abott@adorable.png',
                  userPhoto,
                }}
                size={50}
              /> */}
              <Image
                resizeMode="stretch"
                source={userPhoto}
                style={styles.userImage}
              />

              <View style={{marginLeft: 15, flexDirection: 'column'}}>
                <Title style={styles.title}>
                  {' '}
                  {(user && user?.displayName) ?? profileName}
                </Title>
                <Caption style={styles.caption}>
                  {(user && user?.email) ?? profileEmail}
                </Caption>
                <Caption style={styles.caption}>
                  {(user && user?.phoneNumber) ?? profilePhone}
                </Caption>
              </View>
            </View>

            <View style={styles.row}>
              {/* <View style={styles.section}>
                <Paragraph style={[styles.paragraph, styles.caption]}>
                  80
                </Paragraph>
                <Caption style={styles.caption}>Followin</Caption>
              </View> */}
              <View style={styles.section}>
                <Paragraph style={[styles.paragraph, styles.caption]}>
                  100
                </Paragraph>
                <Caption style={styles.caption}>Rides</Caption>
              </View>
            </View>
          </View>

          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="home-outline" color={color} size={size} />
              )}
              label="Home"
              onPress={() => {
                props.navigation.navigate('Home');
              }}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="account-outline" color={color} size={size} />
              )}
              label="Profile"
              onPress={() => {
                props.navigation.navigate('Profile');
              }}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="chat" color={color} size={size} />
              )}
              label="Chats"
              onPress={() => {
                props.navigation.navigate('ChatScreen');
              }}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="wallet" color={color} size={size} />
              )}
              label="Wallet"
              onPress={() => {
                props.navigation.navigate('WalletScreen');
              }}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="bookmark-outline" color={color} size={size} />
              )}
              label="My Bookings"
              onPress={() => {
                {
                }
                // props.navigation.navigate('BookmarkScreen');
              }}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="timer-settings-outline" color={color} size={size} />
              )}
              label="Settings"
              onPress={() => {
                {
                }
                // props.navigation.navigate('SettingScreen');
              }}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="account-check-outline" color={color} size={size} />
              )}
              label="Support"
              onPress={() => {
                {
                }
                // props.navigation.navigate('SupportScreen');
              }}
            />
          </Drawer.Section>
          <Drawer.Section title="Preferences">
            <TouchableRipple
              onPress={() => {
                // toggleTheme();
              }}>
              <View style={styles.preference}>
                <Text>Dark Theme</Text>
                <View pointerEvents="none">
                  <Switch value={paperTheme.dark} />
                </View>
              </View>
            </TouchableRipple>
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({color, size}) => (
            <Icon name="exit-to-app" color={color} size={size} />
          )}
          label="Sign Out"
          onPress={() => {
            // signOut();
            logout();
          }}
        />
      </Drawer.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: '#f9d29d',
  },
  userImage: {
    width: 50,
    height: 50,
    // marginRight: 22,
    // paddingTop: 30,
    // top: 12,
    alignSelf: 'center',
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f9d29d',
    borderTopWidth: 5,
    // backgroundColor: '#f9d29d',
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
