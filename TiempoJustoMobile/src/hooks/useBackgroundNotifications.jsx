import { useEffect, useRef, useCallback } from 'react';
import { AppState } from 'react-native';
import { useAppContext } from '../context/AppContext';
import backgroundService from '../services/backgroundService';

export const useBackgroundNotifications = (lastActivityAt) => {
    const { tasks } = useAppContext();
    const appState = useRef(AppState.currentState);
    const notificationTimeout = useRef(null);
    const subscriptionRef = useRef(null);

    // Memoizar la función de programación de notificaciones
    const scheduleBackgroundNotifications = useCallback(() => {
        // Verificar tareas importantes pendientes
        const importantTasks = tasks?.filter(task => 
            !task.done && (task.priority === 'A' || task.priority === 'B')
        ) || [];

        if (importantTasks.length > 0) {
            // Programar notificación después de 30 minutos de inactividad
            notificationTimeout.current = setTimeout(() => {
                console.log(`Tienes ${importantTasks.length} tareas importantes pendientes`);
                // Aquí podrías mostrar una notificación push real
                showBackgroundNotification(importantTasks);
            }, 30 * 60 * 1000); // 30 minutos
        }
    }, [tasks]);

    const showBackgroundNotification = useCallback((importantTasks) => {
        // Simular notificación (en una implementación real usarías expo-notifications)
        const taskNames = importantTasks.slice(0, 3).map(t => t.title).join(', ');
        const message = importantTasks.length > 3 
            ? `Tienes ${importantTasks.length} tareas importantes pendientes: ${taskNames}...`
            : `Tareas pendientes: ${taskNames}`;
            
        console.log('Notificación en segundo plano:', message);
        
        // Aquí podrías integrar con expo-notifications para notificaciones reales
        // Notifications.scheduleNotificationAsync({
        //     content: {
        //         title: "TiempoJusto - Tareas Pendientes",
        //         body: message,
        //     },
        //     trigger: null,
        // });
    }, []);

    useEffect(() => {
        const handleAppStateChange = (nextAppState) => {
            if (appState.current && appState.current.match(/inactive|background/) && nextAppState && nextAppState === 'active') {
                // App vuelve al primer plano
                if (notificationTimeout.current) {
                    clearTimeout(notificationTimeout.current);
                    notificationTimeout.current = null;
                }
            } else if (appState.current && appState.current === 'active' && nextAppState && nextAppState.match(/inactive|background/)) {
                // App va al segundo plano - programar notificaciones
                scheduleBackgroundNotifications();
            }
            
            appState.current = nextAppState;
        };

        try {
            // Usar el nuevo API de addEventListener
            subscriptionRef.current = AppState.addEventListener('change', handleAppStateChange);
        } catch (error) {
            console.error('Error configurando listener de AppState:', error);
        }

        return () => {
            try {
                // Usar el nuevo método remove() en lugar de removeEventListener
                if (subscriptionRef.current && typeof subscriptionRef.current.remove === 'function') {
                    subscriptionRef.current.remove();
                }
            } catch (error) {
                console.error('Error removiendo subscription:', error);
            }
            if (notificationTimeout.current) {
                clearTimeout(notificationTimeout.current);
            }
        };
    }, [scheduleBackgroundNotifications]);

    return {
        scheduleBackgroundNotifications,
        showBackgroundNotification
    };
};
