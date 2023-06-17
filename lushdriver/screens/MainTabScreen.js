import React from 'react';

import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ProfileScreen from './ProfileScreen';
import EditProfileScreen from './EditProfileScreen';

import {useTheme, Avatar} from 'react-native-paper';
import {View} from 'react-native-animatable';
import CardListScreen from './CardListScreen';
import CardItemDetails from './CardItemDetails';
import HomelyScreen from '../screens/HomelyScreen';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Journey} from '../screens/Journey';
import HomeScreen from '../screens/HomeScreen';
import {styles} from '../styles/shared';
import {WalletScreen} from './wallets/WalletScreen';
import {theme} from '../styles/theme';

const HomeStack = createStackNavigator();
const NotificationStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const MapStack = createStackNavigator();
const WalletStack = createStackNavigator();

const Tab = createMaterialBottomTabNavigator();

const MainTabScreen = ({navigation}) => (
  <Tab.Navigator activeColor="#f9d29d" barStyle={{backgroundColor: 'black'}}>
    <Tab.Screen
      name="MyHome"
      component={HomeStackScreen}
      options={{
        tabBarLabel: 'Home',
        // tabBarColor: '#00000',
        tabBarIcon: ({color}) => (
          <Icon name="ios-home" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileStackScreen}
      options={{
        tabBarLabel: 'Profile',
        // tabBarColor: '#694fad',
        tabBarIcon: ({color}) => (
          <Icon name="ios-person" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="MyMap"
      component={MapStackScreen}
      options={{
        tabBarStyle: {display: 'none'},
        tabBarLabel: 'Journey',
        // tabBarColor: '#d02860',

        // #f9d29d
        tabBarIcon: ({color}) => <Icon name="map" color={color} size={26} />,
      }}
    />
    <Tab.Screen
      name="Wallet"
      component={WalletStackScreen}
      options={{
        tabBarStyle: {display: 'none'},
        tabBarLabel: 'Wallet',
        // tabBarColor: '#d02860',
        // #f9d29d
        tabBarIcon: ({color}) => <Icon name="wallet" color={color} size={26} />,
      }}
    />
  </Tab.Navigator>
);

export default MainTabScreen;

const HomeStackScreen = ({navigation}) => {
  const {colors} = useTheme();
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
          shadowColor: colors.background, // iOS
          elevation: 0, // Android
        },
        // headerShown: false,
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'LUSH DRIVER',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#000000',
            shadowColor: '#f9fafd',
            elevation: 30,
          },
          headerLeft: () => (
            <View style={{marginLeft: 10}}>
              <Icon.Button
                name="ios-menu"
                size={20}
                backgroundColor="#f9d29d"
                color={colors.text}
                onPress={() => navigation.openDrawer()}
              />
            </View>
          ),
          headerTintColor: '#fff',
          // headerShown: false,
        }}
        // options={{header: () => null}}
      />
      <HomeStack.Screen
        name="CardListScreen"
        component={CardListScreen}
        options={({route}) => ({
          title: 'CardList',
          headerBackTitleVisible: false,
        })}
      />

      <HomeStack.Screen
        name="CardItemDetails"
        component={CardItemDetails}
        options={({route}) => ({
          // title: route.params.title,
          headerBackTitleVisible: false,
          headerTitle: false,
          headerTransparent: true,
          headerTintColor: '#fff',
        })}
      />
    </HomeStack.Navigator>
  );
};

const NotificationStackScreen = ({navigation}) => (
  <NotificationStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#1f65ff',
      },
      headerTintColor: '#fff',
      headerShown: false,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
    <NotificationStack.Screen
      name="RideSchedule"
      component={HomelyScreen}
      options={{
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#1f65ff"
            onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />
  </NotificationStack.Navigator>
);

const ProfileStackScreen = ({navigation}) => {
  const {colors} = useTheme();

  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
          shadowColor: colors.background, // iOS
          elevation: 0, // Android
        },
        headerTintColor: colors.text,
        // headerShown: false,
      }}>
      <ProfileStack.Screen
        name="Profiley"
        component={ProfileScreen}
        options={{
          title: 'MY PROFILE',
          headerTitleAlign: 'center',
          headerTintColor: '#fff',
          headerStyle: {
            backgroundColor: '#000000',
            shadowColor: '#f9fafd',
            elevation: 30,
          },
          headerLeft: () => GoBackBtn(navigation),
          headerRight: () => (
            <View style={{marginRight: 10}}>
              <MaterialCommunityIcons.Button
                name="account-edit"
                size={25}
                backgroundColor={theme.COLORS.BEIGE}
                color={colors.text}
                onPress={() => {}}
              />
            </View>
          ),
        }}
      />
      <ProfileStack.Screen
        name="EditProfile"
        options={{
          title: 'Edit Profile',
        }}
        component={EditProfileScreen}
      />
    </ProfileStack.Navigator>
  );
};

const GoBackBtn = navigation => {
  return (
    <View style={styles.go_back}>
      <FontAwesome.Button
        name="long-arrow-left"
        size={20}
        backgroundColor="beige"
        color="#333"
        onPress={() => navigation.goBack()}
        // onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
};
const WalletStackScreen = ({navigation}) => {
  const {colors} = useTheme();

  return (
    <WalletStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
          shadowColor: colors.background, // iOS
          elevation: 0, // Android
        },
        headerTintColor: colors.text,
        // headerShown: false,
      }}>
      <WalletStack.Screen
        name="WalletScreen"
        component={WalletScreen}
        options={{
          title: 'MY WALLET',
          headerTitleAlign: 'center',
          headerTintColor: '#fff',
          headerStyle: {
            backgroundColor: 'black',
            shadowColor: '#f9fafd',
            elevation: 30,
          },
          headerLeft: () => GoBackBtn(navigation),
        }}
      />
    </WalletStack.Navigator>
  );
};

const MapStackScreen = ({navigation}) => {
  const {colors} = useTheme();

  return (
    <MapStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
          shadowColor: colors.background, // iOS
          elevation: 0, // Android
        },
        headerTintColor: colors.text,
        // headerShown: false,
      }}>
      <MapStack.Screen
        name="Map"
        component={Journey}
        options={{
          title: 'LUSH DRIVER',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: 'black',
            shadowColor: '#f9fafd',
            elevation: 30,
          },
          headerLeft: () => GoBackBtn(navigation),

          // headerRight: () => (
          //   <View style={{marginRight: 10}}>
          //     <MaterialCommunityIcons.Button
          //       name="account-edit"
          //       size={25}
          //       backgroundColor={colors.background}
          //       color={colors.text}
          //       onPress={() => navigation.navigate('EditProfile')}
          //     />
          //   </View>
          // ),
        }}
      />
    </MapStack.Navigator>
  );
};
