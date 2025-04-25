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
import Footer from './components/Footer';
import About from './components/About';

function App() {
  const [hasADHD, setHasADHD] = useState(() => {
    const savedPreference = Cookies.get('hasADHD');
    return savedPreference !== undefined ? JSON.parse(savedPreference) : null;
  });

  const toggleADHDMode = () => {
    setHasADHD((prev) => {
      const newMode = !prev;
      Cookies.set('hasADHD', newMode, { expires: 182 });
      return newMode;
    });
  };

  useEffect(() => {
    if (hasADHD !== null) {
      Cookies.set('hasADHD', hasADHD, { expires: 182 });
    }
  }, [hasADHD]);

  if (hasADHD === null) {
    return (
      <div className="preference-selection" style={{ textAlign: 'center', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1 style={{ color: '#4CAF50', fontSize: '2.5em' }}>¡Hola! 😊</h1>
        <p style={{ fontSize: '1.2em', color: '#555' }}>
          Antes de comenzar, queremos conocerte un poco mejor. ¿Tienes ADHD? Esto nos ayudará a personalizar tu experiencia.
        </p>
        <div style={{ marginTop: '20px' }}>
          <button 
            onClick={() => setHasADHD(true)} 
            style={{ 
              backgroundColor: '#4CAF50', 
              color: 'white', 
              border: 'none', 
              padding: '10px 20px', 
              fontSize: '1em', 
              borderRadius: '5px', 
              cursor: 'pointer', 
              marginRight: '10px' 
            }}
          >
            Sí, tengo ADHD
          </button>
          <button 
            onClick={() => setHasADHD(false)} 
            style={{ 
              backgroundColor: '#f44336', 
              color: 'white', 
              border: 'none', 
              padding: '10px 20px', 
              fontSize: '1em', 
              borderRadius: '5px', 
              cursor: 'pointer' 
            }}
          >
            No, no tengo ADHD
          </button>
        </div>
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
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer hasADHD={hasADHD} toggleADHDMode={toggleADHDMode} />
    </Router>
  );
}

export default App;