import {useContext, useEffect, useState} from 'react';
import NotificationService from './NotificationService';
import {AuthContext} from '../navigation/AuthProvider';
import {firebase} from '@react-native-firebase/database';

export const SendPushNotification = () => {
  const {user} = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [remoteMessages, setRemoteMessages] = useState([]);
  const [deviceToken, setDeviceToken] = useState('');
  const [isNotifyDialogue, setIsNotifyDialogue] = useState(false);
  const [rideInfo, setRideInfo] = useState('');
  const [pickupMsg, setPickupMsg] = useState('');
  const [destinationMsg, setDestinationMsg] = useState('');

  useEffect(() => {
    const fetchRideInfo = async () => {
      if (!user.uid) return;
      await firebase
        .database()
        .ref('riders/')
        //   .child(`/${user.uid}/rideRequest`)
        .once('child_added', snapshot => {
          //   let data = [snapshot.val()];
          let data = snapshot.val().rideRequest;
          // console.log({
          //   // snapshot: data[0].rideRequest.destination,
          //   // data: data,
          //   destination: data.destination,
          //   location: data.location,
          //   destination_addr: data.destination_address,
          //   pickup_addr: data.pickup_address,
          // });
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
