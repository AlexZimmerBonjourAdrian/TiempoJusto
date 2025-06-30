'use client'

import React from 'react';
import { Card } from 'primereact/card';

function Home({ onToolChange }) {
  const mainTools = [
    {
      id: 'tasks',
      name: 'Tablero de Tareas',
      description: 'Organiza tus tareas por prioridad usando el método ABCDE. Enfócate en lo que realmente importa.',
      icon: '📋',
      color: '#4CAF50'
    },
    {
      id: 'projects',
      name: 'Gestión de Proyectos',
      description: 'Planifica y organiza tus proyectos de manera eficiente. Divide grandes objetivos en tareas manejables.',
      icon: '📁',
      color: '#2196F3'
    },
    {
      id: 'analytics',
      name: 'Analytics y Logs',
      description: 'Registra y analiza tu productividad. Identifica patrones y mejora tu rendimiento.',
      icon: '📊',
      color: '#9C27B0'
    },
    {
      id: 'pomodoro',
      name: 'Técnica Pomodoro',
      description: 'Trabaja con intervalos de tiempo enfocados. Maximiza tu concentración y productividad.',
      icon: '⏰',
      color: '#F44336'
    }
  ];

  const extraTools = [
    {
      id: 'calculator',
      name: 'Calculadora de Horas',
      description: 'Mejora tu estimación de tiempo y optimiza tu productividad. Analiza tu precisión de estimación.',
      icon: '🧮',
      color: '#FF9800',
      synergy: 'Sinergia con TaskBoard: Usa esta calculadora para estimar mejor las tareas que agregas a tu tablero diario.'
    },
    {
      id: 'scrum',
      name: 'Modo Scrum',
      description: 'Implementa metodología Scrum para gestión ágil de proyectos. Sprints, story points y Kanban board.',
      icon: '🚀',
      color: '#E91E63',
      synergy: 'Sinergia con Proyectos: Gestiona proyectos complejos con metodología ágil y sprints estructurados.'
    }
  ];

  return (
    <div className="home-container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: 'var(--color-accent)', fontSize: '2.5em', marginBottom: '10px' }}>
          🎯 Bienvenido a tu Centro de Productividad
        </h1>
        <p style={{ fontSize: '1.2em', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
          Elige la herramienta que mejor se adapte a tu necesidad actual. Todas están diseñadas para ayudarte a ser más productivo y alcanzar tus metas.
        </p>
      </div>

      {/* Herramientas Principales */}
      <div style={{ marginBottom: '50px' }}>
        <h2 style={{ 
          color: 'var(--color-accent)', 
          textAlign: 'center', 
          marginBottom: '30px',
          fontSize: '2em'
        }}>
          🛠️ Herramientas Principales
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '20px'
        }}>
          {mainTools.map((tool) => (
            <Card
              key={tool.id}
              className="tool-card"
              style={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: 'none',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                borderRadius: '12px',
                overflow: 'hidden'
              }}
              onClick={() => onToolChange(tool.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{ padding: '20px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '15px',
                  gap: '15px'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: tool.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '30px'
                  }}>
                    {tool.icon}
                  </div>
                  <h3 style={{ 
                    margin: 0, 
                    color: '#333',
                    fontSize: '1.4em',
                    fontWeight: '600'
                  }}>
                    {tool.name}
                  </h3>
                </div>
                <p style={{ 
                  color: '#666', 
                  lineHeight: '1.6',
                  margin: 0,
                  fontSize: '1em'
                }}>
                  {tool.description}
                </p>
                <div style={{ 
                  marginTop: '15px',
                  textAlign: 'right'
                }}>
                  <span style={{
                    color: tool.color,
                    fontWeight: '600',
                    fontSize: '0.9em'
                  }}>
                    → Ir a {tool.name}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Herramientas Adicionales */}
      <div style={{ marginBottom: '50px' }}>
        <h2 style={{ 
          color: 'var(--color-accent)', 
          textAlign: 'center', 
          marginBottom: '30px',
          fontSize: '2em'
        }}>
          ⚡ Herramientas Adicionales
        </h2>
        <p style={{ 
          textAlign: 'center', 
          color: '#666', 
          marginBottom: '30px',
          fontSize: '1.1em',
          maxWidth: '800px',
          margin: '0 auto 30px auto'
        }}>
          Estas herramientas complementan las principales y crean sinergias para mejorar tu experiencia de gestión del tiempo.
        </p>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '25px'
        }}>
          {extraTools.map((tool) => (
            <Card
              key={tool.id}
              className="tool-card"
              style={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: 'none',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                borderRadius: '12px',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
              }}
              onClick={() => onToolChange(tool.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{ padding: '25px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '20px',
                  gap: '15px'
                }}>
                  <div style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    background: tool.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '35px'
                  }}>
                    {tool.icon}
                  </div>
                  <div>
                    <h3 style={{ 
                      margin: 0, 
                      color: '#333',
                      fontSize: '1.5em',
                      fontWeight: '600'
                    }}>
                      {tool.name}
                    </h3>
                    <span style={{
                      padding: '4px 12px',
                      background: tool.color,
                      color: 'white',
                      borderRadius: '12px',
                      fontSize: '0.8em',
                      fontWeight: 'bold'
                    }}>
                      HERRAMIENTA ADICIONAL
                    </span>
                  </div>
                </div>
                <p style={{ 
                  color: '#666', 
                  lineHeight: '1.6',
                  margin: '0 0 15px 0',
                  fontSize: '1em'
                }}>
                  {tool.description}
                </p>
                <div style={{ 
                  background: '#e3f2fd',
                  border: '1px solid #bbdefb',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '15px'
                }}>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '0.9em', 
                    color: '#1976d2',
                    fontStyle: 'italic'
                  }}>
                    💡 <strong>Sinergia:</strong> {tool.synergy}
                  </p>
                </div>
                <div style={{ 
                  textAlign: 'right'
                }}>
                  <span style={{
                    color: tool.color,
                    fontWeight: '600',
                    fontSize: '1em'
                  }}>
                    → Explorar {tool.name}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Consejo del Día */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '12px',
        padding: '30px',
        color: 'white',
        textAlign: 'center'
      }}>
        <h2 style={{ marginBottom: '15px', fontSize: '1.8em' }}>
          💡 Consejo del Día
        </h2>
        <p style={{ fontSize: '1.1em', lineHeight: '1.6', margin: 0 }}>
          "La productividad no se trata de hacer más cosas, sino de hacer las cosas correctas. 
          Comienza cada día identificando tus 3 tareas más importantes y enfócate en completarlas primero.
          Usa las herramientas adicionales para mejorar tu precisión y gestión de proyectos complejos."
        </p>
      </div>
    </div>
  );
}

export default Home; 