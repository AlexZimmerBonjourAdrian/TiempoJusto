import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

function TaskForm({ onAddTask, onClose }) {
  const [taskName, setTaskName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSave = () => {
    if (taskName.trim() === '' || startTime.trim() === '' || endTime.trim() === '') {
      alert('Please fill in all fields.');
      return;
    }

    onAddTask({
      text: taskName,
      startTime: startTime,
      endTime: endTime,
    });
    onClose();
  };

  return (
    <div className="task-form" style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#f9f9f9', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '1000' }}>
      <h2>Add New Task</h2>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="taskName" style={{ display: 'block', marginBottom: '5px' }}>Task Name:</label>
        <InputText id="taskName" value={taskName} onChange={(e) => setTaskName(e.target.value)} required style={{ width: '100%' }} />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="startTime" style={{ display: 'block', marginBottom: '5px' }}>Start Time:</label>
        <InputText id="startTime" value={startTime} onChange={(e) => setStartTime(e.target.value)} type="time" required style={{ width: '100%' }} />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="endTime" style={{ display: 'block', marginBottom: '5px' }}>End Time:</label>
        <InputText id="endTime" value={endTime} onChange={(e) => setEndTime(e.target.value)} type="time" required style={{ width: '100%' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button label="Save" onClick={handleSave} className="p-button-success" style={{ marginRight: '10px' }} />
        <Button label="Cancel" onClick={onClose} className="p-button-danger" />
      </div>
    </div>
  );
}

export default TaskForm;