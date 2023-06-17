import React, {useContext} from 'react';
import {Networks, useIsConnected, XRPLClient} from '@nice-xrpl/react-xrpl';
import {SourceWallet} from '../source-wallet';
import {LoadWallet} from '../load-wallet';
// import './styles.css';
import {Text, View} from 'react-native';
import {AuthContext} from '../../../../navigation/AuthProvider.android';
import {NetWorkContext} from '../../../../navigation/NetworkProvider';
import {Network} from '../../../../components/Network';
import {styles} from '../../../../styles/wallet';
import {WalletScreen} from '../../WalletScreen';

function MainApp() {
  // The useIsConnected hook will let you know
  // when the client has connected to the xrpl network
  const {wallet, cFootprint} = useContext(AuthContext);
  const {network} = useContext(NetWorkContext);
  const isConnected = network?.isConnected;
  const xrplIsConnected = useIsConnected();

  return (
    <View>
      {/* <Network status={isConnected} /> */}
      {/* <View>
        <Text style={{color: 'green'}}>
          Connected: {isConnected ? 'Yes' : 'No'}
        </Text>
      </View> */}
      <View>
        <LoadWallet>
          <WalletScreen />
          {/* <SourceWallet /> */}
        </LoadWallet>
      </View>
    </View>
  );
}

// The main application.  Wrap it with XRPLClient to
// create a connection to the xrpl network!
// All of the hooks require a client somewhere above
// them in the tree.
export default function App() {
  return (
    <View>
      <XRPLClient network={Networks.Testnet}>
        <MainApp />
      </XRPLClient>
    </View>
  );
}
