import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDuBgzftq7qcWwdHll2YlGkuciDmxOJUYY",
    authDomain: "etco-challenge.firebaseapp.com",
    databaseURL: "https://etco-challenge.firebaseio.com",
    projectId: "etco-challenge",
    storageBucket: "etco-challenge.appspot.com",
    messagingSenderId: "407489584884",
    appId: "1:407489584884:web:925caa32406a2db55c48a1"
};

firebase.initializeApp(firebaseConfig);
export default firebase;
export const db = firebase.firestore();