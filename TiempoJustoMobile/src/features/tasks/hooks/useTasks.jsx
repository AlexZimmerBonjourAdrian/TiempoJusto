import { useCallback, useMemo } from 'react';
import { useAppContext } from '../../../context/AppContext';
import taskBusinessLogic from '../domain/taskBusinessLogic';

export const useTasks = () => {
    const { tasks, addTask, toggleTask, removeTask, updateTask } = useAppContext();

    const sorted = useMemo(() => taskBusinessLogic.sortTasksIntelligently(tasks || []), [tasks]);

    const create = useCallback(async (data) => addTask(data), [addTask]);
    const toggle = useCallback(async (id) => toggleTask(id), [toggleTask]);
    const remove = useCallback(async (id) => removeTask(id), [removeTask]);
    const update = useCallback(async (id, updates) => updateTask(id, updates), [updateTask]);

    return { list: tasks || [], sorted, create, toggle, remove, update };
};


