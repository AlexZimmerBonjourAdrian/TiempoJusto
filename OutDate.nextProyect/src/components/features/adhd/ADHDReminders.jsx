import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

function ADHDReminders() {
  const [reminders, setReminders] = useState(() => {
    try {
      const savedReminders = Cookies.get('adhdReminders');
      return savedReminders ? JSON.parse(savedReminders) : [];
    } catch (error) {
      return [];
    }
  });

  const [newReminder, setNewReminder] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newDate, setNewDate] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeReminders, setActiveReminders] = useState([]);
  const [notificationPermission, setNotificationPermission] = useState('default');

  // Solicitar permisos de notificación al cargar
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          setNotificationPermission(permission);
        });
      }
    }
  }, []);

  // Guardar recordatorios en cookies
  useEffect(() => {
    Cookies.set('adhdReminders', JSON.stringify(reminders), { expires: 365 });
  }, [reminders]);

  // Verificar recordatorios activos cada minuto
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const active = reminders.filter(reminder => {
        const reminderTime = new Date(reminder.date + 'T' + reminder.time);
        const timeDiff = reminderTime.getTime() - now.getTime();
        return timeDiff > 0 && timeDiff <= 60000; // Dentro del próximo minuto
      });
      setActiveReminders(active);
    };

    checkReminders();
    const interval = setInterval(checkReminders, 60000); // Verificar cada minuto

    return () => clearInterval(interval);
  }, [reminders]);

  // Mostrar notificaciones para recordatorios activos
  useEffect(() => {
    activeReminders.forEach(reminder => {
      if (notificationPermission === 'granted') {
        new Notification('TiempoJusto - Recordatorio ADHD', {
          body: reminder.text,
          icon: '/favicon.ico',
          requireInteraction: true, // No se cierra automáticamente
          tag: `reminder-${reminder.id}` // Evitar duplicados
        });
      }
      
      // Mostrar alerta persistente en la página
      showPersistentAlert(reminder);
    });
  }, [activeReminders, notificationPermission]);

  const showPersistentAlert = (reminder) => {
    // Crear elemento de alerta persistente
    const alertDiv = document.createElement('div');
    alertDiv.id = `alert-${reminder.id}`;
    alertDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #FF6B6B, #FF8E53);
      color: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 8px 25px rgba(0,0,0,0.3);
      z-index: 10000;
      max-width: 300px;
      animation: slideIn 0.5s ease;
      border: 2px solid #fff;
    `;
    
    alertDiv.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
        <h4 style="margin: 0; font-size: 1.1em;">⏰ Recordatorio</h4>
        <button onclick="this.parentElement.parentElement.remove()" style="
          background: none;
          border: none;
          color: white;
          font-size: 1.5em;
          cursor: pointer;
          padding: 0;
          line-height: 1;
        ">×</button>
      </div>
      <p style="margin: 0 0 15px 0; font-size: 1em;">${reminder.text}</p>
      <div style="display: flex; gap: 10px;">
        <button onclick="
          this.parentElement.parentElement.remove();
          window.completeReminder(${reminder.id});
        " style="
          background: #4CAF50;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9em;
        ">✅ Completado</button>
        <button onclick="
          this.parentElement.parentElement.remove();
          window.snoozeReminder(${reminder.id});
        " style="
          background: #FF9800;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9em;
        ">⏰ 5 min</button>
      </div>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Agregar funciones globales para los botones
    window.completeReminder = (id) => completeReminder(id);
    window.snoozeReminder = (id) => snoozeReminder(id);
    
    // Auto-remover después de 30 segundos si no se interactúa
    setTimeout(() => {
      if (document.getElementById(alertDiv.id)) {
        alertDiv.remove();
      }
    }, 30000);
  };

  const addReminder = () => {
    if (!newReminder.trim() || !newDate || !newTime) return;
    
    const reminder = {
      id: Date.now(),
      text: newReminder,
      date: newDate,
      time: newTime,
      completed: false,
      snoozed: false,
      snoozeCount: 0,
      createdAt: new Date().toISOString()
    };
    
    setReminders(prev => [...prev, reminder]);
    setNewReminder('');
    setNewDate('');
    setNewTime('');
    setShowAddForm(false);
  };

  const completeReminder = (id) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === id ? { ...reminder, completed: true } : reminder
    ));
  };

  const snoozeReminder = (id) => {
    setReminders(prev => prev.map(reminder => {
      if (reminder.id === id) {
        const newTime = new Date();
        newTime.setMinutes(newTime.getMinutes() + 5);
        return {
          ...reminder,
          time: newTime.toTimeString().slice(0, 5),
          date: newTime.toISOString().split('T')[0],
          snoozed: true,
          snoozeCount: reminder.snoozeCount + 1
        };
      }
      return reminder;
    }));
  };

  const deleteReminder = (id) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
  };

  const getReminderStatus = (reminder) => {
    const now = new Date();
    const reminderTime = new Date(reminder.date + 'T' + reminder.time);
    
    if (reminder.completed) return 'completed';
    if (reminderTime < now) return 'overdue';
    if (reminder.snoozed) return 'snoozed';
    return 'pending';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'overdue': return '#F44336';
      case 'snoozed': return '#FF9800';
      default: return '#2196F3';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return '✅ Completado';
      case 'overdue': return '⚠️ Vencido';
      case 'snoozed': return '⏰ Aplazado';
      default: return '⏳ Pendiente';
    }
  };

  const getUpcomingReminders = () => {
    const now = new Date();
    return reminders
      .filter(reminder => !reminder.completed)
      .sort((a, b) => {
        const timeA = new Date(a.date + 'T' + a.time);
        const timeB = new Date(b.date + 'T' + b.time);
        return timeA - timeB;
      })
      .slice(0, 5);
  };

  return (
    <div className="minimal-card" style={{ maxWidth: 800, margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 20, color: 'var(--color-accent)' }}>
        ⏰ Recordatorios Persistentes ADHD
      </h2>
      
      <p style={{ textAlign: 'center', color: 'var(--color-muted)', marginBottom: 25 }}>
        Recordatorios que no se pueden ignorar fácilmente. Diseñados para combatir la procrastinación.
      </p>

      {/* Notification Permission Status */}
      {notificationPermission !== 'granted' && (
        <div style={{
          background: '#fff3cd',
          border: '2px solid #ffeaa7',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <p style={{ margin: '0 0 10px 0', color: '#856404' }}>
            🔔 Para recibir notificaciones persistentes, permite el acceso a notificaciones
          </p>
          <button
            onClick={() => Notification.requestPermission().then(setNotificationPermission)}
            style={{
              background: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              cursor: 'pointer'
            }}
          >
            Permitir Notificaciones
          </button>
        </div>
      )}

      {/* Add Reminder Button */}
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600'
          }}
        >
          ➕ Agregar Recordatorio
        </button>
      </div>

      {/* Add Reminder Form */}
      {showAddForm && (
        <div style={{
          background: '#f8f9fa',
          border: '2px solid #e0e0e0',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '25px'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: 'var(--color-accent)' }}>
            Nuevo Recordatorio
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input
              type="text"
              placeholder="¿Qué necesitas recordar?"
              value={newReminder}
              onChange={(e) => setNewReminder(e.target.value)}
              style={{
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                style={{
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  flex: 1,
                  minWidth: '150px'
                }}
              />
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                style={{
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  flex: 1,
                  minWidth: '120px'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowAddForm(false)}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 20px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={addReminder}
                disabled={!newReminder.trim() || !newDate || !newTime}
                style={{
                  background: (!newReminder.trim() || !newDate || !newTime) ? '#ccc' : '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 20px',
                  cursor: (!newReminder.trim() || !newDate || !newTime) ? 'not-allowed' : 'pointer'
                }}
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Reminders */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--color-accent)' }}>
          🔜 Próximos Recordatorios
        </h3>
        
        {getUpcomingReminders().length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '30px',
            color: '#666',
            background: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <div style={{ fontSize: '3em', marginBottom: '15px' }}>⏰</div>
            <p>No tienes recordatorios pendientes.</p>
            <p>¡Agrega uno para empezar!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {getUpcomingReminders().map(reminder => {
              const status = getReminderStatus(reminder);
              return (
                <div key={reminder.id} style={{
                  background: 'white',
                  border: `2px solid ${getStatusColor(status)}`,
                  borderRadius: '8px',
                  padding: '15px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <p style={{ margin: '0 0 5px 0', fontWeight: '600' }}>
                      {reminder.text}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.9em', color: '#666' }}>
                      {reminder.date} a las {reminder.time}
                      {reminder.snoozed && ` (Aplazado ${reminder.snoozeCount}x)`}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{
                      padding: '4px 8px',
                      background: getStatusColor(status),
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '0.8em',
                      fontWeight: '600'
                    }}>
                      {getStatusText(status)}
                    </span>
                    <button
                      onClick={() => deleteReminder(reminder.id)}
                      style={{
                        background: '#F44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '6px 10px',
                        cursor: 'pointer',
                        fontSize: '0.8em'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* All Reminders */}
      <div>
        <h3 style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--color-accent)' }}>
          📋 Todos los Recordatorios ({reminders.length})
        </h3>
        
        {reminders.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#666',
            background: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <div style={{ fontSize: '3em', marginBottom: '15px' }}>📝</div>
            <p>No tienes recordatorios creados.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {reminders.map(reminder => {
              const status = getReminderStatus(reminder);
              return (
                <div key={reminder.id} style={{
                  background: 'white',
                  border: `2px solid ${getStatusColor(status)}`,
                  borderRadius: '8px',
                  padding: '15px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 5px 0', fontWeight: '600' }}>
                        {reminder.text}
                      </p>
                      <p style={{ margin: 0, fontSize: '0.9em', color: '#666' }}>
                        {reminder.date} a las {reminder.time}
                        {reminder.snoozed && ` (Aplazado ${reminder.snoozeCount}x)`}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{
                        padding: '4px 8px',
                        background: getStatusColor(status),
                        color: 'white',
                        borderRadius: '4px',
                        fontSize: '0.8em',
                        fontWeight: '600'
                      }}>
                        {getStatusText(status)}
                      </span>
                      {!reminder.completed && (
                        <button
                          onClick={() => completeReminder(reminder.id)}
                          style={{
                            background: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '6px 10px',
                            cursor: 'pointer',
                            fontSize: '0.8em'
                          }}
                        >
                          ✅
                        </button>
                      )}
                      <button
                        onClick={() => deleteReminder(reminder.id)}
                        style={{
                          background: '#F44336',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '6px 10px',
                          cursor: 'pointer',
                          fontSize: '0.8em'
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default ADHDReminders; 