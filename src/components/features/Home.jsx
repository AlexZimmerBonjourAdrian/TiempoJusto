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
      description: 'Planifica y organiza tus proyectos con metodología ágil. Sprints, Kanban, y seguimiento completo.',
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
                  fontSize: '1em',
                  marginBottom: '15px'
                }}>
                  {tool.description}
                </p>
                <div style={{
                  background: 'rgba(255, 152, 0, 0.1)',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 152, 0, 0.2)',
                  marginBottom: '15px'
                }}>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '0.9em', 
                    color: '#FF9800',
                    fontWeight: '500'
                  }}>
                    💡 {tool.synergy}
                  </p>
                </div>
                <div style={{ 
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

      {/* Información adicional */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        padding: '30px',
        color: 'white',
        textAlign: 'center'
      }}>
        <h3 style={{ marginBottom: '15px', fontSize: '1.5em' }}>
          🚀 ¿Por qué usar Tiempo Justo?
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px',
          marginTop: '20px'
        }}>
          <div>
            <div style={{ fontSize: '2em', marginBottom: '10px' }}>🎯</div>
            <h4 style={{ marginBottom: '8px' }}>Enfoque en Prioridades</h4>
            <p style={{ fontSize: '0.9em', opacity: 0.9, margin: 0 }}>
              Basado en las filosofías de Brian Tracy y Jordan Peterson para maximizar tu productividad.
            </p>
          </div>
          <div>
            <div style={{ fontSize: '2em', marginBottom: '10px' }}>🧠</div>
            <h4 style={{ marginBottom: '8px' }}>Modo ADHD</h4>
            <p style={{ fontSize: '0.9em', opacity: 0.9, margin: 0 }}>
              Optimizado para personas con ADHD con tareas pequeñas y recompensas inmediatas.
            </p>
          </div>
          <div>
            <div style={{ fontSize: '2em', marginBottom: '10px' }}>📊</div>
            <h4 style={{ marginBottom: '8px' }}>Analytics Avanzados</h4>
            <p style={{ fontSize: '0.9em', opacity: 0.9, margin: 0 }}>
              Seguimiento detallado de tu progreso con insights personalizados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home; 