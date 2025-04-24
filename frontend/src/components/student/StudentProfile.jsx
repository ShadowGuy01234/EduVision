import { useState } from 'react';
import { ArrowLeft, Clock, Activity, AlertTriangle, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EngagementChart from '../session/EngagementChart';

const StudentProfile = ({ student }) => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('week');

  const handleBack = () => {
    navigate(-1);
  };

  const handleExport = () => {
    // In a real application, this would generate and download a PDF/CSV report
    console.log('Exporting student data:', student);
    alert('Student report exported successfully!');
  };

  const getStatusColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStatusEmoji = (score) => {
    if (score >= 80) return '🟢';
    if (score >= 60) return '🟡';
    return '🔴';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>
        <button
          onClick={handleExport}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="h-5 w-5" />
          <span>Export Report</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{student.name}</h1>
            <p className="text-gray-500 dark:text-gray-400">Student ID: {student.id}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getStatusEmoji(student.attentionScore)}</span>
            <span className={`text-xl font-semibold ${getStatusColor(student.attentionScore)}`}>
              {student.attentionScore}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Last Active</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{student.lastActive}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Average Attention</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{student.avgAttention}%</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Disengagement Events</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{student.disengagementEvents}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Attention History</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setTimeRange('week')}
                className={`px-3 py-1 rounded-lg text-sm ${
                  timeRange === 'week'
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setTimeRange('month')}
                className={`px-3 py-1 rounded-lg text-sm ${
                  timeRange === 'month'
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Month
              </button>
            </div>
          </div>
          <div className="h-64">
            <EngagementChart data={student.attentionHistory} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile; 