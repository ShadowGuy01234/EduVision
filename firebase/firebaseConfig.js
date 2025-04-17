// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAGuMJA8mex69Wn3hnsDTo1koM0swKk_9M",
  authDomain: "eduvision-66f57.firebaseapp.com",
  databaseURL: "https://eduvision-66f57-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "eduvision-66f57",
  storageBucket: "eduvision-66f57.firebasestorage.app",
  messagingSenderId: "140684767829",
  appId: "1:140684767829:web:12fdd29677b73a6c971adc",
  measurementId: "G-8Z7XMMZ914"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export {db}