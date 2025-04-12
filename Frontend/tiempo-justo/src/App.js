import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';

function App() {
  const [inputHour1, setInputHour1] = useState('');
  const [inputHour2, setInputHour2] = useState('');
  const [adjustedTime1, setAdjustedTime1] = useState('');
  const [adjustedTime2, setAdjustedTime2] = useState('');
  const [remainingHours, setRemainingHours] = useState('');

  const handleInputChange1 = (event) => {
    setInputHour1(event.target.value);
  };

  const handleInputChange2 = (event) => {
    setInputHour2(event.target.value);
  };

  const handleSubmit1 = () => {
    const hour = parseInt(inputHour1);
    if (!isNaN(hour) && hour >= 0 && hour < 24) {
      const now = new Date();
      const adjusted = new Date(now.setHours(now.getHours() - hour)); // Restar las horas ingresadas
      setAdjustedTime1(`Hora ajustada: ${adjusted.toLocaleTimeString()}`);
    } else {
      setAdjustedTime1('Por favor, introduce una hora válida (0-23).');
    }
  };

  const handleSubmit2 = () => {
    const hour = parseInt(inputHour2);
    if (!isNaN(hour) && hour >= 0 && hour < 24) {
      const now = new Date();
      const adjusted = new Date(now.setHours(now.getHours() - hour)); // Restar las horas ingresadas
      setAdjustedTime2(`Hora ajustada: ${adjusted.toLocaleTimeString()}`);
    } else {
      setAdjustedTime2('Por favor, introduce una hora válida (0-23).');
    }
  };

  const calculateRemainingHours = () => {
    const hour1 = parseInt(inputHour1);
    const hour2 = parseInt(inputHour2);

    if (!isNaN(hour1) && hour1 >= 0 && hour1 < 24 && !isNaN(hour2) && hour2 >= 0 && hour2 < 24) {
      let difference = hour2 - hour1;
      if (difference < 0) {
        difference += 24; // Ajustar para horas del día siguiente
      }
      setRemainingHours(`Faltan ${difference} horas para llegar a la segunda hora.`);
    } else {
      setRemainingHours('Por favor, introduce horas válidas (0-23).');
    }
  };

  return (
    <div className="App">
      <Header />
      <h1>Introduce una hora</h1>
      <h2>Cargar Hora 1</h2>
      <input
        type="number"
        value={inputHour1}
        onChange={handleInputChange1}
        placeholder="Introduce una hora (0-23)"
        min="0"
        max="23"
      />
      <button onClick={handleSubmit1}>Ajustar Hora</button>
      <p>{adjustedTime1}</p>

      <h2>Cargar Hora 2</h2>
      <input
        type="number"
        value={inputHour2}
        onChange={handleInputChange2}
        placeholder="Introduce una hora (0-23)"
        min="0"
        max="23"
      />
      <button onClick={handleSubmit2}>Ajustar Hora</button>
      <p>{adjustedTime2}</p>

      <h2>Calculadora de Horas Restantes</h2>
      <button onClick={calculateRemainingHours}>Calcular Horas Restantes</button>
      <p>{remainingHours}</p>
    </div>
  );
}

export default App;