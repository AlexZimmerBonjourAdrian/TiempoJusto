'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';

function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [mode, setMode] = useState('work'); // 'work', 'shortBreak', 'longBreak'
  const intervalRef = useRef(null);

  const workTime = 25 * 60; // 25 minutes
  const shortBreakTime = 5 * 60; // 5 minutes
  const longBreakTime = 15 * 60; // 15 minutes

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            // Timer finished
            clearInterval(intervalRef.current);
            setIsRunning(false);
            
            // Play notification sound or show notification
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Pomodoro', {
                body: isBreak ? '¡Tiempo de trabajo!' : '¡Tiempo de descanso!',
                icon: '/favicon.ico'
              });
            }
            
            // Switch to next mode
            if (mode === 'work') {
              const nextCycle = cycles + 1;
              setCycles(nextCycle);
              
              if (nextCycle % 4 === 0) {
                // Long break after 4 work sessions
                setMode('longBreak');
                setTimeLeft(longBreakTime);
                setIsBreak(true);
              } else {
                // Short break
                setMode('shortBreak');
                setTimeLeft(shortBreakTime);
                setIsBreak(true);
              }
            } else {
              // Break finished, back to work
              setMode('work');
              setTimeLeft(workTime);
              setIsBreak(false);
            }
            
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, mode, cycles, isBreak]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(workTime);
    setMode('work');
    setIsBreak(false);
  };

  const skipTimer = () => {
    setIsRunning(false);
    setTimeLeft(0); // This will trigger the mode switch
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getModeColor = () => {
    switch (mode) {
      case 'work': return '#4CAF50';
      case 'shortBreak': return '#FF9800';
      case 'longBreak': return '#2196F3';
      default: return '#4CAF50';
    }
  };

  const getModeText = () => {
    switch (mode) {
      case 'work': return 'Trabajo Enfocado';
      case 'shortBreak': return 'Descanso Corto';
      case 'longBreak': return 'Descanso Largo';
      default: return 'Trabajo Enfocado';
    }
  };

  const getModeIcon = () => {
    switch (mode) {
      case 'work': return '💼';
      case 'shortBreak': return '☕';
      case 'longBreak': return '🌴';
      default: return '💼';
    }
  };

  return (
    <div className="minimal-card" style={{ maxWidth: 500, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ marginBottom: '10px', color: 'var(--color-accent)' }}>
          ⏰ Técnica Pomodoro
        </h2>
        <p style={{ color: 'var(--color-muted)', margin: 0 }}>
          Trabaja con intervalos de tiempo enfocados para maximizar tu productividad
        </p>
      </div>

      <div style={{ 
        textAlign: 'center', 
        marginBottom: '30px',
        padding: '30px',
        borderRadius: '12px',
        background: `linear-gradient(135deg, ${getModeColor()}20, ${getModeColor()}10)`,
        border: `2px solid ${getModeColor()}30`
      }}>
        <div style={{ 
          fontSize: '4em', 
          fontWeight: 'bold', 
          color: getModeColor(),
          marginBottom: '10px',
          fontFamily: 'monospace'
        }}>
          {formatTime(timeLeft)}
        </div>
        <div style={{ 
          fontSize: '1.2em', 
          color: getModeColor(),
          fontWeight: '600',
          marginBottom: '5px'
        }}>
          {getModeIcon()} {getModeText()}
        </div>
        <div style={{ color: 'var(--color-muted)', fontSize: '0.9em' }}>
          Ciclo {Math.floor(cycles / 4) + 1} • Sesión {cycles % 4 + 1}/4
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        justifyContent: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        {!isRunning ? (
          <button
            onClick={startTimer}
            style={{
              padding: '12px 24px',
              backgroundColor: getModeColor(),
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              minWidth: '120px'
            }}
          >
            ▶️ Iniciar
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            style={{
              padding: '12px 24px',
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              minWidth: '120px'
            }}
          >
            ⏸️ Pausar
          </button>
        )}
        
        <button
          onClick={skipTimer}
          style={{
            padding: '12px 24px',
            backgroundColor: '#9C27B0',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            minWidth: '120px'
          }}
        >
          ⏭️ Saltar
        </button>
        
        <button
          onClick={resetTimer}
          style={{
            padding: '12px 24px',
            backgroundColor: '#F44336',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            minWidth: '120px'
          }}
        >
          🔄 Reiniciar
        </button>
      </div>

      <div style={{ 
        background: '#f5f5f5', 
        borderRadius: '8px', 
        padding: '20px',
        marginTop: '20px'
      }}>
        <h3 style={{ marginBottom: '15px', color: '#333' }}>📋 Cómo funciona:</h3>
        <ul style={{ 
          listStyle: 'none', 
          padding: 0, 
          margin: 0,
          color: '#666',
          lineHeight: '1.6'
        }}>
          <li style={{ marginBottom: '8px' }}>• <strong>25 min</strong> de trabajo enfocado</li>
          <li style={{ marginBottom: '8px' }}>• <strong>5 min</strong> de descanso corto</li>
          <li style={{ marginBottom: '8px' }}>• <strong>15 min</strong> de descanso largo (cada 4 sesiones)</li>
          <li style={{ marginBottom: '8px' }}>• Repite el ciclo para máxima productividad</li>
        </ul>
      </div>
    </div>
  );
}

export default PomodoroTimer; 