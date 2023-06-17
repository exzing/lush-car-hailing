import 'react-native-get-random-values';
import '@ethersproject/shims';
import React, {useState} from 'react';
import {
  useMintToken,
  Networks,
  useIsConnected,
  XRPLClient,
  Wallet,
} from '@nice-xrpl/react-xrpl';
import {SourceWallet} from './wallets/components/_source-wallet';
import {CreateSourceWallet} from './wallets/components/create-source-wallet';
// import './WalletStyles.js';
import {View, Text, TouchableOpacity} from 'react-native';
import {styles} from '../styles/wallet';
import {mintNFToken} from '../utils/mintNFT';
import {convertStringToHex} from 'xrpl';
// import { client } from '../utils/config';

function MainApp({url, client, wallet}) {
  // The useIsConnected hook will let you know
  // when the client has connected to the xrpl network
  const [sending, setSending] = useState(false);
  const [tokenURI, setTokenURI] = useState('');
  const [tokens, setTokens] = useState('');
  // const isConnected = useIsConnected();

  // const mintToken = useMintToken();
  console.log({url, client, wallet});

  return (
    <View>
      {sending ? (
        <Text style={styles.mintBtnTxt}>Waiting for transaction...</Text>
      ) : (
        <View>
          <TouchableOpacity
            style={styles.mintBtn}
            onPress={async () => {
              setSending(true);
              // const result = await mintNFToken(client, wallet?.wallet, url);
              // const connected = await client.connect();

              client.connect().then(async () => {
                const _account = wallet?.wallet?.classicAddress;
                let _connected = client?.isConnected();
                let _uri = convertStringToHex(url);

                console.log({_connected, _account, _uri, _wallet: wallet});
                await client
                  .submitAndWait(
                    {
                      TransactionType: 'NFTokenMint',
                      Account: 'rfHPqYPFVmL9qCxZpDAWbHGjCbjBJw5rVN',
                      URI: convertStringToHex('234'),
                      // Flags: 8,
                      TransferFee: 0,
                      NFTokenTaxon: 0,
                    },
                    {
                      // autofill: true,
                      wallet: wallet,
                    },
                  )
                  .then(response => {
                    console.log({response});
                  })
                  .catch(err => console.log({err}));
                // console.log('UI: ', result);
              });

              setSending(false);
            }}
            disabled={!url}>
            <Text style={styles.mintBtnTxt}>Mint NFT</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  // return (
  //   <View >
  //     <View>Connected: {isConnected ? 'Yes' : 'No'}</View>
  //     <View className="WalletWrapper">
  //       <CreateSourceWallet>
  //         <SourceWallet />
  //       </CreateSourceWallet>
  //     </View>

  //     <View className="WalletWrapper">
  //       <CreateDestinationWallet>
  //         <DestinationWallet />
  //       </CreateDestinationWallet>
  //     </View>
  //   </View>
  // );
}

// The main application.  Wrap it with XRPLClient to
// create a connection to the xrpl network!
// All of the hooks require a client somewhere above
// them in the tree.
export function MintNFT({url, client, wallet}) {
  return (
    <View>
      <MainApp url={url} client={client} wallet={wallet} />
    </View>
  );
}
