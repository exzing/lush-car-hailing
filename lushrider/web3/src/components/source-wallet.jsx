import {View} from 'react-native';
import {SendXRP} from './wallet-ui/send-xrp';
import {WalletBalance} from './wallet-ui/wallet-balance';
import {WalletInfo} from './wallet-ui/wallet-info';
import {WalletSeed} from './wallet-ui/wallet-seed';

export function SourceWallet() {
  return (
    <View className="Wallet">
      <View className="WalletRow header">Source Wallet</View>
      <WalletSeed />
      <WalletInfo />
      <WalletBalance />
      <SendXRP />
    </View>
  );
}
