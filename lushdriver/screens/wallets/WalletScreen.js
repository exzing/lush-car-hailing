import React from 'react';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import {ethers} from 'ethers';
// import {Client, xrpToDrops, dropsToXrp, Wallet} from 'xrpl';
import {useState, useEffect, useContext} from 'react';
import {Button, Text, View} from 'react-native';
import {NFT, Client} from 'xrpl';
import {useMintToken} from '@nice-xrpl/react-xrpl';

// import {Networks, useIsConnected, XRPLClient} from '@nice-xrpl/react-xrpl';
// import {CreateSourceWallet} from '../web3/src/components/create-source-wallet';
// import {CreateDestinationWallet} from '../web3/src/components/create-destination-wallet';
// import {DestinationWallet} from '../web3/src/components/destination-wallet';
// import {SourceWallet} from '../web3/src/components/source-wallet';

import {DisplayBox} from '../../components/DisplayBox';
import {AuthContext} from '../../navigation/AuthProvider.android';
import {styles} from '../../styles/wallet';
import {theme} from '../../styles/theme';
import {NetWorkContext} from '../../navigation/NetworkProvider';
import {Network} from '../../components/Network';
import {CreateWallet} from '../../datacenter/initialize';
import {Networks, XRPLClient, Wallet} from '@nice-xrpl/react-xrpl';
import {LogBox} from 'react-native';
import {TouchableOpacity} from 'react-native';
// import {MintNFT} from '../MintNFTs';

import {client} from '../../utils/config';
import {MintNFT} from './components/wallet-ui/mint-nft';
import {ShowNFTs} from './components/wallet-ui/show-nfts';

export const WalletScreen = () => {
  const [balance, setBalance] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [isNet, setIsNet] = useState(false);

  const [sending, setSending] = useState(false);
  const [tokenURI, setTokenURI] = useState('');
  const [tokens, setTokens] = useState('');
  const [seed, setSeed] = useState('');

  const {wallet, cFootprint} = useContext(AuthContext);
  const {network} = useContext(NetWorkContext);
  const isConnected = network?.isConnected;
  console.log({wallet});
  console.log({network});
  console.log({isConnected, cFootprint});
  console.log({balance});

  /**
   * rfHPq.....5rVN
   * SED7T.....MBA7
   */

  useEffect(() => {
    if (wallet && wallet?.wallet?.seed) {
      setSeed(wallet?.wallet?.seed);
      setBalance(wallet?.balance);
    }
  }, [wallet]);

  const NoNetwork = () => {
    return (
      <View>
        <Button
          title="RETRY"
          onPress={async () => {
            // let status = await checkNet();
            // status && setIsNet(true);
          }}
        />
      </View>
    );
  };

  //   const createAndFundWallet = async () => {
  //     const altnet = new Client('wss://s.altnet.rippletest.net:51233');
  //     // const devnet = new Client('wss://s.devnet.rippletest.net:51233');
  //     // const api = new Client('wss://xrplcluster.com');

  //     console.log('checking connection...');
  //     let isConnected = altnet.isConnected();
  //     // await altnet.disconnect();
  //     // await api.connect();
  //     // let response = await api.request({
  //     //   command: 'ledger',
  //     //   'ledger_index ': 'validated',
  //     //   transactions: true,
  //     // });

  //     // if (!isConnected) {
  //     console.log('starting connection...');
  //     console.log({isConnected, altnet});

  //     //   await altnet.connect();
  //     altnet.connect().then(() => {
  //       let _wallet = Wallet.generate();
  //       console.log('generating wallet....');
  //       console.log({_wallet});

  //       altnet.fundWallet().then(fund_result => {
  //         console.log('funding wallet....');
  //         console.log({isConnected, fund_result});
  //         setBalance(fund_result.balance);
  //         setWallet(fund_result.wallet);
  //         // setPaymentButtonText("Send a 22 XRP Payment!");
  //       });
  //     });
  //     // }

  //     // console.log({isConnected});
  //     // console.log({altnet, devnet});
  //   };

  //   return (
  //     <View>
  //       <Text style={{color: 'green'}}> Hiiii</Text>
  //       <Button title="create" onPress={() => createAndFundWallet()} />
  //     </View>
  //   );

  return (
    <View style={styles.container}>
      <Network status={isConnected} />
      <XRPLClient network={Networks.Testnet}>
        <Wallet seed={seed}>
          {isConnected && (
            <>
              <DisplayBox
                type="publicKey"
                title={'Public Address'}
                value={wallet?.wallet?.classicAddress}
              />
              <DisplayBox
                type="mnemonics"
                title={'Seed'}
                value={wallet?.wallet?.seed}
              />
              <View style={styles.balances}>
                <Text style={styles.connected}>
                  Balance: {balance || 0.0} XRP
                </Text>
                <Text style={styles.connected}>
                  Carbon FootPrint: {cFootprint} Kg COe
                </Text>
              </View>
              <MintNFT />
              <ShowNFTs />
              {/* <MintNFT url={cFootprint} client={client} wallet={wallet} /> */}
            </>
          )}
        </Wallet>
      </XRPLClient>
    </View>
  );
};
