import React, {useState, useRef} from 'react';
import {View, Modal} from 'react-native';
import Button from '../components/Button';
import MapView from 'react-native-maps';
import PropTypes from 'prop-types';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

const MapModal = ({
  visible = true,
  onClose = () => {},
  onSelectLocation = () => {},
  coords = {latitude: 0, longitude: 0},
}) => {
  let refMap = useRef(null);
  const [location, setLocation] = useState({
    latitude: 33.76876,
    longitude: 73.786876,
  });

  return (
    <Modal animationType="slide" visible={visible} statusBarTranslucent={true}>
      <View
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          backgroundColor: '#46a1b4',
        }}>
        <MapView
          ref={refMap}
          provider="google"
          style={{flex: 1}}
          loadingEnabled={true}
          showsUserLocation={true}
          followsUserLocation={true}
          loadingIndicatorColor="#fff"
          loadingBackgroundColor="rgba(52,52,52,0.5)"
          onRegionChangeComplete={region => setLocation(region)}
          initialRegion={{
            latitude: coords.latitude ? coords.latitude : 33.6360766,
            longitude: coords.longitude ? coords.longitude : 73.0740932,
            latitudeDelta: 0.0222,
            longitudeDelta: 0.0221,
          }}
        />
        <View
          style={{
            left: '47%',
            top: '44.5%',
            position: 'absolute',
          }}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <FontAwesome5Icon name="map-pin" size={40} color="#ed3237" />
          </View>
        </View>
        <View
          style={{
            left: 0,
            right: 0,
            zIndex: 1,
            bottom: '1.5%',
            position: 'absolute',
            flexDirection: 'row',
            marginHorizontal: '5%',
            justifyContent: 'space-between',
          }}>
          <Button
            height={50}
            title="Done"
            color="#67c590"
            textStyle={{fontSize: 15}}
            onPress={() => onSelectLocation(location)}
            style={{width: '49%', alignSelf: 'center'}}
          />
          <Button
            height={50}
            title="Close"
            color="#ed3237"
            onPress={onClose}
            textStyle={{fontSize: 15}}
            style={{width: '49%', alignSelf: 'center'}}
          />
        </View>
      </View>
    </Modal>
  );
};

MapModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  coords: PropTypes.object,
  onSelectLocation: PropTypes.func,
};

export default MapModal;
