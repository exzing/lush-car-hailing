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

import ChatApp from '../firebase_example/ChapApp';

const Routes = ({navigation}) => {
  const {signedInRider} = useContext(AuthContext);

  return (
    <Provider store={store}>
      <NavigationContainer>
        {signedInRider ? (
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
            <Drawer.Screen name="ChatScreen" component={ChatApp} />
          </Drawer.Navigator>
        ) : (
          <AuthStack />
        )}
      </NavigationContainer>
    </Provider>
  );
};

export default Routes;
