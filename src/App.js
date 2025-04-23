import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Cookies from 'js-cookie';
import TaskBoard from './components/TaskBoard';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

function App() {
  const [inputHour1, setInputHour1] = useState(() => Cookies.get('inputHour1') || '');
  const [inputHour2, setInputHour2] = useState(() => Cookies.get('inputHour2') || '');
  const [adjustedTime1, setAdjustedTime1] = useState(() => Cookies.get('adjustedTime1') || '');
  const [adjustedTime2, setAdjustedTime2] = useState(() => Cookies.get('adjustedTime2') || '');
  const [remainingHours, setRemainingHours] = useState(() => Cookies.get('remainingHours') || '');

  useEffect(() => {
    Cookies.set('inputHour1', inputHour1, { expires: 7 });
    Cookies.set('inputHour2', inputHour2, { expires: 7 });
    Cookies.set('adjustedTime1', adjustedTime1, { expires: 7 });
    Cookies.set('adjustedTime2', adjustedTime2, { expires: 7 });
    Cookies.set('remainingHours', remainingHours, { expires: 7 });
  }, [inputHour1, inputHour2, adjustedTime1, adjustedTime2, remainingHours]);

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
      const adjusted = new Date(now.setHours(now.getHours() - hour));
      setAdjustedTime1(`Hora ajustada: ${adjusted.toLocaleTimeString()}`);
    } else {
      setAdjustedTime1('Por favor, introduce una hora válida (0-23).');
    }
  };

  const handleSubmit2 = () => {
    const hour = parseInt(inputHour2);
    if (!isNaN(hour) && hour >= 0 && hour < 24) {
      const now = new Date();
      const adjusted = new Date(now.setHours(now.getHours() - hour));
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
        difference += 24;
      }
      setRemainingHours(`Faltan ${difference} horas para llegar a la segunda hora.`);
    } else {
      setRemainingHours('Por favor, introduce horas válidas (0-23).');
    }
  };

  return (
    <div className="App">
      <Header />
      <Card title="Introduce una hora">
        <h2>Cargar Hora 1</h2>
        <InputNumber
          value={inputHour1}
          onValueChange={(e) => setInputHour1(e.value)}
          placeholder="Introduce una hora (0-23)"
          min={0}
          max={23}
        />
        <Button label="Ajustar Hora" onClick={handleSubmit1} className="p-button-outlined" />
        <p>{adjustedTime1}</p>

        <h2>Cargar Hora 2</h2>
        <InputNumber
          value={inputHour2}
          onValueChange={(e) => setInputHour2(e.value)}
          placeholder="Introduce una hora (0-23)"
          min={0}
          max={23}
        />
        <Button label="Ajustar Hora" onClick={handleSubmit2} className="p-button-outlined" />
        <p>{adjustedTime2}</p>

        <h2>Calculadora de Horas Restantes</h2>
        <Button label="Calcular Horas Restantes" onClick={calculateRemainingHours} className="p-button-outlined" />
        <p>{remainingHours}</p>
      </Card>
      <TaskBoard />
    </div>
  );
}

export default App;