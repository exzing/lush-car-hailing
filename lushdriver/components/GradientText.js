import React from 'react';
import {Text} from 'react-native';
// import MaskedView from '@react-native-community/masked-view';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';

const GradientText = props => {
  return (
    <MaskedView maskElement={<Text {...props} />}>
      <LinearGradient
        colors={['white', 'white', 'white', 'white', 'green', 'green']}
        // colors={['#191919', '#f9d29d']}
        start={{x: 0.2, y: 1}}
        end={{x: 1, y: 1}}>
        <Text {...props} style={[props.style, {opacity: 0}]} />
      </LinearGradient>
    </MaskedView>
  );
};

export default GradientText;
