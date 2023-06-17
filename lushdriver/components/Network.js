import React, {useContext} from 'react';
import {NetWorkContext} from '../navigation/NetworkProvider';
import {Text, View} from 'react-native';
import {styles} from '../styles/wallet';

export function Network({status}) {
  // The useIsConnected hook will let you know
  // when the client has connected to the xrpl network
  // const isConnected = useIsConnected();
  //   const {network} = useContext(NetWorkContext);
  //   isConnected = network?.isConnected;
  console.log({status});
  return (
    <View style={styles.xrplNetwork}>
      <Text style={status ? styles.connected : styles.disconnected}>
        {status ? 'CONNECTED' : 'DISCONNECTED! Pls Check Your Internet'}
      </Text>
    </View>
  );
}
