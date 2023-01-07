import React, {useContext, useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {AuthContext} from './AuthProvider';
import {Provider} from 'react-redux';
import {store} from '../redux/store';

import AuthStack from './AuthStack';
import AppStack from './AppStack';
import {FirebaseOptions_ios, initializeFirebase} from '../firebase_config';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {DrawerContent} from '../screens/DrawerContent';

const Drawer = createDrawerNavigator();

import MainTabScreen from '../screens/MainTabScreen';
import SupportScreen from '../screens/SupportScreen';
import SettingsScreen from '../screens/SettingsScreen';
import BookmarkScreen from '../screens/BookmarkScreen';

import {firebase} from '@react-native-firebase/database';

import {useTheme} from 'react-native-paper';

const Routes = ({navigation}) => {
  const {user, setUser} = useContext(AuthContext);
  const [initializing, setInitializing] = useState(true);
  const {colors} = useTheme();

  useEffect(() => {
    const setupFirebase = async () => {
      try {
        // if (!firebase.apps.length) {
        // await firebase.initializeApp(FirebaseOptions_ios);
        // } else {
        await firebase.app(); // if already initialized, use that one
        // }
      } catch (error) {
        console.log({error: error});
      }
    };
    setupFirebase();
  }, []);

  const onAuthStateChanged = user => {
    setUser(user);

    if (initializing) {
      setInitializing(false);
    }
  };
  console.log({user_: user});

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  });

  if (initializing) {
    return null;
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        {user ? (
          // initializeFirebase() &&
          <Drawer.Navigator
            drawerContent={props => <DrawerContent {...props} />}
            screenOptions={{
              drawerActiveBackgroundColor: 'black',
              headerShown: false,
            }}>
            <Drawer.Screen
              name="AppDrawer"
              options={{
                title: '',
                headerTitle: '',
                headerTitleAlign: 'center',
                headerTintColor: '#fff',
                headerStyle: {
                  backgroundColor: '#000000',
                },
              }}
              component={MainTabScreen}
            />
            <Drawer.Screen name="SupportScreen" component={SupportScreen} />
            <Drawer.Screen name="SettingsScreen" component={SettingsScreen} />
            <Drawer.Screen name="BookmarkScreen" component={BookmarkScreen} />
          </Drawer.Navigator>
        ) : (
          <AuthStack />
        )}
      </NavigationContainer>
    </Provider>
  );
};

export default Routes;
