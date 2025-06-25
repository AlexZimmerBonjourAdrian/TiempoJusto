import React from 'react';
import PropTypes from 'prop-types';

function Task({ task, onComplete, onDelete }) {
  return (
    <li
      className={`task minimal-card${task.completed ? ' completed' : ''}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px',
        marginBottom: '14px',
        borderRadius: 'var(--radius)',
        background: 'var(--color-card)',
        boxShadow: 'var(--shadow)',
        border: '1.5px solid var(--color-border)',
        opacity: task.completed ? 0.6 : 1,
        transition: 'opacity 0.2s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onComplete(task.id)}
          style={{ width: 22, height: 22, accentColor: 'var(--color-primary)' }}
        />
        <span style={{ fontSize: '1.13rem', color: 'var(--color-text)' }}>
          {task.text}
          {task.importance && (
            <span style={{
              background: 'var(--color-bg-light)',
              color: 'var(--color-accent)',
              borderRadius: 8,
              padding: '2px 8px',
              fontSize: '0.95rem',
              marginLeft: 10,
            }}>
              {task.importance}
            </span>
          )}
        </span>
      </div>
      <button
        onClick={() => onDelete(task.id)}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--color-accent)',
          fontSize: 22,
          cursor: 'pointer',
          padding: 0,
        }}
        aria-label="Eliminar tarea"
        title="Eliminar tarea"
      >
        ×
      </button>
    </li>
  );
}

Task.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    importance: PropTypes.string,
  }).isRequired,
  onComplete: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default Task; 