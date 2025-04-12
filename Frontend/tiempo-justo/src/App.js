import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';

function App() {
  const [inputHour, setInputHour] = useState('');
  const [adjustedTime, setAdjustedTime] = useState('');

  const handleInputChange = (event) => {
    setInputHour(event.target.value);
  };

  const handleSubmit = () => {
    const hour = parseInt(inputHour);
    if (!isNaN(hour) && hour >= 0 && hour < 24) {
      const now = new Date();
      const adjusted = new Date(now.setHours(hour));
      setAdjustedTime(`Hora ajustada: ${adjusted.toLocaleTimeString()}`);
    } else {
      setAdjustedTime('Por favor, introduce una hora válida (0-23).');
    }
  };

  return (
    <div className="App">
      <Header />
      <h1>Introduce una hora</h1>
      <input
        type="number"
        value={inputHour}
        onChange={handleInputChange}
        placeholder="Introduce una hora (0-23)"
        min="0"
        max="23"
      />
      <button onClick={handleSubmit}>Ajustar Hora</button>
      <p>{adjustedTime}</p>
    </div>
  );
}

export default App;