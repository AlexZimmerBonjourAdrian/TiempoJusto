import React, { createContext, useContext, useMemo, useCallback, useState, useEffect } from 'react';
import { useAsyncStorageState } from '../storage';
import adService from '../features/ads/services/adService';
import eventBus from '../shared/eventBus';

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
    const [appState, setAppState, { error: storageError, isLoading }] = useAsyncStorageState('TJ_UI_STATE', initialState);
    
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
    
    // Acciones de tareas/proyectos/pomodoro movidas a Providers por slice
    
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
        // Computados de proyectos/tareas movidos a sus slices
    }), []);

    // 11. Valor del contexto - estructura consistente
    const value = useMemo(() => ({
        // Estado local
        showSplash,
        activeTab,
        pomodoroNotification,
        lastActivityAt,
        
        // Estado persistido
        dailyLogs: appState.dailyLogs || [],
        milestones: appState.milestones || [],
        
        // Acciones
        setActiveTab: setActiveTabAction,
        setShowSplash: setShowSplashAction,
        setPomodoroNotification: setPomodoroNotificationAction,
        setLastActivity: setLastActivityAction,
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
        setActiveTabAction,
        setShowSplashAction,
        setPomodoroNotificationAction,
        setLastActivityAction,
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
