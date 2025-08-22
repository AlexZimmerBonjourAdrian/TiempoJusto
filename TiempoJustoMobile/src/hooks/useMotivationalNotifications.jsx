import { useEffect, useRef, useCallback, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';

export function useMotivationalNotifications(lastActivityAt, options = {}, onShowNotification) {
    const { tasks } = useAppContext();
    const lastNotificationTime = useRef(0);
    const completedTasksCount = useRef(0);
    const autoHideTimerRef = useRef(null);

    // Memoizar las opciones para evitar recreaciones
    const memoizedOptions = useMemo(() => ({
        minIntervalMs: options.minIntervalMs ?? 2 * 60 * 60 * 1000, // 2 horas
        idleThresholdMs: options.idleThresholdMs ?? 4 * 60 * 60 * 1000, // 4 horas
    }), [options.minIntervalMs, options.idleThresholdMs]);

    // Memoizar la función de callback para evitar recreaciones
    const memoizedOnShowNotification = useCallback((type) => {
        if (onShowNotification) {
            onShowNotification(type);
        }
    }, [onShowNotification]);

    // Memoizar las tareas para evitar recálculos innecesarios
    const memoizedTasks = useMemo(() => tasks || [], [tasks]);

    useEffect(() => {
        if (!memoizedTasks.length || !memoizedOnShowNotification) return;

        const completedTasks = memoizedTasks.filter(task => task.done).length;
        const totalTasks = memoizedTasks.length;
        const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        const now = Date.now();

        // Notificación cuando se completa una tarea importante
        if (completedTasks > completedTasksCount.current) {
            const newlyCompleted = memoizedTasks.filter(task => 
                task.done && 
                (task.priority === 'A' || task.priority === 'B')
            );
            
            if (newlyCompleted.length > 0) {
                memoizedOnShowNotification('motivation');
                lastNotificationTime.current = now;
            }
        }

        // Notificación periódica poco frecuente (mínimo cada 2 horas)
        if (now - lastNotificationTime.current > memoizedOptions.minIntervalMs) {
            if (completionRate < 40) {
                memoizedOnShowNotification('discipline');
                lastNotificationTime.current = now;
            } else if (completionRate > 85) {
                memoizedOnShowNotification('motivation');
                lastNotificationTime.current = now;
            }
        }

        // Notificación de disciplina si hay muchas tareas pendientes (con el mismo rate limit)
        const pendingTasks = memoizedTasks.filter(task => !task.done);
        if (pendingTasks.length > 7 && now - lastNotificationTime.current > memoizedOptions.minIntervalMs) {
            memoizedOnShowNotification('discipline');
            lastNotificationTime.current = now;
        }

        completedTasksCount.current = completedTasks;
    }, [memoizedTasks, memoizedOnShowNotification, memoizedOptions.minIntervalMs]);

    // Inactividad: si no hay actividad por 4 horas, avisar (respetando el rate limit)
    useEffect(() => {
        if (!lastActivityAt || !memoizedOnShowNotification) return;
        const now = Date.now();
        if (now - lastActivityAt >= memoizedOptions.idleThresholdMs && now - lastNotificationTime.current >= memoizedOptions.minIntervalMs) {
            memoizedOnShowNotification('motivation');
            lastNotificationTime.current = now;
        }
    }, [lastActivityAt, memoizedOnShowNotification, memoizedOptions.idleThresholdMs, memoizedOptions.minIntervalMs]);

    const showManualNotification = useCallback((type = 'general') => {
        if (memoizedOnShowNotification) {
            memoizedOnShowNotification(type);
            lastNotificationTime.current = Date.now();
        }
    }, [memoizedOnShowNotification]);

    return {
        showManualNotification
    };
}
