'use client'

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import ProjectCard from './ProjectCard';
import ProjectForm from './ProjectForm';
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
                deadline: project.deadline ? new Date(project.deadline) : null
            })) : [];
        } catch (error) {
            console.error('Error reading projects from cookies:', error);
            return [];
        }
    });

    const [showForm, setShowForm] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [sortBy, setSortBy] = useState('updatedAt');
    const [filterStatus, setFilterStatus] = useState('all');

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
            tasks: []
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
        }
    };

    const handleEditProject = (project) => {
        setEditingProject(project);
        setShowForm(true);
    };

    const handleViewProjectDetails = (project) => {
        // Aquí podrías navegar a una página de detalles o abrir un modal
        console.log('Ver detalles del proyecto:', project);
        // Por ahora, solo mostraremos un alert con la información
        alert(`Proyecto: ${project.name}\nDescripción: ${project.description}\nEstado: ${project.status}`);
    };

    const filteredAndSortedProjects = projectUtils.sortProjects(
        projects.filter(project => filterStatus === 'all' || project.status === filterStatus),
        sortBy
    );

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
        <div className="minimal-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ margin: 0 }}>Mis Proyectos</h2>
                <button
                    onClick={() => setShowForm(true)}
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
                    + Nuevo Proyecto
                </button>
            </div>

            {projects.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--color-muted)' }}>
                    <h3 style={{ marginBottom: '12px' }}>No tienes proyectos aún</h3>
                    <p style={{ marginBottom: '24px' }}>
                        Crea tu primer proyecto para organizar mejor tus tareas y objetivos.
                    </p>
                    <button
                        onClick={() => setShowForm(true)}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: 'var(--color-accent)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        Crear Primer Proyecto
                    </button>
                </div>
            ) : (
                <>
                    <div style={{ 
                        display: 'flex', 
                        gap: '16px', 
                        marginBottom: '20px',
                        flexWrap: 'wrap'
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
                            </select>
                        </div>

                        <div style={{ flex: 1, minWidth: '200px' }}>
                            <label style={{ 
                                display: 'block', 
                                marginBottom: '6px', 
                                fontSize: '14px',
                                fontWeight: '500'
                            }}>
                                Filtrar por estado:
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
                    </div>

                    <div style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--color-muted)' }}>
                        {filteredAndSortedProjects.length} proyecto{filteredAndSortedProjects.length !== 1 ? 's' : ''} encontrado{filteredAndSortedProjects.length !== 1 ? 's' : ''}
                    </div>

                    <div>
                        {filteredAndSortedProjects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onEdit={handleEditProject}
                                onDelete={handleDeleteProject}
                                onViewDetails={handleViewProjectDetails}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default ProjectBoard; 