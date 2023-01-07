import {useRef, useEffect} from 'react';
import {Animated} from 'react-native';

export default function useRotation(props) {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    function startAnimation() {
      Animated.sequence(
        [
          Animated.timing(animation, {
            toValue: 360,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.delay(500),
        ],
        {useNativeDriver: false},
      ).start(() => {
        animation.setValue(0);
        startAnimation();
      });
    }
    startAnimation();
  });

  const rotateInterpolate = animation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return rotateInterpolate;
}

export function useProgress(props) {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const progressOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    function startAnimation() {
      Animated.sequence(
        [
          Animated.timing(progressAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.delay(500),
        ],
        {useNativeDriver: false},
      ).start(() => {
        progressAnim.setValue(0);
        startAnimation();
      });
    }
    startAnimation();
  });

  //   const rotateInterpolate = progressAnim.interpolate({
  //     inputRange: [0, 360],
  //     outputRange: ['0deg', '360deg'],
  //   });

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

    opacity: progressOpacity,
    backgroundColor: colorInterpolate,
  };

  return progressStyle;
}
