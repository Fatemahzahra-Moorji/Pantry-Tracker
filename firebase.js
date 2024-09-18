// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAeXPAeYr9eVvkw0RLashxUIXopTnZlamE",
  authDomain: "pantry-tracker-30288.firebaseapp.com",
  projectId: "pantry-tracker-30288",
  storageBucket: "pantry-tracker-30288.appspot.com",
  messagingSenderId: "642560050077",
  appId: "1:642560050077:web:17d68c8d93d4e6b0e1e574"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}
