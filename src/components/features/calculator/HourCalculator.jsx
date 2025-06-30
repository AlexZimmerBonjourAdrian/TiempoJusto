'use client'

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

function HourCalculator() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [estimatedHours, setEstimatedHours] = useState('');
    const [actualHours, setActualHours] = useState('');
    const [taskType, setTaskType] = useState('work');
    const [priority, setPriority] = useState('medium');
    const [showHistory, setShowHistory] = useState(false);
    const [accuracyData, setAccuracyData] = useState([]);

    useEffect(() => {
        // Cargar datos guardados
        try {
            const savedTasks = Cookies.get('calculatorTasks');
            const savedAccuracy = Cookies.get('accuracyData');
            if (savedTasks) setTasks(JSON.parse(savedTasks));
            if (savedAccuracy) setAccuracyData(JSON.parse(savedAccuracy));
        } catch (error) {
            console.error('Error loading calculator data:', error);
        }
    }, []);

    useEffect(() => {
        // Guardar datos
        try {
            Cookies.set('calculatorTasks', JSON.stringify(tasks), { expires: 182 });
            Cookies.set('accuracyData', JSON.stringify(accuracyData), { expires: 182 });
        } catch (error) {
            console.error('Error saving calculator data:', error);
            }
    }, [tasks, accuracyData]);

    const addTask = () => {
        if (!newTask.trim() || !estimatedHours) return;

        const task = {
            id: Date.now(),
            name: newTask.trim(),
            estimatedHours: parseFloat(estimatedHours),
            actualHours: actualHours ? parseFloat(actualHours) : null,
            type: taskType,
            priority,
            createdAt: new Date().toISOString(),
            completed: false
        };

        setTasks([...tasks, task]);
        setNewTask('');
        setEstimatedHours('');
        setActualHours('');
    };

    const completeTask = (id) => {
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        const actualHoursInput = prompt(`Ingresa las horas reales para "${task.name}":`);
        if (actualHoursInput === null) return;

        const actual = parseFloat(actualHoursInput);
        if (isNaN(actual) || actual < 0) {
            alert('Por favor ingresa un número válido de horas.');
            return;
        }

        const updatedTasks = tasks.map(t => 
            t.id === id ? { ...t, actualHours: actual, completed: true, completedAt: new Date().toISOString() } : t
        );
        setTasks(updatedTasks);

        // Calcular precisión y guardar en historial
        const accuracy = ((task.estimatedHours - actual) / task.estimatedHours) * 100;
        const accuracyEntry = {
            id: Date.now(),
            taskName: task.name,
            estimated: task.estimatedHours,
            actual: actual,
            accuracy: accuracy,
            type: task.type,
            priority: task.priority,
            date: new Date().toISOString()
        };

        setAccuracyData([accuracyEntry, ...accuracyData]);
    };

    const deleteTask = (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
            setTasks(tasks.filter(t => t.id !== id));
        }
    };

    const getAccuracyStats = () => {
        if (accuracyData.length === 0) return null;

        const totalTasks = accuracyData.length;
        const avgAccuracy = accuracyData.reduce((sum, entry) => sum + Math.abs(entry.accuracy), 0) / totalTasks;
        const overestimated = accuracyData.filter(entry => entry.accuracy > 0).length;
        const underestimated = accuracyData.filter(entry => entry.accuracy < 0).length;
        const perfect = accuracyData.filter(entry => Math.abs(entry.accuracy) <= 5).length;

        return {
            totalTasks,
            avgAccuracy,
            overestimated,
            underestimated,
            perfect,
            perfectPercentage: (perfect / totalTasks) * 100
        };
    };

    const getTypeColor = (type) => {
        const colors = {
            work: '#2196F3',
            personal: '#4CAF50',
            study: '#FF9800',
            health: '#F44336',
            creative: '#9C27B0'
        };
        return colors[type] || '#666';
    };

    const getPriorityColor = (priority) => {
        const colors = {
            low: '#4CAF50',
            medium: '#FF9800',
            high: '#F44336'
        };
        return colors[priority] || '#666';
    };

    const stats = getAccuracyStats();

    return (
        <div className="minimal-card" style={{ maxWidth: 800 }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h2 style={{ color: 'var(--color-accent)', marginBottom: '10px' }}>
                    🧮 Calculadora de Horas Inteligente
                </h2>
                <p style={{ color: 'var(--color-muted)' }}>
                    Mejora tu estimación de tiempo y optimiza tu productividad
                </p>
            </div>

            {/* Estadísticas de precisión */}
            {stats && (
                <div style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '12px',
                    padding: '20px',
                    color: 'white',
                    marginBottom: '30px'
                }}>
                    <h3 style={{ marginBottom: '15px', textAlign: 'center' }}>📊 Tu Precisión de Estimación</h3>
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                        gap: '15px',
                        textAlign: 'center'
                    }}>
                        <div>
                            <div style={{ fontSize: '1.5em', fontWeight: 'bold' }}>{stats.totalTasks}</div>
                            <div style={{ fontSize: '0.9em' }}>Tareas Analizadas</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5em', fontWeight: 'bold' }}>{stats.avgAccuracy.toFixed(1)}%</div>
                            <div style={{ fontSize: '0.9em' }}>Error Promedio</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5em', fontWeight: 'bold' }}>{stats.perfectPercentage.toFixed(1)}%</div>
                            <div style={{ fontSize: '0.9em' }}>Estimaciones Perfectas</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5em', fontWeight: 'bold' }}>
                                {stats.overestimated > stats.underestimated ? '⬇️' : '⬆️'}
                            </div>
                            <div style={{ fontSize: '0.9em' }}>
                                {stats.overestimated > stats.underestimated ? 'Sobreestimas' : 'Subestimas'}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Formulario para agregar tareas */}
            <div style={{ 
                background: '#f8f9fa', 
                borderRadius: '8px', 
                padding: '20px', 
                marginBottom: '30px' 
            }}>
                <h3 style={{ marginBottom: '15px', color: 'var(--color-accent)' }}>➕ Agregar Nueva Tarea</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '10px', alignItems: 'end' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em' }}>Tarea</label>
                <input
                            type="text"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            placeholder="Nombre de la tarea"
                            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em' }}>Horas Estimadas</label>
                <input
                            type="number"
                            value={estimatedHours}
                            onChange={(e) => setEstimatedHours(e.target.value)}
                            placeholder="0.5"
                            step="0.5"
                            min="0"
                            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em' }}>Tipo</label>
                        <select
                            value={taskType}
                            onChange={(e) => setTaskType(e.target.value)}
                            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                        >
                            <option value="work">Trabajo</option>
                            <option value="personal">Personal</option>
                            <option value="study">Estudio</option>
                            <option value="health">Salud</option>
                            <option value="creative">Creativo</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em' }}>Prioridad</label>
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                        >
                            <option value="low">Baja</option>
                            <option value="medium">Media</option>
                            <option value="high">Alta</option>
                        </select>
                    </div>
                    <button
                        onClick={addTask}
                        style={{
                            padding: '8px 16px',
                            background: 'var(--color-accent)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Agregar
                    </button>
                </div>
            </div>

            {/* Lista de tareas */}
            <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3 style={{ color: 'var(--color-accent)' }}>📝 Tareas Pendientes</h3>
                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        style={{
                            padding: '6px 12px',
                            background: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.9em'
                        }}
                    >
                        {showHistory ? 'Ocultar Historial' : 'Ver Historial'}
                    </button>
                </div>

                {tasks.filter(t => !t.completed).length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-muted)' }}>
                        <h4>No hay tareas pendientes</h4>
                        <p>Agrega una tarea para comenzar a mejorar tu estimación de tiempo.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '10px' }}>
                        {tasks.filter(t => !t.completed).map(task => (
                            <div
                                key={task.id}
                                style={{
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    padding: '15px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: 'white'
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                                        <h4 style={{ margin: 0 }}>{task.name}</h4>
                                        <span style={{
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            fontSize: '0.8em',
                                            color: 'white',
                                            background: getTypeColor(task.type)
                                        }}>
                                            {task.type}
                                        </span>
                                        <span style={{
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            fontSize: '0.8em',
                                            color: 'white',
                                            background: getPriorityColor(task.priority)
                                        }}>
                                            {task.priority}
                                        </span>
                                    </div>
                                    <div style={{ color: '#666', fontSize: '0.9em' }}>
                                        Estimado: <strong>{task.estimatedHours}h</strong>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        onClick={() => completeTask(task.id)}
                                        style={{
                                            padding: '6px 12px',
                                            background: '#28a745',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Completar
                                    </button>
                                    <button
                                        onClick={() => deleteTask(task.id)}
                                        style={{
                                            padding: '6px 12px',
                                            background: '#dc3545',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Historial de precisión */}
            {showHistory && accuracyData.length > 0 && (
                <div>
                    <h3 style={{ color: 'var(--color-accent)', marginBottom: '15px' }}>📈 Historial de Precisión</h3>
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {accuracyData.map(entry => (
                            <div
                                key={entry.id}
                                style={{
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    padding: '15px',
                                    marginBottom: '10px',
                                    background: 'white'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 5px 0' }}>{entry.taskName}</h4>
                                        <div style={{ fontSize: '0.9em', color: '#666' }}>
                                            Estimado: {entry.estimated}h | Real: {entry.actual}h
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{
                                            fontSize: '1.2em',
                                            fontWeight: 'bold',
                                            color: Math.abs(entry.accuracy) <= 10 ? '#28a745' : 
                                                   Math.abs(entry.accuracy) <= 25 ? '#ffc107' : '#dc3545'
                                        }}>
                                            {entry.accuracy > 0 ? '+' : ''}{entry.accuracy.toFixed(1)}%
                                        </div>
                                        <div style={{ fontSize: '0.8em', color: '#666' }}>
                                            {entry.accuracy > 0 ? 'Sobreestimado' : 'Subestimado'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Consejos de mejora */}
            {stats && (
                <div style={{ 
                    background: '#e3f2fd', 
                    borderRadius: '8px', 
                    padding: '20px', 
                    marginTop: '30px' 
                }}>
                    <h3 style={{ color: '#1976d2', marginBottom: '15px' }}>💡 Consejos para Mejorar</h3>
                    <div style={{ fontSize: '0.95em', lineHeight: '1.6' }}>
                        {stats.avgAccuracy > 30 && (
                            <p><strong>🔍 Analiza mejor:</strong> Tu error promedio es alto. Considera dividir tareas grandes en subtareas más pequeñas.</p>
                        )}
                        {stats.overestimated > stats.underestimated && (
                            <p><strong>⏰ Sé más realista:</strong> Tiendes a sobreestimar. Considera el tiempo real que necesitas, no el tiempo ideal.</p>
                        )}
                        {stats.underestimated > stats.overestimated && (
                            <p><strong>📋 Planifica mejor:</strong> Tiendes a subestimar. Incluye tiempo para imprevistos y descansos.</p>
                        )}
                        {stats.perfectPercentage < 30 && (
                            <p><strong>📊 Practica más:</strong> Menos del 30% de tus estimaciones son precisas. Continúa registrando para mejorar.</p>
                        )}
                        <p><strong>🎯 Sinergia con el TaskBoard:</strong> Usa esta calculadora para estimar mejor las tareas que agregas a tu tablero diario.</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HourCalculator; 