import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

function DailyLog({ tasks }) {
  const [completedLog, setCompletedLog] = useState(() => {
    try {
      const savedLog = Cookies.get('completedLog');
      return savedLog ? JSON.parse(savedLog) : [];
    } catch (error) {
      console.error('Error reading completedLog from cookies:', error);
      return [];
    }
  });

  useEffect(() => {
    const now = new Date();
    const lastReset = Cookies.get('lastReset');
    const lastResetDate = lastReset ? new Date(lastReset) : null;

    if (!lastResetDate || now - lastResetDate >= 24 * 60 * 60 * 1000) {
      const completedTasks = tasks.filter(task => task.completed).length; // Assuming 'tasks' is available
      const totalTasks = tasks.length; // Assuming 'tasks' is available
      const productivity = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

      setCompletedLog([...completedLog, { date: (lastResetDate || now).toDateString(), completedTasks, totalTasks, productivity }]);
      try {
        Cookies.set('lastReset', now.toISOString(), { expires: 182 });
      } catch (error) {
        console.error('Error writing lastReset to cookies:', error);
      }
      //setTasks([]); // Reset tasks for the new day - Assuming this is handled elsewhere
    }
  }, [tasks, completedLog]); // Added tasks as a dependency

  return null; // Or return some UI if needed, but for now, it just handles the logic
}

export default DailyLog;