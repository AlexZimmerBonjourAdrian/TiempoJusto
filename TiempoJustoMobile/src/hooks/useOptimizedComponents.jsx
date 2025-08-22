import { useMemo, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { useState } from 'react';

// Hook para filtrar y ordenar tareas de manera optimizada
export function useFilteredTasks(filterProjectId = null) {
    const { tasks } = useAppContext();
    
    return useMemo(() => {
        let filtered = tasks || [];
        
        if (filterProjectId !== null) {
            filtered = filtered.filter(task => task.projectId === filterProjectId);
        }
        
        return filtered;
    }, [tasks, filterProjectId]);
}

// Hook para tareas ordenadas por prioridad y estado
export function useSortedTasks(tasks) {
    return useMemo(() => {
        if (!Array.isArray(tasks)) return [];
        
        return [...tasks].sort((a, b) => {
            // Primero por completadas
            if (a.done !== b.done) return Number(a.done) - Number(b.done);
            // Luego por prioridad (A, B, C, D)
            const priorityOrder = { A: 0, B: 1, C: 2, D: 3 };
            const aPriority = priorityOrder[a.priority || 'C'];
            const bPriority = priorityOrder[b.priority || 'C'];
            return aPriority - bPriority;
        });
    }, [tasks]);
}

// Hook para estadísticas de tareas
export function useTaskStats(tasks) {
    return useMemo(() => {
        if (!Array.isArray(tasks)) {
            return {
                total: 0,
                completed: 0,
                pending: 0,
                completionRate: 0,
                priorityBreakdown: { A: 0, B: 0, C: 0, D: 0 }
            };
        }
        
        const total = tasks.length;
        const completed = tasks.filter(task => task.done).length;
        const pending = total - completed;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        const priorityBreakdown = { A: 0, B: 0, C: 0, D: 0 };
        tasks.forEach(task => {
            const priority = task.priority || 'C';
            if (priorityBreakdown.hasOwnProperty(priority)) {
                priorityBreakdown[priority]++;
            }
        });
        
        return {
            total,
            completed,
            pending,
            completionRate,
            priorityBreakdown
        };
    }, [tasks]);
}

// Hook para estadísticas de proyectos
export function useProjectStats(projects, tasks) {
    return useMemo(() => {
        if (!Array.isArray(projects) || !Array.isArray(tasks)) {
            return {};
        }
        
        const projectStats = {};
        
        projects.forEach(project => {
            const projectTasks = tasks.filter(task => task.projectId === project.id);
            const completed = projectTasks.filter(task => task.done).length;
            const total = projectTasks.length;
            
            projectStats[project.id] = {
                total,
                completed,
                pending: total - completed,
                completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
            };
        });
        
        return projectStats;
    }, [projects, tasks]);
}

// Hook para acciones de tareas optimizadas
export function useTaskActions() {
    const { addTask, toggleTask, removeTask, updateTask, setLastActivity } = useAppContext();
    
    const handleAddTask = useCallback(async (taskData) => {
        try {
            await addTask(taskData);
            setLastActivity();
        } catch (error) {
            console.error('Error in handleAddTask:', error);
            throw error;
        }
    }, [addTask, setLastActivity]);
    
    const handleToggleTask = useCallback(async (taskId) => {
        try {
            await toggleTask(taskId);
            setLastActivity();
        } catch (error) {
            console.error('Error in handleToggleTask:', error);
            throw error;
        }
    }, [toggleTask, setLastActivity]);
    
    const handleRemoveTask = useCallback(async (taskId) => {
        try {
            await removeTask(taskId);
            setLastActivity();
        } catch (error) {
            console.error('Error in handleRemoveTask:', error);
            throw error;
        }
    }, [removeTask, setLastActivity]);
    
    const handleUpdateTask = useCallback(async (taskId, updates) => {
        try {
            await updateTask(taskId, updates);
            setLastActivity();
        } catch (error) {
            console.error('Error in handleUpdateTask:', error);
            throw error;
        }
    }, [updateTask, setLastActivity]);
    
    return {
        handleAddTask,
        handleToggleTask,
        handleRemoveTask,
        handleUpdateTask
    };
}

// Hook para acciones de proyectos optimizadas
export function useProjectActions() {
    const { addProject, completeProject, removeProject, setLastActivity } = useAppContext();
    
    const handleAddProject = useCallback(async (projectData) => {
        try {
            await addProject(projectData);
            setLastActivity();
        } catch (error) {
            console.error('Error in handleAddProject:', error);
            throw error;
        }
    }, [addProject, setLastActivity]);
    
    const handleCompleteProject = useCallback(async (projectId) => {
        try {
            await completeProject(projectId);
            setLastActivity();
        } catch (error) {
            console.error('Error in handleCompleteProject:', error);
            throw error;
        }
    }, [completeProject, setLastActivity]);
    
    const handleRemoveProject = useCallback(async (projectId) => {
        try {
            await removeProject(projectId);
            setLastActivity();
        } catch (error) {
            console.error('Error in handleRemoveProject:', error);
            throw error;
        }
    }, [removeProject, setLastActivity]);
    
    return {
        handleAddProject,
        handleCompleteProject,
        handleRemoveProject
    };
}

// Hook para datos de navegación
export function useNavigationData() {
    const { activeTab, setActiveTab } = useAppContext();
    
    const tabData = useMemo(() => [
        {
            id: 'tareas',
            label: 'Tareas',
            legend: 'Diario',
            isActive: activeTab === 'tareas',
            isRunning: false
        },
        {
            id: 'pomodoro',
            label: 'Timer',
            legend: 'Pomodoro',
            isActive: activeTab === 'pomodoro',
            isRunning: false
        },
        {
            id: 'proyectos',
            label: 'Proyectos',
            legend: 'Organización',
            isActive: activeTab === 'proyectos',
            isRunning: false
        },
        {
            id: 'analiticas',
            label: 'Stats',
            legend: 'Análisis',
            isActive: activeTab === 'analiticas',
            isRunning: false
        }
    ], [activeTab]);
    
    const handleTabPress = useCallback((tabId) => {
        setActiveTab(tabId);
    }, [setActiveTab]);
    
    return {
        tabData,
        handleTabPress
    };
}

// Hook para datos de notificaciones
export function useNotificationData() {
    const { pomodoroNotification, setPomodoroNotification } = useAppContext();
    
    const handleClosePomodoroNotification = useCallback(() => {
        setPomodoroNotification({ visible: false, mode: null });
    }, [setPomodoroNotification]);
    
    return {
        pomodoroNotification,
        handleClosePomodoroNotification
    };
}

// Hook para validación de datos
export function useDataValidation() {
    const validateTaskData = useCallback((task) => {
        const errors = [];
        
        if (!task.title || task.title.trim().length === 0) {
            errors.push('El título es requerido');
        }
        
        if (task.title && task.title.length > 200) {
            errors.push('El título no puede tener más de 200 caracteres');
        }
        
        if (!['A', 'B', 'C', 'D'].includes(task.priority)) {
            errors.push('La prioridad debe ser A, B, C o D');
        }
        
        return errors;
    }, []);
    
    const validateProjectData = useCallback((project) => {
        const errors = [];
        
        if (!project.name || project.name.trim().length === 0) {
            errors.push('El nombre del proyecto es requerido');
        }
        
        if (project.name && project.name.length > 100) {
            errors.push('El nombre no puede tener más de 100 caracteres');
        }
        
        return errors;
    }, []);
    
    return {
        validateTaskData,
        validateProjectData
    };
}
