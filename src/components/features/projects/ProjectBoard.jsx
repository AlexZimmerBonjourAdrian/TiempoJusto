'use client'

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import ProjectCard from './ProjectCard';
import ProjectForm from './ProjectForm';
import ProjectDetailView from './ProjectDetailView';
import { STORAGE_KEYS } from '../../../constants';
import { projectUtils } from '../../../utils';

function ProjectBoard() {
    const [projects, setProjects] = useState(() => {
        try {
            const savedProjects = Cookies.get(STORAGE_KEYS.projects);
            return savedProjects ? JSON.parse(savedProjects).map(project => ({
                ...project,
                createdAt: new Date(project.createdAt),
                updatedAt: new Date(project.updatedAt),
                deadline: project.deadline ? new Date(project.deadline) : null,
                sprints: project.sprints || [],
                currentSprint: project.currentSprint || null,
                tasks: project.tasks || [],
                team: project.team || [],
                budget: project.budget || 0,
                actualCost: project.actualCost || 0
            })) : [];
        } catch (error) {
            console.error('Error reading projects from cookies:', error);
            return [];
        }
    });

    const [showForm, setShowForm] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [viewMode, setViewMode] = useState('list'); // 'list', 'kanban', 'timeline'
    const [sortBy, setSortBy] = useState('updatedAt');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');

    useEffect(() => {
        try {
            Cookies.set(STORAGE_KEYS.projects, JSON.stringify(projects), { expires: 182 });
        } catch (error) {
            console.error('Error writing projects to cookies:', error);
        }
    }, [projects]);

    const handleCreateProject = (projectData) => {
        const newProject = {
            ...projectData,
            id: projectUtils.generateId(),
            createdAt: new Date(),
            updatedAt: new Date(),
            actualHours: 0,
            tasks: [],
            sprints: [],
            currentSprint: null,
            team: [],
            budget: projectData.budget || 0,
            actualCost: 0,
            progress: 0,
            velocity: 0,
            burndown: [],
            risks: [],
            milestones: []
        };

        setProjects(prev => [...prev, newProject]);
        setShowForm(false);
    };

    const handleUpdateProject = (projectData) => {
        setProjects(prev => prev.map(project => 
            project.id === editingProject.id 
                ? { ...project, ...projectData, updatedAt: new Date() }
                : project
        ));
        setEditingProject(null);
        setShowForm(false);
    };

    const handleDeleteProject = (projectId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este proyecto? Esta acción no se puede deshacer.')) {
            setProjects(prev => prev.filter(project => project.id !== projectId));
            if (selectedProject?.id === projectId) {
                setSelectedProject(null);
            }
        }
    };

    const handleEditProject = (project) => {
        setEditingProject(project);
        setShowForm(true);
    };

    const handleViewProjectDetails = (project) => {
        setSelectedProject(project);
    };

    const handleBackToList = () => {
        setSelectedProject(null);
    };

    const handleProjectUpdate = (updatedProject) => {
        setProjects(prev => prev.map(project => 
            project.id === updatedProject.id ? updatedProject : project
        ));
        setSelectedProject(updatedProject);
    };

    const filteredAndSortedProjects = projectUtils.sortProjects(
        projects.filter(project => {
            const statusMatch = filterStatus === 'all' || project.status === filterStatus;
            const priorityMatch = filterPriority === 'all' || project.priority === filterPriority;
            return statusMatch && priorityMatch;
        }),
        sortBy
    );

    // Si hay un proyecto seleccionado, mostrar vista detallada
    if (selectedProject) {
        return (
            <ProjectDetailView 
                project={selectedProject}
                onBack={handleBackToList}
                onUpdate={handleProjectUpdate}
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
            />
        );
    }

    if (showForm) {
        return (
            <div className="minimal-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <ProjectForm
                    project={editingProject}
                    onSubmit={editingProject ? handleUpdateProject : handleCreateProject}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingProject(null);
                    }}
                />
            </div>
        );
    }

    return (
        <div className="minimal-card" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ margin: 0, marginBottom: '8px' }}>🚀 Gestión de Proyectos</h2>
                    <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '0.9em' }}>
                        Gestiona tus proyectos con metodología ágil y seguimiento completo
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: 'var(--color-accent)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <span>+</span>
                    Nuevo Proyecto
                </button>
            </div>

            {/* Filtros y controles */}
            <div style={{ 
                display: 'flex', 
                gap: '16px', 
                marginBottom: '20px',
                flexWrap: 'wrap',
                alignItems: 'center'
            }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ 
                        display: 'block', 
                        marginBottom: '6px', 
                        fontSize: '14px',
                        fontWeight: '500'
                    }}>
                        Ordenar por:
                    </label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid var(--color-muted)',
                            borderRadius: '4px',
                            fontSize: '14px'
                        }}
                    >
                        <option value="updatedAt">Última actualización</option>
                        <option value="name">Nombre</option>
                        <option value="deadline">Fecha de vencimiento</option>
                        <option value="progress">Progreso</option>
                        <option value="priority">Prioridad</option>
                    </select>
                </div>

                <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ 
                        display: 'block', 
                        marginBottom: '6px', 
                        fontSize: '14px',
                        fontWeight: '500'
                    }}>
                        Estado:
                    </label>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid var(--color-muted)',
                            borderRadius: '4px',
                            fontSize: '14px'
                        }}
                    >
                        <option value="all">Todos</option>
                        <option value="active">Activos</option>
                        <option value="paused">Pausados</option>
                        <option value="completed">Completados</option>
                    </select>
                </div>

                <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ 
                        display: 'block', 
                        marginBottom: '6px', 
                        fontSize: '14px',
                        fontWeight: '500'
                    }}>
                        Prioridad:
                    </label>
                    <select
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid var(--color-muted)',
                            borderRadius: '4px',
                            fontSize: '14px'
                        }}
                    >
                        <option value="all">Todas</option>
                        <option value="high">Alta</option>
                        <option value="medium">Media</option>
                        <option value="low">Baja</option>
                    </select>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={() => setViewMode('list')}
                        style={{
                            padding: '8px 12px',
                            background: viewMode === 'list' ? 'var(--color-accent)' : '#f5f5f5',
                            color: viewMode === 'list' ? 'white' : '#333',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                        }}
                    >
                        📋 Lista
                    </button>
                    <button
                        onClick={() => setViewMode('kanban')}
                        style={{
                            padding: '8px 12px',
                            background: viewMode === 'kanban' ? 'var(--color-accent)' : '#f5f5f5',
                            color: viewMode === 'kanban' ? 'white' : '#333',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                        }}
                    >
                        🎯 Kanban
                    </button>
                    <button
                        onClick={() => setViewMode('timeline')}
                        style={{
                            padding: '8px 12px',
                            background: viewMode === 'timeline' ? 'var(--color-accent)' : '#f5f5f5',
                            color: viewMode === 'timeline' ? 'white' : '#333',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                        }}
                    >
                        📅 Timeline
                    </button>
                </div>
            </div>

            {/* Estadísticas generales */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '16px',
                marginBottom: '24px'
            }}>
                <div style={{
                    background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                    color: 'white',
                    padding: '16px',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '1.5em', marginBottom: '4px' }}>📁</div>
                    <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{projects.length}</div>
                    <div style={{ fontSize: '0.8em', opacity: 0.9 }}>Total Proyectos</div>
                </div>

                <div style={{
                    background: 'linear-gradient(135deg, #2196F3, #1976D2)',
                    color: 'white',
                    padding: '16px',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '1.5em', marginBottom: '4px' }}>🚀</div>
                    <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
                        {projects.filter(p => p.status === 'active').length}
                    </div>
                    <div style={{ fontSize: '0.8em', opacity: 0.9 }}>Activos</div>
                </div>

                <div style={{
                    background: 'linear-gradient(135deg, #FF9800, #F57C00)',
                    color: 'white',
                    padding: '16px',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '1.5em', marginBottom: '4px' }}>⏰</div>
                    <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
                        {projects.filter(p => p.currentSprint).length}
                    </div>
                    <div style={{ fontSize: '0.8em', opacity: 0.9 }}>En Sprint</div>
                </div>

                <div style={{
                    background: 'linear-gradient(135deg, #9C27B0, #7B1FA2)',
                    color: 'white',
                    padding: '16px',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '1.5em', marginBottom: '4px' }}>✅</div>
                    <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
                        {projects.filter(p => p.status === 'completed').length}
                    </div>
                    <div style={{ fontSize: '0.8em', opacity: 0.9 }}>Completados</div>
                </div>
            </div>

            {projects.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--color-muted)' }}>
                    <div style={{ fontSize: '4em', marginBottom: '16px' }}>🚀</div>
                    <h3 style={{ marginBottom: '12px' }}>No tienes proyectos aún</h3>
                    <p style={{ marginBottom: '24px', maxWidth: '400px', margin: '0 auto' }}>
                        Crea tu primer proyecto para organizar mejor tus tareas y objetivos con metodología ágil.
                    </p>
                    <button
                        onClick={() => setShowForm(true)}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: 'var(--color-accent)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: '600'
                        }}
                    >
                        Crear Primer Proyecto
                    </button>
                </div>
            ) : (
                <div style={{ 
                    display: viewMode === 'kanban' ? 'grid' : 'block',
                    gridTemplateColumns: viewMode === 'kanban' ? 'repeat(auto-fit, minmax(300px, 1fr))' : 'none',
                    gap: viewMode === 'kanban' ? '20px' : '16px'
                }}>
                    {filteredAndSortedProjects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onEdit={handleEditProject}
                            onDelete={handleDeleteProject}
                            onViewDetails={handleViewProjectDetails}
                            viewMode={viewMode}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProjectBoard; 