import React from 'react';
import Task from './Task';

function Project({ project }) {
  return (
    <div className="project" style={{ marginLeft: '20px' }}>
      <h3>{project.title} - {project.level}</h3>
      <p>{project.description}</p>
      <p>Status: {project.status}</p>
      <p>Subtasks:</p>
      <ul>
        {project.subtasks.map((subtask, index) => (
          <li key={index}>
            <Task task={subtask} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Project;