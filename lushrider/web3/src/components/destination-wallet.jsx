import {View} from 'react-native';
import {WalletBalance} from './wallet-ui/wallet-balance';
import {WalletInfo} from './wallet-ui/wallet-info';

export function DestinationWallet() {
  return (
    <View className="Wallet">
      <View className="WalletRow header">Destination Wallet</View>
      <WalletInfo />
      <WalletBalance />
    </View>
  );
}
