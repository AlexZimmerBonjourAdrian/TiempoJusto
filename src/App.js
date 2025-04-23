import React, { useState, useEffect } from 'react';
import './App.css';
import Cookies from 'js-cookie';
import TaskBoard from './components/TaskBoard';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogPage from './components/LogPage';
import Header from './components/Header';
import Donation from './components/Donation';
import Footer from './components/Footer';

function App() {
  const [inputHour1, setInputHour1] = useState(() => Cookies.get('inputHour1') || '');
  const [inputHour2, setInputHour2] = useState(() => Cookies.get('inputHour2') || '');
  const [adjustedTime1, setAdjustedTime1] = useState(() => Cookies.get('adjustedTime1') || '');
  const [adjustedTime2, setAdjustedTime2] = useState(() => Cookies.get('adjustedTime2') || '');
  const [remainingHours, setRemainingHours] = useState(() => Cookies.get('remainingHours') || '');
  const [useCurrentTime, setUseCurrentTime] = useState(false);

  useEffect(() => {
    Cookies.set('inputHour1', inputHour1, { expires: 182 });
    Cookies.set('inputHour2', inputHour2, { expires: 182 });
    Cookies.set('adjustedTime1', adjustedTime1, { expires: 182 });
    Cookies.set('adjustedTime2', adjustedTime2, { expires: 182 });
    Cookies.set('remainingHours', remainingHours, { expires: 182 });
  }, [inputHour1, inputHour2, adjustedTime1, adjustedTime2, remainingHours]);

  useEffect(() => {
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
  }, [inputHour1, inputHour2]);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={
          <div className="App">
            <Card title={<h1 className="task-board-title">Calculadora de Horas</h1>} className="task-board">
              <p className="description-text">Esta herramienta te ayuda a calcular la diferencia entre dos horas del día. Introduce las horas en formato de 24 horas (0-23).</p>
              <div className="task-counter">Cargar Hora 1</div>
              <div className="input-container">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <InputText
                    value={inputHour1}
                    onChange={(e) => setInputHour1(e.target.value)}
                    placeholder="Introduce una hora (ej. 4:30 AM o 16:30 PM)"
                    className="input-hour"
                    disabled={useCurrentTime}
                  />
                  <div style={{ marginLeft: '10px' }}>
                    <input
                      type="checkbox"
                      id="useCurrentTime"
                      checked={useCurrentTime}
                      onChange={(e) => {
                        setUseCurrentTime(e.target.checked);
                        if (e.target.checked) {
                          const now = new Date();
                          const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
                          setInputHour1(formattedTime);
                        }
                      }}
                    />
                    <label htmlFor="useCurrentTime">Usar hora actual</label>
                  </div>
                </div>
                <p className="info-text">{adjustedTime1}</p>
              </div>

              <div className="task-counter">Cargar Hora 2</div>
              <div className="input-container">
                <InputText
                  value={inputHour2}
                  onChange={(e) => setInputHour2(e.target.value)}
                  placeholder="Introduce una hora (ej. 4:30 AM o 16:30 PM)"
                  className="input-hour"
                />
                <p className="info-text">{adjustedTime2}</p>
              </div>

              <div className="completed-counter">Resultado</div>
              <p className="info-text">{remainingHours}</p>
            </Card>
            <TaskBoard />
            <Donation />
            <Footer />
          </div>
        } />
        <Route path="/log" element={<LogPage />} />
      </Routes>
    </Router>
  );
}

export default App;