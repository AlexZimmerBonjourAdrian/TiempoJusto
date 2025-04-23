import React, { useState, useEffect } from 'react';
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
  const [tasks, setTasks] = useState(() => {
    const savedTasks = Cookies.get('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTask, setNewTask] = useState('');
  const [completedLog, setCompletedLog] = useState(() => {
    const savedLog = Cookies.get('completedLog');
    return savedLog ? JSON.parse(savedLog) : [];
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [connectedUsers, setConnectedUsers] = useState(0);

  useEffect(() => {
    Cookies.set('tasks', JSON.stringify(tasks), { expires: 182 });
  }, [tasks]);

  useEffect(() => {
    const now = new Date();
    const filteredTasks = tasks.filter(task => {
      const taskTime = new Date(task.timestamp);
      return isAfter(addHours(taskTime, 24), now);
    });
    if (filteredTasks.length !== tasks.length) {
      setTasks(filteredTasks);
    }
  }, [tasks]);

  useEffect(() => {
    const now = new Date();
    const lastReset = Cookies.get('lastReset');
    const lastResetDate = lastReset ? new Date(lastReset) : null;

    if (!lastResetDate || now - lastResetDate >= 24 * 60 * 60 * 1000) {
      const completedTasks = tasks.filter(task => task.completed).length;
      const totalTasks = tasks.length;
      const productivity = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

      setCompletedLog([...completedLog, { date: lastResetDate || now, completedTasks, totalTasks, productivity }]);
      Cookies.set('completedLog', JSON.stringify([...completedLog, { date: lastResetDate || now, completedTasks, totalTasks, productivity }]), { expires: 182 });

      Cookies.set('lastReset', now.toISOString(), { expires: 182 });
      setTasks([]); // Reset tasks for the new day
    }
  }, [tasks, completedLog]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Simulate fetching the number of connected users from a server
    const fetchConnectedUsers = () => {
      // Replace this with an actual API call in a real application
      const simulatedUsers = Math.floor(Math.random() * 100) + 1; // Random number between 1 and 100
      setConnectedUsers(simulatedUsers);
    };

    fetchConnectedUsers();
    const interval = setInterval(fetchConnectedUsers, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (event) => {
    setNewTask(event.target.value);
  };

  const handleAddTask = () => {
    if (newTask.trim() !== '' && tasks.length < 8) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false, timestamp: new Date() }]);
      setNewTask('');
    } else if (tasks.length >= 8) {
      alert('You can only have up to 8 tasks at a time.');
    }
  };

  const handleTaskComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <Card title="Task Board" className="task-board">
        {/* Propósito de la página */}
        <div className="page-purpose" style={{ marginBottom: '20px', textAlign: 'center', color: '#4A148C' }}>
          <h2>Bienvenido a "Tiempo Justo"</h2>
          <p>Gestiona tus tareas diarias de manera eficiente y significativa. Prioriza lo importante y avanza hacia tus metas con claridad.</p>
        </div>

        <div className="task-counter">
          {tasks.length}/8
        </div>
        <div className="header-info" style={{ marginBottom: '10px', textAlign: 'center' }}>
          <div className="connected-users" style={{ fontSize: '1.2rem', color: '#4A148C', marginBottom: '5px' }}>
            Usuarios conectados: {connectedUsers}
          </div>
          <div className="clock" style={{ fontSize: '1.2rem', color: '#4A148C' }}>
            {currentTime.toLocaleTimeString()}
          </div>
        </div>
        <p className="board-legend">Asigna solo las tareas que sean significativas para ti y que te acerquen a tus metas.</p>
        <div className="completed-counter">
          Tareas Completadas: {tasks.filter(task => task.completed).length}
        </div>
        <Button label="Ver Log" onClick={() => navigate('/log')} className="p-button-info" />
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
              placeholder="Add a new task"
              value={newTask}
              onChange={handleInputChange}
            />
          </span>
          <Button label="Add Task" icon="pi pi-check" onClick={handleAddTask} className="p-button-success" />
        </div>
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={`task ${task.completed ? 'completed' : ''}`}>
              <Checkbox
                checked={task.completed}
                onChange={() => handleTaskComplete(task.id)}
              />
              <span>{task.text}</span>
              <Button icon="pi pi-trash" className="p-button-danger" onClick={() => handleDeleteTask(task.id)} />
            </li>
          ))}
        </ul>
        <div className="legend">
          <h1>Tareas para tu día a día</h1>
          <p>Concéntrate en lo que es importante</p>
        </div>

        {/* Línea separadora azul */}
        <hr style={{ border: '2px solid blue', margin: '20px 0' }} />

        <div className="layout-info" style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
          <h2>Propósito de la Aplicación</h2>
          <p>"Tiempo Justo" es una herramienta diseñada para ayudarte a gestionar tus tareas diarias de manera eficiente y significativa. Inspirada en las filosofías de productividad de Brian Tracy y los principios de responsabilidad personal de Jordan Peterson, esta aplicación busca empoderarte para que te concentres en lo que realmente importa y avances hacia tus metas con claridad y propósito.</p>

          <h3>Enfoque Principal</h3>
          <ul>
            <li><strong>Priorizar lo Importante:</strong> Identifica y completa primero las tareas más importantes y significativas.</li>
            <li><strong>Responsabilidad Personal:</strong> Lleva un registro de tus logros diarios para construir una narrativa positiva sobre tu progreso.</li>
            <li><strong>Gestión del Tiempo:</strong> Limita tus tareas diarias a 8 para mantener un enfoque claro en tus prioridades.</li>
          </ul>

          <h3>Filosofías Inspiradoras</h3>
          <ul>
            <li><strong>Brian Tracy:</strong> "Come That Frog" te anima a abordar primero las tareas más difíciles y significativas.</li>
            <li><strong>Jordan Peterson:</strong> "Poner tu casa en orden" fomenta la responsabilidad personal y el progreso diario.</li>
          </ul>

          <h3>Beneficios</h3>
          <ul>
            <li>Incrementa tu productividad al enfocarte en lo que realmente importa.</li>
            <li>Reduce el estrés al limitar el número de tareas diarias.</li>
            <li>Fomenta un sentido de logro y responsabilidad personal.</li>
            <li>Te ayuda a construir hábitos positivos que impactan tu vida a largo plazo.</li>
          </ul>
        </div>

        {/* Sección Acerca de */}
        <div className="about-section" style={{ marginTop: '20px', padding: '15px', backgroundColor: '#EDE7F6', borderRadius: '8px' }}>
          <h2>Acerca de "Tiempo Justo"</h2>
          <p>"Tiempo Justo" es una aplicación diseñada para ayudarte a gestionar tus tareas diarias de manera eficiente. Prioriza lo importante, mantén un registro de tus logros y avanza hacia tus metas con claridad y propósito.</p>
          <p>Utiliza las herramientas disponibles para añadir, completar y eliminar tareas, y consulta el registro de productividad para evaluar tu progreso diario.</p>
        </div>
      </Card>
  );
}

export default TaskBoard;