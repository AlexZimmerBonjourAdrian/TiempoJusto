import React from 'react';
import './Task.css';

function Task({ task }) {
  return (
    <div className="task">
      <h3>{task.title} - {task.level}</h3>
      <p>{task.description}</p>
      <p>Status: {task.status}</p>
    </div>
  );
}

export default Task;