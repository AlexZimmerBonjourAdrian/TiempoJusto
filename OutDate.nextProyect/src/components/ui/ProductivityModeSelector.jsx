'use client'

import React, { useState } from 'react';
import { useProductivityMode } from '../../hooks/useProductivityMode';

function ProductivityModeSelector() {
  const { mode, settings, updateMode, updateSettings } = useProductivityMode();
  const [showSettings, setShowSettings] = useState(false);

  const modes = [
    {
      id: 'default',
      name: 'Modo Estándar',
      description: 'Configuración balanceada para la mayoría de usuarios',
      icon: '⚙️',
      color: '#6c757d'
    },
    {
      id: 'adhd',
      name: 'Modo ADHD',
      description: 'Optimizado para personas con ADHD: tareas pequeñas, gamificación, recompensas inmediatas',
      icon: '🧠',
      color: '#E91E63'
    },
    {
      id: 'focus',
      name: 'Modo Enfoque',
      description: 'Mínimo de distracciones, pocas tareas visibles, máxima concentración',
      icon: '🎯',
      color: '#2196F3'
    },
    {
      id: 'minimal',
      name: 'Modo Minimalista',
      description: 'Interfaz limpia, sin animaciones, máximo de tareas visibles',
      icon: '✨',
      color: '#4CAF50'
    }
  ];

  const currentMode = modes.find(m => m.id === mode) || modes[0];

  return (
    <div style={{ 
      background: 'white', 
      borderRadius: '12px', 
      padding: '20px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      marginBottom: '20px'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <h3 style={{ margin: 0, color: 'var(--color-accent)' }}>
          🎛️ Modo de Productividad
        </h3>
        <button
          onClick={() => setShowSettings(!showSettings)}
          style={{
            padding: '6px 12px',
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.8em'
          }}
        >
          {showSettings ? 'Ocultar' : 'Configurar'}
        </button>
      </div>

      {/* Current Mode Display */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        padding: '15px',
        background: `${currentMode.color}10`,
        border: `2px solid ${currentMode.color}30`,
        borderRadius: '8px',
        marginBottom: '15px'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: currentMode.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px'
        }}>
          {currentMode.icon}
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: '0 0 5px 0', color: currentMode.color }}>
            {currentMode.name}
          </h4>
          <p style={{ margin: 0, fontSize: '0.9em', color: '#666' }}>
            {currentMode.description}
          </p>
        </div>
        <div style={{
          padding: '4px 8px',
          background: currentMode.color,
          color: 'white',
          borderRadius: '12px',
          fontSize: '0.7em',
          fontWeight: 'bold'
        }}>
          ACTIVO
        </div>
      </div>

      {/* Mode Selection */}
      {showSettings && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>
            Seleccionar Modo:
          </h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '15px' 
          }}>
            {modes.map(modeOption => (
              <div
                key={modeOption.id}
                onClick={() => updateMode(modeOption.id)}
                style={{
                  padding: '15px',
                  border: `2px solid ${mode === modeOption.id ? modeOption.color : '#ddd'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: mode === modeOption.id ? `${modeOption.color}10` : 'white',
                  transform: mode === modeOption.id ? 'scale(1.02)' : 'scale(1)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.5em' }}>{modeOption.icon}</span>
                  <h5 style={{ 
                    margin: 0, 
                    color: mode === modeOption.id ? modeOption.color : '#333',
                    fontWeight: 'bold'
                  }}>
                    {modeOption.name}
                  </h5>
                </div>
                <p style={{ 
                  margin: 0, 
                  fontSize: '0.85em', 
                  color: '#666',
                  lineHeight: '1.4'
                }}>
                  {modeOption.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Settings */}
      {showSettings && (
        <div>
          <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>
            Configuración Actual:
          </h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '10px',
            fontSize: '0.9em'
          }}>
            <div style={{ 
              padding: '8px', 
              background: '#f8f9fa', 
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>Tareas máximas visibles:</span>
              <span style={{ fontWeight: 'bold' }}>{settings.maxVisibleTasks}</span>
            </div>
            <div style={{ 
              padding: '8px', 
              background: '#f8f9fa', 
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>Subtareas:</span>
              <span style={{ fontWeight: 'bold', color: settings.showSubtasks ? '#28a745' : '#dc3545' }}>
                {settings.showSubtasks ? 'Activado' : 'Desactivado'}
              </span>
            </div>
            <div style={{ 
              padding: '8px', 
              background: '#f8f9fa', 
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>Gamificación:</span>
              <span style={{ fontWeight: 'bold', color: settings.showGamification ? '#28a745' : '#dc3545' }}>
                {settings.showGamification ? 'Activado' : 'Desactivado'}
              </span>
            </div>
            <div style={{ 
              padding: '8px', 
              background: '#f8f9fa', 
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>Recompensas:</span>
              <span style={{ fontWeight: 'bold', color: settings.showRewards ? '#28a745' : '#dc3545' }}>
                {settings.showRewards ? 'Activado' : 'Desactivado'}
              </span>
            </div>
            <div style={{ 
              padding: '8px', 
              background: '#f8f9fa', 
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>Animaciones:</span>
              <span style={{ fontWeight: 'bold', color: settings.showAnimations ? '#28a745' : '#dc3545' }}>
                {settings.showAnimations ? 'Activado' : 'Desactivado'}
              </span>
            </div>
            <div style={{ 
              padding: '8px', 
              background: '#f8f9fa', 
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>Código de colores:</span>
              <span style={{ fontWeight: 'bold', color: settings.colorCoding ? '#28a745' : '#dc3545' }}>
                {settings.colorCoding ? 'Activado' : 'Desactivado'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ADHD Mode Tips */}
      {mode === 'adhd' && (
        <div style={{
          marginTop: '15px',
          padding: '15px',
          background: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '8px',
          color: '#856404'
        }}>
          <h5 style={{ margin: '0 0 8px 0', color: '#856404' }}>
            💡 Consejos para el Modo ADHD:
          </h5>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.9em' }}>
            <li>Divide tareas grandes en subtareas pequeñas</li>
            <li>Usa las recompensas para mantener la motivación</li>
            <li>Mantén solo 5 tareas visibles para evitar abrumarte</li>
            <li>Celebra cada logro, por pequeño que sea</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default ProductivityModeSelector; 