import React from 'react';

function LogTaskComponent({ closedTasks }) {
  const completedCount = closedTasks.filter(task => task.isCompleted).length;
  const totalTasks = closedTasks.length;
  const completedPercentage = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;
  const incompletePercentage = 100 - completedPercentage;

  return (
    <div className="component-container">
      <h2>Closed Tasks</h2>
      <p>Completed: {completedPercentage.toFixed(2)}%</p>
      <p>Incomplete: {incompletePercentage.toFixed(2)}%</p>
      <ul>
        {closedTasks.map((task, index) => (
          <li key={index}>
            {task.name} - Importance: {task.importance} - Date: {new Date(task.date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LogTaskComponent;