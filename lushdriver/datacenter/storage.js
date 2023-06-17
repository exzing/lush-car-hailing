import AsyncStorage from '@react-native-async-storage/async-storage';
import {storage_keys} from '../storage.keys';

export const setWalletData = async data => {
  try {
    await AsyncStorage.setItem(storage_keys.wallet, JSON.stringify(data));
  } catch (err) {
    return null;
  }
};

export const getWalletData = async () => {
  try {
    const response = await AsyncStorage.getItem(storage_keys.wallet);
    if (response) {
      return JSON.parse(response);
    }
    return null;
  } catch (err) {
    return null;
  }
};
export const removeWalletData = async () => {
  try {
    await AsyncStorage.removeItem(storage_keys.wallet);
  } catch (err) {
    return null;
  }
};
