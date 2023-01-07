import React from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import {theme} from '../styles/theme';
const logo = require('../assets/ic_launcher_round.png');

const ModalActivityIndicator = props => {
  const {modalVisible} = props || {};

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      statusBarTranslucent={true}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Image source={logo} style={styles.logo} resizeMode="stretch" />
          <ActivityIndicator
            size={50}
            style={styles.loading}
            color={theme.COLORS.YELLOW}
          />
          <Text style={styles.loadingText}>Processing!. Please Wait...</Text>
        </View>
      </View>
    </Modal>
  );
};

export default ModalActivityIndicator;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(52,52,52,0.5)',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    top: '28%',
  },
  loading: {
    right: 0,
    left: '1%',
    top: '73%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontFamily: 'AntDesign',
    color: theme.COLORS.WHITE_OPACITY_40P,
    top: '32%',
  },
});
