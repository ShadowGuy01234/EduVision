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

// Create a session
export const createSession = async (sessionData) => {
  try {
    const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
    const { db } = await import('./firebaseConfig');
    const sessionsCollection = collection(db, 'sessions');
    const docRef = await addDoc(sessionsCollection, {
      ...sessionData,
      createdAt: serverTimestamp(),
      status: 'active'
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
};

// Get all sessions
export const getSessions = async () => {
  try {
    const { collection, getDocs } = await import('firebase/firestore');
    const { db } = await import('./firebaseConfig');
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

// Get a specific session by ID
export const getSessionById = async (sessionId) => {
  try {
    const { doc, getDoc } = await import('firebase/firestore');
    const { db } = await import('./firebaseConfig');
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

// Get students in a session
export const getStudentsInSession = async (sessionId) => {
  try {
    const { collection, getDocs } = await import('firebase/firestore');
    const { db } = await import('./firebaseConfig');
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

// Get specific student in a session
export const getStudentInSession = async (sessionId, studentId) => {
  try {
    const { doc, getDoc } = await import('firebase/firestore');
    const { db } = await import('./firebaseConfig');
    const studentDoc = doc(db, `sessions/${sessionId}/students`, studentId);
    const studentSnapshot = await getDoc(studentDoc);
    
    if (!studentSnapshot.exists()) {
      throw new Error('Student not found in this session');
    }
    
    return {
      id: studentSnapshot.id,
      ...studentSnapshot.data()
    };
  } catch (error) {
    console.error('Error fetching student in session:', error);
    throw error;
  }
};

// Update student status in a session
export const updateStudentStatus = async (sessionId, studentId, status) => {
  try {
    const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
    const { db } = await import('./firebaseConfig');
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