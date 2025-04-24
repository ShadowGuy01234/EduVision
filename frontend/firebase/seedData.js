import { db } from './firebaseConfig.js';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Function to seed the database with initial data
async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    
    // Create sessions (meetings/classes)
    const sessions = [
      {
        id: 'session1',
        subject: 'Mathematics',
        className: 'Math 101',
        date: '2024-07-10',
        duration: '1 hour',
        status: 'completed',
        studentCount: 3,
        engagement: 75,
        peakEngagement: 85,
        engagementData: [
          { time: '09:00', value: 80, engagement: 80 },
          { time: '09:15', value: 75, engagement: 75 },
          { time: '09:30', value: 85, engagement: 85 },
          { time: '09:45', value: 70, engagement: 70 },
          { time: '10:00', value: 75, engagement: 75 },
        ],
        createdAt: serverTimestamp()
      },
      {
        id: 'session2',
        subject: 'Physics',
        className: 'Physics 201',
        date: '2024-07-09',
        duration: '1.5 hours',
        status: 'completed',
        studentCount: 3,
        engagement: 82,
        peakEngagement: 90,
        engagementData: [
          { time: '10:00', value: 85, engagement: 85 },
          { time: '10:15', value: 82, engagement: 82 },
          { time: '10:30', value: 90, engagement: 90 },
          { time: '10:45', value: 88, engagement: 88 },
          { time: '11:00', value: 82, engagement: 82 },
        ],
        createdAt: serverTimestamp()
      },
      {
        id: 'session3',
        subject: 'Computer Science',
        className: 'CS 101',
        date: '2024-07-10',
        duration: '2 hours',
        status: 'active',
        studentCount: 3,
        engagement: 78,
        peakEngagement: 88,
        engagementData: [
          { time: '14:00', value: 75, engagement: 75 },
          { time: '14:15', value: 78, engagement: 78 },
          { time: '14:30', value: 88, engagement: 88 },
          { time: '14:45', value: 82, engagement: 82 },
          { time: '15:00', value: 78, engagement: 78 },
        ],
        createdAt: serverTimestamp()
      }
    ];

    // Create students for each session
    const students = [
      {
        id: 'student1',
        name: 'John Smith',
        sessions: ['session1', 'session2', 'session3'],
        status: {
          attention: 85,
          averageAttention: 82,
          disengagementEvents: 3,
          attentionHistory: [
            { time: '09:00', value: 90 },
            { time: '09:15', value: 85 },
            { time: '09:30', value: 88 },
            { time: '09:45', value: 82 },
            { time: '10:00', value: 85 },
          ]
        }
      },
      {
        id: 'student2',
        name: 'Emma Wilson',
        sessions: ['session1', 'session2', 'session3'],
        status: {
          attention: 92,
          averageAttention: 89,
          disengagementEvents: 1,
          attentionHistory: [
            { time: '09:00', value: 95 },
            { time: '09:15', value: 90 },
            { time: '09:30', value: 92 },
            { time: '09:45', value: 91 },
            { time: '10:00', value: 92 },
          ]
        }
      },
      {
        id: 'student3',
        name: 'Michael Brown',
        sessions: ['session1', 'session2', 'session3'],
        status: {
          attention: 45,
          averageAttention: 48,
          disengagementEvents: 8,
          attentionHistory: [
            { time: '09:00', value: 50 },
            { time: '09:15', value: 45 },
            { time: '09:30', value: 40 },
            { time: '09:45', value: 48 },
            { time: '10:00', value: 45 },
          ]
        }
      }
    ];

    // Add sessions to Firestore
    for (const session of sessions) {
      const { id, ...sessionData } = session;
      await setDoc(doc(db, 'sessions', id), sessionData);
      console.log(`Added session: ${id}`);
    }

    // Add students to each session
    for (const student of students) {
      for (const sessionId of student.sessions) {
        const studentInSessionRef = doc(db, `sessions/${sessionId}/students`, student.id);
        await setDoc(studentInSessionRef, {
          name: student.name,
          studentId: student.id,
          status: student.status,
          timestamp: serverTimestamp()
        });
        console.log(`Added student: ${student.id} to session: ${sessionId}`);
      }
    }

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

export { seedDatabase }; 