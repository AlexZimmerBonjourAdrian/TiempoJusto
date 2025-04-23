import React, { useState, useEffect } from 'react';
import './App.css';
import Cookies from 'js-cookie';
import TaskBoard from './components/TaskBoard';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogPage from './components/LogPage';

function HeaderSection() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [connectedUsers, setConnectedUsers] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const fetchConnectedUsers = () => {
      const simulatedUsers = Math.floor(Math.random() * 100) + 1;
      setConnectedUsers(simulatedUsers);
    };

    fetchConnectedUsers();
    const interval = setInterval(fetchConnectedUsers, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', backgroundColor: '#EDE7F6', color: '#4A148C' }}>
      <div style={{ fontSize: '1.2rem' }}>Hora actual: {currentTime.toLocaleTimeString()}</div>
      <div style={{ fontSize: '1.2rem' }}>Usuarios conectados: {connectedUsers}</div>
    </div>
  );
}

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

  useEffect(() => {
    const hour1 = parseInt(inputHour1);
    const hour2 = parseInt(inputHour2);

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
      setRemainingHours(`Faltan ${difference} horas para llegar a la segunda hora.`);
    } else {
      setRemainingHours('Por favor, introduce horas válidas (0-23).');
    }
  }, [inputHour1, inputHour2]);

  return (
    <Router>
      <HeaderSection />
      <Routes>
        <Route path="/" element={
          <div className="App">
            <Card title="Introduce una hora">
              <h2>Cargar Hora 1</h2>
              <InputNumber
                value={inputHour1}
                onValueChange={(e) => setInputHour1(e.value)}
                placeholder="Introduce una hora (0-23)"
                min={0}
                max={23}
              />
              <p>{adjustedTime1}</p>

              <h2>Cargar Hora 2</h2>
              <InputNumber
                value={inputHour2}
                onValueChange={(e) => setInputHour2(e.value)}
                placeholder="Introduce una hora (0-23)"
                min={0}
                max={23}
              />
              <p>{adjustedTime2}</p>

              <h2>Calculadora de Horas Restantes</h2>
              <p>{remainingHours}</p>
            </Card>
            <TaskBoard />
          </div>
        } />
        <Route path="/log" element={<LogPage />} />
      </Routes>
    </Router>
  );
}

export default App;