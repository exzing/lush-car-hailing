import 'react-native-get-random-values';
import '@ethersproject/shims';
import {
  useWallet,
  useCreateWallet,
  useIsConnected,
} from '@nice-xrpl/react-xrpl';
import {Wallet, Client} from 'xrpl';
import {getWalletData, setWalletData} from './storage';

export const CreateWallet = async value => {
  const createWallet = useCreateWallet();
  const initialState = await createWallet(value);
  console.log({initialState});
  return initialState;
};

export const initializeWallet = async () => {
  //   const network = await altnet.connect();

  //   useEffect(() => {
  //     console.log("start connection");
  //     client.connect().then(() => {
  //       console.log("connected");
  //       console.log("funding wallet");

  //       client.fundWallet().then((fund_result) => {
  //         console.log(fund_result);
  //         setBalance(fund_result.balance);
  //         setWallet(fund_result.wallet);
  //         setPaymentButtonText("Send a 22 XRP Payment!");
  //       });
  //     });
  //   }, []);

  try {
    let stored = await getWalletData();
    console.log({stored});
    const altnet = new Client('wss://s.altnet.rippletest.net:51233');
    if (stored == null) {
      //created a new wallet
      //   let newWallet = null;
      altnet.connect().then(() => {
        console.log('connected');
        console.log('funding wallet');

        altnet.fundWallet().then(result => {
          console.log({result});
          setWalletData(result);
          //   setBalance(fund_result.balance);
          //   setWallet(fund_result.wallet);
          //   setPaymentButtonText('Send a 22 XRP Payment!');
        });
        // altnet.connect().then(() => {
        //   let _network = altnet.isConnected();
        //   console.log({_network});
        //   let newWallet = Wallet.generate();
        //   console.log({newWallet});
        //   // altnet.fundWallet();
        //   setWalletData(newWallet);
        //   altnet.disconnect();
        // });
        // const newWallet = Wallet.generate();

        //   return newWallet;
      });
    } else {
      //return wallet details
      //   console.log({stored});
      return stored;
    }
  } catch (error) {
    console.log({walletError: error});
    return null;
  }
};

export const NetworkCheck = async () => {
  // The useIsConnected hook will let you know
  // when the client has connected to the xrpl network
  const altnet = new Client('wss://s.altnet.rippletest.net:51233');
  let network = altnet.isConnected();
  console.log({network});
};
