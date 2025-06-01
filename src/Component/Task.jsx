import { useState } from 'react';

function Task({ name, importance, isCompleted }) {
  const [isCompletedState, setIsCompletedState] = useState(isCompleted);
  const [importanceState, setImportanceState] = useState(importance);

  const handleComplete = () => {
    setIsCompletedState(!isCompletedState);
  };

  const handleImportanceChange = (event) => {
    setImportanceState(event.target.value);
  };

  return (
    <div>
      <h3>{name}</h3>
      <p>Importance: {importance}</p>
      <label>
        Completed:
        <input type="checkbox" checked={isCompletedState} onChange={handleComplete} />
      </label>
      <br />
      <label>
        Importance:
        <select value={importanceState} onChange={handleImportanceChange}>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </select>
      </label>
    </div>
  );
}

export default Task;