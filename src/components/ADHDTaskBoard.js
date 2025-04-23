import React, { useState } from 'react';
import './TaskBoard.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Card } from 'primereact/card';

function ADHDTaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [focusTaskId, setFocusTaskId] = useState(null);

  const handleAddTask = () => {
    if (newTask.trim() !== '' && tasks.length < 8) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask('');
    } else if (tasks.length >= 8) {
      alert('You can only have up to 8 tasks at a time.');
    }
  };

  const handleFocusTask = (id) => {
    setFocusTaskId(id);
  };

  return (
    <Card title="Task Board (ADHD Optimized)" className="task-board">
      <div className="input-container">
        <InputText
          placeholder="Add a new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <Button label="Add Task" onClick={handleAddTask} />
      </div>
      <ul className="task-list">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`task ${focusTaskId === task.id ? 'focused' : ''}`}
            onClick={() => handleFocusTask(task.id)}
          >
            <Checkbox
              checked={task.completed}
              onChange={() => {
                setTasks(
                  tasks.map((t) =>
                    t.id === task.id ? { ...t, completed: !t.completed } : t
                  )
                );
              }}
            />
            <span>{task.text}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default ADHDTaskBoard;