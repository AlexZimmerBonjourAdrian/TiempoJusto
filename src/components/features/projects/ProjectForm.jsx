'use client'

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { PROJECT_STATUSES } from '../../../constants';

function ProjectForm({ project, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: PROJECT_STATUSES.ACTIVE,
        priority: 'medium',
        deadline: '',
        estimatedHours: '',
        budget: '',
        team: []
    });

    useEffect(() => {
        if (project) {
            setFormData({
                name: project.name || '',
                description: project.description || '',
                status: project.status || PROJECT_STATUSES.ACTIVE,
                priority: project.priority || 'medium',
                deadline: project.deadline ? new Date(project.deadline).toISOString().split('T')[0] : '',
                estimatedHours: project.estimatedHours?.toString() || '',
                budget: project.budget?.toString() || '',
                team: project.team || []
            });
        }
    }, [project]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            alert('El nombre del proyecto es obligatorio');
            return;
        }

        const projectData = {
            ...formData,
            estimatedHours: formData.estimatedHours ? parseFloat(formData.estimatedHours) : 0,
            budget: formData.budget ? parseFloat(formData.budget) : 0,
            deadline: formData.deadline ? new Date(formData.deadline) : null
        };

        onSubmit(projectData);
    };

    return (
        <div className="minimal-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>
                {project ? 'Editar Proyecto' : 'Nuevo Proyecto'}
            </h2>
            
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '16px' }}>
                    <label style={{ 
                        display: 'block', 
                        marginBottom: '6px', 
                        fontWeight: '500',
                        color: 'var(--color-text)'
                    }}>
                        Nombre del Proyecto *
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Ej: Rediseño del sitio web"
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid var(--color-muted)',
                            borderRadius: '4px',
                            fontSize: '14px'
                        }}
                        required
                    />
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label style={{ 
                        display: 'block', 
                        marginBottom: '6px', 
                        fontWeight: '500',
                        color: 'var(--color-text)'
                    }}>
                        Descripción
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe el objetivo y alcance del proyecto..."
                        rows="4"
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid var(--color-muted)',
                            borderRadius: '4px',
                            fontSize: '14px',
                            resize: 'vertical'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '6px', 
                            fontWeight: '500',
                            color: 'var(--color-text)'
                        }}>
                            Estado
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid var(--color-muted)',
                                borderRadius: '4px',
                                fontSize: '14px'
                            }}
                        >
                            <option value={PROJECT_STATUSES.ACTIVE}>Activo</option>
                            <option value={PROJECT_STATUSES.PAUSED}>Pausado</option>
                            <option value={PROJECT_STATUSES.COMPLETED}>Completado</option>
                        </select>
                    </div>

                    <div style={{ flex: 1 }}>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '6px', 
                            fontWeight: '500',
                            color: 'var(--color-text)'
                        }}>
                            Prioridad
                        </label>
                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleInputChange}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid var(--color-muted)',
                                borderRadius: '4px',
                                fontSize: '14px'
                            }}
                        >
                            <option value="low">Baja</option>
                            <option value="medium">Media</option>
                            <option value="high">Alta</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '6px', 
                            fontWeight: '500',
                            color: 'var(--color-text)'
                        }}>
                            Fecha de Vencimiento
                        </label>
                        <input
                            type="date"
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleInputChange}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid var(--color-muted)',
                                borderRadius: '4px',
                                fontSize: '14px'
                            }}
                        />
                    </div>

                    <div style={{ flex: 1 }}>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '6px', 
                            fontWeight: '500',
                            color: 'var(--color-text)'
                        }}>
                            Horas Estimadas
                        </label>
                        <input
                            type="number"
                            name="estimatedHours"
                            value={formData.estimatedHours}
                            onChange={handleInputChange}
                            placeholder="0"
                            min="0"
                            step="0.5"
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid var(--color-muted)',
                                borderRadius: '4px',
                                fontSize: '14px'
                            }}
                        />
                    </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <label style={{ 
                        display: 'block', 
                        marginBottom: '6px', 
                        fontWeight: '500',
                        color: 'var(--color-text)'
                    }}>
                        Presupuesto (USD)
                    </label>
                    <input
                        type="number"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        placeholder="0"
                        min="0"
                        step="0.01"
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid var(--color-muted)',
                            borderRadius: '4px',
                            fontSize: '14px'
                        }}
                    />
                </div>

                <div style={{ 
                    display: 'flex', 
                    gap: '12px', 
                    justifyContent: 'flex-end'
                }}>
                    <button
                        type="button"
                        onClick={onCancel}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        style={{
                            padding: '10px 20px',
                            backgroundColor: 'var(--color-accent)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        {project ? 'Actualizar' : 'Crear'} Proyecto
                    </button>
                </div>
            </form>
        </div>
    );
}

ProjectForm.propTypes = {
    project: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default ProjectForm; 