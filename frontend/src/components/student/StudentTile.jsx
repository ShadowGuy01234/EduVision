import { useNavigate } from 'react-router-dom';

const StudentTile = ({ student }) => {
  const navigate = useNavigate();

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

  const handleClick = () => {
    navigate(`/student/${student.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{student.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">ID: {student.id}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xl">{getStatusEmoji(student.attentionScore)}</span>
          <span className={`text-lg font-semibold ${getStatusColor(student.attentionScore)}`}>
            {student.attentionScore}%
          </span>
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Last active: {student.lastActive}
      </div>
    </div>
  );
};

export default StudentTile; 