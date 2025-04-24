import { db } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface AnalysisData {
  geminiAnalysis: string;
  timestamp: string;
  overallSummary?: string;
  averageEngagement?: number;
  dominantMood?: string;
  remarks?: string;
  teachingStrategySuggestions?: string[];
  teachingEffectivenessAssessment?: string;
  individualStudentInsights?: Array<{
    id: number;
    engagementLevel: number;
    emotionalState: string;
    remarks: string;
  }>;
}

export const storeClassroomLog = async (analysisData: AnalysisData) => {
  try {
    const logsCollection = collection(db, "classroom_logs");
    const logData = {
      ...analysisData,
      timestamp: serverTimestamp(),
    };

    const docRef = await addDoc(logsCollection, logData);
    return {
      id: docRef.id,
      ...logData,
    };
  } catch (error) {
    console.error("Error storing classroom log:", error);
    throw error;
  }
};
