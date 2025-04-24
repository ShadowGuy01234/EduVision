import React from 'react';
import { formatDate, formatDuration } from '../../utils/dateUtils';

/**
 * Card component to display a single session's information
 * @param {Object} props 
 * @param {Object} props.session - Session data
 * @param {Function} props.onClick - Click handler for the card
 */
const SessionCard = ({ session, onClick }) => {
  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    ongoing: 'bg-blue-100 text-blue-800',
    canceled: 'bg-red-100 text-red-800',
    scheduled: 'bg-yellow-100 text-yellow-800'
  };

  const statusColor = statusColors[session.status] || 'bg-gray-100 text-gray-800';

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-4 mb-4 cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={() => onClick(session)}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{session.subject}</h3>
          <p className="text-sm text-gray-600">{session.className}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
          {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mt-3">
        <div className="text-sm">
          <p className="text-gray-500">Date</p>
          <p className="font-medium">{formatDate(session.date)}</p>
        </div>
        
        <div className="text-sm">
          <p className="text-gray-500">Duration</p>
          <p className="font-medium">{formatDuration(session.duration)}</p>
        </div>
        
        <div className="text-sm">
          <p className="text-gray-500">Students</p>
          <p className="font-medium">{session.studentCount}</p>
        </div>
        
        <div className="text-sm">
          <p className="text-gray-500">Engagement</p>
          <p className="font-medium">
            {typeof session.engagement === 'number' 
              ? `${Math.round(session.engagement * 100)}%` 
              : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SessionCard; 