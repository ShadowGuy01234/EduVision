import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Plus, Activity, Users, AlertTriangle } from 'lucide-react';
import { mockStudents, mockEngagementData } from '../lib/mock-data';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // For now, use mock data
    setStudents(mockStudents || []);
  }, []);
  
  const handleNewSession = () => {
    // Generate a session ID
    const sessionId = 'session-' + Date.now();
    
    // Create a new session object with initial data
    const newSession = {
      id: sessionId,
      subject: 'New Session',
      className: 'My Class',
      date: new Date().toISOString().split('T')[0],
      duration: '60',
      status: 'active',
      studentCount: students.length,
      engagement: 0,
      peakEngagement: 0,
      students: students,
      engagementData: []
    };
    
    // Store the session data in localStorage for demo purposes
    const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    sessions.push(newSession);
    localStorage.setItem('sessions', JSON.stringify(sessions));
    
    // Redirect to the session detail page
    navigate(`/history/${sessionId}`, { state: { newSession: true } });
  };
  
  // Calculate some basic statistics
  const stats = {
    total: students.length,
    engaged: students.filter(s => s?.attentionScore >= 80).length,
    warning: students.filter(s => s?.attentionScore >= 60 && s?.attentionScore < 80).length,
    disengaged: students.filter(s => s?.attentionScore < 60).length,
    avgEngagement: Math.round(
      students.reduce((sum, student) => sum + (student?.attentionScore || 0), 0) / 
      (students.length || 1)
    )
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Welcome back, {user?.name || 'User'}!
          </p>
        </div>
        <button
          onClick={handleNewSession}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>New Session</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Students</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Engaged</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.engaged}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Warning</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.warning}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Disengaged</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.disengaged}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
            You've successfully logged in with the simplified authentication. 
            Click on the "New Session" button to start a new classroom session.
          </p>
          <div className="flex justify-center">
            <button 
              onClick={handleNewSession}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start New Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 