import React, {Component, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';

export default class AnimatedButton extends Component {
  state = {
    animation: new Animated.Value(0),
    opacity: new Animated.Value(1),
  };

  handlePress = () => {
    this.state.animation.setValue(0);
    this.state.opacity.setValue(1);

    Animated.timing(this.state.animation, {
      duration: 1500,
      toValue: 1,
      useNativeDriver: false,
    }).start(({finished}) => {
      if (finished) {
        Animated.timing(this.state.opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
    });
  };

  render() {
    const progressInterpolate = this.state.animation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
      extrapolate: 'clamp',
    });

    const colorInterpolate = this.state.animation.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgb(71,255,99)', 'rgb(99,71,255)'],
    });

    const progressStyle = {
      width: progressInterpolate,
      bottom: 0,

      // height: progressInterpolate,
      // right: 0,

      // top: null,
      // bottom: 0,
      // width: progressInterpolate,
      // height: 5,

      opacity: this.state.opacity,
      backgroundColor: colorInterpolate,
    };

    return (
      <View>
        <TouchableWithoutFeedback onPress={this.handlePress}>
          <View style={styles.button}>
            <View style={StyleSheet.absoluteFill}>
              <Animated.View
                style={[
                  styles.progress,
                  progressStyle,
                  // styles.opacityBackground,
                ]}
              />
            </View>
            <Text style={styles.buttonText}>Get it!</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

export const AnimatedProgress = () => {
  // fadeAnim will be used as the value for opacity. Initial Value: 0
  const progressAnim = new Animated.Value(0);
  const progressOpacity = new Animated.Value(1);
  // const progressAnim = useRef(new Animated.Value(0)).current;
  // const progressOpacity = useRef(new Animated.Value(1)).current;

  // state = {
  //   animation: new Animated.Value(0),
  //   opacity: new Animated.Value(1),
  // };

  const translation = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 5000,
    }).start();
  };

  const fadeOut = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(progressAnim, {
      toValue: 0,
      duration: 3000,
    }).start();
  };
  // state = {
  //   animation: new Animated.Value(0),
  //   opacity: new Animated.Value(1),
  // };

  const handlePress = () => {
    // this.state.animation.setValue(0);
    // this.state.opacity.setValue(1);

    Animated.timing(progressAnim, {
      duration: 1500,
      toValue: 1,
      useNativeDriver: false,
    }).start(({finished}) => {
      if (finished) {
        Animated.timing(progressOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
    });
  };

  // opacity: translation.interpolate({
  //   inputRange: [0, 50, 100],
  //   outputRange: [0, 1, 0],
  // })

  const progressInterpolate = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  const colorInterpolate = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgb(71,255,99)', 'rgb(99,71,255)'],
  });

  const progressStyle = {
    width: progressInterpolate,
    bottom: 0,

    // height: progressInterpolate,
    // right: 0,

    // top: null,
    // bottom: 0,
    // width: progressInterpolate,
    // height: 5,

    opacity: progressOpacity,
    backgroundColor: colorInterpolate,
  };

  // useEffect (() => {})

  return (
    <View>
      <TouchableWithoutFeedback onPress={handlePress}>
        <View style={styles.button}>
          <View style={StyleSheet.absoluteFill}>
            <Animated.View
              style={[styles.progress, progressStyle]}
              // style={{
              //   width: 100,
              //   height: 100,
              //   backgroundColor: 'orange',
              //   // transform: [
              //   //   { translateX: translation },
              //   // ],
              // }}
            />
          </View>
          <Text style={styles.buttonText}>Got it!</Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#e6537d',
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 60,
    paddingVertical: 10,
    overflow: 'hidden',
  },
  buttonText: {
    color: '#FFF',
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
