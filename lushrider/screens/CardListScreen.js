import React, {useState} from 'react';
import {View, Text, Button, FlatList, StyleSheet} from 'react-native';
import {data} from '../model/data';
import Card from '../components/Card_';
import {ScrollView, Image, Modal, Dimensions} from 'react-native';
import {theme} from '../styles/theme';
import {imagestyles} from '../styles/imageuploadmission';
import Ripple from '../components/Ripple';
import LinearGradient from 'react-native-linear-gradient';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {AboutMissionModal} from '../components/AboutMissionModal';
import {actions} from '../state/Reducer';
import {useStateValue} from '../state/State';

const CardListScreen = ({navigation}) => {
  const [showInfo, setShowInfo] = useState(false);
  const [showTCButton, setShowTCButton] = useState(false);
  const [tcAgreed, setTCAgreed] = useState(false);
  const [showTC, setShowTC] = useState(false);
  // const [, dispatch] = useStateValue();

  // const UploadMission = require('../assets/image_upload_mission_test.png');
  // const CompanyIcon = require('../assets/company_icon.png');

  const renderItem = ({item}) => {
    return (
      <Card
        itemData={item}
        onPress={() => navigation.navigate('CardItemDetails', {itemData: item})}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* <Image
          resizeMode="stretch"
          source={UploadMission}
          style={styles.cardCover}
        /> */}
      {/* <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      /> */}
      {/* <AboutMissionModal open={showInfo} onClose={() => setShowInfo(false)} /> */}
    </View>
  );
};

export default CardListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '90%',
    alignSelf: 'center',
  },
});
