import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { useAsyncStorageState, validateProject } from '../../../storage';
import eventBus from '../../../shared/eventBus';
import { useTasksContext } from '../../tasks/state/TasksProvider';

const ProjectsContext = createContext(null);

export function useProjectsContext() {
    const ctx = useContext(ProjectsContext);
    if (!ctx) throw new Error('useProjectsContext debe usarse dentro de ProjectsProvider');
    return ctx;
}

export function ProjectsProvider({ children }) {
    const [projects, setProjects, { error, isLoading }] = useAsyncStorageState('TJ_PROJECTS_STATE', []);
    const { tasks } = useTasksContext();

    const projectIdToTaskCount = useMemo(() => (tasks || []).reduce((acc, t) => {
        if (t.projectId) acc[t.projectId] = (acc[t.projectId] || 0) + 1;
        return acc;
    }, {}), [tasks]);

    const addProject = useCallback((project) => {
        const normalizedProject = { name: (project?.name || '').trim() };
        const errors = validateProject(normalizedProject);
        if (errors.length > 0) return { ok: false, errors };
        const newProject = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
            ...normalizedProject,
            createdAt: new Date().toISOString(),
        };
        setProjects(prev => ([...(prev || []), newProject]));
        return { ok: true, project: newProject };
    }, [setProjects]);

    const completeProject = useCallback((projectId) => {
        const completedAt = new Date().toISOString();
        setProjects(prev => (prev || []).map(p => p.id === projectId ? { ...p, completedAt, status: 'completed' } : p));
        try { eventBus.emit('project:completed', { projectId }); } catch {}
    }, [setProjects]);

    const removeProject = useCallback((projectId) => {
        setProjects(prev => (prev || []).filter(p => p.id !== projectId));
        // Las tareas se limpian desde TasksProvider si decides implementar limpieza cruzada
    }, [setProjects]);

    const value = useMemo(() => ({
        projects: projects || [],
        projectIdToTaskCount,
        addProject,
        completeProject,
        removeProject,
        isLoading,
        error,
    }), [projects, projectIdToTaskCount, addProject, completeProject, removeProject, isLoading, error]);

    return (
        <ProjectsContext.Provider value={value}>
            {children}
        </ProjectsContext.Provider>
    );
}


