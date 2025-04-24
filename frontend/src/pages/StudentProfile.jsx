import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentProfile from '../components/student/StudentProfile';
import { getSessions, getStudentInSession, db } from '../../firebase';
import { mockStudents } from '../lib/mock-data';

const StudentProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setIsLoading(true);
        
        // Get all sessions first
        const sessions = await getSessions();
        
        // Find sessions that include this student
        // We'll need to check each session for the student
        let studentData = null;
        
        // Try to find the student in any session
        for (const session of sessions) {
          try {
            const fetchedStudent = await getStudentInSession(session.id, id);
            if (fetchedStudent) {
              // Transform student data
              studentData = {
                id: fetchedStudent.id,
                name: fetchedStudent.name || `Student ${fetchedStudent.id}`,
                attentionScore: fetchedStudent.status?.attention || 50,
                lastActive: fetchedStudent.timestamp ? 'Just now' : 'N/A',
                avgAttention: fetchedStudent.status?.averageAttention || 50,
                disengagementEvents: fetchedStudent.status?.disengagementEvents || 0,
                attentionHistory: fetchedStudent.status?.attentionHistory || [
                  { time: '00:00', value: 50 }
                ],
                sessionId: session.id
              };
              break;
            }
          } catch (err) {
            // Continue to the next session if student not found in this one
            continue;
          }
        }
        
        if (studentData) {
          setStudent(studentData);
        } else {
          // If student not found in any session, try mock data as fallback
          const mockStudent = mockStudents.find(s => s.id === id);
          if (mockStudent) {
            setStudent(mockStudent);
          } else {
            setError('Student not found');
          }
        }
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError('Failed to load student data');
        
        // Use mock data as fallback
        const mockStudent = mockStudents.find(s => s.id === id);
        if (mockStudent) {
          setStudent(mockStudent);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStudentData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Student not found</h2>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return <StudentProfile student={student} />;
};

export default StudentProfilePage; 