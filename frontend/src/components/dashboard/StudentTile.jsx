import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

const StudentTile = ({ student }) => {
  const getStatusColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusEmoji = (score) => {
    if (score >= 80) return '🟢';
    if (score >= 50) return '🟡';
    return '🔴';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800 dark:text-white">{student.name}</h3>
        <span className="text-2xl">{getStatusEmoji(student.attentionScore)}</span>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-300">Attention Score</span>
          <span className="font-medium text-gray-800 dark:text-white">{student.attentionScore}%</span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${getStatusColor(student.attentionScore)}`}
            style={{ width: `${student.attentionScore}%` }}
          />
        </div>

        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Clock className="w-4 h-4 mr-1" />
          <span>Last active: {student.lastActive}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentTile; 