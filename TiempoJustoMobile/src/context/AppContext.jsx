import React, { createContext, useContext, useMemo, useCallback, useState, useEffect } from 'react';
import { useAsyncStorageState, validateTask, validateProject, validatePomodoroSettings } from '../storage';
import adService from '../services/adService';
import eventBus from '../services/eventBus';

// Estado inicial
const initialState = {
    showSplash: true,
    activeTab: 'tareas',
    pomodoroNotification: { visible: false, mode: null },
    lastActivityAt: Date.now(),
    tasks: [],
    projects: [],
    dailyLogs: [],
    milestones: [],
    pomodoroSettings: { focusMinutes: 25, shortBreakMinutes: 5, longBreakMinutes: 15 },
};

// Crear el contexto
const AppContext = createContext();

// Hook personalizado para usar el contexto
export function useAppContext() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext debe ser usado dentro de un AppProvider');
    }
    return context;
}

// Provider del contexto
export function AppProvider({ children }) {
    // 1. Estado unificado con AsyncStorage
    const [appState, setAppState, { error: storageError, isLoading }] = useAsyncStorageState('TJ_APP_STATE', initialState);
    
    // 2. Estado local para UI (no persistido) - orden consistente
    const [showSplash, setShowSplash] = useState(true);
    const [activeTab, setActiveTab] = useState('tareas');
    const [pomodoroNotification, setPomodoroNotification] = useState({ visible: false, mode: null });
    const [lastActivityAt, setLastActivityAt] = useState(Date.now());

    // 3. Sincronizar estado local con estado persistido
    useEffect(() => {
        if (!isLoading && appState) {
            setShowSplash(appState.showSplash);
            setActiveTab(appState.activeTab);
            setPomodoroNotification(appState.pomodoroNotification);
            setLastActivityAt(appState.lastActivityAt);
        }
    }, [isLoading, appState]);

    // 4. Mostrar errores de storage
    useEffect(() => {
        if (storageError) {
            console.error('Storage error:', storageError);
        }
    }, [storageError]);

    // 5. Acciones de navegación y UI
    const setActiveTabAction = useCallback((tab) => {
        setActiveTab(tab);
        setAppState(prev => ({ ...prev, activeTab: tab }));
    }, [setAppState]);
    
    const setShowSplashAction = useCallback((show) => {
        setShowSplash(show);
        setAppState(prev => ({ ...prev, showSplash: show }));
    }, [setAppState]);
    
    const setPomodoroNotificationAction = useCallback((notification) => {
        setPomodoroNotification(notification);
        setAppState(prev => ({ ...prev, pomodoroNotification: notification }));
    }, [setAppState]);
    
    const setLastActivityAction = useCallback(() => {
        const now = Date.now();
        setLastActivityAt(now);
        setAppState(prev => ({ ...prev, lastActivityAt: now }));
    }, [setAppState]);
    
    // 6. Acciones de tareas
    const addTask = useCallback((task) => {
        const normalizedTask = {
            title: (task?.title || '').trim(),
            projectId: task?.projectId ?? null,
            priority: ['A', 'B', 'C', 'D'].includes(task?.priority) ? task.priority : 'C',
            description: task?.description,
            done: false,
        };

        const errors = validateTask(normalizedTask);
        if (errors.length > 0) {
            return { ok: false, errors };
        }

        const newTask = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
            ...normalizedTask,
            createdAt: new Date().toISOString(),
        };
        
        setAppState(prev => ({
            ...prev,
            tasks: [...(prev.tasks || []), newTask],
            lastActivityAt: Date.now()
        }));

        return { ok: true, task: newTask };
    }, [setAppState]);
    
    const toggleTask = useCallback((taskId) => {
        setAppState(prev => {
            const updatedTasks = (prev.tasks || []).map(task => {
                if (task.id === taskId) {
                    const newDone = !task.done;
                    const updated = {
                        ...task,
                        done: newDone,
                        completedAt: newDone ? new Date().toISOString() : null
                    };
                    try { eventBus.emit('task:toggled', { task: updated }); } catch {}
                    return updated;
                }
                return task;
            });

            return {
                ...prev,
                tasks: updatedTasks,
                lastActivityAt: Date.now()
            };
        });
    }, [setAppState]);
    
    const removeTask = useCallback((taskId) => {
        setAppState(prev => ({
            ...prev,
            tasks: (prev.tasks || []).filter(task => task.id !== taskId),
            lastActivityAt: Date.now()
        }));
    }, [setAppState]);
    
    const updateTask = useCallback((taskId, updates) => {
        let result = { ok: false, errors: [] };
        setAppState(prev => {
            const existingTask = (prev.tasks || []).find(t => t.id === taskId);
            if (!existingTask) {
                result = { ok: false, errors: ['Tarea no encontrada'] };
                return prev;
            }

            const mergedTask = { ...existingTask, ...updates };
            const errors = validateTask(mergedTask);
            if (errors.length > 0) {
                result = { ok: false, errors };
                return prev;
            }

            result = { ok: true };
            return {
                ...prev,
                tasks: (prev.tasks || []).map(task => 
                    task.id === taskId ? mergedTask : task
                ),
                lastActivityAt: Date.now()
            };
        });
        return result;
    }, [setAppState]);
    
    // 7. Acciones de proyectos
    const addProject = useCallback((project) => {
        const normalizedProject = {
            name: (project?.name || '').trim(),
        };

        const errors = validateProject(normalizedProject);
        if (errors.length > 0) {
            return { ok: false, errors };
        }

        const newProject = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
            ...normalizedProject,
            createdAt: new Date().toISOString(),
        };
        
        setAppState(prev => ({
            ...prev,
            projects: [...(prev.projects || []), newProject],
            lastActivityAt: Date.now()
        }));

        return { ok: true, project: newProject };
    }, [setAppState]);
    
    const completeProject = useCallback((projectId) => {
        const project = (appState.projects || []).find(p => p.id === projectId);
        if (!project) return;
        
        const completedAt = new Date().toISOString();
        const milestone = {
            id: `${projectId}-${completedAt}`,
            projectId,
            name: project.name,
            completedAt
        };
        
        setAppState(prev => ({
            ...prev,
            projects: (prev.projects || []).map(p => 
                p.id === projectId ? { ...p, completedAt, status: 'completed' } : p
            ),
            milestones: [...(prev.milestones || []), milestone],
            lastActivityAt: Date.now()
        }));

        try { eventBus.emit('project:completed', { projectId }); } catch {}
    }, [appState.projects, setAppState]);
    
    const removeProject = useCallback((projectId) => {
        setAppState(prev => ({
            ...prev,
            projects: (prev.projects || []).filter(p => p.id !== projectId),
            tasks: (prev.tasks || []).filter(t => t.projectId !== projectId),
            lastActivityAt: Date.now()
        }));
    }, [setAppState]);
    
    // 8. Acciones de configuración
    const updatePomodoroSettings = useCallback((settings) => {
        const errors = validatePomodoroSettings(settings);
        if (errors.length > 0) {
            return { ok: false, errors };
        }

        setAppState(prev => ({ ...prev, pomodoroSettings: settings }));
        return { ok: true };
    }, [setAppState]);
    
    // 9. Acción de archivar día
    const archiveToday = useCallback(() => {
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];

        const todayTasks = (appState.tasks || []).filter((t) => {
            const dateStr = t.createdAt ? new Date(t.createdAt).toISOString().split('T')[0] : todayString;
            return dateStr === todayString;
        });

        const completed = todayTasks.filter((t) => t.done);
        const completionRate = todayTasks.length ? Math.round((completed.length / todayTasks.length) * 100) : 0;

        const priorityBreakdown = { A: 0, B: 0, C: 0, D: 0 };
        for (const t of todayTasks) {
            const p = t.priority || 'C';
            priorityBreakdown[p]++;
        }

        const projectBreakdown = {};
        for (const t of todayTasks) {
            const projectName = t.projectId ? ((appState.projects || []).find(p=>p.id===t.projectId)?.name || 'Sin proyecto') : 'Sin proyecto';
            if (!projectBreakdown[projectName]) projectBreakdown[projectName] = { total: 0, completed: 0 };
            projectBreakdown[projectName].total++;
            if (t.done) projectBreakdown[projectName].completed++;
        }

        let productivityScore = 0;
        for (const t of completed) {
            const p = t.priority || 'C';
            productivityScore += p === 'A' ? 10 : p === 'B' ? 7 : p === 'C' ? 4 : 1;
        }

        const logEntry = {
            date: todayString,
            totalTasks: todayTasks.length,
            completedTasks: completed.length,
            completionRate,
            productivityScore,
            priorityBreakdown,
            projectBreakdown,
        };

        setAppState(prev => {
            const newDailyLogs = [...(prev.dailyLogs || [])];
            const idx = newDailyLogs.findIndex((e) => e.date === todayString);
            if (idx >= 0) newDailyLogs[idx] = logEntry; 
            else newDailyLogs.push(logEntry);

            // Mantener solo tareas que NO sean del día archivado, es decir,
            // eliminar las tareas creadas hoy (independientemente de proyecto)
            const filteredTasks = (prev.tasks || []).filter((t) => {
                const dateStr = t.createdAt ? new Date(t.createdAt).toISOString().split('T')[0] : todayString;
                return dateStr !== todayString;
            });
            
            return {
                ...prev,
                dailyLogs: newDailyLogs,
                tasks: filteredTasks,
                activeTab: 'analiticas'
            };
        });
    }, [appState.tasks, appState.projects, setAppState]);

    // 10. Computed values - al final para evitar problemas de dependencias
    const computed = useMemo(() => ({
        projectIdToProject: (appState.projects || []).reduce((acc, project) => {
            acc[project.id] = project;
            return acc;
        }, {}),
        
        projectIdToTaskCount: (appState.tasks || []).reduce((acc, task) => {
            if (task.projectId) {
                acc[task.projectId] = (acc[task.projectId] || 0) + 1;
            }
            return acc;
        }, {}),
        
        projectTasks: (appState.tasks || []).reduce((acc, task) => {
            if (task.projectId) {
                if (!acc[task.projectId]) {
                    acc[task.projectId] = [];
                }
                acc[task.projectId].push(task);
            }
            return acc;
        }, {}),
    }), [appState.projects, appState.tasks]);

    // 11. Valor del contexto - estructura consistente
    const value = useMemo(() => ({
        // Estado local
        showSplash,
        activeTab,
        pomodoroNotification,
        lastActivityAt,
        
        // Estado persistido
        tasks: appState.tasks || [],
        projects: appState.projects || [],
        dailyLogs: appState.dailyLogs || [],
        milestones: appState.milestones || [],
        pomodoroSettings: appState.pomodoroSettings || { focusMinutes: 25, shortBreakMinutes: 5, longBreakMinutes: 15 },
        
        // Acciones
        setActiveTab: setActiveTabAction,
        setShowSplash: setShowSplashAction,
        setPomodoroNotification: setPomodoroNotificationAction,
        setLastActivity: setLastActivityAction,
        addTask,
        toggleTask,
        removeTask,
        updateTask,
        addProject,
        completeProject,
        removeProject,
        updatePomodoroSettings,
        archiveToday,
        
        // Computed values
        ...computed,
        
        // Estado de carga
        isLoading,
        storageError,
    }), [
        showSplash,
        activeTab,
        pomodoroNotification,
        lastActivityAt,
        appState.tasks,
        appState.projects,
        appState.dailyLogs,
        appState.milestones,
        appState.pomodoroSettings,
        setActiveTabAction,
        setShowSplashAction,
        setPomodoroNotificationAction,
        setLastActivityAction,
        addTask,
        toggleTask,
        removeTask,
        updateTask,
        addProject,
        completeProject,
        removeProject,
        updatePomodoroSettings,
        archiveToday,
        computed,
        isLoading,
        storageError
    ]);

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}
