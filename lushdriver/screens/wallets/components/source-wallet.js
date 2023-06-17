import React from 'react';
import {Text, View} from 'react-native';
import {SendXRP} from './wallet-ui/send-xrp';
import {WalletBalance} from './wallet-ui/wallet-balance';
import {WalletInfo} from './wallet-ui/wallet-info';
import {WalletSeed} from './wallet-ui/wallet-seed';
import {MintNFT} from './wallet-ui/mint-nft';
import {ShowNFTs} from './wallet-ui/show-nfts';
import {BurnNFT} from './wallet-ui/burn-nft';
import {WalletScreen} from '../WalletScreen';

/**
 * rfHPq.....5rVN
 *
 * rQDc6.....KSaH
 */

export function SourceWallet() {
  return (
    <View>
      {/* <View>
        <Text style={{color: 'green'}}>Source Wallet</Text>
      </View> */}
      <WalletScreen />
      {/* <WalletSeed />
      <WalletInfo /> */}
      {/* <WalletBalance /> */}
      {/* <MintNFT /> */}
      {/* <BurnNFT /> */}
      {/* <ShowNFTs /> */}
      {/* <SendXRP /> */}
    </View>
  );
}
