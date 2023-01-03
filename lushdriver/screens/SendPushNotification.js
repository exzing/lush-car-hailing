import {useContext, useEffect, useState} from 'react';
import NotificationService from './NotificationService';
import {AuthContext} from '../navigation/AuthProvider';
import {firebase} from '@react-native-firebase/database';

export const SendPushNotification = () => {
  const {user} = useContext(AuthContext);
  const [rideInfo, setRideInfo] = useState('');

  useEffect(() => {
    const fetchRideInfo = async () => {
      if (!user.uid) return;
      await firebase
        .database()
        .ref('riders/')
        .once('child_added', snapshot => {
          let data = snapshot.val().rideRequest;
          setRideInfo(data);
        });
    };
    fetchRideInfo();
  }, [user]);

  const sendNotification = async () => {
    //rideInfo

    // if (!deviceToken) return;
    let notificationData = {
      pickup: rideInfo?.pickup_address,
      destination: rideInfo?.destination_address,
      body: 'data.body',
      title: 'Ride With Us!',

      token:
        //   deviceToken,
        'cHWhO4o6T9yziFUiHEaxkc:APA91bFWQ68_UpNeqspuNCdMOFEQPYPzYmpsImfuSCSj6ilB9e9iHt9i7Kh4vK5E6tEqSmd5FwbE3g9AFCALk4iEFeFFSygkgF6Ym-XW_bEVZxfmmeIIkFi8vJFEWoYs5GwgPcmxtV2N',
    };
    await NotificationService.sendSingleDeviceNotification(notificationData);
  };
};
