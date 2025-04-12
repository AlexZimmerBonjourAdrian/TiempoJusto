import React, { useState } from 'react';

function TimeCalculator() {
  const [targetDate, setTargetDate] = useState('');
  const [timeRemaining, setTimeRemaining] = useState('');
// MVP function calculator Time
//TODO: Install Luxon or date-fns for better date handling
  const calculateTimeRemaining = () => {
    const now = new Date();
    const target = new Date(targetDate);
    const diff = target - now;

    if (diff > 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeRemaining(`${hours} horas y ${minutes} minutos`);
    } else {
      setTimeRemaining('El tiempo ya ha pasado.');
    }
  };

  return (
    <div>
      <input
        type="datetime-local"
        value={targetDate}
        onChange={(e) => setTargetDate(e.target.value)}
      />
      <button onClick={calculateTimeRemaining}>Calcular tiempo restante</button>
      <p>{timeRemaining}</p>
    </div>
  );
}

export default TimeCalculator;