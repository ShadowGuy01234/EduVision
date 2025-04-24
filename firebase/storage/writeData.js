import { db } from '../firebaseConfig.js';
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

// Save student status to Firestore
export const addData = async (sessionId, studentId, status) => {
  try {
    const docRef = doc(db, `sessions/${sessionId}/students/${studentId}`);
    await setDoc(docRef, {
      studentId,
      status,
      timestamp: serverTimestamp() // Use Firestore server time
    });
    console.log("Status saved for student:", studentId);
  } catch (error) {
    console.error("Error saving status:", error);
  }
};