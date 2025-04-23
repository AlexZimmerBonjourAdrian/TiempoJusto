import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Card } from 'primereact/card';

function LogTask() {
  const [taskLog, setTaskLog] = useState(() => {
    const savedLog = Cookies.get('taskLog');
    return savedLog ? JSON.parse(savedLog) : [];
  });

  const [completedLog, setCompletedLog] = useState(() => {
    const savedLog = Cookies.get('completedLog');
    return savedLog ? JSON.parse(savedLog) : [];
  });

  useEffect(() => {
    const now = new Date();
    const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));
    const filteredTaskLog = taskLog.filter(log => new Date(log.date) >= sixMonthsAgo);
    setTaskLog(filteredTaskLog);
    Cookies.set('taskLog', JSON.stringify(filteredTaskLog), { expires: 182 });

    const filteredCompletedLog = completedLog.filter(log => new Date(log.date) >= sixMonthsAgo);
    setCompletedLog(filteredCompletedLog);
    Cookies.set('completedLog', JSON.stringify(filteredCompletedLog), { expires: 182 });
  }, []);

  return (
    <Card title="Productivity Log" className="log-task">
      <h3>Task History</h3>
      <ul>
        {taskLog.map((log, index) => (
          <li key={index}>
            <p>Date: {new Date(log.date).toLocaleDateString()}</p>
            <p>Task: {log.task}</p>
            <p>Status: {log.completed ? 'Completed' : 'Not Completed'}</p>
          </li>
        ))}
      </ul>
      <h3>Task Completion Log</h3>
      <ul>
        {completedLog.map((log, index) => (
          <li key={index}>
            <p>Fecha: {new Date(log.date).toLocaleDateString()}</p>
            <p>Tareas Completadas: {log.completedTasks}</p>
            <p>Tareas Totales: {log.totalTasks}</p>
            <p>Productividad: {log.productivity.toFixed(2)}%</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default LogTask;