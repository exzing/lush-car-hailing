import React from 'react';
import {useState} from 'react';
import {Button, Text, TextInput, View} from 'react-native';
import {useBurnToken, useGetTokens} from '@nice-xrpl/react-xrpl';

export function BurnNFT() {
  // The useBurnToken hook can be used to burn
  // an NFT.
  // This is a transactional hook and requires a
  // wallet.
  const burnToken = useBurnToken();
  const [id, setId] = useState('');
  const [sending, setSending] = useState(false);

  return (
    <View>
      <Text> Burn an NFT with ID: </Text>
      <TextInput value={id} onChange={e => setId(e)} />
      {sending ? (
        <Text>"Waiting for response..."</Text>
      ) : (
        <Button
          onPress={async () => {
            setSending(true);
            const result = await burnToken(id, 0);
            console.log('UI: ', result);
            setSending(false);
            setId('');
          }}
          title="Send"
          disabled={!id}
        />
      )}
    </View>
  );
}
