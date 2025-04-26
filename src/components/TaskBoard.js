import React, { useState, useEffect } from 'react';
import Task from './Task';
import Project from './Project';
import './TaskBoard.css';
import Cookies from 'js-cookie';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Card } from 'primereact/card';
import { addHours, isAfter } from 'date-fns';
import { useNavigate } from 'react-router-dom';

function TaskBoard() {
  const navigate = useNavigate();

  const generateLevel = () => {
    const levels = ['A', 'B', 'C', 'D'];
    const levelIndex = Math.floor(Math.random() * levels.length);
    const level = levels[levelIndex] + (Math.floor(Math.random() * 9) + 1);
    return level;
  };

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
  const [completedLog, setCompletedLog] = useState(() => {
    try {
      const savedLog = Cookies.get('completedLog');
      return savedLog ? JSON.parse(savedLog) : [];
    } catch (error) {
      console.error('Error reading completedLog from cookies:', error);
      return [];
    }
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTask, setActiveTask] = useState(null); // Add activeTask state

  useEffect(() => {
    try {
      Cookies.set('tasks', JSON.stringify(tasks), { expires: 182 });
    } catch (error) {
      console.error('Error writing tasks to cookies:', error);
    }
  }, [tasks]);

  useEffect(() => {
    const now = new Date();
    const filteredTasks = tasks.filter(task => {
      const taskTime = new Date(task.timestamp);
      return isAfter(addHours(taskTime, 24), now);
    });
    if (filteredTasks.length !== tasks.length) {
      if (filteredTasks.length !== tasks.length) {
        setTasks(filteredTasks);
      }
    }
  }, [tasks]);

  useEffect(() => {
    const now = new Date();
    const lastReset = Cookies.get('lastReset');
    const lastResetDate = lastReset ? new Date(lastReset) : null;

    if (!lastResetDate || now.toDateString() !== lastResetDate.toDateString()) {
      const completedTasks = tasks.filter(task => task.completed).length;
      const totalTasks = tasks.length;
      const productivity = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

      setCompletedLog(prevLog => [...prevLog, { date: now, completedTasks, totalTasks, productivity }]);
      try {
        Cookies.set('lastReset', now.toISOString(), { expires: 182 });
      } catch (error) {
        console.error('Error writing lastReset to cookies:', error);
      }
      setTasks([]); // Reset tasks for the new day
    }
  }, [tasks]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (event) => {
    setNewTask(event.target.value);
  };

  


  const handleTaskComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };





  const handleAddTask = () => {
    if (newTask.trim() !== '' && !isTaskDuplicate(newTask) && tasks.length < 8) {
      const level = generateLevel();
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false, timestamp: new Date(), level: level, isProject: false, subtasks: [] }]);
      setNewTask('');
    } else if (isTaskDuplicate(newTask)) {
      alert('This task already exists.');
    } else if (tasks.length >= 8) {
      alert('You can only have up to 8 tasks at a time.');
    }
  };



  const isTaskDuplicate = (newTaskText) => {
    return tasks.some(task => task.text.trim() === newTaskText.trim());
  };

  const handleTaskFocus = (id) => {
    setActiveTask(id);
  };

  const handleConvertToProject = (id) => {
    const today = new Date().toLocaleDateString();
    const projectExists = tasks.some(task => task.isProject && new Date(task.timestamp).toLocaleDateString() === today);

    if (projectExists) {
      alert('You can only create one project per day.');
      return;
    }

    setTasks(tasks.map(task =>
      task.id === id ? { ...task, isProject: true } : task
    ));
  };

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
      <div className="log-container">
        <h3>Daily Productivity Log</h3>
        <ul>
          {completedLog.map((log, index) => (
            <li key={index}>
              {new Date(log.date).toLocaleDateString()}: {log.completedTasks}/{log.totalTasks} tasks completed ({log.productivity.toFixed(2)}% productivity)
            </li>
          ))}
        </ul>
      </div>
      <div className="input-container">
        <span className="p-input-icon-left">
          <i className="pi pi-plus" />
          <InputText
            placeholder="Add new task"
            value={newTask}
            onChange={handleInputChange}
          />
        </span>
        <Button label="Agregar Tarea" icon="pi pi-check" onClick={handleAddTask} className="p-button-success" />
      </div>
      <ul className="task-list">
        {tasks.map((task) => (
          <div key={task.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <Task
              task={task}
              handleTaskComplete={handleTaskComplete}
              handleDeleteTask={handleDeleteTask}
             handleTaskFocus={handleTaskFocus}
             activeTask={activeTask}
           />
           <Button
             label="Convert to Project"
             onClick={() => handleConvertToProject(task.id)}
             className="p-button-secondary p-button-sm"
             style={{ marginLeft: '10px' }}
           />
         </div>
       ))}
       {tasks.map((task) =>
         task.isProject && (
           <Project key={task.id} project={task} />
         )
       )}
      </ul>

      {/* Línea separadora entre la lista de tareas y la leyenda */}
      <hr className="hr-separator" />

      <div className="legend">
        <h1>Tasks for your day</h1>
        <p>Focus on what's important</p>
      </div>

      {/* Línea separadora azul */}
      <hr className="hr-blue-separator" />

      {/* Línea separadora entre la leyenda y la información del diseño */}
      <hr className="hr-separator" />

      <div className="layout-info">
        <h2>Application Purpose</h2>
        <p>"Tiempo Justo" is a tool designed to help you manage your daily tasks efficiently and meaningfully. Inspired by the productivity philosophies of Brian Tracy and the principles of personal responsibility of Jordan Peterson, this application seeks to empower you to focus on what really matters and move towards your goals with clarity and purpose.</p>

        <h3>Main Focus</h3>
        <ul>
          <li><strong>Prioritize what's important:</strong> Identify and complete the most important and meaningful tasks first.</li>
          <li><strong>Personal Responsibility:</strong> Keep a record of your daily achievements to build a positive narrative about your progress.</li>
            <li><strong>Time Management:</strong> Limit your daily tasks to 8 to maintain a clear focus on your priorities.</li>
          </ul>

          <h3>Filosofías Inspiradoras</h3>
          <ul>
            <li><strong>Brian Tracy:</strong> "Come That Frog" te anima a abordar primero las tareas más difíciles y significativas.</li>
            <li><strong>Jordan Peterson:</strong> "Poner tu casa en orden" fomenta la responsabilidad personal y el progreso diario.</li>
          </ul>

          <h3>Benefits</h3>
          <ul>
            <li>Increase your productivity by focusing on what really matters.</li>
            <li>Reduce stress by limiting the number of daily tasks.</li>
            <li>Foster a sense of accomplishment and personal responsibility.</li>
            <li>Helps you build positive habits that impact your life in the long term.</li>
          </ul>
        </div>

        {/* Línea separadora entre la información del diseño y la sección Acerca de */}
        <hr style={{ border: '1px solid #ccc', margin: '20px 0' }} />

        {/* Sección Acerca de */}
        <div className="about-section">
          <h2>About "Tiempo Justo"</h2>
          <p>"Tiempo Justo" is an application designed to help you manage your daily tasks efficiently. Prioritize what's important, keep a record of your achievements, and move towards your goals with clarity and purpose.</p>
          <p>Use the available tools to add, complete, and delete tasks, and consult the productivity log to evaluate your daily progress.</p>
        </div>
      </Card>
  );
}

export default TaskBoard;

