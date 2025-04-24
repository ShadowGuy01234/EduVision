import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const storeClassroomLog = async (analysisData) => {
  try {
    const logsCollection = collection(db, 'classroom_logs');
    const logData = {
      ...analysisData,
      timestamp: serverTimestamp()
    };
    
    const docRef = await addDoc(logsCollection, logData);
    return {
      id: docRef.id,
      ...logData
    };
  } catch (error) {
    console.error('Error storing classroom log:', error);
    throw error;
  }
}; 