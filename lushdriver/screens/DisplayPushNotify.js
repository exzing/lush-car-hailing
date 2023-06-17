import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Button, Platform, Text, TouchableOpacity} from 'react-native';
import {View} from 'react-native';
import messaging from '@react-native-firebase/messaging';
// import {GiftedChat} from 'react-native-gifted-chat';

import NotificationService from '../components/NotificationService';
import {StyleSheet} from 'react-native';
import {theme} from '../styles/theme';
import {firebase} from '@react-native-firebase/database';
import LinearGradient from 'react-native-linear-gradient';
import {modalstyles, modalstyles as ridestyles} from '../styles/imageupload';
import {AuthContext} from '../navigation/AuthProvider';
import {Image} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {Switch} from 'react-native';
import RotateAnimation from '../components/RotateAnimation';
import Toast from 'react-native-simple-toast';
import {useNavigation} from '@react-navigation/native';

const CompanyIcon = require('../assets/ic_launcher_round.png');

export const DisplayPushNotify = ({show}) => {
  const navigation = useNavigation();
  const {
    user,
    deviceToken,
    authDriverRef,
    riderOnlineRef,
    pickupMsg,
    destinationMsg,
    // isNotifyDialogue,
    setIsNotifyDialogue,
    destinationAddr,
    pickupAddr,
    destinationGeoMsg,
    pickupGeoMsg,
  } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [remoteMessages, setRemoteMessages] = useState([]);
  // const [deviceToken, setDeviceToken] = useState('');
  // const [isNotifyDialogue, setIsNotifyDialogue] = useState(false);
  const [rideInfo, setRideInfo] = useState('');
  // const [pickupMsg, setPickupMsg] = useState('');
  // const [destinationMsg, setDestinationMsg] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const toggleAvailability = () => setIsOnline(previousState => !previousState);
  const [isLoading, setIsLoading] = useState(false);
  const [driverId, setDriverId] = useState(null);
  const [driverUserId, setDriverUserId] = useState(null);
  const [requestStatus, setRequestStatus] = useState(null);
  const [riderUserId, setRiderUserId] = useState(null);
  const [riderUID, setRiderUID] = useState(null);
  const [rideRequest, setRideRequest] = useState(null);
  const [journeyStatus, setJourneyStatus] = useState(null);
  const [isRideAccepted, setIsRideAccepted] = useState(false);

  //subscribe n token
  // useEffect(() => {
  //   // requestPermission();
  //   // const uid = user.uid;
  //   // messaging()
  //   //   .getToken()
  //   //   .then(token => {
  //   //     console.log('token=>>>', token);
  //   //     if (uid && token) {
  //   //       // setDeviceToken(token);
  //   //       // firebase.database().ref().child(`drivers/${uid}/`).update({
  //   //       //   fcmTokens: token,
  //   //       // });
  //   //     }
  //   //   });
  //   const subscribeOnMsg = messaging().onMessage(async remoteMessage => {
  //     await messaging().subscribeToTopic('alldrivers');
  //     await messaging().subscribeToTopic('allriders');
  //     await messaging().subscribeToTopic('allusers');

  //     // const formatted_msg = JSON.stringify(remoteMessage)
  //     let message_body = remoteMessage.notification.body;
  //     let message_title = remoteMessage.notification.title;
  //     let message_pickup = remoteMessage.data.pickup;
  //     let message_dest = remoteMessage.data.destination;
  //     let avatar = remoteMessage.notification.android.imageUrl;

  //     // Show an alert to the user
  //     // alert(message_pickup, message_dest);
  //     setIsNotifyDialogue(true);
  //     setPickupMsg(message_pickup);
  //     setDestinationMsg(message_dest);

  //     console.log({remoteMessage: remoteMessage});
  //   });

  //   return subscribeOnMsg;
  // }, [messages, user.uid]);

  // console.log({pickupMsg: pickupMsg});
  // console.log({destMsg: destinationMsg});
  // console.log({isNotifyDialogue: isNotifyDialogue});
  // console.log({riderUID: riderUID});
  // console.log({riderUserId: riderUserId});

  //rideInfo
  // useEffect(() => {
  //   const fetchRideInfo = async () => {
  //     if (!user.uid) return;
  //     await firebase
  //       .database()
  //       .ref(`riders/`)
  //       //   .child(`/${user.uid}/rideRequest`)
  //       .once('child_added', snapshot => {
  //         //   let data = [snapshot.val()];
  //         let data = snapshot.val().rideRequest;
  //         // console.log({
  //         //   // snapshot: data[0].rideRequest.destination,
  //         //   // data: data,
  //         //   destination: data.destination,
  //         //   location: data.location,
  //         //   destination_addr: data.destination_address,
  //         //   pickup_addr: data.pickup_address,
  //         // });
  //         setRideInfo(data);
  //       });
  //   };
  //   fetchRideInfo();
  // }, [user]);

  const requestPermission = async () => {
    return Platform.OS === 'ios' && (await messaging().requestPermission());
  };
  const registerDevice = async () => {
    return (
      Platform.OS === 'ios' &&
      (await firebase.messaging().registerDeviceForRemoteMessages())
    );
  };

  useEffect(() => {
    const getDrivers = async () => {
      const authDriverRef = firebase.database().ref(`drivers/${user?.uid}`);
      authDriverRef.on('value', snap => {
        const data = snap.val();
        console.log({
          data,
          RID: data?.newJourneyRID,
          requestStatus: data?.requestStatus,
        });
      });
    };

    // getDrivers()
  }, [user?.uid]);

  useEffect(() => {
    // if (authDriverRef) {
    // const _authDriverRef = firebase.database().ref(`drivers/${user.uid}`);
    const _riderRequestRef = firebase
      .database()
      .ref()
      .child(`riders/rideRequest`);

    const _riderIdRef = firebase.database().ref().child(`riders/`);

    // console.log({_riderIdRef, _riderRequestRef});

    _riderRequestRef.on('value', snap => {
      console.log({ridersReqSnap: snap.val()});
    });
    _riderIdRef.on('value', snap => {
      // console.log({ridersIdSnap: snap.val()});
      snap.forEach(async childSnap => {
        let childKey = childSnap?.key;
        let childData = childSnap?.val();
        let fcmDeviceTokens = childData?.fcmDeviceTokens;
        let uid = childData?.uid;

        console.log({childKey, fcmDeviceTokens, uid});
      });
    });

    const _authDriverRef = firebase.database().ref('drivers/drivers_Id');
    _authDriverRef.on('value', snap => {
      const data = snap.val();
      // console.log({_data: data});
      snap?.forEach(async childSnapshot => {
        var childKey = childSnapshot?.key;
        var childData = childSnapshot?.val();
        // console.log({DchildKey: childKey});
        // console.log({DchildData: childData});
        // console.log({childData: childData});
        // console.log({fcmDeviceTokens: childData?.fcmDeviceTokens});
        // console.log({userIdToken: childData?.userIdToken});
      });
      // var childKey = snap?.key;
      // var childData = snap?.val();
      // console.log({DchildKey: childKey});
      // console.log({DchildData: childData});
      // // console.log({rideRequest: childData.rideRequest});
      // console.log({Demail: childData.email});
      // console.log({DToken: childData?.fcmDeviceTokens});
      // const _driverUserId = snap?.val()?.userIdToken;

      // setDriverUserId(_driverUserId);
    });
    // }
    // const _riderOnlineRef = firebase.database().ref('riders');
    // if (riderOnlineRef) {
    const _riderOnlineRef = firebase.database().ref('riders');
    _riderOnlineRef.on('value', snap => {
      const data = snap.val();
      // console.log({_rider_snap: data});
      snap?.forEach(async childSnapshot => {
        var childKey = childSnapshot?.key;
        var childData = childSnapshot?.val();
        // console.log({RchildKey: childKey});
        // console.log({rideRequest: childData.rideRequest});
        // console.log({Remail: childData.email});
        // console.log({childData: childData});
        // console.log({riderUserIdToken: childData.userIdToken});
        // console.log({rider_id: childData?.uid});
        setRiderUserId(childData?.userIdToken);
        setRiderUID(childData?.uid);
        // setDriverId(childData?.rideRequest?.driver_id);
        // setRideRequest(childData?.rideRequest);
      });
    });
    // }
  }, [authDriverRef, riderOnlineRef, user.uid]);

  // console.log({mdriverUserId: driverUserId});

  const handleRideAccepted = async () => {
    // if (authDriverRef) {
    // const _riderRequestRef = firebase.database().ref();
    // .child(`riders/${user?.uid}/rideRequest`);// riders + drivers credentials....wrong

    const _authDriverIdRef = firebase.database().ref(`drivers/${user.uid}`);
    const _authDriverRef = firebase
      .database()
      .ref(`drivers/drivers_Id/${user.uid}`);

    _authDriverIdRef.update({
      newJourneyRID: riderUserId,
      requestStatus: 'accepted!',
      online: false,
    });

    _authDriverRef.update({
      newJourneyRID: riderUserId,
      requestStatus: 'accepted!',
      online: false,
    });

    // riderOnlineRef.update({
    //   newJourneyDID: driverUserId,
    //   requestStatus: 'accepted!',
    // });
    // }

    // await user.reload();
    setIsRideAccepted(true);
    setIsNotifyDialogue(!show);
    // setIsNotifyDialogue(!isNotifyDialogue);
    setIsLoading(false);
    Toast.showWithGravity('Ride request accepted!', Toast.LONG, Toast.TOP);

    navigation.navigate('MyMap', {
      screen: 'Map',
      params: {show, destinationMsg, pickupMsg},
    });
  };

  const handleRideRejected = async () => {
    // if (authDriverRef) {
    const _authDriverRef = firebase.database().ref(`drivers/${user.uid}`);
    _authDriverRef.update({
      newJourneyRID: 'waiting...',
      requestStatus: 'declined!',
      online: true,
    });
    const _authDriverIdRef = firebase
      .database()
      .ref(`drivers/drivers_Id/${user.uid}`);
    _authDriverIdRef.update({
      newJourneyRID: 'waiting...',
      requestStatus: 'declined!',
      online: true,
    });
    _authDriverRef.update({
      newJourneyRID: 'waiting...',
      requestStatus: 'declined!',
      online: true,
    });
    // }

    // await user.reload();
    setIsNotifyDialogue(!show);

    setIsLoading(false);

    Toast.showWithGravity('Ride declined by you!', Toast.LONG, Toast.TOP);
  };

  const sendNotification = async () => {
    if (!deviceToken) return;
    let notificationData = {
      pickup: rideInfo?.pickup_address,
      destination: rideInfo?.destination_address,
      body: 'data.body',
      title: 'Ride With Us!',

      token: deviceToken, // recipient deviceToken
      // 'cHWhO4o6T9yziFUiHEaxkc:APA91bFWQ68_UpNeqspuNCdMOFEQPYPzYmpsImfuSCSj6ilB9e9iHt9i7Kh4vK5E6tEqSmd5FwbE3g9AFCALk4iEFeFFSygkgF6Ym-XW_bEVZxfmmeIIkFi8vJFEWoYs5GwgPcmxtV2N',
    };
    await NotificationService.sendSingleDeviceNotification(notificationData);
  };

  const sendMultiNotification = async () => {
    let notificationData = {
      title: 'First Multi Device Notification',
      body: 'sending to multiple devices',
      token: [
        deviceToken,
        // 'cHWhO4o6T9yziFUiHEaxkc:APA91bFWQ68_UpNeqspuNCdMOFEQPYPzYmpsImfuSCSj6ilB9e9iHt9i7Kh4vK5E6tEqSmd5FwbE3g9AFCALk4iEFeFFSygkgF6Ym-XW_bEVZxfmmeIIkFi8vJFEWoYs5GwgPcmxtV2N',
      ],
    };
    await NotificationService.sendMultiDeviceNotification(notificationData);
  };

  // const onSend = useCallback((messages = []) => {
  //   setMessages(previousMessages =>
  //     GiftedChat.append(previousMessages, messages),
  //   );
  // }, []);

  // console.log({isNotifyDialogue});
  console.log({destinationAddr, destinationMsg});

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity style={styles.btnNotify}>
        <Text
          style={styles.txtNotify}
          onPress={() => {
            sendNotification();
          }}>
          Notify
        </Text>
      </TouchableOpacity> */}
      {isLoading === true && <RotateAnimation />}
      {(destinationMsg ?? destinationAddr) && show && (
        <>
          <View style={ridestyles.info}>
            {/* <Image
              resizeMode="stretch"
              source={CompanyIcon}
              style={ridestyles.infoImage}
            /> */}
            <View>
              <Text style={ridestyles.companyTitle}>New Ride Request</Text>
              <View style={ridestyles.tags}>
                <Text style={ridestyles.tagText}>🚀 To: </Text>
                <Text style={ridestyles.rideDestText}>
                  {destinationMsg ?? destinationAddr}
                </Text>
              </View>
              <View style={ridestyles.tags}>
                <Text style={ridestyles.tagText}>🚖 From: </Text>
                <Text style={ridestyles.rideDestText} numberOfLines={14}>
                  {pickupMsg ?? pickupAddr}
                </Text>
              </View>
            </View>
          </View>
          <View style={modalstyles.stakeUnstakeButtons}>
            <TouchableOpacity
              onPress={() => {
                setIsLoading(true);
                //set 'accepted' in fdb
                handleRideAccepted();
              }}>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                // colors={['gold', 'green', 'green', 'green', 'green', 'gold']}
                colors={[
                  '#f9d29d',
                  '#329BFF',
                  '#329BFF',
                  '#329BFF',
                  '#4C64FF',
                  '#6536FF',
                  '#8000FF',
                ]}
                style={modalstyles.instagramButton}>
                <Text style={modalstyles.stakeButtonText}>Accept </Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsLoading(true);
                handleRideRejected();
              }}>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                colors={[
                  '#5851DB',
                  '#C13584',
                  '#E1306C',
                  '#FD1D1D',
                  // '#F77737',
                  '#5851DB',
                ]}
                style={modalstyles.instagramButton}>
                <Text style={modalstyles.stakeButtonText}>Reject</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </>
      )}
      {/* <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
        }}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    bottom: '50%',
    backgroundColor: 'black',
  },
  switch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 20,
    // width: Dimensions.get('screen').width * 0.56,
  },
  switchcontainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtNotify: {
    fontSize: 18,
    // fontFamily: 'Lato-Bold',
    color: theme.COLORS.WHITE,
    textTransform: 'uppercase',
    marginTop: 10,
    // justifyContent: 'center',
    // alignItems: 'center',
    textAlign: 'center',
  },
  btnNotify: {
    width: '50%',
    height: 50,
    // paddingBottom: 420,
    // top: 150,
    // justifyContent: 'center',
    // alignItems: 'center',
    borderRadius: 10,
    alignSelf: 'center',
    backgroundColor: 'blue',
    // flexDirection: 'row',
  },
});
