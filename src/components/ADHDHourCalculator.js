import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import './TaskBoard.css';

function ADHDHourCalculator() {
  const [inputHour1, setInputHour1] = useState('');
  const [inputHour2, setInputHour2] = useState('');
  const [adjustedTime1, setAdjustedTime1] = useState('');
  const [adjustedTime2, setAdjustedTime2] = useState('');
  const [remainingHours, setRemainingHours] = useState('');

  const calculateTimes = () => {
    const parseHour = (input) => {
      const [time, modifier] = input.split(' ');
      let [hours, minutes] = time.split(':').map(Number);

      if (modifier === 'PM' && hours !== 12) {
        hours += 12;
      }
      if (modifier === 'AM' && hours === 12) {
        hours = 0;
      }

      return hours + (minutes / 60);
    };

    const hour1 = parseHour(inputHour1);
    const hour2 = parseHour(inputHour2);

    if (!isNaN(hour1) && hour1 >= 0 && hour1 < 24) {
      const now = new Date();
      const adjusted = new Date(now.setHours(now.getHours() - hour1));
      setAdjustedTime1(`Hora ajustada: ${adjusted.toLocaleTimeString()}`);
    } else {
      setAdjustedTime1('Por favor, introduce una hora válida (0-23).');
    }

    if (!isNaN(hour2) && hour2 >= 0 && hour2 < 24) {
      const now = new Date();
      const adjusted = new Date(now.setHours(now.getHours() - hour2));
      setAdjustedTime2(`Hora ajustada: ${adjusted.toLocaleTimeString()}`);
    } else {
      setAdjustedTime2('Por favor, introduce una hora válida (0-23).');
    }

    if (!isNaN(hour1) && hour1 >= 0 && hour1 < 24 && !isNaN(hour2) && hour2 >= 0 && hour2 < 24) {
      let difference = hour2 - hour1;
      if (difference < 0) {
        difference += 24;
      }
      setRemainingHours(`Faltan ${difference.toFixed(2)} horas para llegar a la segunda hora.`);
    } else {
      setRemainingHours('Por favor, introduce horas válidas (0-23).');
    }
  };

  return (
    <Card title="Calculadora de Horas (ADHD Optimized)" className="task-board">
      <div className="input-container">
        <InputText
          value={inputHour1}
          onChange={(e) => setInputHour1(e.target.value)}
          placeholder="Introduce una hora (ej. 4:30 AM o 16:30 PM)"
        />
        <p>{adjustedTime1}</p>
      </div>

      <div className="input-container">
        <InputText
          value={inputHour2}
          onChange={(e) => setInputHour2(e.target.value)}
          placeholder="Introduce una hora (ej. 4:30 AM o 16:30 PM)"
        />
        <p>{adjustedTime2}</p>
      </div>

      <div className="completed-counter">Resultado</div>
      <p>{remainingHours}</p>

      <button onClick={calculateTimes}>Calcular</button>
    </Card>
  );
}

export default ADHDHourCalculator;