import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { useAsyncStorageState, validateTask } from '../../../storage';
import eventBus from '../../../shared/eventBus';

const TasksContext = createContext(null);

export function useTasksContext() {
    const ctx = useContext(TasksContext);
    if (!ctx) throw new Error('useTasksContext debe usarse dentro de TasksProvider');
    return ctx;
}

export function TasksProvider({ children }) {
    const [tasks, setTasks, { error, isLoading }] = useAsyncStorageState('TJ_TASKS_STATE', []);

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

        setTasks(prev => ([...(prev || []), newTask]));
        return { ok: true, task: newTask };
    }, [setTasks]);

    const toggleTask = useCallback((taskId) => {
        setTasks(prev => {
            const updated = (prev || []).map(task => {
                if (task.id === taskId) {
                    const newDone = !task.done;
                    const updatedTask = { ...task, done: newDone, completedAt: newDone ? new Date().toISOString() : null };
                    try { eventBus.emit('task:toggled', { task: updatedTask }); } catch {}
                    return updatedTask;
                }
                return task;
            });
            return updated;
        });
    }, [setTasks]);

    const removeTask = useCallback((taskId) => {
        setTasks(prev => (prev || []).filter(task => task.id !== taskId));
    }, [setTasks]);

    const updateTask = useCallback((taskId, updates) => {
        let result = { ok: false, errors: [] };
        setTasks(prev => {
            const existingTask = (prev || []).find(t => t.id === taskId);
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
            return (prev || []).map(task => task.id === taskId ? mergedTask : task);
        });
        return result;
    }, [setTasks]);

    const value = useMemo(() => ({
        tasks: tasks || [],
        addTask,
        toggleTask,
        removeTask,
        updateTask,
        isLoading,
        error,
    }), [tasks, addTask, toggleTask, removeTask, updateTask, isLoading, error]);

    return (
        <TasksContext.Provider value={value}>
            {children}
        </TasksContext.Provider>
    );
}


