'use client'

import React from 'react';
import PropTypes from 'prop-types';
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS } from '../../../constants';
import { projectUtils } from '../../../utils';

function ProjectCard({ project, onEdit, onDelete, onViewDetails }) {
    const progress = projectUtils.calculateProgress(project);
    const daysUntilDeadline = projectUtils.getDaysUntilDeadline(project.deadline);
    
    return (
        <div className="minimal-card" style={{ 
            marginBottom: '16px', 
            cursor: 'pointer',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
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
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8em' }}>
                <div style={{ color: 'var(--color-muted)' }}>
                    <span>{project.tasks?.length || 0} tareas</span>
                    {project.estimatedHours > 0 && (
                        <span style={{ marginLeft: '12px' }}>
                            {project.estimatedHours}h estimadas
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
            
            <div style={{ 
                display: 'flex', 
                gap: '8px', 
                marginTop: '12px',
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
        createdAt: PropTypes.instanceOf(Date).isRequired,
        updatedAt: PropTypes.instanceOf(Date).isRequired,
        deadline: PropTypes.instanceOf(Date),
        estimatedHours: PropTypes.number,
        actualHours: PropTypes.number,
        tasks: PropTypes.array
    }).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onViewDetails: PropTypes.func.isRequired
};

export default ProjectCard; 