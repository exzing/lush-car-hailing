import React, {useState} from 'react';
import {
  Text,
  View,
  ScrollView,
  Modal,
  Dimensions,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {theme} from '../styles/theme';
import Ripple from '../components/Ripple';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

export const AboutMissionModal = ({open = false, onClose = () => {}}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <Modal transparent visible={open} statusBarTranslucent animationType="fade">
      <View style={styles.infoModalContainer}>
        <View style={styles.infoModalContentContainer}>
          <View style={styles.header}>
            <FontAwesome5Icon
              size={42}
              name="list-alt"
              color={theme.COLORS.WHITE}
              style={styles.buttonIcon}
            />
            <Text style={styles.headerTitle}>About Mission</Text>
          </View>
          <ScrollView
            horizontal
            pagingEnabled
            nestedScrollEnabled
            onScroll={e => {
              const index = Math.round(
                (e.nativeEvent.contentOffset.x /
                  Dimensions.get('screen').width) *
                  0.9,
              );
              setCurrentIndex(index);
            }}
            showsHorizontalScrollIndicator={false}>
            <View style={styles.infoContainerItems}>
              <View style={styles.infoContainerItem}>
                <Text style={styles.infoContentItemTitle}>Title1</Text>
                <Text style={styles.infoContentItemDescription}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Aenean et tellus justo. Sed nec sodales est. Nunc venenatis
                  tellus at leo posuere, vitae interdum mi consequat.
                  Pellentesque nec lacus
                </Text>
              </View>
              <View style={styles.infoContainerItem}>
                <Text style={styles.infoContentItemTitle}>Rewards</Text>
                <Text style={styles.infoContentItemDescription}>
                  lacinia, congue sapien quis, dapibus Duis et molestie
                  ligula,nec maximus erat. Donec dapibus, justo sed viverra
                  sagittis, eros sapien consequat nunc, Duis et molestie
                  ligula,nec maximus erat. Donec dapibus, justo sed viverra.
                </Text>
              </View>
            </View>
            <View style={styles.infoContainerItems}>
              <View style={styles.infoContainerItem}>
                <Text style={styles.infoContentItemTitle}>Requirements</Text>
                <Text style={styles.infoContentItemDescription}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Aenean et tellus justo. Sed nec sodales est. Nunc venenatis
                  tellus at leo posuere, vitae interdum mi consequat.
                  Pellentesque nec lacus
                </Text>
              </View>
              <View style={styles.infoContainerItem}>
                <Text style={styles.infoContentItemTitle}>Rewards</Text>
                <Text style={styles.infoContentItemDescription}>
                  lacinia, congue sapien quis, dapibus Duis et molestie
                  ligula,nec maximus erat. Donec dapibus, justo sed viverra
                  sagittis, eros sapien consequat nunc, Duis et molestie
                  ligula,nec maximus erat. Donec dapibus, justo sed viverra.
                </Text>
              </View>
            </View>
          </ScrollView>
          <View style={styles.bottomContainer}>
            <View style={styles.dots}>
              {Array.from(Array(2).keys()).map((_, index) => (
                <Ripple
                  key={index}
                  style={currentIndex === index ? styles.dot : styles.dotActive}
                />
              ))}
            </View>
            <LinearGradient
              end={{x: 1, y: 0}}
              start={{x: 0.15, y: 0}}
              colors={[theme.COLORS.LIGHT_PURPLE, theme.COLORS.LIGHT_BLUE]}
              style={styles.modalButtonGradient}>
              <Ripple onPress={onClose} style={styles.modalButton}>
                <Text style={styles.buttonText}>Got It</Text>
              </Ripple>
            </LinearGradient>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Info Modal Styling
  infoModalContainer: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || '10%',
  },
  infoModalContentContainer: {
    flex: 1,
    marginTop: '8%',
    borderRadius: 30,
    marginBottom: '11.2%',
    marginHorizontal: '4.5%',
    backgroundColor: theme.APP_COLOR_2,
  },
  header: {
    height: '18%',
    alignItems: 'center',
    borderBottomWidth: 2,
    paddingHorizontal: '1%',
    justifyContent: 'center',
    borderBottomColor: theme.COLORS.LIGHT_GREY,
  },
  headerTitle: {
    fontSize: 24,
    marginTop: 13,
    textAlign: 'center',
    //fontFamily: 'AntDesign',
    color: theme.COLORS.WHITE,
    textTransform: 'uppercase',
  },
  infoContainerItems: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: '4.5%',
    width: Dimensions.get('screen').width * 0.91,
  },
  infoContainerItem: {
    paddingTop: '13%',
  },
  infoContentItemTitle: {
    fontSize: 16,
    textAlign: 'center',
    //fontFamily: 'AntDesign',
    color: theme.COLORS.WHITE,
    textTransform: 'uppercase',
  },
  infoContentItemDescription: {
    fontSize: 12,
    lineHeight: 19,
    marginTop: '6%',
    textAlign: 'center',
    fontFamily: 'Moon-Light',
    textTransform: 'uppercase',
    color: theme.COLORS.WHITE,
  },
  bottomContainer: {
    flex: 1,
    marginBottom: '10%',
    paddingHorizontal: '9%',
    justifyContent: 'flex-end',
  },
  dots: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    paddingHorizontal: '2%',
    paddingVertical: '1.25%',
    marginVertical: '13.5%',
    justifyContent: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    elevation: 5,
    borderRadius: 15,
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    marginHorizontal: '1.25%',
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {width: 0, height: 4},
    backgroundColor: theme.COLORS.PURPLE,
  },
  dotActive: {
    width: 12,
    height: 12,
    elevation: 5,
    borderRadius: 15,
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    marginHorizontal: '1.25%',
    shadowColor: theme.COLORS.BLACK,
    backgroundColor: theme.COLORS.GREY,
    shadowOffset: {width: 0, height: 4},
  },
  modalButtonGradient: {
    borderRadius: 30,
    marginVertical: '1.25%',
  },
  modalButton: {
    margin: 2,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: '5%',
    paddingHorizontal: '1%',
    justifyContent: 'center',
    backgroundColor: theme.APP_COLOR_2,
  },

  //RadioButton Styling
  radioButton: {
    width: 32,
    height: 32,
    borderWidth: 2,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.APP_COLOR_2,
    borderColor: theme.COLORS.LIGHT_GREY,
  },
  radioButtonDot: {
    width: 16,
    height: 16,
    borderRadius: 25,
    backgroundColor: theme.APP_COLOR_2,
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
    //fontFamily: 'AntDesign',
    color: theme.COLORS.WHITE,
    textTransform: 'uppercase',
  },
});
