import React, { useState } from 'react';

function ADHDTaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [focusTaskId, setFocusTaskId] = useState(null);

  const handleAddTask = () => {
    if (newTask.trim() !== '' && tasks.length < 8) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask('');
    } else if (tasks.length >= 8) {
      alert('Solo puedes tener hasta 8 tareas a la vez.');
    }
  };

  const handleFocusTask = (id) => {
    setFocusTaskId(id);
  };

  const handleComplete = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div className="minimal-card" style={{ maxWidth: 520 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 8 }}>Tablero ADHD</h2>
      <div className="input-container">
        <input
          placeholder="Agregar nueva tarea"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          style={{ flex: 1 }}
        />
        <button onClick={handleAddTask} style={{ minWidth: 120 }}>Agregar</button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`minimal-card${focusTaskId === task.id ? ' focused' : ''}`}
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
              cursor: 'pointer',
            }}
            onClick={() => handleFocusTask(task.id)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={e => { e.stopPropagation(); handleComplete(task.id); }}
                style={{ width: 22, height: 22, accentColor: 'var(--color-primary)' }}
                onClick={e => e.stopPropagation()}
              />
              <span style={{ fontSize: '1.13rem', color: 'var(--color-text)' }}>{task.text}</span>
            </div>
            <button
              onClick={e => { e.stopPropagation(); handleDelete(task.id); }}
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
        ))}
      </ul>
    </div>
  );
}

export default ADHDTaskBoard; 