import React from 'react';
import Sidebar from '../components/Sidebar';
import Chat from '../components/Chat';
import {View} from 'react-native';

const Home = () => {
  return (
    <View className="home">
      <View className="container">
        <Sidebar />
        <Chat />
      </View>
    </View>
  );
};

export default Home;
