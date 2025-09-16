// ============================================================================
// HOOK DE TAREAS - TIEMPOJUSTO
// ============================================================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Task, CreateTaskData, UpdateTaskData, TaskFilters, TaskSortOptions, TaskStatistics, UseTasksReturn } from '../../../shared/types';
import { taskService } from '../services/taskService';
import { debugUtils } from '../../../shared/utils';

// ============================================================================
// HOOK PRINCIPAL DE TAREAS
// ============================================================================

export const useTasks = (): UseTasksReturn => {
  // ============================================================================
  // ESTADO LOCAL
  // ============================================================================

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<TaskStatistics>({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
    cancelled: 0,
    completionRate: 0,
    averageCompletionTime: 0,
    priorityDistribution: { A: 0, B: 0, C: 0, D: 0 },
    statusDistribution: { pending: 0, in_progress: 0, completed: 0, cancelled: 0 },
    dailyCompletion: {},
    weeklyCompletion: {},
    monthlyCompletion: {}
  });

  // ============================================================================
  // EFECTOS
  // ============================================================================

  useEffect(() => {
    initializeTasks();
  }, []);

  // ============================================================================
  // FUNCIONES DE INICIALIZACIÓN
  // ============================================================================

  const initializeTasks = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      await taskService.initialize();
      const loadedTasks = taskService.getTasks();
      const loadedStatistics = taskService.getStatistics();
      
      setTasks(loadedTasks);
      setStatistics(loadedStatistics);
      
      debugUtils.log('Tasks initialized successfully', { count: loadedTasks.length });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error initializing tasks';
      setError(errorMessage);
      debugUtils.error('Error initializing tasks', err);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // FUNCIONES DE CRUD
  // ============================================================================

  const addTask = useCallback(async (data: CreateTaskData): Promise<void> => {
    try {
      setError(null);
      const newTask = await taskService.createTask(data);
      
      setTasks(prevTasks => [...prevTasks, newTask]);
      setStatistics(taskService.getStatistics());
      
      debugUtils.log('Task added successfully', { id: newTask.id });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error adding task';
      setError(errorMessage);
      debugUtils.error('Error adding task', err);
      throw err;
    }
  }, []);

  const updateTask = useCallback(async (id: string, data: UpdateTaskData): Promise<void> => {
    try {
      setError(null);
      const updatedTask = await taskService.updateTask(id, data);
      
      setTasks(prevTasks => 
        prevTasks.map(task => task.id === id ? updatedTask : task)
      );
      setStatistics(taskService.getStatistics());
      
      debugUtils.log('Task updated successfully', { id });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error updating task';
      setError(errorMessage);
      debugUtils.error('Error updating task', err);
      throw err;
    }
  }, []);

  const deleteTask = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      await taskService.deleteTask(id);
      
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      setStatistics(taskService.getStatistics());
      
      debugUtils.log('Task deleted successfully', { id });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error deleting task';
      setError(errorMessage);
      debugUtils.error('Error deleting task', err);
      throw err;
    }
  }, []);

  const completeTask = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      const completedTask = await taskService.completeTask(id);
      
      setTasks(prevTasks => 
        prevTasks.map(task => task.id === id ? completedTask : task)
      );
      setStatistics(taskService.getStatistics());
      
      debugUtils.log('Task completed successfully', { id });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error completing task';
      setError(errorMessage);
      debugUtils.error('Error completing task', err);
      throw err;
    }
  }, []);

  // ============================================================================
  // FUNCIONES DE CONSULTA
  // ============================================================================

  const getTasksByProject = useCallback((projectId: string): Task[] => {
    return taskService.getTasksByProject(projectId);
  }, []);

  const getTasksByPriority = useCallback((priority: string): Task[] => {
    return taskService.getTasksByPriority(priority);
  }, []);

  const getTasksByStatus = useCallback((status: string): Task[] => {
    return taskService.getTasksByStatus(status);
  }, []);

  const filterTasks = useCallback((filters: TaskFilters): Task[] => {
    return taskService.filterTasks(filters);
  }, []);

  const sortTasks = useCallback((tasks: Task[], options: TaskSortOptions): Task[] => {
    return taskService.sortTasks(tasks, options);
  }, []);

  // ============================================================================
  // FUNCIONES DE UTILIDAD
  // ============================================================================

  const refreshTasks = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const loadedTasks = taskService.getTasks();
      const loadedStatistics = taskService.getStatistics();
      
      setTasks(loadedTasks);
      setStatistics(loadedStatistics);
      
      debugUtils.log('Tasks refreshed successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error refreshing tasks';
      setError(errorMessage);
      debugUtils.error('Error refreshing tasks', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  // ============================================================================
  // VALORES MEMOIZADOS
  // ============================================================================

  const pendingTasks = useMemo(() => {
    return tasks.filter(task => task.status === 'pending');
  }, [tasks]);

  const completedTasks = useMemo(() => {
    return tasks.filter(task => task.status === 'completed');
  }, [tasks]);

  const inProgressTasks = useMemo(() => {
    return tasks.filter(task => task.status === 'in_progress');
  }, [tasks]);

  const todayTasks = useMemo(() => {
    const today = new Date();
    return taskService.getTasksByDate(today);
  }, [tasks]);

  const overdueTasks = useMemo(() => {
    const today = new Date();
    return tasks.filter(task => 
      task.dueDate && 
      task.dueDate < today && 
      task.status !== 'completed'
    );
  }, [tasks]);

  const highPriorityTasks = useMemo(() => {
    return tasks.filter(task => task.priority === 'A' && task.status !== 'completed');
  }, [tasks]);

  // ============================================================================
  // RETORNO DEL HOOK
  // ============================================================================

  return {
    // Estado
    tasks,
    loading,
    error,
    statistics,
    
    // Funciones CRUD
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    
    // Funciones de consulta
    getTasksByProject,
    getTasksByPriority,
    getTasksByStatus,
    filterTasks,
    sortTasks,
    
    // Funciones de utilidad
    refreshTasks,
    clearError,
    
    // Valores memoizados
    pendingTasks,
    completedTasks,
    inProgressTasks,
    todayTasks,
    overdueTasks,
    highPriorityTasks
  };
};

// ============================================================================
// HOOKS ESPECIALIZADOS
// ============================================================================

/**
 * Hook para obtener tareas de un proyecto específico
 */
export const useProjectTasks = (projectId: string) => {
  const { tasks, loading, error } = useTasks();
  
  const projectTasks = useMemo(() => {
    return tasks.filter(task => task.projectId === projectId);
  }, [tasks, projectId]);
  
  return {
    tasks: projectTasks,
    loading,
    error
  };
};

/**
 * Hook para obtener tareas por prioridad
 */
export const usePriorityTasks = (priority: string) => {
  const { tasks, loading, error } = useTasks();
  
  const priorityTasks = useMemo(() => {
    return tasks.filter(task => task.priority === priority);
  }, [tasks, priority]);
  
  return {
    tasks: priorityTasks,
    loading,
    error
  };
};

/**
 * Hook para obtener tareas del día
 */
export const useTodayTasks = () => {
  const { tasks, loading, error } = useTasks();
  
  const todayTasks = useMemo(() => {
    const today = new Date();
    return taskService.getTasksByDate(today);
  }, [tasks]);
  
  return {
    tasks: todayTasks,
    loading,
    error
  };
};

/**
 * Hook para obtener estadísticas de tareas
 */
export const useTaskStatistics = () => {
  const { statistics, loading, error } = useTasks();
  
  return {
    statistics,
    loading,
    error
  };
};
