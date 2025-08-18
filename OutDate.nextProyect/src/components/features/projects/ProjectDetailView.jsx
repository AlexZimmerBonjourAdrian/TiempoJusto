'use client'

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import KanbanBoard from '../../ui/KanbanBoard';
import { projectUtils } from '../../../utils';

function ProjectDetailView({ project, onBack, onUpdate, onEdit, onDelete }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [showSprintForm, setShowSprintForm] = useState(false);
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [sprintData, setSprintData] = useState({
        name: '',
        duration: 14,
        goal: '',
        startDate: ''
    });

    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        storyPoints: 1,
        assignee: '',
        estimatedHours: 0
    });

    const tabs = [
        { id: 'overview', name: '📊 Resumen', icon: '📊' },
        { id: 'sprints', name: '🚀 Sprints', icon: '🚀' },
        { id: 'tasks', name: '📋 Tareas', icon: '📋' },
        { id: 'kanban', name: '🎯 Kanban', icon: '🎯' },
        { id: 'timeline', name: '📅 Timeline', icon: '📅' },
        { id: 'team', name: '👥 Equipo', icon: '👥' },
        { id: 'analytics', name: '📈 Analytics', icon: '📈' }
    ];

    const handleCreateSprint = () => {
        if (!sprintData.name || !sprintData.goal || !sprintData.startDate) {
            alert('Por favor completa todos los campos del sprint.');
            return;
        }

        const newSprint = {
            id: Date.now(),
            ...sprintData,
            status: 'active',
            createdAt: new Date().toISOString(),
            endDate: new Date(new Date(sprintData.startDate).getTime() + sprintData.duration * 24 * 60 * 60 * 1000).toISOString(),
            velocity: 0,
            completedPoints: 0,
            totalPoints: 0,
            tasks: []
        };

        const updatedProject = {
            ...project,
            sprints: [...project.sprints, newSprint],
            currentSprint: newSprint
        };

        onUpdate(updatedProject);
        setSprintData({ name: '', duration: 14, goal: '', startDate: '' });
        setShowSprintForm(false);
    };

    const handleCreateTask = () => {
        if (!taskData.title || !taskData.description) {
            alert('Por favor completa todos los campos de la tarea.');
            return;
        }

        const newTask = {
            id: Date.now(),
            ...taskData,
            status: 'backlog',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            completed: false,
            sprintId: project.currentSprint?.id || null,
            assignee: taskData.assignee || 'Sin asignar',
            timeSpent: 0,
            comments: []
        };

        const updatedProject = {
            ...project,
            tasks: [...project.tasks, newTask]
        };

        onUpdate(updatedProject);
        setTaskData({ title: '', description: '', priority: 'medium', storyPoints: 1, assignee: '', estimatedHours: 0 });
        setShowTaskForm(false);
    };

    const handleTaskMove = (taskId, newStatus) => {
        const updatedTasks = project.tasks.map(task =>
            task.id === taskId ? { ...task, status: newStatus, updatedAt: new Date().toISOString() } : task
        );

        const updatedProject = {
            ...project,
            tasks: updatedTasks
        };

        onUpdate(updatedProject);
    };

    const handleTaskComplete = (taskId) => {
        const updatedTasks = project.tasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() } : task
        );

        const updatedProject = {
            ...project,
            tasks: updatedTasks
        };

        onUpdate(updatedProject);
    };

    const handleTaskUpdate = (taskId, updates) => {
        const updatedTasks = project.tasks.map(task =>
            task.id === taskId ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task
        );

        const updatedProject = {
            ...project,
            tasks: updatedTasks
        };

        onUpdate(updatedProject);
    };

    const getProjectProgress = () => {
        if (!project.tasks || project.tasks.length === 0) return 0;
        const completedTasks = project.tasks.filter(task => task.completed).length;
        return (completedTasks / project.tasks.length) * 100;
    };

    const getSprintProgress = (sprint) => {
        if (!sprint.tasks || sprint.tasks.length === 0) return 0;
        const completedTasks = sprint.tasks.filter(task => task.completed).length;
        return (completedTasks / sprint.tasks.length) * 100;
    };

    const getStatusColor = (status) => {
        const colors = {
            'backlog': '#6c757d',
            'in-progress': '#ffc107',
            'review': '#17a2b8',
            'done': '#28a745'
        };
        return colors[status] || '#6c757d';
    };

    const getPriorityColor = (priority) => {
        const colors = {
            'low': '#28a745',
            'medium': '#ffc107',
            'high': '#dc3545'
        };
        return colors[priority] || '#6c757d';
    };

    const renderOverview = () => (
        <div style={{ display: 'grid', gap: '20px' }}>
            {/* Información del proyecto */}
            <div style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                padding: '20px',
                color: 'white'
            }}>
                <h3 style={{ marginBottom: '15px' }}>📋 {project.name}</h3>
                <p style={{ marginBottom: '15px', opacity: 0.9 }}>{project.description}</p>
                
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                    gap: '15px'
                }}>
                    <div>
                        <div style={{ fontSize: '0.9em', opacity: 0.8 }}>Estado</div>
                        <div style={{ fontWeight: 'bold' }}>{project.status}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.9em', opacity: 0.8 }}>Progreso</div>
                        <div style={{ fontWeight: 'bold' }}>{Math.round(getProjectProgress())}%</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.9em', opacity: 0.8 }}>Tareas</div>
                        <div style={{ fontWeight: 'bold' }}>{project.tasks?.length || 0}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.9em', opacity: 0.8 }}>Sprints</div>
                        <div style={{ fontWeight: 'bold' }}>{project.sprints?.length || 0}</div>
                    </div>
                </div>
            </div>

            {/* Estadísticas rápidas */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '16px'
            }}>
                <div style={{
                    background: 'white',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef'
                }}>
                    <div style={{ fontSize: '1.2em', marginBottom: '8px' }}>📊</div>
                    <div style={{ fontSize: '1.1em', fontWeight: 'bold', marginBottom: '4px' }}>
                        {project.tasks?.filter(t => t.completed).length || 0}
                    </div>
                    <div style={{ fontSize: '0.9em', color: '#666' }}>Tareas Completadas</div>
                </div>

                <div style={{
                    background: 'white',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef'
                }}>
                    <div style={{ fontSize: '1.2em', marginBottom: '8px' }}>⏰</div>
                    <div style={{ fontSize: '1.1em', fontWeight: 'bold', marginBottom: '4px' }}>
                        {project.estimatedHours || 0}h
                    </div>
                    <div style={{ fontSize: '0.9em', color: '#666' }}>Horas Estimadas</div>
                </div>

                <div style={{
                    background: 'white',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef'
                }}>
                    <div style={{ fontSize: '1.2em', marginBottom: '8px' }}>🚀</div>
                    <div style={{ fontSize: '1.1em', fontWeight: 'bold', marginBottom: '4px' }}>
                        {project.currentSprint ? project.currentSprint.name : 'Ninguno'}
                    </div>
                    <div style={{ fontSize: '0.9em', color: '#666' }}>Sprint Actual</div>
                </div>

                <div style={{
                    background: 'white',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef'
                }}>
                    <div style={{ fontSize: '1.2em', marginBottom: '8px' }}>👥</div>
                    <div style={{ fontSize: '1.1em', fontWeight: 'bold', marginBottom: '4px' }}>
                        {project.team?.length || 0}
                    </div>
                    <div style={{ fontSize: '0.9em', color: '#666' }}>Miembros del Equipo</div>
                </div>
            </div>

            {/* Sprint actual */}
            {project.currentSprint && (
                <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef'
                }}>
                    <h4 style={{ marginBottom: '15px' }}>🎯 Sprint Actual: {project.currentSprint.name}</h4>
                    <p style={{ marginBottom: '15px', color: '#666' }}>{project.currentSprint.goal}</p>
                    
                    <div style={{ marginBottom: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontSize: '0.9em', color: '#666' }}>Progreso del Sprint</span>
                            <span style={{ fontSize: '0.9em', fontWeight: 'bold' }}>
                                {Math.round(getSprintProgress(project.currentSprint))}%
                            </span>
                        </div>
                        <div style={{
                            width: '100%',
                            height: '8px',
                            background: '#e9ecef',
                            borderRadius: '4px',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                width: `${getSprintProgress(project.currentSprint)}%`,
                                height: '100%',
                                background: 'var(--color-accent)',
                                transition: 'width 0.3s ease'
                            }} />
                        </div>
                    </div>

                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                        gap: '10px',
                        fontSize: '0.9em'
                    }}>
                        <div>
                            <div style={{ color: '#666' }}>Duración</div>
                            <div style={{ fontWeight: 'bold' }}>{project.currentSprint.duration} días</div>
                        </div>
                        <div>
                            <div style={{ color: '#666' }}>Story Points</div>
                            <div style={{ fontWeight: 'bold' }}>{project.currentSprint.totalPoints}</div>
                        </div>
                        <div>
                            <div style={{ color: '#666' }}>Completados</div>
                            <div style={{ fontWeight: 'bold' }}>{project.currentSprint.completedPoints}</div>
                        </div>
                        <div>
                            <div style={{ color: '#666' }}>Velocidad</div>
                            <div style={{ fontWeight: 'bold' }}>{project.currentSprint.velocity.toFixed(1)}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const renderSprints = () => (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>🚀 Sprints</h3>
                <button
                    onClick={() => setShowSprintForm(true)}
                    style={{
                        padding: '8px 16px',
                        background: 'var(--color-accent)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                >
                    + Nuevo Sprint
                </button>
            </div>

            {showSprintForm && (
                <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef',
                    marginBottom: '20px'
                }}>
                    <h4 style={{ marginBottom: '15px' }}>Crear Nuevo Sprint</h4>
                    <div style={{ display: 'grid', gap: '12px' }}>
                        <input
                            type="text"
                            placeholder="Nombre del sprint"
                            value={sprintData.name}
                            onChange={(e) => setSprintData({...sprintData, name: e.target.value})}
                            style={{
                                padding: '8px',
                                border: '1px solid #ddd',
                                borderRadius: '4px'
                            }}
                        />
                        <textarea
                            placeholder="Objetivo del sprint"
                            value={sprintData.goal}
                            onChange={(e) => setSprintData({...sprintData, goal: e.target.value})}
                            rows="3"
                            style={{
                                padding: '8px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                resize: 'vertical'
                            }}
                        />
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <input
                                type="date"
                                value={sprintData.startDate}
                                onChange={(e) => setSprintData({...sprintData, startDate: e.target.value})}
                                style={{
                                    padding: '8px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    flex: 1
                                }}
                            />
                            <select
                                value={sprintData.duration}
                                onChange={(e) => setSprintData({...sprintData, duration: parseInt(e.target.value)})}
                                style={{
                                    padding: '8px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    flex: 1
                                }}
                            >
                                <option value={7}>7 días</option>
                                <option value={14}>14 días</option>
                                <option value={21}>21 días</option>
                                <option value={30}>30 días</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={handleCreateSprint}
                                style={{
                                    padding: '8px 16px',
                                    background: 'var(--color-accent)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Crear Sprint
                            </button>
                            <button
                                onClick={() => setShowSprintForm(false)}
                                style={{
                                    padding: '8px 16px',
                                    background: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gap: '16px' }}>
                {project.sprints?.map(sprint => (
                    <div key={sprint.id} style={{
                        background: 'white',
                        padding: '16px',
                        borderRadius: '8px',
                        border: '1px solid #e9ecef'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                            <div>
                                <h4 style={{ margin: '0 0 4px 0' }}>{sprint.name}</h4>
                                <p style={{ margin: 0, color: '#666', fontSize: '0.9em' }}>{sprint.goal}</p>
                            </div>
                            <span style={{
                                padding: '4px 8px',
                                borderRadius: '12px',
                                fontSize: '0.8em',
                                background: sprint.status === 'active' ? '#28a745' : '#6c757d',
                                color: 'white'
                            }}>
                                {sprint.status === 'active' ? 'Activo' : 'Completado'}
                            </span>
                        </div>
                        
                        <div style={{ marginBottom: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span style={{ fontSize: '0.9em', color: '#666' }}>Progreso</span>
                                <span style={{ fontSize: '0.9em', fontWeight: 'bold' }}>
                                    {Math.round(getSprintProgress(sprint))}%
                                </span>
                            </div>
                            <div style={{
                                width: '100%',
                                height: '6px',
                                background: '#e9ecef',
                                borderRadius: '3px',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    width: `${getSprintProgress(sprint)}%`,
                                    height: '100%',
                                    background: 'var(--color-accent)',
                                    transition: 'width 0.3s ease'
                                }} />
                            </div>
                        </div>

                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', 
                            gap: '8px',
                            fontSize: '0.8em'
                        }}>
                            <div>
                                <div style={{ color: '#666' }}>Duración</div>
                                <div style={{ fontWeight: 'bold' }}>{sprint.duration} días</div>
                            </div>
                            <div>
                                <div style={{ color: '#666' }}>Story Points</div>
                                <div style={{ fontWeight: 'bold' }}>{sprint.totalPoints}</div>
                            </div>
                            <div>
                                <div style={{ color: '#666' }}>Completados</div>
                                <div style={{ fontWeight: 'bold' }}>{sprint.completedPoints}</div>
                            </div>
                            <div>
                                <div style={{ color: '#666' }}>Velocidad</div>
                                <div style={{ fontWeight: 'bold' }}>{sprint.velocity.toFixed(1)}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderTasks = () => (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>📋 Tareas</h3>
                <button
                    onClick={() => setShowTaskForm(true)}
                    style={{
                        padding: '8px 16px',
                        background: 'var(--color-accent)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                >
                    + Nueva Tarea
                </button>
            </div>

            {showTaskForm && (
                <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef',
                    marginBottom: '20px'
                }}>
                    <h4 style={{ marginBottom: '15px' }}>Crear Nueva Tarea</h4>
                    <div style={{ display: 'grid', gap: '12px' }}>
                        <input
                            type="text"
                            placeholder="Título de la tarea"
                            value={taskData.title}
                            onChange={(e) => setTaskData({...taskData, title: e.target.value})}
                            style={{
                                padding: '8px',
                                border: '1px solid #ddd',
                                borderRadius: '4px'
                            }}
                        />
                        <textarea
                            placeholder="Descripción de la tarea"
                            value={taskData.description}
                            onChange={(e) => setTaskData({...taskData, description: e.target.value})}
                            rows="3"
                            style={{
                                padding: '8px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                resize: 'vertical'
                            }}
                        />
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                            <select
                                value={taskData.priority}
                                onChange={(e) => setTaskData({...taskData, priority: e.target.value})}
                                style={{
                                    padding: '8px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px'
                                }}
                            >
                                <option value="low">Baja Prioridad</option>
                                <option value="medium">Media Prioridad</option>
                                <option value="high">Alta Prioridad</option>
                            </select>
                            <input
                                type="number"
                                placeholder="Story Points"
                                value={taskData.storyPoints}
                                onChange={(e) => setTaskData({...taskData, storyPoints: parseInt(e.target.value)})}
                                min="1"
                                max="13"
                                style={{
                                    padding: '8px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px'
                                }}
                            />
                            <input
                                type="number"
                                placeholder="Horas estimadas"
                                value={taskData.estimatedHours}
                                onChange={(e) => setTaskData({...taskData, estimatedHours: parseFloat(e.target.value)})}
                                step="0.5"
                                style={{
                                    padding: '8px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px'
                                }}
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="Asignado a (opcional)"
                            value={taskData.assignee}
                            onChange={(e) => setTaskData({...taskData, assignee: e.target.value})}
                            style={{
                                padding: '8px',
                                border: '1px solid #ddd',
                                borderRadius: '4px'
                            }}
                        />
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={handleCreateTask}
                                style={{
                                    padding: '8px 16px',
                                    background: 'var(--color-accent)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Crear Tarea
                            </button>
                            <button
                                onClick={() => setShowTaskForm(false)}
                                style={{
                                    padding: '8px 16px',
                                    background: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gap: '12px' }}>
                {project.tasks?.map(task => (
                    <div key={task.id} style={{
                        background: 'white',
                        padding: '16px',
                        borderRadius: '8px',
                        border: '1px solid #e9ecef',
                        opacity: task.completed ? 0.7 : 1
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <h4 style={{ 
                                margin: 0, 
                                textDecoration: task.completed ? 'line-through' : 'none',
                                color: task.completed ? '#666' : '#333'
                            }}>
                                {task.title}
                            </h4>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <span style={{
                                    padding: '2px 6px',
                                    borderRadius: '8px',
                                    fontSize: '0.7em',
                                    background: getPriorityColor(task.priority),
                                    color: 'white'
                                }}>
                                    {task.priority}
                                </span>
                                <span style={{
                                    padding: '2px 6px',
                                    borderRadius: '8px',
                                    fontSize: '0.7em',
                                    background: getStatusColor(task.status),
                                    color: 'white'
                                }}>
                                    {task.status}
                                </span>
                            </div>
                        </div>
                        
                        <p style={{ 
                            margin: '0 0 12px 0', 
                            color: '#666', 
                            fontSize: '0.9em',
                            textDecoration: task.completed ? 'line-through' : 'none'
                        }}>
                            {task.description}
                        </p>

                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', 
                            gap: '8px',
                            fontSize: '0.8em',
                            marginBottom: '12px'
                        }}>
                            <div>
                                <div style={{ color: '#666' }}>Story Points</div>
                                <div style={{ fontWeight: 'bold' }}>{task.storyPoints}</div>
                            </div>
                            <div>
                                <div style={{ color: '#666' }}>Horas Estimadas</div>
                                <div style={{ fontWeight: 'bold' }}>{task.estimatedHours}h</div>
                            </div>
                            <div>
                                <div style={{ color: '#666' }}>Asignado a</div>
                                <div style={{ fontWeight: 'bold' }}>{task.assignee}</div>
                            </div>
                            <div>
                                <div style={{ color: '#666' }}>Tiempo Real</div>
                                <div style={{ fontWeight: 'bold' }}>{task.timeSpent}h</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={() => handleTaskComplete(task.id)}
                                style={{
                                    padding: '4px 8px',
                                    background: task.completed ? '#6c757d' : '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '0.8em'
                                }}
                            >
                                {task.completed ? 'Desmarcar' : 'Completar'}
                            </button>
                            <select
                                value={task.status}
                                onChange={(e) => handleTaskMove(task.id, e.target.value)}
                                style={{
                                    padding: '4px 8px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '0.8em'
                                }}
                            >
                                <option value="backlog">Backlog</option>
                                <option value="in-progress">En Progreso</option>
                                <option value="review">En Revisión</option>
                                <option value="done">Completado</option>
                            </select>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderKanban = () => (
        <div>
            <h3 style={{ marginBottom: '20px' }}>🎯 Kanban Board</h3>
            <KanbanBoard
                tasks={project.tasks || []}
                onTaskMove={handleTaskMove}
                onTaskComplete={handleTaskComplete}
                onTaskUpdate={handleTaskUpdate}
                disabled={false}
            />
        </div>
    );

    const renderTimeline = () => (
        <div>
            <h3 style={{ marginBottom: '20px' }}>📅 Timeline del Proyecto</h3>
            <div style={{ 
                background: 'white', 
                padding: '20px', 
                borderRadius: '8px',
                border: '1px solid #e9ecef'
            }}>
                <p style={{ color: '#666', textAlign: 'center' }}>
                    Timeline view coming soon...
                </p>
            </div>
        </div>
    );

    const renderTeam = () => (
        <div>
            <h3 style={{ marginBottom: '20px' }}>👥 Equipo del Proyecto</h3>
            <div style={{ 
                background: 'white', 
                padding: '20px', 
                borderRadius: '8px',
                border: '1px solid #e9ecef'
            }}>
                <p style={{ color: '#666', textAlign: 'center' }}>
                    Team management coming soon...
                </p>
            </div>
        </div>
    );

    const renderAnalytics = () => (
        <div>
            <h3 style={{ marginBottom: '20px' }}>📈 Analytics del Proyecto</h3>
            <div style={{ 
                background: 'white', 
                padding: '20px', 
                borderRadius: '8px',
                border: '1px solid #e9ecef'
            }}>
                <p style={{ color: '#666', textAlign: 'center' }}>
                    Project analytics coming soon...
                </p>
            </div>
        </div>
    );

    return (
        <div className="minimal-card" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button
                        onClick={onBack}
                        style={{
                            padding: '8px 12px',
                            background: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        ← Volver
                    </button>
                    <div>
                        <h2 style={{ margin: 0, marginBottom: '4px' }}>{project.name}</h2>
                        <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '0.9em' }}>
                            {project.description}
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={() => onEdit(project)}
                        style={{
                            padding: '8px 16px',
                            background: 'var(--color-accent)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        Editar
                    </button>
                    <button
                        onClick={() => onDelete(project.id)}
                        style={{
                            padding: '8px 16px',
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        Eliminar
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ 
                display: 'flex', 
                gap: '4px', 
                marginBottom: '24px',
                borderBottom: '1px solid #e9ecef',
                overflowX: 'auto'
            }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '12px 16px',
                            background: activeTab === tab.id ? 'var(--color-accent)' : 'transparent',
                            color: activeTab === tab.id ? 'white' : '#666',
                            border: 'none',
                            borderRadius: '8px 8px 0 0',
                            cursor: 'pointer',
                            fontSize: '14px',
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                    >
                        <span>{tab.icon}</span>
                        <span>{tab.name}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div>
                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'sprints' && renderSprints()}
                {activeTab === 'tasks' && renderTasks()}
                {activeTab === 'kanban' && renderKanban()}
                {activeTab === 'timeline' && renderTimeline()}
                {activeTab === 'team' && renderTeam()}
                {activeTab === 'analytics' && renderAnalytics()}
            </div>
        </div>
    );
}

ProjectDetailView.propTypes = {
    project: PropTypes.object.isRequired,
    onBack: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
};

export default ProjectDetailView; 