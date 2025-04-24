// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDzDQTFw6A2K5e94Rt_CwjJ8EupQ4IUygc",
  authDomain: "eduvision-fc96b.firebaseapp.com",
  projectId: "eduvision-fc96b",
  storageBucket: "eduvision-fc96b.firebaseapp.com",
  messagingSenderId: "696417749068",
  appId: "1:696417749068:web:e6698eb2c192f94a244ce9",
  measurementId: "G-MEASUREMENT_ID" // Optional - add your measurement ID if you use Analytics
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, app }; 