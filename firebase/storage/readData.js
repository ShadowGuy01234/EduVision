import { collection, getDocs, doc, setDoc, serverTimestamp } from "firebase/firestore"; 
import { db } from '../firebaseConfig.js';

export class database {
    async readData(studentId, sessionId) {
        try{
            const studentCollection = collection(db, "database_name");
            const sessionData = await getDocs(studentCollection);
            const result = [];
            sessionData.forEach((doc) => {
                if (doc.id === studentId && doc.data().sessionId === sessionId) {
                    result.push(doc.data());
                }
            });
            return result;
        }catch(err){
            throw err;
            return false;
        }
    }

    async writeData({sessionId, studentId, status}){
        const addData = async (sessionId, studentId, status) => {
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
    }
}