import React from 'react';
import {Text, View, ScrollView, Modal, StyleSheet} from 'react-native';
import {theme} from '../styles/theme';
import Ripple from '../components/Ripple';
import LinearGradient from 'react-native-linear-gradient';
import AntIcon from 'react-native-vector-icons/AntDesign';

export const TCModal = ({open = false, onClose = () => {}}) => {
  return (
    <Modal
      transparent
      visible={open}
      statusBarTranslucent
      animationType="slide">
      <View style={styles.tcModalContainer}>
        <View style={styles.tcModalContentContainer}>
          <Text style={styles.tcHeaderTitle}>Terms &amp; Conditions</Text>
          <View style={styles.mainDivider} />
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.tcContainerItems}>
            <View style={styles.tcContainerItem}>
              <Text style={styles.tcContentItemTitle}>
                Vivamus pulvinar neque
              </Text>
              <Text style={styles.tcContentItemDescription}>
                Lorem ipsum dolor sit amet, consectetu r adipiscing elit. Aenean
                et tellus justo. Sed nec sodales est. Nunc venenatis tellus at
                leo posuere, vitae interdum mi consequat. Pellentesque nec lacus
                Lorem ipsum dolor sit amet, consectetu r adipiscing elit. Aenean
                et tellus justo. Sed nec sodales est. Nunc venenatis tellus at
                leo posuere, vitae interdum mi consequat. Pellentesque nec lacus
                Lorem ipsum dolor sit amet, consectetu r adipiscing elit. Aenean
                et tellus justo. Sed nec sodales est. Nunc venenatis tellus at
                leo posuere, vitae interdum mi consequat. Pellentesque nec lacus
              </Text>
            </View>
            <View style={styles.tcContainerItem}>
              <Text style={styles.tcContentItemTitle}>
                Vestibulum ante ipsum
              </Text>
              <Text style={styles.tcContentItemDescription}>
                lacinia, congue sapien quis, dapibus Duis et molestie ligula,nec
                maximus erat. Donec dapibus, justo sed viverra sagittis, eros
                sapien consequat nunc, Duis et molestie ligula,nec maximus erat.
                Donec dapibus, justo sed viverra . Lorem ipsum dolor sit amet,
                consectetu r adipiscing elit. Aenean et tellus justo. Sed nec
                sodales est. Nunc venenatis tellus at leo posuere, vitae
                interdum mi consequat. Pellentesque nec lacus
              </Text>
            </View>
          </ScrollView>
          <LinearGradient
            colors={['transparent', theme.COLORS.BACKGROUND]}
            style={styles.tcCloseButtonContainer}>
            <Ripple onPress={onClose} style={styles.tcCloseButton}>
              <AntIcon size={23} name="close" color={theme.COLORS.WHITE} />
            </Ripple>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // TC Modal Styling
  tcModalContainer: {
    flex: 1,
    paddingTop: '30%',
  },
  tcModalContentContainer: {
    flex: 1,
    borderRadius: 30,
    backgroundColor: theme.APP_COLOR_1,
  },
  tcHeaderTitle: {
    margin: 40,
    fontSize: 16,
    lineHeight: 29,
    textAlign: 'center',
    //fontFamily: 'AntDesign',
    color: theme.COLORS.WHITE,
    textTransform: 'uppercase',
  },
  tcContainerItems: {
    alignItems: 'center',
    paddingBottom: '50%',
    paddingHorizontal: 40,
  },
  tcContainerItem: {
    paddingTop: 32,
  },
  tcContentItemTitle: {
    fontSize: 14,
    lineHeight: 17,
    textAlign: 'center',
    //fontFamily: 'AntDesign',
    color: theme.COLORS.WHITE,
    textTransform: 'uppercase',
  },
  tcContentItemDescription: {
    fontSize: 12,
    lineHeight: 20,
    marginTop: 20,
    textAlign: 'center',
    fontFamily: 'Moon-Light',
    color: theme.COLORS.WHITE,
    textTransform: 'uppercase',
  },
  tcCloseButtonContainer: {
    left: 0,
    right: 0,
    bottom: 0,
    height: '30%',
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    position: 'absolute',
    paddingBottom: '15%',
    justifyContent: 'flex-end',
  },
  tcCloseButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.APP_COLOR_2,
  },
});
