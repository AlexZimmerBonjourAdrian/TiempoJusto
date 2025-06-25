'use client'

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Task from '../../ui/Task';

function TaskBoard() {
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = Cookies.get('tasks');
      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch (error) {
      console.error('Error reading tasks from cookies:', error);
      return [];
    }
  });
  const [newTask, setNewTask] = useState('');
  const [newImportance, setNewImportance] = useState('A');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    try {
      Cookies.set('tasks', JSON.stringify(tasks), { expires: 182 });
    } catch (error) {
      console.error('Error writing tasks to cookies:', error);
    }
  }, [tasks]);

  const handleInputChange = (event) => {
    setNewTask(event.target.value);
  };

  const sortTasksByImportance = (tasksToSort) => {
    return [...tasksToSort].sort((a, b) => {
      const importanceOrder = { 'A': 1, 'B': 2, 'C': 3, 'D': 4 };
      const [importanceA, indexA] = a.importance.split('-');
      const [importanceB, indexB] = b.importance.split('-');
      const orderA = importanceOrder[importanceA] || 5;
      const orderB = importanceOrder[importanceB] || 5;
      if (orderA !== orderB) return orderA - orderB;
      const indexANum = parseInt(indexA) || 0;
      const indexBNum = parseInt(indexB) || 0;
      return indexANum - indexBNum;
    });
  };

  const handleTaskComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id) => {
    setTaskToDelete(id);
    setShowConfirmation(true);
  };

  const handleConfirmDelete = () => {
    setTasks(tasks.filter((task) => task.id !== taskToDelete));
    setShowConfirmation(false);
    setTaskToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
    setTaskToDelete(null);
  };

  const handleAddTask = () => {
    const trimmedNewTask = newTask.trim();
    if (trimmedNewTask !== '' && !isTaskDuplicate(trimmedNewTask) && tasks.length < 8) {
      const tasksWithSameImportance = tasks.filter(task => task.importance.startsWith(newImportance));
      const nextIndex = tasksWithSameImportance.length + 1;
      const indexedImportance = `${newImportance}-${nextIndex}`;
      const updatedTasks = [...tasks, { id: Date.now(), text: trimmedNewTask, completed: false, timestamp: new Date(), importance: indexedImportance }];
      const sortedTasks = sortTasksByImportance(updatedTasks);
      setTasks(sortedTasks);
      setNewTask('');
      setNewImportance('A');
    } else if (isTaskDuplicate(trimmedNewTask)) {
      alert('Esta tarea ya existe.');
    } else if (tasks.length >= 8) {
      alert('Solo puedes tener hasta 8 tareas a la vez.');
    }
  };

  const isTaskDuplicate = (newTaskText) => {
    return tasks.some(task => task.text.trim() === newTaskText.trim());
  };

  return (
    <div className="minimal-card" style={{ maxWidth: 520 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 8 }}>Tablero de Tareas</h2>
      <p style={{ textAlign: 'center', color: 'var(--color-muted)', marginBottom: 18 }}>
        Asigna solo tareas significativas y que te acerquen a tus metas.
      </p>
      <div style={{ textAlign: 'center', marginBottom: 18, color: 'var(--color-accent)', fontWeight: 600 }}>
        {tasks.length}/8 tareas
      </div>
      <div className="input-container">
        <input
          placeholder="Agregar nueva tarea"
          value={newTask}
          onChange={handleInputChange}
          aria-label="Agregar nueva tarea"
          style={{ flex: 1 }}
        />
        <button onClick={handleAddTask} style={{ minWidth: 120 }}>Agregar</button>
        <select
          value={newImportance}
          onChange={(e) => setNewImportance(e.target.value)}
          style={{ minWidth: 60 }}
        >
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {tasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            onComplete={handleTaskComplete}
            onDelete={handleDeleteTask}
          />
        ))}
      </ul>
      {showConfirmation && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div className="minimal-card" style={{ maxWidth: 320, textAlign: 'center' }}>
            <p>¿Seguro que quieres eliminar esta tarea?</p>
            <button onClick={handleConfirmDelete} style={{ background: 'var(--color-accent)' }}>Sí, eliminar</button>
            <button onClick={handleCancelDelete} style={{ background: 'var(--color-muted)', color: '#fff' }}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskBoard; 