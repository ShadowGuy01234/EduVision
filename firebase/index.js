// Export Firebase configuration and instances
export { db, auth } from './firebaseConfig';

// Export authentication functions
export { 
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  onAuthStateChange
} from './auth/auth';

// Export Firestore functions (example data operations)
export const getSessionById = async (db, sessionId) => {
  try {
    const { doc, getDoc } = await import('firebase/firestore');
    const sessionDoc = doc(db, 'sessions', sessionId);
    const sessionSnapshot = await getDoc(sessionDoc);
    
    if (!sessionSnapshot.exists()) {
      throw new Error('Session not found');
    }
    
    return {
      id: sessionSnapshot.id,
      ...sessionSnapshot.data()
    };
  } catch (error) {
    console.error('Error fetching session:', error);
    throw error;
  }
};

export const getStudentsInSession = async (db, sessionId) => {
  try {
    const { collection, getDocs } = await import('firebase/firestore');
    const studentsCollection = collection(db, `sessions/${sessionId}/students`);
    const studentsSnapshot = await getDocs(studentsCollection);
    
    return studentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching students in session:', error);
    throw error;
  }
};

export const getSessions = async (db) => {
  try {
    const { collection, getDocs } = await import('firebase/firestore');
    const sessionsCollection = collection(db, 'sessions');
    const sessionSnapshot = await getDocs(sessionsCollection);
    
    return sessionSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching sessions:', error);
    throw error;
  }
};

export const updateStudentStatus = async (db, sessionId, studentId, status) => {
  try {
    const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
    const studentRef = doc(db, `sessions/${sessionId}/students/${studentId}`);
    await setDoc(studentRef, {
      studentId,
      status,
      timestamp: serverTimestamp()
    }, { merge: true });
    
    return true;
  } catch (error) {
    console.error('Error updating student status:', error);
    throw error;
  }
}; 