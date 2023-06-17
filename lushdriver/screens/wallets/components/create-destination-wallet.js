import {useCreateWallet, Wallet, WalletAddress} from '@nice-xrpl/react-xrpl';
import {useState} from 'react';
import {View} from 'react-native';
import {Button} from 'react-native-elements/dist/buttons/Button';

export function CreateDestinationWallet({children}) {
  const [address, setAddress] = useState('');
  const [sending, setSending] = useState(false);

  // When connected to the testnet/dev net, you can
  // use the useCreateWallet series of hooks to create
  // a wallet and fund it from the faucet.
  const createWallet = useCreateWallet();

  // The Wallet component is used when you have
  // credentials. It enables the use of all
  // transactional hooks and all request hooks.
  return address ? (
    <WalletAddress address={address}>{children}</WalletAddress>
  ) : (
    <View>
      {/* {!sending ? (
        <buton
          onClick={async () => {
            setSending(true);
            const initialState = await createWallet('1048');

            setSending(false);

            if (initialState.wallet.address) {
              console.log('created wallet: ', initialState);
              setAddress(initialState.wallet.address);
            }
          }}
          >
          Create destination wallet
        </button>
      ) : (
        'Creating destination wallet...'
      )} */}
    </View>
  );
}
