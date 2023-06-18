import {Networks, useIsConnected, XRPLClient} from '@nice-xrpl/react-xrpl';
import {CreateSourceWallet} from './components/create-source-wallet';
import {CreateDestinationWallet} from './components/create-destination-wallet';
import {DestinationWallet} from './components/destination-wallet';
import {SourceWallet} from './components/source-wallet';
import './styles.css';
import {View} from 'react-native';

function MainApp() {
  // The useIsConnected hook will let you know
  // when the client has connected to the xrpl network
  const isConnected = useIsConnected();

  return (
    <View className="MainApp">
      <View>Connected: {isConnected ? 'Yes' : 'No'}</View>
      <View className="WalletWrapper">
        <CreateSourceWallet>
          <SourceWallet />
        </CreateSourceWallet>
      </View>

      <View className="WalletWrapper">
        <CreateDestinationWallet>
          <DestinationWallet />
        </CreateDestinationWallet>
      </View>
    </View>
  );
}

// The main application.  Wrap it with XRPLClient to
// create a connection to the xrpl network!
// All of the hooks require a client somewhere above
// them in the tree.
export default function WalletApp() {
  return (
    <div className="App">
      <XRPLClient network={Networks.Testnet}>
        <MainApp />
      </XRPLClient>
    </div>
  );
}
