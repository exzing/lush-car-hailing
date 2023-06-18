import {useWalletAddress} from '@nice-xrpl/react-xrpl';
import {View} from 'react-native';

export function WalletInfo() {
  // The useWalletAddress hook gives you the address
  // of the wallet used up in the tree.
  const address = useWalletAddress();

  return <View className="WalletRow">Address: {address}</View>;
}
