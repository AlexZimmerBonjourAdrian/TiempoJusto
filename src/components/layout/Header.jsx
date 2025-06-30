'use client'

import React, { useState } from 'react';
import { Card } from 'primereact/card';

function Header({ activeTool, onToolChange }) {
  const tools = [
    { id: 'home', name: 'Inicio', icon: '🏠' },
    { id: 'tasks', name: 'Tareas', icon: '📋' },
    { id: 'projects', name: 'Proyectos', icon: '📁' },
    { id: 'calculator', name: 'Calculadora', icon: '🧮' },
    { id: 'analytics', name: 'Analytics', icon: '📊' },
    { id: 'pomodoro', name: 'Pomodoro', icon: '⏰' }
  ];

  return (
    <div>
      <Card className="app-header" style={{ background: 'var(--color-accent)', color: '#F3E5F5', textAlign: 'center', border: 'none', boxShadow: 'none', borderRadius: 8 }}>
        <h1 className="app-title">Cómete esos sapos: Filosofías de Productividad</h1>
      </Card>
      
      <Card className="navigation-header" style={{ background: '#fff', border: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderRadius: 8, marginTop: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => onToolChange(tool.id)}
              style={{
                background: activeTool === tool.id ? 'var(--color-accent)' : '#f5f5f5',
                color: activeTool === tool.id ? '#fff' : '#333',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeTool === tool.id ? '600' : '400',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>{tool.icon}</span>
              <span>{tool.name}</span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default Header; 