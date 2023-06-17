import React, {useContext, useEffect} from 'react';
import {useState} from 'react';
import {useMintToken} from '@nice-xrpl/react-xrpl';
import {Button, Text, TextInput, View} from 'react-native';
import {AuthContext} from '../../../../navigation/AuthProvider.android';
import {styles} from '../../../../styles/wallet';
import {TouchableOpacity} from 'react-native';

export function MintNFT() {
  // The useMintToken hook can be used to mint
  // an NFT with some data that will be encoded.
  // This is a transactional hook and requires a
  // wallet.
  const {cFootprint} = useContext(AuthContext);
  const mintToken = useMintToken();
  const [url, setUrl] = useState('');
  const [sending, setSending] = useState(false);
  const [emission, setEmission] = useState(0);

  // useEffect(() => {
  //   cFootprint && setEmission(`${cFootprint} Kg COe`);
  // }, [cFootprint]);

  useEffect(() => {
    cFootprint && setUrl(`${cFootprint} Kg COe`);
  }, [cFootprint]);

  console.log({url});
  return (
    <View>
      <Text style={{color: 'green', alignSelf: 'center', bottom: 15}}>
        {' '}
        Mint NFT with COe data:{' '}
      </Text>
      {/* <TextInput
        style={{backgroundColor: 'beige', color: 'black'}}
        value={url}
        onChangeText={text => setUrl(text)}
      /> */}
      {sending ? (
        <Text style={{color: 'green'}}>"Waiting for response..."</Text>
      ) : (
        // <Button
        //   onPress={async () => {
        //     // alert('Sending..');
        //     setSending(true);
        //     const result = await mintToken(url, 0);
        //     console.log('UI: ', result);
        //     setSending(false);
        //     setUrl('');
        //   }}
        //   title="Send"
        //   disabled={!url}
        // />
        <TouchableOpacity
          style={styles.mintBtn}
          onPress={async () => {
            setSending(true);

            const result = await mintToken(url, 0);
            console.log('UI: ', result);
            setSending(false);
            setUrl('');
          }}
          disabled={!url}>
          <Text style={styles.mintBtnTxt}>Mint NFT</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
