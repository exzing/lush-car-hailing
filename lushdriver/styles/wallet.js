import {StyleSheet} from 'react-native';
import {theme} from './theme';
import {deviceHeight} from '../utils/Dimensions';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: '15.5%',
    paddingHorizontal: '4.2%',
    backgroundColor: theme.COLORS.BEIGE,
  },
  xrplNetwork: {
    alignSelf: 'center',
    bottom: 10,
  },
  connected: {
    color: theme.COLORS.GREEN,
  },
  disconnected: {
    color: theme.COLORS.LIGHT_RED,
  },
  mintBtn: {
    borderColor: theme.COLORS.GREEN,
    borderWidth: 4,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 15,
    top: '50.5%',
  },
  mintBtnTxt: {
    color: '#000000',
    alignSelf: 'center',
  },
  readOnlyBox: {
    padding: 5,
    minHeight: 94,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: '9.2%',
    backgroundColor: theme.APP_COLOR_1,
    borderColor: theme.COLORS.TULIP_TREE,
  },
  readOnlyBoxShadow: {
    shadowColor: theme.COLORS.TULIP_TREE,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    elevation: 4,
  },
  titleCopyButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: theme.COLORS.WHITE,
  },
  balances: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: '15.5%',
  },
  textBoxTitle: {
    fontSize: 11,
    lineHeight: 11.5,
    fontFamily: 'Moon-Bold',
    color: theme.COLORS.WHITE,
    textTransform: 'uppercase',
  },
  textBoxValue: {
    fontSize: 11,
    lineHeight: 15.1,
    top: '5.5%',
    // paddingBottom: '-5.5%',
    // marginTop: '1.5%',
    fontFamily: 'Moon-Light',
    textTransform: 'uppercase',
    color: theme.COLORS.WHITE,
  },
  textBoxPhraseValue: {
    fontSize: 11,
    lineHeight: 15.1,
    marginTop: '3.5%',
    fontFamily: 'Moon-Bold',
    textTransform: 'uppercase',
    color: theme.COLORS.WHITE,
  },
  textBoxPhraseValueAction: {
    fontFamily: 'Moon-Bold',
    color: theme.COLORS.TULIP_TREE,
  },
  buttonStyle: {
    width: '70%',
    borderRadius: 30,
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Moon-Bold',
    textTransform: 'uppercase',
    textAlignVertical: 'center',
    color: theme.COLORS.LIGHT_RED,
  },
  addWalletButtonText: {
    fontSize: 18,
    fontFamily: 'Moon-Bold',
    textTransform: 'uppercase',
    textAlignVertical: 'center',
    color: theme.COLORS.DARK_PURPLE,
  },
  redText: {
    fontSize: 10,
    fontFamily: 'Moon-Bold',
    textTransform: 'uppercase',
    textAlignVertical: 'center',
    color: theme.COLORS.LIGHT_RED,
  },
  secureFeather: {
    bottom: deviceHeight * 0.04,
    paddingLeft: 318,
    alignSelf: 'flex-end',
  },
  secureTextRules: {
    fontSize: 11,
    lineHeight: 15.1,
    marginTop: 15,
    fontFamily: 'Moon-Bold',
    // textTransform: 'uppercase',
    color: theme.COLORS.WHITE,
  },
});
