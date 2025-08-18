import React, { useState } from 'react';
import ADHDTaskBoard from './ADHDTaskBoard';
import ADHDHourCalculator from './ADHDHourCalculator';
import ADHDGamification from './ADHDGamification';
import ADHDRoutines from './ADHDRoutines';
import ADHDReminders from './ADHDReminders';

function ADHDView() {
  const [focusMode, setFocusMode] = useState(false);
  const [activeSection, setActiveSection] = useState('tasks'); // 'tasks', 'gamification', 'calculator', 'routines', 'reminders'

  const toggleFocusMode = () => {
    setFocusMode((prevMode) => !prevMode);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'gamification':
        return <ADHDGamification />;
      case 'calculator':
        return <ADHDHourCalculator />;
      case 'routines':
        return <ADHDRoutines />;
      case 'reminders':
        return <ADHDReminders />;
      default:
        return <ADHDTaskBoard />;
    }
  };

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', padding: '32px 0' }}>
      <div className="minimal-card" style={{ maxWidth: 520, marginBottom: 32 }}>
        <h1 style={{ textAlign: 'center', marginBottom: 8 }}>Vista ADHD Optimizada</h1>
        <p style={{ textAlign: 'center', color: 'var(--color-muted)', marginBottom: 18 }}>
          Esta vista está diseñada para ayudarte a enfocarte y mantenerte organizado.
        </p>
        
        {/* Navigation Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          marginBottom: '18px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setActiveSection('tasks')}
            style={{
              background: activeSection === 'tasks' ? 'var(--color-accent)' : 'var(--color-primary)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius)',
              padding: '10px 16px',
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            📋 Tareas
          </button>
          <button
            onClick={() => setActiveSection('gamification')}
            style={{
              background: activeSection === 'gamification' ? 'var(--color-accent)' : 'var(--color-primary)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius)',
              padding: '10px 16px',
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            🎮 Gamificación
          </button>
          <button
            onClick={() => setActiveSection('calculator')}
            style={{
              background: activeSection === 'calculator' ? 'var(--color-accent)' : 'var(--color-primary)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius)',
              padding: '10px 16px',
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            🧮 Calculadora
          </button>
          <button
            onClick={() => setActiveSection('routines')}
            style={{
              background: activeSection === 'routines' ? 'var(--color-accent)' : 'var(--color-primary)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius)',
              padding: '10px 16px',
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            📅 Rutinas
          </button>
          <button
            onClick={() => setActiveSection('reminders')}
            style={{
              background: activeSection === 'reminders' ? 'var(--color-accent)' : 'var(--color-primary)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius)',
              padding: '10px 16px',
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            ⏰ Recordatorios
          </button>
        </div>

        <button
          onClick={toggleFocusMode}
          style={{
            display: 'block',
            margin: '0 auto 18px auto',
            background: focusMode ? 'var(--color-accent)' : 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius)',
            padding: '14px 28px',
            fontSize: '1.1rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: 'var(--shadow)',
            transition: 'background 0.2s',
          }}
        >
          {focusMode ? 'Desactivar Modo Enfoque' : 'Activar Modo Enfoque'}
        </button>
        {focusMode && (
          <div className="minimal-card" style={{ background: 'var(--color-bg-light)', margin: '18px 0', boxShadow: 'none', border: '1.5px solid var(--color-primary)' }}>
            <h2 style={{ color: 'var(--color-accent)', fontSize: '1.2rem', marginBottom: 8 }}>Tips de Enfoque</h2>
            <ul style={{ color: 'var(--color-text-soft)', fontSize: '1.05rem', margin: 0, paddingLeft: 18 }}>
              <li>Divide las tareas en pasos pequeños.</li>
              <li>Usa un temporizador para mantenerte en camino.</li>
              <li>Toma descansos cortos para recargar energía.</li>
            </ul>
          </div>
        )}
      </div>
      
      {/* Active Section Content */}
      {renderActiveSection()}
    </div>
  );
}

export default ADHDView; 