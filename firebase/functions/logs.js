import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

export const getClassroomLogs = async (db) => {
  try {
    const logsCollection = collection(db, 'classroom_logs');
    const logsSnapshot = await getDocs(logsCollection);
    
    return logsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching classroom logs:', error);
    throw error;
  }
};

export const getClassroomLogById = async (db, logId) => {
  try {
    const logDoc = doc(db, 'classroom_logs', logId);
    const logSnapshot = await getDoc(logDoc);
    
    if (!logSnapshot.exists()) {
      throw new Error('Log not found');
    }
    
    return {
      id: logSnapshot.id,
      ...logSnapshot.data()
    };
  } catch (error) {
    console.error('Error fetching classroom log:', error);
    throw error;
  }
}; 