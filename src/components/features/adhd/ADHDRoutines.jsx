import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

function ADHDRoutines() {
  const [routines, setRoutines] = useState(() => {
    try {
      const savedRoutines = Cookies.get('adhdRoutines');
      return savedRoutines ? JSON.parse(savedRoutines) : [];
    } catch (error) {
      return [];
    }
  });

  const [activeRoutine, setActiveRoutine] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState('');

  // Plantillas de expertos ADHD
  const expertTemplates = [
    {
      id: 'morning-routine',
      name: 'Rutina Matutina ADHD',
      description: 'Diseñada por expertos para empezar el día con energía y enfoque',
      tasks: [
        { id: 1, name: 'Levantarse de la cama', duration: 5, completed: false },
        { id: 2, name: 'Beber agua', duration: 2, completed: false },
        { id: 3, name: 'Ejercicio ligero (5 min)', duration: 5, completed: false },
        { id: 4, name: 'Ducha', duration: 10, completed: false },
        { id: 5, name: 'Desayuno nutritivo', duration: 15, completed: false },
        { id: 6, name: 'Revisar agenda del día', duration: 5, completed: false }
      ],
      totalDuration: 32,
      expert: 'Dr. Russell Barkley'
    },
    {
      id: 'work-focus',
      name: 'Rutina de Trabajo Enfocado',
      description: 'Optimizada para mantener la concentración durante el trabajo',
      tasks: [
        { id: 1, name: 'Preparar espacio de trabajo', duration: 5, completed: false },
        { id: 2, name: 'Listar 3 tareas prioritarias', duration: 3, completed: false },
        { id: 3, name: 'Sesión Pomodoro 25 min', duration: 25, completed: false },
        { id: 4, name: 'Descanso 5 min', duration: 5, completed: false },
        { id: 5, name: 'Revisar progreso', duration: 2, completed: false }
      ],
      totalDuration: 40,
      expert: 'Dr. Edward Hallowell'
    },
    {
      id: 'evening-wind-down',
      name: 'Rutina de Relajación Nocturna',
      description: 'Para preparar el cuerpo y mente para un sueño reparador',
      tasks: [
        { id: 1, name: 'Cenar sin pantallas', duration: 20, completed: false },
        { id: 2, name: 'Preparar ropa del día siguiente', duration: 5, completed: false },
        { id: 3, name: 'Rutina de higiene', duration: 15, completed: false },
        { id: 4, name: 'Leer 10 minutos', duration: 10, completed: false },
        { id: 5, name: 'Ejercicios de respiración', duration: 5, completed: false }
      ],
      totalDuration: 55,
      expert: 'Dr. Ari Tuckman'
    },
    {
      id: 'study-session',
      name: 'Rutina de Estudio Efectivo',
      description: 'Especialmente diseñada para estudiantes con ADHD',
      tasks: [
        { id: 1, name: 'Organizar materiales', duration: 5, completed: false },
        { id: 2, name: 'Establecer objetivo de estudio', duration: 3, completed: false },
        { id: 3, name: 'Estudiar 20 min', duration: 20, completed: false },
        { id: 4, name: 'Tomar notas', duration: 10, completed: false },
        { id: 5, name: 'Repasar lo aprendido', duration: 7, completed: false }
      ],
      totalDuration: 45,
      expert: 'Dr. Thomas Brown'
    }
  ];

  // Guardar rutinas en cookies
  useEffect(() => {
    Cookies.set('adhdRoutines', JSON.stringify(routines), { expires: 365 });
  }, [routines]);

  const createRoutineFromTemplate = (template) => {
    const newRoutine = {
      id: Date.now(),
      name: template.name,
      description: template.description,
      tasks: template.tasks.map(task => ({ ...task, id: Date.now() + task.id })),
      totalDuration: template.totalDuration,
      expert: template.expert,
      createdAt: new Date().toISOString(),
      completed: false
    };
    setRoutines(prev => [...prev, newRoutine]);
    setShowTemplates(false);
  };

  const createCustomRoutine = () => {
    if (newRoutineName.trim() === '') return;
    
    const newRoutine = {
      id: Date.now(),
      name: newRoutineName,
      description: 'Rutina personalizada',
      tasks: [],
      totalDuration: 0,
      expert: 'Personalizada',
      createdAt: new Date().toISOString(),
      completed: false
    };
    setRoutines(prev => [...prev, newRoutine]);
    setNewRoutineName('');
  };

  const addTaskToRoutine = (routineId, taskName, duration) => {
    setRoutines(prev => prev.map(routine => {
      if (routine.id === routineId) {
        const newTask = {
          id: Date.now(),
          name: taskName,
          duration: parseInt(duration) || 5,
          completed: false
        };
        return {
          ...routine,
          tasks: [...routine.tasks, newTask],
          totalDuration: routine.totalDuration + newTask.duration
        };
      }
      return routine;
    }));
  };

  const toggleTaskCompletion = (routineId, taskId) => {
    setRoutines(prev => prev.map(routine => {
      if (routine.id === routineId) {
        return {
          ...routine,
          tasks: routine.tasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
          )
        };
      }
      return routine;
    }));
  };

  const deleteRoutine = (routineId) => {
    setRoutines(prev => prev.filter(routine => routine.id !== routineId));
    if (activeRoutine === routineId) {
      setActiveRoutine(null);
    }
  };

  const getRoutineProgress = (routine) => {
    const completedTasks = routine.tasks.filter(task => task.completed).length;
    const totalTasks = routine.tasks.length;
    return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  };

  const getCompletedDuration = (routine) => {
    return routine.tasks
      .filter(task => task.completed)
      .reduce((sum, task) => sum + task.duration, 0);
  };

  return (
    <div className="minimal-card" style={{ maxWidth: 800, margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 20, color: 'var(--color-accent)' }}>
        📅 Rutinas Estructuradas ADHD
      </h2>
      
      <p style={{ textAlign: 'center', color: 'var(--color-muted)', marginBottom: 25 }}>
        Las rutinas estructuradas ayudan a reducir la carga cognitiva y mantener el enfoque.
      </p>

      {/* Botones de Acción */}
      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        justifyContent: 'center', 
        marginBottom: '25px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setShowTemplates(!showTemplates)}
          style={{
            background: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 20px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600'
          }}
        >
          🎯 Plantillas de Expertos
        </button>
        <button
          onClick={createCustomRoutine}
          disabled={!newRoutineName.trim()}
          style={{
            background: newRoutineName.trim() ? '#4CAF50' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 20px',
            cursor: newRoutineName.trim() ? 'pointer' : 'not-allowed',
            fontSize: '1rem',
            fontWeight: '600'
          }}
        >
          ➕ Crear Rutina Personalizada
        </button>
      </div>

      {/* Input para rutina personalizada */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <input
          type="text"
          placeholder="Nombre de tu rutina personalizada..."
          value={newRoutineName}
          onChange={(e) => setNewRoutineName(e.target.value)}
          style={{
            padding: '10px 15px',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '1rem',
            width: '300px',
            maxWidth: '100%'
          }}
          onKeyPress={(e) => e.key === 'Enter' && createCustomRoutine()}
        />
      </div>

      {/* Plantillas de Expertos */}
      {showTemplates && (
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--color-accent)' }}>
            🧠 Plantillas Diseñadas por Expertos ADHD
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {expertTemplates.map(template => (
              <div key={template.id} style={{
                background: 'white',
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
              }}
              onClick={() => createRoutineFromTemplate(template)}
              >
                <h4 style={{ margin: '0 0 10px 0', color: 'var(--color-accent)' }}>
                  {template.name}
                </h4>
                <p style={{ fontSize: '0.9em', color: '#666', margin: '0 0 15px 0' }}>
                  {template.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9em', color: '#888' }}>
                    ⏱️ {template.totalDuration} min
                  </span>
                  <span style={{ fontSize: '0.8em', color: '#2196F3', fontWeight: '600' }}>
                    {template.expert}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lista de Rutinas */}
      <div>
        <h3 style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--color-accent)' }}>
          📋 Mis Rutinas ({routines.length})
        </h3>
        
        {routines.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#666',
            background: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <div style={{ fontSize: '3em', marginBottom: '15px' }}>📅</div>
            <p>No tienes rutinas creadas aún.</p>
            <p>¡Usa las plantillas de expertos o crea una personalizada para empezar!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {routines.map(routine => (
              <div key={routine.id} style={{
                background: 'white',
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', color: 'var(--color-accent)' }}>
                      {routine.name}
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.9em', color: '#666' }}>
                      {routine.description} • {routine.expert}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button
                      onClick={() => setActiveRoutine(activeRoutine === routine.id ? null : routine.id)}
                      style={{
                        background: activeRoutine === routine.id ? '#FF9800' : '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        fontSize: '0.9em'
                      }}
                    >
                      {activeRoutine === routine.id ? 'Ocultar' : 'Ver'}
                    </button>
                    <button
                      onClick={() => deleteRoutine(routine.id)}
                      style={{
                        background: '#F44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        fontSize: '0.9em'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: '15px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '5px',
                    fontSize: '0.9em',
                    color: '#666'
                  }}>
                    <span>Progreso: {Math.round(getRoutineProgress(routine))}%</span>
                    <span>{getCompletedDuration(routine)}/{routine.totalDuration} min</span>
                  </div>
                  <div style={{
                    background: '#e0e0e0',
                    borderRadius: '10px',
                    height: '8px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      background: 'linear-gradient(90deg, #4CAF50, #8BC34A)',
                      height: '100%',
                      width: `${getRoutineProgress(routine)}%`,
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>

                {/* Tasks List */}
                {activeRoutine === routine.id && (
                  <div style={{ marginTop: '15px' }}>
                    <h5 style={{ margin: '0 0 10px 0', color: 'var(--color-accent)' }}>
                      Tareas ({routine.tasks.length})
                    </h5>
                    
                    {routine.tasks.length === 0 ? (
                      <p style={{ color: '#666', fontStyle: 'italic' }}>
                        No hay tareas en esta rutina. ¡Agrega algunas!
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {routine.tasks.map(task => (
                          <div key={task.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px',
                            background: task.completed ? '#f0f8f0' : '#f8f9fa',
                            borderRadius: '6px',
                            border: task.completed ? '1px solid #4CAF50' : '1px solid #e0e0e0'
                          }}>
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => toggleTaskCompletion(routine.id, task.id)}
                              style={{
                                width: '18px',
                                height: '18px',
                                accentColor: '#4CAF50'
                              }}
                            />
                            <span style={{
                              flex: 1,
                              textDecoration: task.completed ? 'line-through' : 'none',
                              color: task.completed ? '#666' : '#333'
                            }}>
                              {task.name}
                            </span>
                            <span style={{
                              fontSize: '0.8em',
                              color: '#888',
                              background: '#e0e0e0',
                              padding: '2px 6px',
                              borderRadius: '4px'
                            }}>
                              {task.duration} min
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Task Form */}
                    <div style={{
                      marginTop: '15px',
                      padding: '15px',
                      background: '#f8f9fa',
                      borderRadius: '8px'
                    }}>
                      <h6 style={{ margin: '0 0 10px 0', color: 'var(--color-accent)' }}>
                        ➕ Agregar Nueva Tarea
                      </h6>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <input
                          type="text"
                          placeholder="Nombre de la tarea..."
                          id={`task-${routine.id}`}
                          style={{
                            flex: 1,
                            minWidth: '200px',
                            padding: '8px 12px',
                            border: '1px solid #ddd',
                            borderRadius: '4px'
                          }}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const taskName = e.target.value;
                              const duration = 5; // Default duration
                              if (taskName.trim()) {
                                addTaskToRoutine(routine.id, taskName, duration);
                                e.target.value = '';
                              }
                            }
                          }}
                        />
                        <button
                          onClick={() => {
                            const input = document.getElementById(`task-${routine.id}`);
                            const taskName = input.value;
                            if (taskName.trim()) {
                              addTaskToRoutine(routine.id, taskName, 5);
                              input.value = '';
                            }
                          }}
                          style={{
                            background: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '8px 16px',
                            cursor: 'pointer'
                          }}
                        >
                          Agregar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ADHDRoutines; 