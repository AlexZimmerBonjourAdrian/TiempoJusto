import React, { useState, useEffect } from 'react';
import './TaskBoard.css';
import Cookies from 'js-cookie';
import ConfirmationPopup from './ConfirmationPopup';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import Task from './Task';
import { addHours, isAfter } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import DailyLog from './DailyLog';

function TaskBoard() {
  const navigate = useNavigate();
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
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    try {
      Cookies.set('tasks', JSON.stringify(tasks), { expires: 182 });
    } catch (error) {
      console.error('Error writing tasks to cookies:', error);
    }
  }, [tasks]);

  // useEffect(() => {
  //   const now = new Date();
  //   const filteredTasks = tasks.filter(task => {
  //     const taskTime = new Date(task.timestamp);
  //     return isAfter(addHours(taskTime, 24), now);
  //   });
  //   if (filteredTasks.length !== tasks.length) {
  //     if (filteredTasks.length !== tasks.length) {
  //       setTasks(filteredTasks);
  //     }
  //   }
  // }, [tasks]);

  // useEffect(() => {
  //   const now = new Date();
  //   const lastReset = Cookies.get('lastReset');
  //   const lastResetDate = lastReset ? new Date(lastReset) : null;

  //   if (!lastResetDate || now - lastResetDate >= 24 * 60 * 60 * 1000) {
  //     const completedTasks = tasks.filter(task => task.completed).length;
  //     const totalTasks = tasks.length;
  //     const productivity = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  //     setCompletedLog([...completedLog, { date: (lastResetDate || now).toDateString(), completedTasks, totalTasks, productivity }]);
  //     try {
  //       Cookies.set('lastReset', now.toISOString(), { expires: 182 });
  //     } catch (error) {
  //       console.error('Error writing lastReset to cookies:', error);
  //     }
  //     //setTasks([]); // Reset tasks for the new day
  //   }
  // }, [tasks, completedLog]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (event) => {
    setNewTask(event.target.value);
  };

  const sortTasksByImportance = (tasksToSort) => {
    return [...tasksToSort].sort((a, b) => {
      const importanceOrder = { 'A': 1, 'B': 2, 'C': 3, 'D': 4 };
      const [importanceA, indexA] = a.importance.split('-');
      const [importanceB, indexB] = b.importance.split('-');

      const orderA = importanceOrder[importanceA] || 5; // Default to a lower priority if importance is not A, B, C, or D
      const orderB = importanceOrder[importanceB] || 5;

      if (orderA !== orderB) {
        return orderA - orderB;
      }

      // If importances are the same, sort by index
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
      alert('This task already exists.');
    } else if (tasks.length >= 8) {
      alert('You can only have up to 8 tasks at a time.');
    }
  };

  const isTaskDuplicate = (newTaskText) => {
    return tasks.some(task => task.text.trim() === newTaskText.trim());
  };

  // const handleTaskFocus = (id) => {
  //   // Function to highlight the selected task
  //   setActiveTask(id);
  // };

  return (
    <Card title="Task Board" className="task-board">
      {/* Propósito de la página */}
      <div className="page-purpose">
        <h2>Welcome to "Tiempo Justo"</h2>
        <p>Manage your daily tasks efficiently and meaningfully. Prioritize what's important and move towards your goals with clarity.</p>
      </div>

      <div className="task-counter">
        {tasks.length}/8
      </div>

      {/* Línea separadora entre el contador de tareas y la información del encabezado */}
      <hr className="hr-separator" />

      <div className="header-info">
        <div className="clock" style={{ fontSize: '1.2rem', color: '#4A148C' }}>
          {currentTime.toLocaleTimeString()}
        </div>
      </div>
      <p className="board-legend">Asigna solo las tareas que sean significativas para ti y que te acerquen a tus metas.</p>
      <div className="completed-counter">
        Completed Tasks: {tasks.filter(task => task.completed).length}
      </div>
      <Button label="View Log" onClick={() => navigate('/log')} className="p-button-info" />
      <DailyLog tasks={tasks} />
      <div className="input-container">
        <span className="p-input-icon-left">
          <i className="pi pi-plus" />
          <InputText
            placeholder="Add new task"
            value={newTask}
            onChange={handleInputChange}
            aria-label="Add a new task"
          />
        </span>
        <Button label="Agregar Tarea" icon="pi pi-check" onClick={handleAddTask} className="p-button-success" aria-label="Add Task" />
        <label htmlFor="importance">Importance:</label>
        <select
          id="importance"
          value={newImportance}
          onChange={(e) => setNewImportance(e.target.value)}
        >
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>
      </div>
      <ul className="task-list">
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
        <ConfirmationPopup
          message="Are you sure you want to delete this task?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
      </Card>
  );
}

export default TaskBoard;
