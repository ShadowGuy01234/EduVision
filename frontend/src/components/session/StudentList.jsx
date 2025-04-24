import React from 'react';
import { useNavigate } from 'react-router-dom';

const StudentList = ({ students = [] }) => {
  const navigate = useNavigate();
  
  // If no students provided, use a placeholder
  const studentList = students.length > 0 ? students : [
    { id: '1', name: 'Emma Thompson', attentionScore: 92, lastActive: '2 min ago' },
    { id: '2', name: 'James Wilson', attentionScore: 75, lastActive: 'Just now' },
    { id: '3', name: 'Olivia Davis', attentionScore: 45, lastActive: '5 min ago' },
    { id: '4', name: 'William Moore', attentionScore: 88, lastActive: '1 min ago' },
    { id: '5', name: 'Sophia Brown', attentionScore: 63, lastActive: '3 min ago' }
  ];
  
  const getAttentionColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const handleStudentClick = (studentId) => {
    navigate(`/student/${studentId}`);
  };
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Student
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Attention
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Last Active
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {studentList.map((student) => (
            <tr 
              key={student.id} 
              className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => handleStudentClick(student.id)}
            >
              <td className="py-4 px-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {student.name}
                  </div>
                </div>
              </td>
              <td className="py-4 px-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div 
                    className={`h-2.5 w-2.5 rounded-full ${getAttentionColor(student.attentionScore)} mr-2`}
                  ></div>
                  <div className="text-sm text-gray-900 dark:text-white">
                    {student.attentionScore}%
                  </div>
                </div>
              </td>
              <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {student.lastActive}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList; 