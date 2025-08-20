import { useState, useEffect, useRef } from 'react';

export function useMotivationalNotifications(tasks, lastActivityAt, options = {}) {
    const [showNotification, setShowNotification] = useState(false);
    const [notificationType, setNotificationType] = useState('general');
    const lastNotificationTime = useRef(0);
    const completedTasksCount = useRef(0);
    const autoHideTimerRef = useRef(null);

    const minIntervalMs = options.minIntervalMs ?? 2 * 60 * 60 * 1000; // 2 horas
    const idleThresholdMs = options.idleThresholdMs ?? 4 * 60 * 60 * 1000; // 4 horas

    useEffect(() => {
        if (!tasks || tasks.length === 0) return;

        const completedTasks = tasks.filter(task => task.done).length;
        const totalTasks = tasks.length;
        const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        const now = Date.now();

        // Notificación cuando se completa una tarea importante
        if (completedTasks > completedTasksCount.current) {
            const newlyCompleted = tasks.filter(task => 
                task.done && 
                (task.priority === 'A' || task.priority === 'B')
            );
            
            if (newlyCompleted.length > 0) {
                setNotificationType('motivation');
                setShowNotification(true);
                lastNotificationTime.current = now;
            }
        }

        // Notificación periódica poco frecuente (mínimo cada 2 horas)
        if (now - lastNotificationTime.current > minIntervalMs) {
            if (completionRate < 40) {
                setNotificationType('discipline');
                setShowNotification(true);
                lastNotificationTime.current = now;
            } else if (completionRate > 85) {
                setNotificationType('motivation');
                setShowNotification(true);
                lastNotificationTime.current = now;
            }
        }

        // Notificación de disciplina si hay muchas tareas pendientes (con el mismo rate limit)
        const pendingTasks = tasks.filter(task => !task.done);
        if (pendingTasks.length > 7 && now - lastNotificationTime.current > minIntervalMs) {
            setNotificationType('discipline');
            setShowNotification(true);
            lastNotificationTime.current = now;
        }

        completedTasksCount.current = completedTasks;
    }, [tasks]);

    // Inactividad: si no hay actividad por 4 horas, avisar (respetando el rate limit)
    useEffect(() => {
        if (!lastActivityAt) return;
        const now = Date.now();
        if (now - lastActivityAt >= idleThresholdMs && now - lastNotificationTime.current >= minIntervalMs) {
            setNotificationType('motivation');
            setShowNotification(true);
            lastNotificationTime.current = now;
        }
    }, [lastActivityAt]);

    // Auto-ocultar las notificaciones tipo leyenda
    useEffect(() => {
        if (showNotification) {
            if (autoHideTimerRef.current) clearTimeout(autoHideTimerRef.current);
            autoHideTimerRef.current = setTimeout(() => {
                setShowNotification(false);
            }, options.autoHideMs ?? 7000);
        }
        return () => {
            if (autoHideTimerRef.current) {
                clearTimeout(autoHideTimerRef.current);
                autoHideTimerRef.current = null;
            }
        };
    }, [showNotification]);

    const closeNotification = () => {
        setShowNotification(false);
    };

    const showManualNotification = (type = 'general') => {
        setNotificationType(type);
        setShowNotification(true);
        lastNotificationTime.current = Date.now();
    };

    return {
        showNotification,
        notificationType,
        closeNotification,
        showManualNotification
    };
}
