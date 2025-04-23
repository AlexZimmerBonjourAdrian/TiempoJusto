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

  useEffect(() => {
    Cookies.set('tasks', JSON.stringify(tasks), { expires: 7 });
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
      Cookies.set('completedLog', JSON.stringify([...completedLog, { date: lastResetDate || now, completedTasks, totalTasks, productivity }]), { expires: 7 });

      Cookies.set('lastReset', now.toISOString(), { expires: 7 });
      setTasks([]); // Reset tasks for the new day
    }
  }, [tasks, completedLog]);

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
      <div className="task-counter">
        {tasks.length}/8
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
    </Card>
  );
}

export default TaskBoard;