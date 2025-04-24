import { db } from '../../firebase';
import { getClassroomLogs, getClassroomLogById } from '../../firebase/functions/logs';

export const fetchClassroomLogs = async () => {
  try {
    const logs = await getClassroomLogs(db);
    return logs;
  } catch (error) {
    console.error('Error fetching classroom logs:', error);
    throw error;
  }
};

export const fetchLogDetail = async (logId) => {
  try {
    const log = await getClassroomLogById(db, logId);
    return log;
  } catch (error) {
    console.error('Error fetching log detail:', error);
    throw error;
  }
}; 