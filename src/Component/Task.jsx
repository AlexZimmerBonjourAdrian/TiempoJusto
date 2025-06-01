import { useState } from 'react';

function Task({ name, importance, isCompleted, onDelete }) {
  const [isCompletedState, setIsCompletedState] = useState(isCompleted);

  const handleComplete = () => {
    setIsCompletedState(!isCompletedState);
  };

  return (
    <div className="task-item" onClick={handleComplete}>
      <h3 className={isCompletedState ? 'completed-task' : ''}>{name}</h3>
      <p>Importance: {importance}</p>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
}

export default Task;