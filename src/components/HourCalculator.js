import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import './HourCalculator.css';

function HourCalculator() {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [duration, setDuration] = useState('');
  const [adjustedTime, setAdjustedTime] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const calculateDuration = () => {
    const parseTime = (time) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    if (startTime && endTime) {
      const startMinutes = parseTime(startTime);
      const endMinutes = parseTime(endTime);
      const diff = endMinutes - startMinutes;

      if (diff >= 0) {
        const hours = Math.floor(diff / 60);
        const minutes = diff % 60;
        setDuration(`${hours} horas y ${minutes} minutos`);
        setErrorMessage('');
      } else {
        setErrorMessage('La hora de fin debe ser posterior a la hora de inicio.');
        setDuration('');
      }
    } else {
      setErrorMessage('Por favor, introduce ambas horas en formato HH:MM.');
      setDuration('');
    }
  };

  const adjustTime = () => {
    if (startTime) {
      const [hours, minutes] = startTime.split(':').map(Number);
      const adjusted = new Date();
      adjusted.setHours(hours);
      adjusted.setMinutes(minutes);
      adjusted.setMinutes(adjusted.getMinutes() + 30); // Ajuste de 30 minutos

      setAdjustedTime(`Hora ajustada: ${adjusted.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    } else {
      setAdjustedTime('Por favor, introduce una hora de inicio.');
    }
  };

  return (
    <Card title="Calculadora de Horas" className="hour-calculator">
      <div className="hour-calculator-section">
        <h3>Calcula las horas faltantes desde la hora de inicio hasta la hora de fin</h3>
        <div className="input-group">
          <InputText
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            placeholder="Hora de inicio (HH:MM)"
            className="hour-input"
          />
          <InputText
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            placeholder="Hora de fin (HH:MM)"
            className="hour-input"
          />
        </div>
        <Button label="Calcular Duración" onClick={calculateDuration} className="p-button-success calculate-button" />
        {errorMessage && <p className="error-text">{errorMessage}</p>}
        {duration && <p className="result-text">Duración: {duration}</p>}
        <p className="info-text">Ingresa las horas en formato HH:MM para calcular la duración o ajustar la hora.</p>
      </div>

      
    </Card>
  );
}

export default HourCalculator;