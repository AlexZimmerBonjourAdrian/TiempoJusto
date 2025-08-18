'use client'

import React, { useState } from 'react';
import { useProductivityMode } from '../../hooks/useProductivityMode';

function TaskCard({ 
  task, 
  onComplete, 
  onDelete, 
  onUpdate, 
  onMove,
  disabled = false,
  showSubtasks = true,
  showGamification = true,
  showRewards = true,
  showAnimations = true,
  colorCoding = true
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [newSubtask, setNewSubtask] = useState('');

  const { mode } = useProductivityMode();

  const handleComplete = () => {
    if (disabled) return;
    
    // Mostrar animación de confeti si está habilitado
    if (showAnimations && showRewards) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
    
    onComplete(task.id);
  };

  const handleSubtaskComplete = (subtaskId) => {
    const updatedSubtasks = task.subtasks?.map(subtask =>
      subtask.id === subtaskId 
        ? { ...subtask, completed: !subtask.completed }
        : subtask
    ) || [];

    onUpdate(task.id, { subtasks: updatedSubtasks });
  };

  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    
    const newSubtaskObj = {
      id: Date.now(),
      text: newSubtask.trim(),
      completed: false
    };

    const updatedSubtasks = [...(task.subtasks || []), newSubtaskObj];
    onUpdate(task.id, { subtasks: updatedSubtasks });
    setNewSubtask('');
  };

  const deleteSubtask = (subtaskId) => {
    const updatedSubtasks = task.subtasks?.filter(subtask => subtask.id !== subtaskId) || [];
    onUpdate(task.id, { subtasks: updatedSubtasks });
  };

  const getPriorityColor = (priority) => {
    if (!colorCoding) return '#666';
    
    const colors = {
      'A': '#dc3545', // Rojo - Alta prioridad
      'B': '#ffc107', // Amarillo - Media prioridad
      'C': '#17a2b8', // Azul - Baja prioridad
      'D': '#6c757d'  // Gris - Muy baja prioridad
    };
    return colors[priority] || '#666';
  };

  const getTaskTypeColor = (type) => {
    if (!colorCoding) return '#666';
    
    const colors = {
      'work': '#2196F3',
      'personal': '#4CAF50',
      'study': '#FF9800',
      'health': '#F44336',
      'creative': '#9C27B0'
    };
    return colors[type] || '#666';
  };

  const getProgressPercentage = () => {
    if (!task.subtasks || task.subtasks.length === 0) {
      return task.completed ? 100 : 0;
    }
    
    const completedSubtasks = task.subtasks.filter(subtask => subtask.completed).length;
    return Math.round((completedSubtasks / task.subtasks.length) * 100);
  };

  const getRewardMessage = () => {
    const messages = [
      "¡Excelente trabajo! 🎉",
      "¡Sigue así! 💪",
      "¡Increíble progreso! ⭐",
      "¡Lo estás haciendo genial! 🚀",
      "¡Eres un campeón! 🏆"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const progressPercentage = getProgressPercentage();
  const hasSubtasks = task.subtasks && task.subtasks.length > 0;

  return (
    <div
      style={{
        position: 'relative',
        background: 'white',
        border: `2px solid ${task.completed ? '#28a745' : '#ddd'}`,
        borderRadius: '12px',
        padding: '15px',
        marginBottom: '10px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        opacity: disabled ? 0.6 : 1,
        transform: showConfetti ? 'scale(1.05)' : 'scale(1)',
        boxShadow: showConfetti ? '0 8px 25px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.1)'
      }}
      onClick={() => !disabled && setIsExpanded(!isExpanded)}
    >
      {/* Confetti Animation */}
      {showConfetti && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 10
        }}>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: '8px',
                height: '8px',
                background: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'][i % 5],
                borderRadius: '50%',
                animation: `confetti 2s ease-out forwards`,
                animationDelay: `${i * 0.1}s`,
                left: `${Math.random() * 100}%`,
                top: '0%'
              }}
            />
          ))}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
            <h4 style={{ 
              margin: 0, 
              fontSize: '1.1em',
              textDecoration: task.completed ? 'line-through' : 'none',
              color: task.completed ? '#666' : '#333'
            }}>
              {task.text}
            </h4>
            
            {/* Priority Badge */}
            {colorCoding && task.importance && (
              <span style={{
                padding: '2px 6px',
                borderRadius: '8px',
                fontSize: '0.7em',
                color: 'white',
                background: getPriorityColor(task.importance.split('-')[0]),
                fontWeight: 'bold'
              }}>
                {task.importance.split('-')[0]}
              </span>
            )}

            {/* Task Type Badge */}
            {colorCoding && task.type && (
              <span style={{
                padding: '2px 6px',
                borderRadius: '8px',
                fontSize: '0.7em',
                color: 'white',
                background: getTaskTypeColor(task.type)
              }}>
                {task.type}
              </span>
            )}

            {/* Star for important tasks */}
            {task.important && (
              <span style={{ color: '#ffc107', fontSize: '1.2em' }}>⭐</span>
            )}
          </div>

          {/* Progress Bar */}
          {hasSubtasks && (
            <div style={{ marginBottom: '10px' }}>
              <div style={{ 
                width: '100%', 
                height: '6px', 
                background: '#f0f0f0', 
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${progressPercentage}%`,
                  height: '100%',
                  background: progressPercentage === 100 ? '#28a745' : '#007bff',
                  transition: 'width 0.3s ease'
                }} />
              </div>
              <div style={{ 
                fontSize: '0.8em', 
                color: '#666', 
                marginTop: '2px',
                textAlign: 'right'
              }}>
                {progressPercentage}% completado
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '5px', flexShrink: 0 }}>
          {!disabled && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleComplete();
                }}
                style={{
                  padding: '6px 12px',
                  background: task.completed ? '#28a745' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.8em',
                  fontWeight: 'bold'
                }}
              >
                {task.completed ? '✅' : '✓'}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.id);
                }}
                style={{
                  padding: '6px 12px',
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.8em'
                }}
              >
                🗑️
              </button>
            </>
          )}
        </div>
      </div>

      {/* Subtasks Section */}
      {showSubtasks && hasSubtasks && (
        <div style={{ marginTop: '10px' }}>
          <div style={{ 
            fontSize: '0.9em', 
            fontWeight: 'bold', 
            marginBottom: '8px',
            color: '#666'
          }}>
            📋 Subtareas ({task.subtasks.filter(s => s.completed).length}/{task.subtasks.length})
          </div>
          
          <div style={{ display: 'grid', gap: '5px' }}>
            {task.subtasks.map(subtask => (
              <div
                key={subtask.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px',
                  background: '#f8f9fa',
                  borderRadius: '6px',
                  fontSize: '0.85em'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={subtask.completed}
                  onChange={() => handleSubtaskComplete(subtask.id)}
                  style={{ cursor: 'pointer' }}
                />
                <span style={{
                  textDecoration: subtask.completed ? 'line-through' : 'none',
                  color: subtask.completed ? '#666' : '#333',
                  flex: 1
                }}>
                  {subtask.text}
                </span>
                <button
                  onClick={() => deleteSubtask(subtask.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#dc3545',
                    cursor: 'pointer',
                    fontSize: '0.8em'
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Add Subtask */}
          <div style={{ 
            display: 'flex', 
            gap: '5px', 
            marginTop: '8px',
            alignItems: 'center'
          }}>
            <input
              type="text"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              placeholder="Agregar subtarea..."
              style={{
                flex: 1,
                padding: '4px 8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '0.8em'
              }}
              onClick={(e) => e.stopPropagation()}
              onKeyPress={(e) => e.key === 'Enter' && addSubtask()}
            />
            <button
              onClick={addSubtask}
              style={{
                padding: '4px 8px',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.8em'
              }}
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Gamification - Points */}
      {showGamification && task.points && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: '#ffc107',
          color: '#333',
          padding: '2px 6px',
          borderRadius: '8px',
          fontSize: '0.7em',
          fontWeight: 'bold'
        }}>
          {task.points} pts
        </div>
      )}

      {/* Reward Message */}
      {showRewards && showConfetti && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(40, 167, 69, 0.9)',
          color: 'white',
          padding: '10px 15px',
          borderRadius: '8px',
          fontSize: '0.9em',
          fontWeight: 'bold',
          zIndex: 20,
          animation: 'fadeInOut 2s ease-in-out'
        }}>
          {getRewardMessage()}
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100px) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes fadeInOut {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default TaskCard; 