import React, { useState, useEffect } from 'react';
import './App.css';
import Cookies from 'js-cookie';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogPage from './components/LogPage';
import Header from './components/Header';
import ADHDView from './components/ADHDView'; // Import the ADHDView component
import MainView from './components/MainView'; // Import the MainView component

function App() {
  const [inputHour1] = useState(() => Cookies.get('inputHour1') || '');
  const [inputHour2] = useState(() => Cookies.get('inputHour2') || '');
  const [adjustedTime1, setAdjustedTime1] = useState(() => Cookies.get('adjustedTime1') || '');
  const [adjustedTime2, setAdjustedTime2] = useState(() => Cookies.get('adjustedTime2') || '');
  const [remainingHours, setRemainingHours] = useState(() => Cookies.get('remainingHours') || '');
  const [hasADHD, setHasADHD] = useState(() => {
    const savedPreference = Cookies.get('hasADHD');
    return savedPreference !== undefined ? JSON.parse(savedPreference) : null;
  });

  useEffect(() => {
    if (hasADHD !== null) {
      Cookies.set('hasADHD', hasADHD, { expires: 182 });
    }
  }, [hasADHD]);

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

  if (hasADHD === null) {
    return (
      <div className="preference-selection">
        <h1>¿Tienes ADHD?</h1>
        <button onClick={() => setHasADHD(true)}>Sí</button>
        <button onClick={() => setHasADHD(false)}>No</button>
      </div>
    );
  }

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={hasADHD ? <ADHDView /> : <MainView />} /> {/* Render based on ADHD preference */}
        <Route path="/log" element={<LogPage />} />
        <Route path="/adhd" element={<ADHDView />} /> {/* Add the ADHD route */}
      </Routes>
    </Router>
  );
}

export default App;