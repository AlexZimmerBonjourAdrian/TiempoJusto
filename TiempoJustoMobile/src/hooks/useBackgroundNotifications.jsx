import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import backgroundService from '../services/backgroundService';

export const useBackgroundNotifications = (tasks, lastActivityAt) => {
    const appState = useRef(AppState.currentState);
    const notificationTimeout = useRef(null);

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

        let subscription;
        try {
            subscription = AppState.addEventListener('change', handleAppStateChange);
        } catch (error) {
            console.error('Error configurando listener de AppState:', error);
        }

        return () => {
            try {
                subscription?.remove();
            } catch (error) {
                console.error('Error removiendo subscription:', error);
            }
            if (notificationTimeout.current) {
                clearTimeout(notificationTimeout.current);
            }
        };
    }, [tasks, lastActivityAt]);

    const scheduleBackgroundNotifications = () => {
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
    };

    const showBackgroundNotification = (importantTasks) => {
        // Simular notificación (en una implementación real usarías expo-notifications)
        const taskNames = importantTasks.slice(0, 3).map(t => t.title).join(', ');
        const message = importantTasks.length > 3 
            ? `Tienes ${importantTasks.length} tareas importantes pendientes: ${taskNames}...`
            : `Tareas pendientes: ${taskNames}`;
            
        console.log('🔔 Notificación en segundo plano:', message);
        
        // Aquí podrías integrar con expo-notifications para notificaciones reales
        // Notifications.scheduleNotificationAsync({
        //     content: {
        //         title: "TiempoJusto - Tareas Pendientes",
        //         body: message,
        //     },
        //     trigger: null,
        // });
    };

    return {
        scheduleBackgroundNotifications,
        showBackgroundNotification
    };
};
