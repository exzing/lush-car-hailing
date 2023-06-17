import NetInfo from '@react-native-community/netinfo';
import React, {createContext, useEffect, useState} from 'react';

export const NetWorkContext = createContext();

export const NetWorkProvider = ({children}) => {
  const [network, setNetwork] = useState(null);

  const handleNetworkChange = state => {
    setNetwork(state);
  };
  useEffect(() => {
    const netInfoSubscription = NetInfo.addEventListener(handleNetworkChange);
    return () => {
      netInfoSubscription && netInfoSubscription();
    };
  }, []);

  return (
    <NetWorkContext.Provider value={{network}}>
      {children}
    </NetWorkContext.Provider>
  );
};
