import React from 'react';

function Task({ task, onComplete, onDelete }) {
  return (
    <li className={`task ${task.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onComplete(task.id)}
      />
      <span>{task.text} - Importance: {task.importance || 'N/A'}</span>
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </li>
  );
}

export default Task;