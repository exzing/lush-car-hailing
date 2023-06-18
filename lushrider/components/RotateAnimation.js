import React from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import Logo from '../assets/ic_launcher_round.png';

//import hook
import {useProgress} from './UseRotation';
import useRotation from './UseRotation';
import {modalstyles} from '../styles/modalStyles';

export default function RotateAnimation() {
  // get degrees from hook
  const rotate = useRotation();
  const progressStyle = useProgress();

  // transform image to rotate
  const animatedStyle = {transform: [{rotate}]};

  return (
    <View style={styles.container}>
      <Text style={{color: 'purple'}}>{'Pls Wait...'}</Text>
      <View style={styles.button}>
        <View style={StyleSheet.absoluteFill}>
          <Animated.View style={[styles.progress, progressStyle]} />
        </View>
        <Animated.Image
          style={[styles.image, animatedStyle]}
          source={Logo}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 30,
    height: 30,
  },
  textMargin: {
    marginTop: 30,
    fontSize: 18,
  },
  button: {
    backgroundColor: '#e6537d',
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    // paddingHorizontal: 60,
    width: '100%',
    // height: '10%',
    // paddingVertical: 10,
    // overflow: 'hidden',
  },
  buttonText: {
    color: 'black',
    fontSize: 24,
    backgroundColor: 'transparent',
  },
  progress: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  opacityBackground: {
    // backgroundColor: "rgba(255,255,255,.5)",
  },
});
