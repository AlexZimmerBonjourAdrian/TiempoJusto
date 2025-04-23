import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

function HourCalculator() {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [duration, setDuration] = useState('');
  const [adjustedTime, setAdjustedTime] = useState('');

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
      } else {
        setDuration('La hora de fin debe ser posterior a la hora de inicio.');
      }
    } else {
      setDuration('Por favor, introduce ambas horas.');
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
      <div className="input-container">
        <h3>Calcula la duración entre dos horas</h3>
        <InputText
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          placeholder="Hora de inicio (HH:MM)"
        />
        <InputText
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          placeholder="Hora de fin (HH:MM)"
        />
        <Button label="Calcular Duración" onClick={calculateDuration} className="p-button-success" />
        <p>{duration}</p>
      </div>

      <div className="input-container">
        <h3>Ajusta una hora específica</h3>
        <InputText
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          placeholder="Hora de inicio (HH:MM)"
        />
        <Button label="Ajustar Hora" onClick={adjustTime} className="p-button-info" />
        <p>{adjustedTime}</p>
      </div>
    </Card>
  );
}

export default HourCalculator;