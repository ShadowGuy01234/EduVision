import { getFirestore } from "@firebase/firestore";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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
export {db}