import React from 'react';
import {ToastAndroid, Alert, Platform} from 'react-native';
import {theme} from '../styles/theme';
import Clipboard from '@react-native-clipboard/clipboard';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Physics} from './Physics';

const DupeButton = ({text, onTouched = () => {}}) => {
  const onTouch = () => {
    onTouched();
    Clipboard.setString(text);
    if (Platform.OS === 'ios') {
      Alert.alert('Copied to clipboard');
    } else {
      ToastAndroid.show('Copied to clipboard', ToastAndroid.SHORT);
    }
  };

  return (
    <Physics onPress={onTouch}>
      <MaterialIcon size={15} name="content-copy" color={theme.COLORS.WHITE} />
    </Physics>
  );
};

export default DupeButton;
