import React from 'react';
import {
  View,
  Platform,
  TouchableNativeFeedback,
  TouchableHighlight,
} from 'react-native';

export const Physics = ({style = {}, children = null, ...props}) => {
  const activate = ActiveComponent => {
    const Touchable =
      ActiveComponent ||
      Platform.select({
        android: TouchableNativeFeedback,
        ios: TouchableHighlight,
        default: TouchableHighlight,
      });
    let defaultTouchableProps = {};
    if (Touchable === TouchableHighlight) {
      defaultTouchableProps = {underlayColor: 'rgba(0, 0, 0, 0.1)'};
    }
    return {Touchable, defaultTouchableProps};
  };

  const {Touchable, defaultTouchableProps} = activate();

  const outerStyle = {
    borderRadius: style.borderRadius ? style.borderRadius : 0,
    overflow: 'hidden',
  };

  return (
    <View style={outerStyle}>
      <Touchable {...defaultTouchableProps} {...props}>
        <View style={style}>{children}</View>
      </Touchable>
    </View>
  );
};
