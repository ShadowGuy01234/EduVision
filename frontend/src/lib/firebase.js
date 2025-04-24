// Import Firebase configuration from local file
import { db, auth } from './firebaseConfig';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  query, 
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

// Authentication services
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

// Firestore services - Sessions/Meetings
export const getSessions = async () => {
  try {
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

export const getSessionById = async (sessionId) => {
  try {
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

// Firestore services - Students in a session
export const getStudentsInSession = async (sessionId) => {
  try {
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

export const getStudentInSession = async (sessionId, studentId) => {
  try {
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

// Add or update student data in a session
export const updateStudentStatus = async (sessionId, studentId, status) => {
  try {
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

// Create a new session
export const createSession = async (sessionData) => {
  try {
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