import {useState} from 'react';
import {
  useBalance,
  useSendXRP,
  ReserveRequirement,
} from '@nice-xrpl/react-xrpl';
import {Button, TextInput, View} from 'react-native';

export function SendXRP() {
  // The useSendXRP hook can be used to send XRP to
  // another account.  This is a transactional hook and
  // requires a wallet.
  const sendXRP = useSendXRP();
  const balance = useBalance();

  const [destinationAddress, setDestinationAddress] = useState('');
  const [amount, setAmount] = useState(48);
  const [sending, setSending] = useState(false);

  return (
    <View className="WalletRow">
      Send{' '}
      <TextInput
        value={amount}
        onChange={e => setAmount(parseInt(e.currentTarget.value, 10))}
        type="number"
      />{' '}
      XRP to{' '}
      <TextInput
        value={destinationAddress}
        onChange={e => setDestinationAddress(e.currentTarget.value)}
        type="text"
      />{' '}
      -{' '}
      {sending ? (
        'Waiting for response...'
      ) : (
        <Button
          onPress={async () => {
            setSending(true);
            try {
              const result = await sendXRP(destinationAddress, amount);
              console.log('UI: ', result);
            } catch (e) {
              alert(e);
            }

            setSending(false);
          }}
          disabled={
            !amount ||
            amount >= balance - ReserveRequirement ||
            !destinationAddress
          }>
          Send
        </Button>
      )}
    </View>
  );
}
