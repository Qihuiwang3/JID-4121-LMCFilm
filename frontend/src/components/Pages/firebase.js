// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDXSAaNLQT4jPp1RlKyApSGfvU74b3qTgQ",
    authDomain: "lmcfilm-464db.firebaseapp.com",
    projectId: "lmcfilm-464db",
    storageBucket: "lmcfilm-464db.appspot.com",
    messagingSenderId: "655312398265",
    appId: "1:655312398265:web:db584394d0c5213fedb868",
    measurementId: "G-HEE7QDFT79"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default getFirestore();