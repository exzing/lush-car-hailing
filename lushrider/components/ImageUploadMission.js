import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  ScrollView,
  Image,
  Modal,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {theme} from '../styles/theme';
import {modalstyles} from '../styles/modalStyles';
import Ripple from '../components/Ripple';
import LinearGradient from 'react-native-linear-gradient';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {AboutMissionModal} from '../components/AboutMissionModal';
import {actions} from '../state/Reducer';
import {useStateValue} from '../state/State';

const UploadMission = require('../assets/image_upload_mission_test.png');
// const CompanyIcon = require('../assets/company_icon.png');
const CompanyIcon = require('../assets/ic_launcher_round.png');

import {TCModal} from '../components/TCModal';
import Button from './Button';
import AnimatedButton, {AnimatedProgress} from './AnimatedButton';
import RotateAnimation from './RotateAnimation';
import {calculateFares} from '../utils/EstimateFares';
import {firebase} from '@react-native-firebase/database';
// import {distance} from 'geofire';
// import {MissionCounter} from '../components/MissionCounter';
// import {Reward} from '../components/Reward';

const RadioButton = ({checked, onCheckChange}) => {
  return (
    <Ripple
      style={modalstyles.radioButton}
      onPress={() => onCheckChange(!checked)}>
      {checked && (
        <LinearGradient
          end={{x: 1, y: 0}}
          start={{x: 0.15, y: 0}}
          style={modalstyles.radioButtonDot}
          colors={[theme.COLORS.LIGHT_PURPLE, theme.COLORS.LIGHT_BLUE]}
        />
      )}
    </Ripple>
  );
};

const ImageUploadMission = ({navigation, duration, distance, onPress}) => {
  const [showInfo, setShowInfo] = useState(false);
  const [showTCButton, setShowTCButton] = useState(false);
  const [tcAgreed, setTCAgreed] = useState(false);
  const [showTC, setShowTC] = useState(false);
  const [charge, setCharge] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  // const [, dispatch] = useStateValue();

  useEffect(() => {
    const getFares = () => {
      const fares = calculateFares(distance, duration);
      console.log({fares: fares});

      setCharge(parseFloat(fares));
    };

    getFares();
  }, [duration, distance]);

  const createRideOrder = (user, coordinates = []) => {
    // setDialogueOpen(true);
    console.log({isLoading: isLoading});

    const riderRequestRef = firebase
      .database()
      .ref()
      .child(`riders/${user?.uid}/rideRequest`);

    // const pickup = coordinates[0].latitude
    const pickupMap = {
      latitude: coordinates[0]?.latitude.toString(),
      longitude: coordinates[0]?.longitude.toString(),
    };

    const destinationMap = {
      latitude: coordinates[1]?.latitude.toString(),
      longitude: coordinates[1]?.longitude.toString(),
    };

    const rideMap = {
      createdAt: firebase.database().getServerTime(),
      // 'rider_name': currentUserInfo!.displayName,
      // 'rider_phone': currentUserInfo.phoneNumber,
      rider_email_address: user?.email,
      destination_address: route.params?.destination?.description,
      pickup_address: route.params?.origin?.description,
      location: pickupMap,
      destination: destinationMap,
      payment_method: 'cash',
      driver_id: 'waiting',
    };

    riderRequestRef?.set(rideMap);
    setIsLoading(false);
  };

  return (
    <>
      {/* <AboutMissionModal open={showInfo} onClose={() => setShowInfo(false)} />
      <TCModal open={showTC} onClose={() => setShowTC(false)} /> */}
      <View style={modalstyles.container}>
        {/* <Image
          resizeMode="stretch"
          source={CompanyIcon}
          style={styles.cardCover}
        /> */}

        {/* <ScrollView
        style={styles.companyInfoContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.companyInfoContentContainer}> */}
        {
          !showTCButton ? (
            <>
              <View style={modalstyles.info}>
                <Image
                  resizeMode="stretch"
                  source={CompanyIcon}
                  style={modalstyles.infoImage}
                />
                <View>
                  <Text style={modalstyles.companyTitle}>Ride Summary</Text>
                  {/* <Text style={styles.compantTitle}>Butterfly Images</Text> */}
                  <View style={modalstyles.tags}>
                    <View style={modalstyles.tag}>
                      <Text style={modalstyles.tagText}>
                        {duration.toFixed(0)} min
                      </Text>
                    </View>
                    <View style={modalstyles.tag}>
                      <Text style={modalstyles.tagText}>
                        {distance.toFixed(0)} km
                      </Text>
                    </View>
                    <View style={modalstyles.tag}>
                      <Text style={modalstyles.tagText}>
                        ₦{charge && charge.toFixed(0)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={modalstyles.mainDivider} />

              <View style={modalstyles.mainDivider} />
              <View style={modalstyles.stakeUnstakeButtons}>
                <TouchableOpacity
                  onPress={() => {
                    onPress;
                    // console.log({distance: distance});
                    // createRideOrder(distance);
                  }}>
                  <LinearGradient
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    colors={[
                      '#5851DB',
                      '#C13584',
                      '#E1306C',
                      '#FD1D1D',
                      '#F77737',
                    ]}
                    style={modalstyles.instagramButton}>
                    <Text style={modalstyles.stakeButtonText}>Order Ride</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {}}>
                  <LinearGradient
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    colors={[
                      '#5851DB',
                      '#C13584',
                      '#E1306C',
                      '#FD1D1D',
                      '#F77737',
                    ]}
                    style={modalstyles.instagramButton}>
                    <Text style={modalstyles.stakeButtonText}>Negotiate</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              <View>
                {/* <RotateAnimation /> */}
                {/* <AnimatedButton /> */}
                {/* <AnimatedProgress /> */}
              </View>
              {/* <Animated.View
                style={[
                  styles.progress,
                  progressStyle,
                  styles.opacityBackground,
                ]}
              /> */}
              {/* <View style={styles.button}>
                <Ripple
                  onPress={() => setShowInfo(true)}
                  style={styles.buttonOuter}>
                  <FontAwesome5Icon
                    size={24}
                    name="list-alt"
                    color={theme.COLORS.WHITE}
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonText}>About Mission</Text>
                </Ripple>
              </View> */}
              {/* <View style={styles.button}>
                <LinearGradient
                  end={{x: 1, y: 0}}
                  start={{x: 0.15, y: 0}}
                  colors={[theme.COLORS.SKY_BLUE, theme.COLORS.YELLOW]}
                  style={styles.radius30}>
                  <View style={styles.stakeUnstakeButtons}>
                    <Button
                      height={55}
                      // title="UnStake"
                      // onPress={() => UnStakeDT()}
                      title="Trade"
                      onPress={() => navigation.navigate('Trade')}
                      color={theme.APP_COLOR_2}
                      textStyle={styles.stakeButtonText}
                      buttonStyle={styles.stakeUnstakeButtonStyle}
                    />
                    <Button
                      height={55}
                      // title="Stake"
                      // onPress={() => StakeDT()}
                      title="Pool"
                      onPress={() => navigation.navigate('Pool')}
                      color={theme.APP_COLOR_2}
                      textStyle={styles.stakeButtonText}
                      buttonStyle={styles.stakeUnstakeButtonStyle}
                    />
                  </View>
                  <Ripple
                    onPress={() => setShowTCButton(false)}
                    style={styles.gradientButtonInner}>
                    <Text style={styles.buttonText}>Claim Mission</Text>
                  </Ripple>
                </LinearGradient>
              </View> */}
            </>
          ) : (
            ''
          )
          // (
          //   <>
          //     <Text style={styles.tcText}>Terms &amp; Conditions</Text>
          //     <View style={styles.mainDivider} />
          //     <View style={styles.actionContainer}>
          //       <View style={styles.radioButtonContainer}>
          //         <RadioButton checked={tcAgreed} onCheckChange={setTCAgreed} />
          //         <Text
          //           style={styles.radioButtonText}
          //           onPress={() => setTCAgreed(!tcAgreed)}>
          //           {'By checking this box I agree to\nData Union’s '}
          //           <Text
          //             onPress={() => setShowTC(true)}
          //             style={styles.radioButtonTextLink}>
          //             {'Terms & Conditions'}
          //           </Text>
          //         </Text>
          //       </View>
          //     </View>
          //     <View style={styles.button}>
          //       <LinearGradient
          //         end={{x: 1, y: 0}}
          //         start={{x: 0.15, y: 0}}
          //         colors={[
          //           theme.COLORS.DARK_PURPLE_1,
          //           theme.COLORS.DARK_BLUE_1,
          //         ]}
          //         style={styles.radius30}>
          //         <Ripple
          //           disabled={!tcAgreed}
          //           onPress={() => {
          //             // dispatch({
          //             //   type: actions.SET_ALERT_SETTINGS,
          //             //   alertSettings: {
          //             //     show: true,
          //             //     type: 'success',
          //             //     message: 'Mission has been added to your board.',
          //             //     confirmText: 'Got It',
          //             //     cancelText: 'Got It',
          //             //     title: 'New Mission Accepted!',
          //             //     showCancelButton: true,
          //             //     onCancelPressed: () => {
          //             //       //confirm action
          //             //       navigation.navigate('MyMissions');
          //             //     },
          //             //   },
          //             // });
          //           }}
          //           style={
          //             tcAgreed ? styles.gradientButtonInner : styles.buttonOuter
          //           }>
          //           <Text style={styles.buttonText}>Continue</Text>
          //         </Ripple>
          //       </LinearGradient>
          //     </View>
          //   </>
          // )
        }
        {/* </ScrollView> */}
      </View>
    </>
  );
};

export default ImageUploadMission;
