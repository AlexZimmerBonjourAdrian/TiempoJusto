'use client'

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

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
    <div className="minimal-card" style={{ maxWidth: 520 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 8 }}>Historial de Productividad</h2>
      <h3 style={{ color: 'var(--color-accent)', marginTop: 18 }}>Tareas</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {taskLog.map((log, index) => (
          <li key={index} style={{ marginBottom: 14, padding: 12, background: 'var(--color-bg-light)', borderRadius: 10 }}>
            <p style={{ margin: 0, color: 'var(--color-text)' }}>Fecha: {new Date(log.date).toLocaleDateString()}</p>
            <p style={{ margin: 0, color: 'var(--color-muted)' }}>Tarea: {log.task}</p>
            <p style={{ margin: 0, color: log.completed ? 'var(--color-primary)' : 'var(--color-accent)' }}>Estado: {log.completed ? 'Completada' : 'No completada'}</p>
          </li>
        ))}
      </ul>
      <h3 style={{ color: 'var(--color-accent)', marginTop: 18 }}>Log de Completadas</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {completedLog.map((log, index) => (
          <li key={index} style={{ marginBottom: 14, padding: 12, background: 'var(--color-bg-light)', borderRadius: 10 }}>
            <p style={{ margin: 0, color: 'var(--color-text)' }}>Fecha: {new Date(log.date).toLocaleDateString()}</p>
            <p style={{ margin: 0, color: 'var(--color-primary)' }}>Tareas Completadas: {log.completedTasks}</p>
            <p style={{ margin: 0, color: 'var(--color-muted)' }}>Tareas Totales: {log.totalTasks}</p>
            <p style={{ margin: 0, color: 'var(--color-accent)' }}>Productividad: {log.productivity.toFixed(2)}%</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LogTask; 