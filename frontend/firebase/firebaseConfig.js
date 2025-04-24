// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth  } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDzDQTFw6A2K5e94Rt_CwjJ8EupQ4IUygc",
  authDomain: "eduvision-fc96b.firebaseapp.com",
  projectId: "eduvision-fc96b",
  storageBucket: "eduvision-fc96b.firebasestorage.app",
  messagingSenderId: "696417749068",
  appId: "1:696417749068:web:e6698eb2c192f94a244ce9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app);

export {db, auth}