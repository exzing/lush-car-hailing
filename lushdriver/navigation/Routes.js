import React, {useContext, useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {AuthContext} from './AuthProvider';
import {Provider} from 'react-redux';
import {store} from '../redux/store';

import AuthStack from './AuthStack';
// import AppStack from './AppStack';
import {FirebaseOptions_ios, initializeFirebase} from '../firebase_config';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {DrawerContent} from '../screens/DrawerContent';

const Drawer = createDrawerNavigator();

import {initializeApp} from 'firebase/app';
import {firebase} from '@react-native-firebase/database';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTheme} from 'react-native-paper';
import MainTabScreen from '../screens/MainTabScreen';
import SupportScreen from '../screens/SupportScreen';
import SettingsScreen from '../screens/SettingsScreen';
import BookmarkScreen from '../screens/BookmarkScreen';
import ChatApp from '../firebase_example/ChapApp';
import {WalletScreen} from '../screens/wallets/WalletScreen';
import {NetworkApp} from '../components/NetworkApp';
import {NetWorkContext} from './NetworkProvider';
import {Network} from '../components/Network';
import {styles} from '../styles/wallet';
import App from '../screens/wallets/components/wallet-ui/App';

// import {AuthContext} from './components/context';

// import RootStackScreen from './screens/RootStackScreen';

const Routes = ({navigation}) => {
  const {user, setUser} = useContext(AuthContext);
  const {network} = useContext(NetWorkContext);
  const [initializing, setInitializing] = useState(true);
  const {colors} = useTheme();

  useEffect(() => {
    const setupFirebase = async () => {
      if (!firebase.apps.length) {
        await firebase.initializeApp(FirebaseOptions_ios);
        // await firebase.initializeApp(FirebaseOptions_android);
      } else {
        await firebase.app(); // if already initialized, use that one
      }
    };
    setupFirebase();
  }, []);

  // console.log({user});

  // useEffect(() => {
  //   const getToken = async () => {
  //     return await firebase
  //       .auth()
  //       ?.currentUser?.getIdTokenResult(true)
  //       .then(result => {
  //         // console.log({userTokenIdResult: result});
  //       });
  //   };

  //   getToken();
  // });

  useEffect(() => {
    const onAuthStateChanged = user => {
      setUser(user);

      if (initializing) {
        setInitializing(false);
      }
    };
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, [initializing, setUser]);

  if (initializing) {
    return null;
  }

  const isConnected = network?.isConnected;

  return isConnected ? (
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
                // headerLeft: () => (
                //   <View style={{marginLeft: 10}}>
                //     <Icon.Button
                //       name="ios-menu"
                //       size={25}
                //       backgroundColor="gold"
                //       color={colors.text}
                //       onPress={() => navigation.openDrawer()}
                //     />
                //   </View>
                // ),
              }}
              component={MainTabScreen}
            />
            <Drawer.Screen name="SupportScreen" component={SupportScreen} />
            <Drawer.Screen name="SettingsScreen" component={SettingsScreen} />
            <Drawer.Screen name="BookmarkScreen" component={BookmarkScreen} />
            <Drawer.Screen name="ChatScreen" component={ChatApp} />
            {/* <Drawer.Screen name="WalletScreen" component={App} /> */}
          </Drawer.Navigator>
        ) : (
          <AuthStack />
        )}
      </NavigationContainer>
    </Provider>
  ) : (
    <View style={styles.container}>
      <Network status={isConnected} />
    </View>
  );
};

export default Routes;
