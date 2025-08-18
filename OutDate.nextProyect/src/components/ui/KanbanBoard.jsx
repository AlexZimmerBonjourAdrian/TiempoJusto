'use client'

import React, { useState, useEffect } from 'react';
import { useProductivityMode } from '../../hooks/useProductivityMode';
import TaskCard from './TaskCard';

function KanbanBoard({ 
  tasks = [], 
  columns = [
    { id: 'backlog', title: '📋 Backlog', color: '#6c757d' },
    { id: 'todo', title: '📝 Por Hacer', color: '#007bff' },
    { id: 'in-progress', title: '🔄 En Progreso', color: '#ffc107' },
    { id: 'review', title: '👀 En Revisión', color: '#17a2b8' },
    { id: 'done', title: '✅ Completado', color: '#28a745' }
  ],
  onTaskMove,
  onTaskComplete,
  onTaskDelete,
  onTaskUpdate,
  maxVisibleTasks = 5,
  showSubtasks = true,
  showGamification = true,
  showRewards = true,
  showAnimations = true,
  colorCoding = true,
  disabled = false
}) {
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const { mode, settings } = useProductivityMode();

  // Aplicar configuraciones del modo activo
  const effectiveMaxTasks = settings.maxVisibleTasks || maxVisibleTasks;
  const effectiveShowSubtasks = settings.showSubtasks && showSubtasks;
  const effectiveShowGamification = settings.showGamification && showGamification;
  const effectiveShowRewards = settings.showRewards && showRewards;
  const effectiveShowAnimations = settings.showAnimations && showAnimations;
  const effectiveColorCoding = settings.colorCoding && colorCoding;

  const handleDragStart = (e, task) => {
    if (disabled) return;
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    if (disabled) return;
    setDragOverColumn(columnId);
  };

  const handleDrop = (e, targetColumnId) => {
    e.preventDefault();
    if (disabled || !draggedTask) return;

    const sourceColumnId = draggedTask.status || 'backlog';
    
    if (sourceColumnId !== targetColumnId) {
      onTaskMove(draggedTask.id, targetColumnId);
    }
    
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const getTasksForColumn = (columnId) => {
    return tasks.filter(task => (task.status || 'backlog') === columnId);
  };

  const getVisibleTasks = (columnTasks) => {
    if (mode === 'adhd' || mode === 'focus') {
      return columnTasks.slice(0, effectiveMaxTasks);
    }
    return columnTasks;
  };

  const getColumnStats = (columnId) => {
    const columnTasks = getTasksForColumn(columnId);
    const completedTasks = columnTasks.filter(task => task.completed).length;
    const totalPoints = columnTasks.reduce((sum, task) => sum + (task.points || 0), 0);
    const completedPoints = columnTasks
      .filter(task => task.completed)
      .reduce((sum, task) => sum + (task.points || 0), 0);

    return {
      total: columnTasks.length,
      completed: completedTasks,
      points: totalPoints,
      completedPoints: completedPoints,
      progress: columnTasks.length > 0 ? (completedTasks / columnTasks.length) * 100 : 0
    };
  };

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: `repeat(${columns.length}, 1fr)`, 
      gap: '20px',
      minHeight: '600px',
      padding: '20px 0'
    }}>
      {columns.map(column => {
        const columnTasks = getTasksForColumn(column.id);
        const visibleTasks = getVisibleTasks(columnTasks);
        const stats = getColumnStats(column.id);
        const isDragOver = dragOverColumn === column.id;

        return (
          <div
            key={column.id}
            style={{
              background: '#f8f9fa',
              borderRadius: '12px',
              padding: '15px',
              minHeight: '500px',
              border: isDragOver ? `3px dashed ${column.color}` : '2px solid #e9ecef',
              transition: 'all 0.3s ease',
              opacity: isDragOver ? 0.8 : 1
            }}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDrop={(e) => handleDrop(e, column.id)}
            onDragLeave={() => setDragOverColumn(null)}
          >
            {/* Column Header */}
            <div style={{ 
              marginBottom: '15px',
              textAlign: 'center'
            }}>
              <h3 style={{ 
                color: column.color, 
                margin: '0 0 8px 0',
                fontSize: '1.1em',
                fontWeight: 'bold'
              }}>
                {column.title}
              </h3>
              
              {/* Column Stats */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontSize: '0.8em',
                color: '#666',
                marginBottom: '10px'
              }}>
                <span>{stats.total} tareas</span>
                <span>{stats.completed} completadas</span>
              </div>

              {/* Progress Bar */}
              {stats.total > 0 && (
                <div style={{ 
                  width: '100%', 
                  height: '4px', 
                  background: '#e9ecef', 
                  borderRadius: '2px',
                  overflow: 'hidden',
                  marginBottom: '10px'
                }}>
                  <div style={{
                    width: `${stats.progress}%`,
                    height: '100%',
                    background: column.color,
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              )}

              {/* Points Display */}
              {effectiveShowGamification && stats.points > 0 && (
                <div style={{ 
                  fontSize: '0.75em', 
                  color: '#666',
                  fontWeight: 'bold'
                }}>
                  {stats.completedPoints}/{stats.points} pts
                </div>
              )}
            </div>

            {/* Tasks Container */}
            <div style={{ 
              display: 'grid', 
              gap: '10px',
              maxHeight: '400px',
              overflowY: 'auto',
              padding: '5px'
            }}>
              {visibleTasks.map(task => (
                <div
                  key={task.id}
                  draggable={!disabled}
                  onDragStart={(e) => handleDragStart(e, task)}
                  onDragEnd={handleDragEnd}
                  style={{
                    cursor: disabled ? 'default' : 'grab',
                    opacity: draggedTask?.id === task.id ? 0.5 : 1,
                    transform: draggedTask?.id === task.id ? 'rotate(5deg)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <TaskCard
                    task={task}
                    onComplete={onTaskComplete}
                    onDelete={onTaskDelete}
                    onUpdate={onTaskUpdate}
                    disabled={disabled}
                    showSubtasks={effectiveShowSubtasks}
                    showGamification={effectiveShowGamification}
                    showRewards={effectiveShowRewards}
                    showAnimations={effectiveShowAnimations}
                    colorCoding={effectiveColorCoding}
                  />
                </div>
              ))}

              {/* Hidden Tasks Indicator */}
              {columnTasks.length > visibleTasks.length && (
                <div style={{
                  textAlign: 'center',
                  padding: '10px',
                  background: '#e9ecef',
                  borderRadius: '8px',
                  fontSize: '0.8em',
                  color: '#666',
                  fontStyle: 'italic'
                }}>
                  +{columnTasks.length - visibleTasks.length} tareas más
                </div>
              )}

              {/* Empty State */}
              {visibleTasks.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: '#999',
                  fontSize: '0.9em'
                }}>
                  <div style={{ fontSize: '2em', marginBottom: '10px' }}>
                    {column.id === 'done' ? '🎉' : '📝'}
                  </div>
                  {column.id === 'done' 
                    ? '¡Excelente trabajo!' 
                    : 'No hay tareas aquí'
                  }
                </div>
              )}
            </div>

            {/* ADHD Mode - Quick Add Task */}
            {mode === 'adhd' && column.id === 'todo' && !disabled && (
              <div style={{ 
                marginTop: '15px',
                padding: '10px',
                background: 'white',
                borderRadius: '8px',
                border: '2px dashed #007bff'
              }}>
                <div style={{ 
                  fontSize: '0.9em', 
                  color: '#007bff',
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}>
                  ➕ Agregar tarea rápida
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default KanbanBoard; 