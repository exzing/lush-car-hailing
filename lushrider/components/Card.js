import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  PanResponder,
  Animated,
  Dimensions,
} from 'react-native';

import moment from 'moment';

const {width, height} = Dimensions.get('window');

export default class Card extends Component {
  componentWillMount() {
    this.pan = new Animated.ValueXY();

    this.cardPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([
        null,
        {dx: this.pan.x, dy: this.pan.y},
        {useNativeDriver: true},
      ]),
      onPanResponderRelease: (e, {dx}) => {
        const absDx = Math.abs(dx);
        const direction = absDx / dx;

        if (absDx > 120) {
          Animated.decay(this.pan, {
            velocity: {x: 3 * direction, y: 0},
            deceleration: 0.995,
          }).start();
        } else {
          Animated.spring(this.pan, {
            toValue: {x: 0, y: 0},
            friction: 4.5,
          }).start();
        }
      },
    });
  }

  render() {
    const {birthday, name, bio, id} = this.props.profile;
    const profileBday = moment(birthday, 'MM/DD/YYYY');
    const profileAge = moment().diff(profileBday, 'years');
    const fbImage = `https://graph.facebook.com/${id}/picture?height=500`;

    const rotateCard = this.pan.x.interpolate({
      inputRange: [-200, 0, 200],
      outputRange: ['10deg', '0deg', '-10deg'],
    });
    const animatedStyle = {
      transform: [
        {translateX: this.pan.x},
        {translateY: this.pan.y},
        {rotate: rotateCard},
      ],
    };

    return (
      <Animated.View
        {...this.cardPanResponder.panHandlers}
        style={[styles.card, animatedStyle]}>
        <Image style={{flex: 1}} source={{uri: fbImage}} />
        <View style={{margin: 20}}>
          <Text style={{fontSize: 20}}>
            {name}, {profileAge}
          </Text>
          <Text style={{fontSize: 15, color: 'darkgrey'}}>{bio}</Text>
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: width - 20,
    height: height * 0.7,
    top: (height * 0.3) / 2,
    overflow: 'hidden',
    backgroundColor: 'white',
    margin: 10,
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 8,
  },
});
