import Task from './Task.jsx';
import '../Style/global.css';
import { useState } from 'react';
import useCookie from '../hooks/useCookie.js';
import { useNavigate } from 'react-router-dom';

function TaskBoard({ setClosedTasks }) {
  const [tasks, setTasks] = useCookie('tasks', []);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskImportance, setNewTaskImportance] = useState('low');
  const navigate = useNavigate();

  const handleAddTask = () => {
    if (newTaskName.trim() !== '') {
      const newTask = { name: newTaskName, importance: newTaskImportance, isCompleted: false, date: new Date() };
      setTasks([...tasks, newTask]);
      setNewTaskName('');
    }
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  const handleClearAllTasks = () => {
    setClosedTasks([...tasks]);
    setTasks([]);
  };

  const handleViewLog = () => {
    navigate('/log');
  };

  return (
    <div className="component-container task-board">
      <h2>Task Board</h2>
      <div className="task-input">
        <label htmlFor="taskName">Task Name:</label>
        <input
          type="text"
          id="taskName"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          placeholder="Enter task name"
        />
        <label htmlFor="taskImportance">Importance:</label>
        <select id="taskImportance" value={newTaskImportance} onChange={(e) => setNewTaskImportance(e.target.value)}>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </select>
        <button onClick={handleAddTask}>Add Task</button>
      </div>
      {tasks.length === 0 ? (
        <p className="no-tasks">No tasks yet. Add some!</p>
      ) : (
        tasks.map((task, index) => (
          <Task
            key={index}
            name={task.name}
            importance={task.importance}
            isCompleted={task.isCompleted}
            onDelete={() => handleDeleteTask(index)}
          />
        ))
      )}
      <button onClick={handleClearAllTasks}>Clear All Tasks</button>
      <button onClick={handleViewLog}>View Log</button>
    </div>
  );
}

export default TaskBoard;