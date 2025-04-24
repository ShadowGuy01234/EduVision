import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Calendar, Filter,
  ChevronLeft, ChevronRight,
  ArrowDown, ArrowUp
} from 'lucide-react';
import SessionCard from './SessionCard';
import { formatDate, getRelativeTimeString } from '../../utils/dateUtils';

const mockSessions = [
  {
    id: '1',
    subject: 'Mathematics',
    className: 'Grade 10 - Section A',
    date: 'May 15, 2023',
    duration: '45 min',
    studentCount: 28,
    engagement: 85,
    status: 'completed'
  },
  {
    id: '2',
    subject: 'Physics',
    className: 'Grade 11 - Section B',
    date: 'May 14, 2023',
    duration: '50 min',
    studentCount: 24,
    engagement: 78,
    status: 'completed'
  },
  {
    id: '3',
    subject: 'Chemistry',
    className: 'Grade 10 - Section C',
    date: 'May 14, 2023',
    duration: '45 min',
    studentCount: 26,
    engagement: 65,
    status: 'completed'
  },
  {
    id: '4',
    subject: 'Biology',
    className: 'Grade 11 - Section A',
    date: 'May 13, 2023',
    duration: '60 min',
    studentCount: 30,
    engagement: 92,
    status: 'completed'
  },
  {
    id: '5',
    subject: 'Computer Science',
    className: 'Grade 12 - Section B',
    date: 'May 12, 2023',
    duration: '55 min',
    studentCount: 22,
    engagement: 88,
    status: 'completed'
  }
];

const HistoryPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sessionsPerPage] = useState(6);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchSessions = async () => {
      setIsLoading(true);
      try {
        // Replace with actual API call
        setTimeout(() => {
          setSessions(mockSessions);
          setFilteredSessions(mockSessions);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching sessions:', error);
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, []);

  useEffect(() => {
    let result = [...sessions];
    
    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(session => session.status === filterStatus);
    }
    
    // Apply search query
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      result = result.filter(session => 
        session.subject.toLowerCase().includes(query) || 
        session.className.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortConfig.key === 'date') {
        return sortConfig.direction === 'asc' 
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      }
      
      if (sortConfig.key === 'engagement') {
        // Handle null engagement values
        if (a.engagement === null) return sortConfig.direction === 'asc' ? -1 : 1;
        if (b.engagement === null) return sortConfig.direction === 'asc' ? 1 : -1;
        
        return sortConfig.direction === 'asc'
          ? a.engagement - b.engagement
          : b.engagement - a.engagement;
      }
      
      return 0;
    });
    
    setFilteredSessions(result);
  }, [sessions, searchTerm, sortConfig, filterStatus]);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSessionClick = (sessionId) => {
    navigate(`/history/${sessionId}`);
  };

  // Pagination
  const indexOfLastSession = currentPage * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions = filteredSessions.slice(indexOfFirstSession, indexOfLastSession);
  const totalPages = Math.ceil(filteredSessions.length / sessionsPerPage);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Session History</h1>
        <p className="text-gray-600 dark:text-gray-400">View and analyze your past teaching sessions</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search sessions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            <Calendar className="w-4 h-4" />
            <span>Date</span>
          </button>
          <button className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <select
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="ongoing">Ongoing</option>
            <option value="scheduled">Scheduled</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
        
        <button 
          className={`px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 ${
            sortConfig.key === 'date' ? 'bg-blue-50 border-blue-300' : ''
          }`}
          onClick={() => handleSort('date')}
        >
          Date
          {sortConfig.key === 'date' && (
            sortConfig.direction === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />
          )}
        </button>
        
        <button 
          className={`px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 ${
            sortConfig.key === 'engagement' ? 'bg-blue-50 border-blue-300' : ''
          }`}
          onClick={() => handleSort('engagement')}
        >
          Engagement
          {sortConfig.key === 'engagement' && (
            sortConfig.direction === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />
          )}
        </button>
      </div>

      {filteredSessions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No sessions found.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentSessions.map((session) => (
              <SessionCard 
                key={session.id} 
                session={session} 
                onClick={() => handleSessionClick(session.id)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center mx-4">
                <span className="text-gray-700 dark:text-gray-300">
                  Page {currentPage} of {totalPages}
                </span>
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HistoryPage; 