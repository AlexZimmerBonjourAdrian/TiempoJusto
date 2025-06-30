'use client'

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import TaskCard from '../../ui/TaskCard';
import KanbanBoard from '../../ui/KanbanBoard';
import ProductivityModeSelector from '../../ui/ProductivityModeSelector';
import { requestNotificationPermission, showTaskboardClosureNotification, showMidnightReminder } from '../../../utils/notifications';
import { useProductivityMode } from '../../../hooks/useProductivityMode';

function TaskBoard() {
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = Cookies.get('tasks');
      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch (error) {
      console.error('Error reading tasks from cookies:', error);
      return [];
    }
  });
  const [newTask, setNewTask] = useState('');
  const [newImportance, setNewImportance] = useState('A');
  const [newTaskType, setNewTaskType] = useState('work');
  const [newPoints, setNewPoints] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [showClosureConfirmation, setShowClosureConfirmation] = useState(false);
  const [closureStep, setClosureStep] = useState(1);
  const [isClosed, setIsClosed] = useState(() => {
    try {
      const savedClosed = Cookies.get('taskboardClosed');
      return savedClosed ? JSON.parse(savedClosed) : false;
    } catch (error) {
      return false;
    }
  });
  const [lastClosedDate, setLastClosedDate] = useState(() => {
    try {
      const savedDate = Cookies.get('lastClosedDate');
      return savedDate || null;
    } catch (error) {
      return null;
    }
  });
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'kanban'

  const { mode, settings } = useProductivityMode();

  // Request notification permissions on component mount
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Check for automatic closure at midnight
  useEffect(() => {
    const checkMidnightClosure = () => {
      const now = new Date();
      const today = now.toDateString();
      
      if (lastClosedDate !== today && now.getHours() === 0 && now.getMinutes() === 0) {
        showMidnightReminder();
        setTimeout(() => {
          handleDailyClosure();
        }, 2000);
      }
    };

    const interval = setInterval(checkMidnightClosure, 60000);
    checkMidnightClosure();

    return () => clearInterval(interval);
  }, [lastClosedDate]);

  // Save tasks and closure state to cookies
  useEffect(() => {
    try {
      Cookies.set('tasks', JSON.stringify(tasks), { expires: 182 });
      Cookies.set('taskboardClosed', JSON.stringify(isClosed), { expires: 182 });
      if (lastClosedDate) {
        Cookies.set('lastClosedDate', lastClosedDate, { expires: 182 });
      }
    } catch (error) {
      console.error('Error writing to cookies:', error);
    }
  }, [tasks, isClosed, lastClosedDate]);

  const handleInputChange = (event) => {
    setNewTask(event.target.value);
  };

  const sortTasksByImportance = (tasksToSort) => {
    return [...tasksToSort].sort((a, b) => {
      const importanceOrder = { 'A': 1, 'B': 2, 'C': 3, 'D': 4 };
      const [importanceA, indexA] = a.importance.split('-');
      const [importanceB, indexB] = b.importance.split('-');
      const orderA = importanceOrder[importanceA] || 5;
      const orderB = importanceOrder[importanceB] || 5;
      if (orderA !== orderB) return orderA - orderB;
      const indexANum = parseInt(indexA) || 0;
      const indexBNum = parseInt(indexB) || 0;
      return indexANum - indexBNum;
    });
  };

  const handleTaskComplete = (id) => {
    if (isClosed) return;
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleTaskUpdate = (id, updates) => {
    if (isClosed) return;
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      )
    );
  };

  const handleTaskMove = (id, newStatus) => {
    if (isClosed) return;
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  const handleDeleteTask = (id) => {
    if (isClosed) return;
    setTaskToDelete(id);
    setShowConfirmation(true);
  };

  const handleConfirmDelete = () => {
    setTasks(tasks.filter((task) => task.id !== taskToDelete));
    setShowConfirmation(false);
    setTaskToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
    setTaskToDelete(null);
  };

  const handleAddTask = () => {
    if (isClosed) {
      alert('El tablero está cerrado. No puedes agregar más tareas hasta mañana.');
      return;
    }

    const trimmedNewTask = newTask.trim();
    if (trimmedNewTask !== '' && !isTaskDuplicate(trimmedNewTask) && tasks.length < 8) {
      const tasksWithSameImportance = tasks.filter(task => task.importance.startsWith(newImportance));
      const nextIndex = tasksWithSameImportance.length + 1;
      const indexedImportance = `${newImportance}-${nextIndex}`;
      
      const newTaskObj = {
        id: Date.now(),
        text: trimmedNewTask,
        completed: false,
        timestamp: new Date(),
        importance: indexedImportance,
        type: newTaskType,
        points: settings.showGamification ? newPoints : null,
        status: 'todo',
        subtasks: [],
        important: newImportance === 'A'
      };

      const updatedTasks = [...tasks, newTaskObj];
      const sortedTasks = sortTasksByImportance(updatedTasks);
      setTasks(sortedTasks);
      setNewTask('');
      setNewImportance('A');
      setNewTaskType('work');
      setNewPoints(1);
    } else if (isTaskDuplicate(trimmedNewTask)) {
      alert('Esta tarea ya existe.');
    } else if (tasks.length >= 8) {
      alert('Solo puedes tener hasta 8 tareas a la vez.');
    }
  };

  const isTaskDuplicate = (newTaskText) => {
    return tasks.some(task => task.text.trim() === newTaskText.trim());
  };

  const handleDailyClosure = () => {
    if (tasks.length === 0) {
      alert('No hay tareas para cerrar.');
      return;
    }

    const completedTasks = tasks.filter(task => task.completed);
    const productivityRate = (completedTasks.length / tasks.length) * 100;
    
    const dailyLog = {
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString(),
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      incompleteTasks: tasks.length - completedTasks.length,
      productivityRate: productivityRate,
      tasks: tasks.map(task => ({
        text: task.text,
        importance: task.importance,
        completed: task.completed,
        type: task.type,
        points: task.points
      })),
      motivationalMessage: getMotivationalMessage(productivityRate)
    };

    try {
      const existingLogs = Cookies.get('dailyLogs');
      const logs = existingLogs ? JSON.parse(existingLogs) : [];
      logs.push(dailyLog);
      Cookies.set('dailyLogs', JSON.stringify(logs), { expires: 365 });
    } catch (error) {
      console.error('Error saving daily log:', error);
    }

    setIsClosed(true);
    setLastClosedDate(new Date().toDateString());
    
    showTaskboardClosureNotification(productivityRate, dailyLog.motivationalMessage);
    
    alert(`¡Día completado! Productividad: ${productivityRate.toFixed(1)}%\n\n${dailyLog.motivationalMessage}`);
  };

  const handleManualClosure = () => {
    setShowClosureConfirmation(true);
    setClosureStep(1);
  };

  const handleFirstConfirmation = () => {
    setClosureStep(2);
  };

  const handleFinalConfirmation = () => {
    setShowClosureConfirmation(false);
    setClosureStep(1);
    handleDailyClosure();
  };

  const handleCancelClosure = () => {
    setShowClosureConfirmation(false);
    setClosureStep(1);
  };

  const handleResetBoard = () => {
    const confirmed = window.confirm('¿Estás seguro de que quieres reiniciar el tablero? Esto eliminará todas las tareas actuales.');
    if (confirmed) {
      setTasks([]);
      setIsClosed(false);
      setLastClosedDate(null);
      setNewTask('');
      setNewImportance('A');
    }
  };

  const getMotivationalMessage = (productivityRate) => {
    const messages = [
      {
        range: [90, 100],
        message: "¡Excepcional! Eres un ejemplo de disciplina y determinación. Como dice Jordan Peterson: 'La responsabilidad es el precio de la grandeza.'",
        author: "Jordan Peterson"
      },
      {
        range: [80, 89],
        message: "¡Excelente trabajo! Tu consistencia te está llevando hacia el éxito. Recuerda: 'La excelencia no es un acto, sino un hábito.'",
        author: "Aristóteles"
      },
      {
        range: [70, 79],
        message: "¡Muy bien! Estás construyendo hábitos sólidos. Como dice Tracy: 'El éxito es la suma de pequeños esfuerzos repetidos día tras día.'",
        author: "Brian Tracy"
      },
      {
        range: [60, 69],
        message: "¡Buen progreso! Cada día es una oportunidad para mejorar. 'La disciplina es el puente entre metas y logros.'",
        author: "Jim Rohn"
      },
      {
        range: [50, 59],
        message: "¡Sigue adelante! La mitad del camino está recorrido. 'El éxito no es final, el fracaso no es fatal: es el coraje para continuar lo que cuenta.'",
        author: "Winston Churchill"
      },
      {
        range: [40, 49],
        message: "¡No te rindas! Cada esfuerzo cuenta. 'La diferencia entre lo imposible y lo posible está en la determinación.'",
        author: "Tommy Lasorda"
      },
      {
        range: [30, 39],
        message: "¡Mantén la fe! Los grandes logros requieren tiempo. 'La paciencia y la persistencia son virtudes que pagan dividendos.'",
        author: "Brian Tracy"
      },
      {
        range: [0, 29],
        message: "¡Mañana es un nuevo día! Como dice Peterson: 'Compara tu ser de hoy con tu ser de ayer, no con el ser de otra persona.'",
        author: "Jordan Peterson"
      }
    ];

    const message = messages.find(m => productivityRate >= m.range[0] && productivityRate <= m.range[1]);
    return message ? message.message : messages[messages.length - 1].message;
  };

  const getStatusColor = () => {
    if (isClosed) return '#F44336';
    if (tasks.length >= 6) return '#FF9800';
    return '#4CAF50';
  };

  const getStatusText = () => {
    if (isClosed) return '🔒 CERRADO';
    if (tasks.length >= 6) return '⚠️ CASI LLENO';
    return '✅ ACTIVO';
  };

  const getVisibleTasks = () => {
    if (mode === 'adhd' || mode === 'focus') {
      return tasks.slice(0, settings.maxVisibleTasks);
    }
    return tasks;
  };

  const visibleTasks = getVisibleTasks();

  return (
    <div className="minimal-card" style={{ maxWidth: 1200 }}>
      {/* Productivity Mode Selector */}
      <ProductivityModeSelector />

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '15px',
        padding: '10px',
        background: getStatusColor() + '10',
        borderRadius: '8px',
        border: `2px solid ${getStatusColor()}30`
      }}>
        <h2 style={{ margin: 0, color: 'var(--color-accent)' }}>Tablero de Tareas</h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ 
            padding: '4px 12px', 
            background: getStatusColor(), 
            color: 'white', 
            borderRadius: '20px',
            fontSize: '0.8em',
            fontWeight: 'bold'
          }}>
            {getStatusText()}
          </div>
          <button
            onClick={() => setViewMode(viewMode === 'list' ? 'kanban' : 'list')}
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
            {viewMode === 'list' ? '📊 Kanban' : '📋 Lista'}
          </button>
        </div>
      </div>

      <p style={{ textAlign: 'center', color: 'var(--color-muted)', marginBottom: 18 }}>
        {mode === 'adhd' 
          ? 'Divide tareas grandes en subtareas pequeñas. Celebra cada logro, por pequeño que sea.'
          : 'Asigna solo tareas significativas y que te acerquen a tus metas.'
        }
      </p>

      <div style={{ textAlign: 'center', marginBottom: 18, color: 'var(--color-accent)', fontWeight: 600 }}>
        {tasks.length}/8 tareas
        {mode === 'adhd' && tasks.length > settings.maxVisibleTasks && (
          <span style={{ fontSize: '0.8em', color: '#666', marginLeft: '10px' }}>
            (mostrando {settings.maxVisibleTasks})
          </span>
        )}
      </div>

      {!isClosed && (
        <div className="input-container" style={{ marginBottom: '20px' }}>
          <input
            placeholder="Agregar nueva tarea"
            value={newTask}
            onChange={handleInputChange}
            aria-label="Agregar nueva tarea"
            style={{ flex: 1 }}
          />
          <select
            value={newImportance}
            onChange={(e) => setNewImportance(e.target.value)}
            style={{ minWidth: 60 }}
          >
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
          <select
            value={newTaskType}
            onChange={(e) => setNewTaskType(e.target.value)}
            style={{ minWidth: 80 }}
          >
            <option value="work">Trabajo</option>
            <option value="personal">Personal</option>
            <option value="study">Estudio</option>
            <option value="health">Salud</option>
            <option value="creative">Creativo</option>
          </select>
          {settings.showGamification && (
            <select
              value={newPoints}
              onChange={(e) => setNewPoints(parseInt(e.target.value))}
              style={{ minWidth: 70 }}
            >
              <option value={1}>1 pt</option>
              <option value={2}>2 pts</option>
              <option value={3}>3 pts</option>
              <option value={5}>5 pts</option>
              <option value={8}>8 pts</option>
            </select>
          )}
          <button onClick={handleAddTask} style={{ minWidth: 120 }}>Agregar</button>
        </div>
      )}

      {/* View Mode Content */}
      {viewMode === 'kanban' ? (
        <KanbanBoard
          tasks={tasks}
          onTaskMove={handleTaskMove}
          onTaskComplete={handleTaskComplete}
          onTaskDelete={handleDeleteTask}
          onTaskUpdate={handleTaskUpdate}
          disabled={isClosed}
          maxVisibleTasks={settings.maxVisibleTasks}
          showSubtasks={settings.showSubtasks}
          showGamification={settings.showGamification}
          showRewards={settings.showRewards}
          showAnimations={settings.showAnimations}
          colorCoding={settings.colorCoding}
        />
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {visibleTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={handleTaskComplete}
              onDelete={handleDeleteTask}
              onUpdate={handleTaskUpdate}
              disabled={isClosed}
              showSubtasks={settings.showSubtasks}
              showGamification={settings.showGamification}
              showRewards={settings.showRewards}
              showAnimations={settings.showAnimations}
              colorCoding={settings.colorCoding}
            />
          ))}
        </ul>
      )}

      {tasks.length === 0 && !isClosed && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--color-muted)' }}>
          <h3 style={{ marginBottom: '12px' }}>No hay tareas aún</h3>
          <p>Agrega tu primera tarea para comenzar a ser productivo.</p>
        </div>
      )}

      {isClosed && (
        <div style={{ 
          textAlign: 'center', 
          padding: '20px', 
          background: '#f5f5f5', 
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <h3 style={{ color: '#F44336', marginBottom: '10px' }}>🔒 Tablero Cerrado</h3>
          <p style={{ color: '#666', marginBottom: '15px' }}>
            El tablero se abrirá automáticamente mañana a las 00:00.
          </p>
          <button 
            onClick={handleResetBoard}
            style={{
              padding: '8px 16px',
              background: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reiniciar Tablero
          </button>
        </div>
      )}

      {!isClosed && tasks.length > 0 && (
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          marginTop: '20px',
          justifyContent: 'center'
        }}>
          <button 
            onClick={handleManualClosure}
            style={{
              padding: '10px 20px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ✅ Cerrar Día
          </button>
        </div>
      )}

      {/* Confirmation Modals */}
      {showConfirmation && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div className="minimal-card" style={{ maxWidth: 320, textAlign: 'center' }}>
            <p>¿Seguro que quieres eliminar esta tarea?</p>
            <button onClick={handleConfirmDelete} style={{ background: 'var(--color-accent)' }}>Sí, eliminar</button>
            <button onClick={handleCancelDelete} style={{ background: 'var(--color-muted)', color: '#fff' }}>Cancelar</button>
          </div>
        </div>
      )}

      {showClosureConfirmation && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div className="minimal-card" style={{ maxWidth: 400, textAlign: 'center' }}>
            {closureStep === 1 ? (
              <>
                <h3 style={{ color: '#FF9800', marginBottom: '15px' }}>⚠️ Primera Confirmación</h3>
                <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
                  ¿Estás seguro de que quieres cerrar el tablero de tareas para hoy?
                </p>
                <p style={{ color: '#666', fontSize: '0.9em', marginBottom: '20px' }}>
                  Esta acción guardará el progreso del día y cerrará el tablero hasta mañana.
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button 
                    onClick={handleFirstConfirmation}
                    style={{ 
                      background: '#FF9800', 
                      color: 'white',
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    Sí, continuar
                  </button>
                  <button 
                    onClick={handleCancelClosure}
                    style={{ 
                      background: 'var(--color-muted)', 
                      color: 'white',
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 style={{ color: '#F44336', marginBottom: '15px' }}>🔒 Confirmación Final</h3>
                <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
                  <strong>¿Estás completamente seguro?</strong>
                </p>
                <p style={{ color: '#666', fontSize: '0.9em', marginBottom: '20px' }}>
                  Esta acción <strong>NO SE PUEDE DESHACER</strong>. El tablero se cerrará y no podrás agregar más tareas hasta mañana.
                </p>
                <div style={{ 
                  background: '#fff3cd', 
                  border: '1px solid #ffeaa7', 
                  borderRadius: '4px', 
                  padding: '10px', 
                  marginBottom: '20px',
                  color: '#856404'
                }}>
                  <strong>Productividad actual:</strong> {tasks.length > 0 ? ((tasks.filter(t => t.completed).length / tasks.length) * 100).toFixed(1) : 0}%
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button 
                    onClick={handleFinalConfirmation}
                    style={{ 
                      background: '#F44336', 
                      color: 'white',
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    Sí, cerrar definitivamente
                  </button>
                  <button 
                    onClick={handleCancelClosure}
                    style={{ 
                      background: '#4CAF50', 
                      color: 'white',
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    No, mantener abierto
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskBoard; 