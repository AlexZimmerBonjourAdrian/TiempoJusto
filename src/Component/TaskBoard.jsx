import Task from './Task.jsx';
import '../Style/global.css';
import { useState } from 'react';
import useCookie from '../hooks/useCookie.js';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

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
        <InputText
          id="taskName"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          placeholder="Enter task name"
        />
        <label htmlFor="taskImportance">Importance:</label>
        <Dropdown
          id="taskImportance"
          value={newTaskImportance}
          options={['A', 'B', 'C']}
          onChange={(e) => setNewTaskImportance(e.value)}
          placeholder="Select an importance"
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>
      {tasks.length === 0 ? (
        <p className="no-tasks">No tasks yet. Add some!</p>
      ) : (
        <DataTable value={tasks} responsiveLayout="scroll">
          <Column field="name" header="Name" />
          <Column field="importance" header="Importance" />
          <Column body={(rowData) => (
            <button onClick={() => handleDeleteTask(tasks.findIndex(task => task === rowData))}>Delete</button>
          )} header="Actions" />
        </DataTable>
      )}
      <button onClick={handleClearAllTasks}>Clear All Tasks</button>
      <button onClick={handleViewLog}>View Log</button>
    </div>
  );
}

export default TaskBoard;