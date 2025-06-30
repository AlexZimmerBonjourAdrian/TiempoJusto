'use client'

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import DailyLog from './DailyLog';
import LogTask from './LogTask';
import MonthlyProgress from './MonthlyProgress';
import AdvancedStats from './AdvancedStats';

function AnalyticsView() {
  const [tasks, setTasks] = useState([]);
  const [dailyLogs, setDailyLogs] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalTasks: 0,
    completedTasks: 0,
    productivityRate: 0,
    weeklyProgress: [],
    dailyStats: []
  });

  useEffect(() => {
    // Load tasks from cookies
    try {
      const savedTasks = Cookies.get('tasks');
      const currentTasks = savedTasks ? JSON.parse(savedTasks) : [];
      setTasks(currentTasks);
    } catch (error) {
      console.error('Error reading tasks from cookies:', error);
    }

    // Load daily logs from cookies
    try {
      const savedLogs = Cookies.get('dailyLogs');
      const logs = savedLogs ? JSON.parse(savedLogs) : [];
      setDailyLogs(logs.sort((a, b) => new Date(b.date) - new Date(a.date))); // Sort by date, newest first
    } catch (error) {
      console.error('Error reading daily logs from cookies:', error);
    }
  }, []);

  useEffect(() => {
    // Calculate analytics from daily logs
    if (dailyLogs.length > 0) {
      const totalTasks = dailyLogs.reduce((sum, log) => sum + log.totalTasks, 0);
      const completedTasks = dailyLogs.reduce((sum, log) => sum + log.completedTasks, 0);
      const productivityRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

      // Get weekly progress (last 7 days)
      const weeklyProgress = [];
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayLog = dailyLogs.find(log => log.date === dateStr);
        if (dayLog) {
          weeklyProgress.push({
            date: dateStr,
            completed: dayLog.completedTasks,
            total: dayLog.totalTasks
          });
        } else {
          weeklyProgress.push({
            date: dateStr,
            completed: 0,
            total: 0
          });
        }
      }

      setAnalytics({
        totalTasks,
        completedTasks,
        productivityRate,
        weeklyProgress,
        dailyStats: dailyLogs
      });
    }
  }, [dailyLogs]);

  const getProductivityColor = (rate) => {
    if (rate >= 80) return '#4CAF50';
    if (rate >= 60) return '#FF9800';
    if (rate >= 40) return '#FFC107';
    return '#F44336';
  };

  const getProductivityEmoji = (rate) => {
    if (rate >= 80) return '🚀';
    if (rate >= 60) return '👍';
    if (rate >= 40) return '😐';
    return '😔';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMotivationalQuote = (productivityRate) => {
    const quotes = [
      {
        range: [90, 100],
        quote: "La responsabilidad es el precio de la grandeza.",
        author: "Jordan Peterson"
      },
      {
        range: [80, 89],
        quote: "La excelencia no es un acto, sino un hábito.",
        author: "Aristóteles"
      },
      {
        range: [70, 79],
        quote: "El éxito es la suma de pequeños esfuerzos repetidos día tras día.",
        author: "Brian Tracy"
      },
      {
        range: [60, 69],
        quote: "La disciplina es el puente entre metas y logros.",
        author: "Jim Rohn"
      },
      {
        range: [50, 59],
        quote: "El éxito no es final, el fracaso no es fatal: es el coraje para continuar lo que cuenta.",
        author: "Winston Churchill"
      },
      {
        range: [40, 49],
        quote: "La diferencia entre lo imposible y lo posible está en la determinación.",
        author: "Tommy Lasorda"
      },
      {
        range: [30, 39],
        quote: "La paciencia y la persistencia son virtudes que pagan dividendos.",
        author: "Brian Tracy"
      },
      {
        range: [0, 29],
        quote: "Compara tu ser de hoy con tu ser de ayer, no con el ser de otra persona.",
        author: "Jordan Peterson"
      }
    ];

    const quote = quotes.find(q => productivityRate >= q.range[0] && productivityRate <= q.range[1]);
    return quote || quotes[quotes.length - 1];
  };

  return (
    <div className="minimal-card" style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ marginBottom: '10px', color: 'var(--color-accent)' }}>
          📊 Analytics y Productividad
        </h2>
        <p style={{ color: 'var(--color-muted)', margin: 0 }}>
          Analiza tu rendimiento y mejora tu productividad
        </p>
      </div>

      {/* Main Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #4CAF50, #45a049)',
          color: 'white',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2em', marginBottom: '5px' }}>📋</div>
          <div style={{ fontSize: '1.5em', fontWeight: 'bold' }}>{analytics.totalTasks}</div>
          <div style={{ fontSize: '0.9em', opacity: 0.9 }}>Total de Tareas</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #2196F3, #1976D2)',
          color: 'white',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2em', marginBottom: '5px' }}>✅</div>
          <div style={{ fontSize: '1.5em', fontWeight: 'bold' }}>{analytics.completedTasks}</div>
          <div style={{ fontSize: '0.9em', opacity: 0.9 }}>Tareas Completadas</div>
        </div>

        <div style={{
          background: `linear-gradient(135deg, ${getProductivityColor(analytics.productivityRate)}, ${getProductivityColor(analytics.productivityRate)}dd)`,
          color: 'white',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2em', marginBottom: '5px' }}>{getProductivityEmoji(analytics.productivityRate)}</div>
          <div style={{ fontSize: '1.5em', fontWeight: 'bold' }}>{analytics.productivityRate.toFixed(1)}%</div>
          <div style={{ fontSize: '0.9em', opacity: 0.9 }}>Productividad</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #9C27B0, #7B1FA2)',
          color: 'white',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2em', marginBottom: '5px' }}>📅</div>
          <div style={{ fontSize: '1.5em', fontWeight: 'bold' }}>{dailyLogs.length}</div>
          <div style={{ fontSize: '0.9em', opacity: 0.9 }}>Días Registrados</div>
        </div>
      </div>

      {/* Advanced Statistics */}
      <AdvancedStats dailyLogs={dailyLogs} />

      {/* Monthly Progress Section */}
      <MonthlyProgress dailyLogs={dailyLogs} />

      {/* Weekly Progress Chart */}
      <div style={{ 
        background: '#f5f5f5', 
        borderRadius: '12px', 
        padding: '20px',
        marginBottom: '30px'
      }}>
        <h3 style={{ marginBottom: '20px', color: '#333' }}>📈 Progreso Semanal (Últimos 7 días)</h3>
        <div style={{ 
          display: 'flex', 
          alignItems: 'end', 
          gap: '10px', 
          height: '150px',
          justifyContent: 'space-between'
        }}>
          {analytics.weeklyProgress.map((day, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              flex: 1
            }}>
              <div style={{
                background: day.total > 0 ? '#4CAF50' : '#ccc',
                width: '100%',
                maxWidth: '40px',
                height: `${day.total > 0 ? (day.completed / day.total) * 100 : 0}px`,
                borderRadius: '4px 4px 0 0',
                marginBottom: '8px'
              }} />
              <div style={{ 
                fontSize: '0.8em', 
                color: '#666',
                textAlign: 'center'
              }}>
                {new Date(day.date).toLocaleDateString('es-ES', { weekday: 'short' })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Logs Section */}
      <div style={{ 
        background: '#fff', 
        borderRadius: '12px', 
        padding: '20px',
        border: '1px solid #e0e0e0',
        marginBottom: '30px'
      }}>
        <h3 style={{ marginBottom: '20px', color: '#333' }}>📝 Historial de Días</h3>
        
        {dailyLogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <h4 style={{ marginBottom: '10px' }}>No hay registros aún</h4>
            <p>Completa tu primer día de tareas para ver tu historial aquí.</p>
          </div>
        ) : (
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {dailyLogs.map((log, index) => {
              const motivationalQuote = getMotivationalQuote(log.productivityRate);
              return (
                <div key={index} style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '20px',
                  marginBottom: '15px',
                  background: '#fafafa'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '15px'
                  }}>
                    <h4 style={{ margin: 0, color: '#333' }}>
                      📅 {formatDate(log.date)}
                    </h4>
                    <div style={{
                      padding: '4px 12px',
                      background: getProductivityColor(log.productivityRate),
                      color: 'white',
                      borderRadius: '20px',
                      fontSize: '0.9em',
                      fontWeight: 'bold'
                    }}>
                      {log.productivityRate.toFixed(1)}% Productividad
                    </div>
                  </div>

                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                    gap: '15px',
                    marginBottom: '15px'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#4CAF50' }}>
                        {log.totalTasks}
                      </div>
                      <div style={{ fontSize: '0.9em', color: '#666' }}>Total Tareas</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#2196F3' }}>
                        {log.completedTasks}
                      </div>
                      <div style={{ fontSize: '0.9em', color: '#666' }}>Completadas</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#FF9800' }}>
                        {log.incompleteTasks}
                      </div>
                      <div style={{ fontSize: '0.9em', color: '#666' }}>Pendientes</div>
                    </div>
                  </div>

                  {/* Task Details */}
                  <div style={{ marginBottom: '15px' }}>
                    <h5 style={{ marginBottom: '10px', color: '#333' }}>📋 Detalle de Tareas:</h5>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                      gap: '10px'
                    }}>
                      {log.tasks.map((task, taskIndex) => (
                        <div key={taskIndex} style={{
                          padding: '8px 12px',
                          background: task.completed ? '#e8f5e8' : '#fff3cd',
                          border: `1px solid ${task.completed ? '#4CAF50' : '#FFC107'}`,
                          borderRadius: '6px',
                          fontSize: '0.9em'
                        }}>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center'
                          }}>
                            <span style={{ 
                              textDecoration: task.completed ? 'line-through' : 'none',
                              color: task.completed ? '#666' : '#333'
                            }}>
                              {task.text}
                            </span>
                            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                              <span style={{
                                background: '#f0f0f0',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '0.8em',
                                color: '#666'
                              }}>
                                {task.importance}
                              </span>
                              <span style={{ 
                                color: task.completed ? '#4CAF50' : '#FF9800',
                                fontWeight: 'bold'
                              }}>
                                {task.completed ? '✅' : '⏳'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Motivational Message */}
                  <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '15px',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '1.1em', marginBottom: '5px', fontWeight: 'bold' }}>
                      💡 Mensaje Motivacional
                    </div>
                    <div style={{ fontSize: '0.95em', marginBottom: '5px' }}>
                      "{motivationalQuote.quote}"
                    </div>
                    <div style={{ fontSize: '0.8em', opacity: 0.9 }}>
                      — {motivationalQuote.author}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Task Logging Section */}
      <div style={{ 
        background: '#fff', 
        borderRadius: '12px', 
        padding: '20px',
        border: '1px solid #e0e0e0'
      }}>
        <h3 style={{ marginBottom: '20px', color: '#333' }}>📝 Registrar Actividad</h3>
        <LogTask />
      </div>

      {/* Daily Log Component (hidden but functional) */}
      <div style={{ display: 'none' }}>
        <DailyLog tasks={tasks} />
      </div>

      {/* Productivity Tips */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '12px',
        padding: '20px',
        color: 'white',
        marginTop: '20px'
      }}>
        <h3 style={{ marginBottom: '15px' }}>💡 Consejos para Mejorar tu Productividad</h3>
        <ul style={{ 
          listStyle: 'none', 
          padding: 0, 
          margin: 0,
          lineHeight: '1.6'
        }}>
          <li style={{ marginBottom: '8px' }}>• Establece metas claras y específicas para cada día</li>
          <li style={{ marginBottom: '8px' }}>• Usa la técnica Pomodoro para mantener el enfoque</li>
          <li style={{ marginBottom: '8px' }}>• Prioriza tus tareas usando el método ABCDE</li>
          <li style={{ marginBottom: '8px' }}>• Revisa tu progreso diariamente y ajusta tu plan</li>
          <li style={{ marginBottom: '8px' }}>• Celebra tus logros, por pequeños que sean</li>
        </ul>
      </div>
    </div>
  );
}

export default AnalyticsView; 