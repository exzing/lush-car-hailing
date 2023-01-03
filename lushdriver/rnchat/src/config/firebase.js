import * as firebase from 'firebase/app';

const firebaseConfig = {
  apiKey: 'APIKEY',
  appId: '1:478816800318:android:b3006ae89ca9cc1140cb6f',
  messagingSenderId: '478816800318',
  projectId: 'exzingdb',
  databaseURL: 'https://exzingdb-default-rtdb.firebaseio.com',
  storageBucket: 'exzingdb.appspot.com',
};

firebase.initializeApp(firebaseConfig);

export default firebase;
