import React from 'react';
import {Text, View} from 'react-native';
import {useTokens} from '@nice-xrpl/react-xrpl';

export function ShowNFTs() {
  // The useTokens hook gives you a list of all
  // tokens associated with an address.
  // This is a request hook, so it can be used with
  // a wallet or a wallet address.
  const tokens = useTokens();

  return (
    <View style={{top: 50}}>
      <Text style={{color: 'green'}}> Tokens: </Text>
      {tokens.length ? (
        tokens.map(token => {
          return (
            <View key={token.id}>
              <Text style={{color: 'green'}}>
                {/* {token.issuer}{' - '} */}
                {token.id}: {token.uri}
              </Text>
            </View>
          );
        })
      ) : (
        <Text style={{color: 'green'}}> No tokens held </Text>
      )}
    </View>
  );
}
