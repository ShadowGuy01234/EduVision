import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Clock, Users, BarChart2, Download, Play, Pause, Square, Edit } from 'lucide-react';
import { mockSessions, mockStudents } from '../lib/mock-data';
import EngagementChart from '../components/session/EngagementChart';
import StudentList from '../components/session/StudentList';

const SessionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [session, setSession] = useState(null);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    subject: '',
    className: '',
    duration: ''
  });

  // Generate sample engagement data with a pattern that looks realistic
  const generateSampleEngagementData = () => {
    const timePoints = ['10:00', '10:15', '10:30', '10:45', '11:00'];
    const baseValue = Math.floor(Math.random() * 30) + 60; // Random base between 60-90
    
    return timePoints.map((time, index) => {
      // Create a wave pattern with some randomness
      const variation = Math.sin(index * 0.5 * Math.PI) * 15 + (Math.random() * 10 - 5);
      const value = Math.min(Math.max(Math.round(baseValue + variation), 30), 95);
      return { time, value };
    });
  };

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        setIsLoading(true);
        
        // Check if we have a new session from state
        if (location.state?.newSession) {
          // Use session data from localStorage
          const storedSessions = JSON.parse(localStorage.getItem('sessions') || '[]');
          const newSession = storedSessions.find(s => s.id === id);
          
          if (newSession) {
            // Add sample engagement data if it's empty
            if (!newSession.engagementData || newSession.engagementData.length === 0) {
              newSession.engagementData = generateSampleEngagementData();
              
              // Update localStorage with the enhanced session
              const updatedSessions = storedSessions.map(s => 
                s.id === id ? {...newSession} : s
              );
              localStorage.setItem('sessions', JSON.stringify(updatedSessions));
            }
            
            setSession(newSession);
            setEditForm({
              subject: newSession.subject || 'New Session',
              className: newSession.className || 'My Class',
              duration: newSession.duration || '60'
            });
            setStudents(newSession.students || mockStudents);
            setIsLoading(false);
            return;
          }
        }
        
        // Try to load from localStorage first
        const storedSessions = JSON.parse(localStorage.getItem('sessions') || '[]');
        const sessionData = storedSessions.find(s => s.id === id);
        
        if (sessionData) {
          // If it exists in localStorage, use it
          // Add sample engagement data if it's empty
          if (!sessionData.engagementData || sessionData.engagementData.length === 0) {
            sessionData.engagementData = generateSampleEngagementData();
            
            // Update localStorage with the enhanced session
            const updatedSessions = storedSessions.map(s => 
              s.id === id ? {...sessionData} : s
            );
            localStorage.setItem('sessions', JSON.stringify(updatedSessions));
          }
          
          setSession(sessionData);
          setEditForm({
            subject: sessionData.subject || 'New Session',
            className: sessionData.className || 'My Class',
            duration: sessionData.duration || '60'
          });
          setStudents(sessionData.students || mockStudents);
        } else {
          // Otherwise check mock data
          const mockSession = mockSessions.find(s => s.id === id);
          
          if (mockSession) {
            setSession(mockSession);
            setEditForm({
              subject: mockSession.subject || 'New Session',
              className: mockSession.className || 'My Class',
              duration: mockSession.duration || '60'
            });
            setStudents(mockSession.students || mockStudents);
          } else {
            // Create a new session if nothing is found
            const sampleEngagementData = generateSampleEngagementData();
            const newSession = {
              id,
              subject: 'New Session',
              className: 'My Class',
              date: new Date().toISOString().split('T')[0],
              duration: '60',
              status: 'active',
              studentCount: mockStudents.length,
              students: mockStudents,
              engagement: sampleEngagementData.reduce((sum, data) => sum + data.value, 0) / sampleEngagementData.length,
              peakEngagement: Math.max(...sampleEngagementData.map(data => data.value)),
              engagementData: sampleEngagementData
            };
            
            setSession(newSession);
            setEditForm({
              subject: newSession.subject,
              className: newSession.className,
              duration: newSession.duration
            });
            setStudents(mockStudents);
            
            // Save to localStorage
            const sessions = [...storedSessions, newSession];
            localStorage.setItem('sessions', JSON.stringify(sessions));
          }
        }
      } catch (err) {
        console.error('Error fetching session data:', err);
        setError('Failed to load session data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSessionData();
  }, [id, location.state]);

  const handleBack = () => {
    navigate('/history');
  };

  const handleExport = () => {
    // In a real application, this would generate and download a PDF/CSV report
    console.log('Exporting session data:', session);
    alert('Session report exported successfully!');
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPaused(!isPaused);
    } else {
      setIsPlaying(true);
      setIsPaused(false);
      
      // Update session status
      const updatedSession = { ...session, status: 'active' };
      setSession(updatedSession);
      
      // Update in localStorage
      const storedSessions = JSON.parse(localStorage.getItem('sessions') || '[]');
      const updatedSessions = storedSessions.map(s => s.id === id ? updatedSession : s);
      localStorage.setItem('sessions', JSON.stringify(updatedSessions));
    }
  };

  const handleStop = () => {
    setIsPlaying(false);
    setIsPaused(false);
    
    // Update session status
    const updatedSession = { ...session, status: 'completed' };
    setSession(updatedSession);
    
    // Update in localStorage
    const storedSessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    const updatedSessions = storedSessions.map(s => s.id === id ? updatedSession : s);
    localStorage.setItem('sessions', JSON.stringify(updatedSessions));
  };
  
  const handleEditToggle = () => {
    if (editMode) {
      // Save changes
      const updatedSession = { 
        ...session, 
        subject: editForm.subject,
        className: editForm.className,
        duration: editForm.duration
      };
      
      setSession(updatedSession);
      
      // Update in localStorage
      const storedSessions = JSON.parse(localStorage.getItem('sessions') || '[]');
      const updatedSessions = storedSessions.map(s => s.id === id ? updatedSession : s);
      localStorage.setItem('sessions', JSON.stringify(updatedSessions));
    }
    
    setEditMode(!editMode);
  };
  
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Session not found</h2>
        <button
          onClick={() => navigate('/history')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to History
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to History</span>
        </button>
        <div className="flex space-x-2">
          <button
            onClick={handleEditToggle}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <Edit className="h-5 w-5" />
            <span>{editMode ? 'Save' : 'Edit'}</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-5 w-5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            {editMode ? (
              <div className="space-y-2">
                <input
                  type="text"
                  name="subject"
                  value={editForm.subject}
                  onChange={handleEditFormChange}
                  className="w-full text-2xl font-bold bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:text-white"
                  placeholder="Session Title"
                />
                <input
                  type="text"
                  name="className"
                  value={editForm.className}
                  onChange={handleEditFormChange}
                  className="w-full text-gray-500 dark:text-gray-400 bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                  placeholder="Class Name"
                />
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{session.subject}</h1>
                <p className="text-gray-500 dark:text-gray-400">{session.className}</p>
              </>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePlayPause}
              className={`p-2 rounded-full ${
                isPlaying
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {isPlaying && !isPaused ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </button>
            <button
              onClick={handleStop}
              className="p-2 rounded-full bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
            >
              <Square className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Session Details</h3>
              <div className="space-y-2">
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Date:</span> {session.date}
                </p>
                {editMode ? (
                  <div className="flex items-center">
                    <span className="font-medium text-gray-600 dark:text-gray-300 mr-2">Duration:</span>
                    <input
                      type="number"
                      name="duration"
                      value={editForm.duration}
                      onChange={handleEditFormChange}
                      className="w-16 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-blue-500 text-gray-600 dark:text-gray-300"
                      min="5"
                      step="5"
                    />
                    <span className="ml-2 text-gray-600 dark:text-gray-300">min</span>
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Duration:</span> {session.duration} min
                  </p>
                )}
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Status:</span>{' '}
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    session.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}>
                    {session.status}
                  </span>
                </p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Engagement Metrics</h3>
              <div className="space-y-2">
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Average Engagement:</span> {Math.round(session.engagement)}%
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Peak Engagement:</span> {session.peakEngagement || 0}%
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Engagement Over Time</h3>
            <EngagementChart data={session.engagementData} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Student Performance</h2>
          <StudentList students={students} />
        </div>
      </div>
    </div>
  );
};

export default SessionDetail; 