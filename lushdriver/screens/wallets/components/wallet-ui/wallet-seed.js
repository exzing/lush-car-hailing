import React from 'react';
import {useWallet} from '@nice-xrpl/react-xrpl';
import {Text, View} from 'react-native';

export function WalletSeed() {
  // The useWallet hook gives you direct access to the
  // raw xrpl wallet - from here you can grab the seed
  // or any other information.
  const wallet = useWallet();

  return (
    <View>
      <Text style={{color: 'green'}}>Seed: {wallet.seed}</Text>
    </View>
  );
}
