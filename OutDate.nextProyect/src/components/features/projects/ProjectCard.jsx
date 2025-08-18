'use client'

import React from 'react';
import PropTypes from 'prop-types';
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS } from '../../../constants';
import { projectUtils } from '../../../utils';

function ProjectCard({ project, onEdit, onDelete, onViewDetails, viewMode = 'list' }) {
    const progress = projectUtils.calculateProgress(project);
    const daysUntilDeadline = projectUtils.getDaysUntilDeadline(project.deadline);
    
    const getPriorityColor = (priority) => {
        const colors = {
            'high': '#dc3545',
            'medium': '#ffc107',
            'low': '#28a745'
        };
        return colors[priority] || '#6c757d';
    };

    const getPriorityLabel = (priority) => {
        const labels = {
            'high': 'Alta',
            'medium': 'Media',
            'low': 'Baja'
        };
        return labels[priority] || 'Sin definir';
    };

    if (viewMode === 'kanban') {
        return (
            <div className="minimal-card" style={{ 
                marginBottom: '16px', 
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                background: 'white',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                padding: '16px'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }}
            onClick={onViewDetails}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <h3 style={{ 
                        margin: 0, 
                        fontSize: '1.1em', 
                        fontWeight: '600',
                        color: 'var(--color-text)'
                    }}>
                        {project.name}
                    </h3>
                    <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.7em',
                        fontWeight: '500',
                        backgroundColor: PROJECT_STATUS_COLORS[project.status] + '20',
                        color: PROJECT_STATUS_COLORS[project.status]
                    }}>
                        {PROJECT_STATUS_LABELS[project.status]}
                    </span>
                </div>
                
                <p style={{ 
                    margin: '0 0 12px 0', 
                    color: 'var(--color-muted)', 
                    fontSize: '0.8em',
                    lineHeight: '1.4'
                }}>
                    {project.description?.substring(0, 100)}{project.description?.length > 100 ? '...' : ''}
                </p>
                
                <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.7em', color: 'var(--color-muted)' }}>Progreso</span>
                        <span style={{ fontSize: '0.7em', fontWeight: '500' }}>{Math.round(progress)}%</span>
                    </div>
                    <div style={{
                        width: '100%',
                        height: '4px',
                        backgroundColor: 'var(--color-muted)',
                        borderRadius: '2px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: `${progress}%`,
                            height: '100%',
                            backgroundColor: 'var(--color-accent)',
                            transition: 'width 0.3s ease'
                        }} />
                    </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7em' }}>
                    <div style={{ color: 'var(--color-muted)' }}>
                        <span>{project.tasks?.length || 0} tareas</span>
                        {project.currentSprint && (
                            <span style={{ marginLeft: '8px' }}>
                                🚀 Sprint activo
                            </span>
                        )}
                    </div>
                    
                    {project.priority && (
                        <span style={{
                            padding: '2px 6px',
                            borderRadius: '8px',
                            fontSize: '0.6em',
                            background: getPriorityColor(project.priority),
                            color: 'white',
                            fontWeight: 'bold'
                        }}>
                            {getPriorityLabel(project.priority)}
                        </span>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="minimal-card" style={{ 
            marginBottom: '16px', 
            cursor: 'pointer',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            background: 'white',
            border: '1px solid #e9ecef',
            borderRadius: '8px',
            padding: '16px'
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        }}
        onClick={onViewDetails}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <h3 style={{ 
                    margin: 0, 
                    fontSize: '1.2em', 
                    fontWeight: '600',
                    color: 'var(--color-text)'
                }}>
                    {project.name}
                </h3>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {project.priority && (
                        <span style={{
                            padding: '2px 6px',
                            borderRadius: '8px',
                            fontSize: '0.7em',
                            background: getPriorityColor(project.priority),
                            color: 'white',
                            fontWeight: 'bold'
                        }}>
                            {getPriorityLabel(project.priority)}
                        </span>
                    )}
                    <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.8em',
                        fontWeight: '500',
                        backgroundColor: PROJECT_STATUS_COLORS[project.status] + '20',
                        color: PROJECT_STATUS_COLORS[project.status]
                    }}>
                        {PROJECT_STATUS_LABELS[project.status]}
                    </span>
                </div>
            </div>
            
            <p style={{ 
                margin: '0 0 12px 0', 
                color: 'var(--color-muted)', 
                fontSize: '0.9em',
                lineHeight: '1.4'
            }}>
                {project.description}
            </p>
            
            <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.8em', color: 'var(--color-muted)' }}>Progreso</span>
                    <span style={{ fontSize: '0.8em', fontWeight: '500' }}>{Math.round(progress)}%</span>
                </div>
                <div style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: 'var(--color-muted)',
                    borderRadius: '3px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: `${progress}%`,
                        height: '100%',
                        backgroundColor: 'var(--color-accent)',
                        transition: 'width 0.3s ease'
                    }} />
                </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8em', marginBottom: '12px' }}>
                <div style={{ color: 'var(--color-muted)' }}>
                    <span>{project.tasks?.length || 0} tareas</span>
                    {project.estimatedHours > 0 && (
                        <span style={{ marginLeft: '12px' }}>
                            {project.estimatedHours}h estimadas
                        </span>
                    )}
                    {project.currentSprint && (
                        <span style={{ marginLeft: '12px', color: '#ff9800', fontWeight: 'bold' }}>
                            🚀 Sprint activo
                        </span>
                    )}
                </div>
                
                {daysUntilDeadline !== null && (
                    <span style={{
                        color: daysUntilDeadline < 0 ? '#f44336' : 
                               daysUntilDeadline <= 3 ? '#ff9800' : 'var(--color-muted)',
                        fontWeight: '500'
                    }}>
                        {daysUntilDeadline < 0 ? 'Vencido' : 
                         daysUntilDeadline === 0 ? 'Vence hoy' :
                         `${daysUntilDeadline} días`}
                    </span>
                )}
            </div>

            {/* Información adicional */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                gap: '8px',
                marginBottom: '12px',
                fontSize: '0.8em'
            }}>
                <div>
                    <div style={{ color: '#666' }}>Sprints</div>
                    <div style={{ fontWeight: 'bold' }}>{project.sprints?.length || 0}</div>
                </div>
                <div>
                    <div style={{ color: '#666' }}>Equipo</div>
                    <div style={{ fontWeight: 'bold' }}>{project.team?.length || 0} miembros</div>
                </div>
                <div>
                    <div style={{ color: '#666' }}>Presupuesto</div>
                    <div style={{ fontWeight: 'bold' }}>${project.budget || 0}</div>
                </div>
                <div>
                    <div style={{ color: '#666' }}>Velocidad</div>
                    <div style={{ fontWeight: 'bold' }}>{project.velocity?.toFixed(1) || 0}</div>
                </div>
            </div>
            
            <div style={{ 
                display: 'flex', 
                gap: '8px', 
                justifyContent: 'flex-end'
            }}>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(project);
                    }}
                    style={{
                        padding: '6px 12px',
                        fontSize: '0.8em',
                        backgroundColor: 'var(--color-accent)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Editar
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(project.id);
                    }}
                    style={{
                        padding: '6px 12px',
                        fontSize: '0.8em',
                        backgroundColor: '#f44336',
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
    );
}

ProjectCard.propTypes = {
    project: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        status: PropTypes.oneOf(['active', 'completed', 'paused']).isRequired,
        priority: PropTypes.oneOf(['high', 'medium', 'low']),
        createdAt: PropTypes.instanceOf(Date).isRequired,
        updatedAt: PropTypes.instanceOf(Date).isRequired,
        deadline: PropTypes.instanceOf(Date),
        estimatedHours: PropTypes.number,
        actualHours: PropTypes.number,
        tasks: PropTypes.array,
        sprints: PropTypes.array,
        currentSprint: PropTypes.object,
        team: PropTypes.array,
        budget: PropTypes.number,
        actualCost: PropTypes.number,
        velocity: PropTypes.number
    }).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onViewDetails: PropTypes.func.isRequired,
    viewMode: PropTypes.oneOf(['list', 'kanban', 'timeline'])
};

export default ProjectCard; 