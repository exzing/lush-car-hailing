import React, {useContext} from 'react';
import {useCreateWallet, Wallet} from '@nice-xrpl/react-xrpl';
import {useEffect, useRef, useState} from 'react';
import {Text, View} from 'react-native';
import {AuthContext} from '../../../navigation/AuthProvider.android';

export function LoadWallet({children}) {
  const [seed, setSeed] = useState('');
  const creating = useRef(false);

  // When connected to the testnet/dev net, you can
  // use the useCreateWallet series of hooks to create
  // a wallet and fund it from the faucet.
  const createWallet = useCreateWallet();
  const {wallet, cFootprint} = useContext(AuthContext);

  // useEffect(() => {
  //   if (!creating.current) {
  //     creating.current = true;
  //     createWallet('1048')
  //       .then(initialState => {
  //         creating.current = false;
  //         setSeed(initialState.wallet.seed);
  //       })
  //       .catch(() => {
  //         creating.current = false;
  //       });
  //   }
  // }, [createWallet]);
  useEffect(() => {
    wallet && wallet?.wallet?.seed && setSeed(wallet?.wallet?.seed);
  }, [wallet]);

  console.log({seed, wallet, cFootprint});

  return seed ? (
    <Wallet
      seed={seed}
      fallback={
        <View>
          <Text style={{color: 'green'}}>Loading wallet...</Text>
        </View>
      }>
      {children}
    </Wallet>
  ) : (
    <View>
      <Text style={{color: 'green'}}>Loading wallet...</Text>
    </View>
  );
}
