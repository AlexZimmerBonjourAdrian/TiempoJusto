import React from 'react';
import LogTaskComponent from '../Component/LogTaskComponent.jsx';

function Log() {
  const closedTasks = JSON.parse(localStorage.getItem('closedTasks')) || [];

  return (
    <div>
      <h1>Log</h1>
      <LogTaskComponent closedTasks={closedTasks} />
    </div>
  );
}

export default Log;