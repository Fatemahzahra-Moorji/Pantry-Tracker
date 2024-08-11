// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQhcK2NumCi088JPrVVKM3dBdVS8N9zZY",
  authDomain: "pantry-tracker-fz.firebaseapp.com",
  projectId: "pantry-tracker-fz",
  storageBucket: "pantry-tracker-fz.appspot.com",
  messagingSenderId: "781435005647",
  appId: "1:781435005647:web:ef6723823f4a7f196a25ba",
  measurementId: "G-MLEKLLK8KV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}