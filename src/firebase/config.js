import * as firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBNNmnMhrHu0ahOmoTZqZ88q7mHDPsLaYs',
  authDomain: 'alldemos-58c1e.firebaseapp.com',
  databaseURL: 'https://alldemos-58c1e.firebaseio.com',
  projectId: 'alldemos-58c1e',
  storageBucket: 'alldemos-58c1e.appspot.com',
  messagingSenderId: '1021208799048',
  appId: '1:1021208799048:web:b85bd7910922559267f57d',
  measurementId: 'G-23B1X0B3QW',
};
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);

const database = firebase.firestore();

export {
  firebase,
  database as default,
};
