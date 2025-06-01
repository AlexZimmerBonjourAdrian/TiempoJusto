import Task from './Task.jsx';

import { useState } from 'react';
function TaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskImportance, setNewTaskImportance] = useState('low');

  const handleAddTask = () => {
    setTasks([...tasks, { name: newTaskName, importance: newTaskImportance, isCompleted: false }]);
    setNewTaskName('');
  };

  return (
    <div>
      <h2>Task Board</h2>
      <input
        type="text"
        value={newTaskName}
        onChange={(e) => setNewTaskName(e.target.value)}
        placeholder="Task Name"
      />
      <select value={newTaskImportance} onChange={(e) => setNewTaskImportance(e.target.value)}>
        <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
      </select>
      <button onClick={handleAddTask}>Add Task</button>
      {tasks.map((task, index) => (
        <Task key={index} name={task.name} importance={task.importance} isCompleted={task.isCompleted} />
      ))}
    </div>
  );
}

export default TaskBoard;