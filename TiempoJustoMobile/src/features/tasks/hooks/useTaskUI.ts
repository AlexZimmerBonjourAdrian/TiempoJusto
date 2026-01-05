// ============================================================================
// HOOK DE UI PARA TAREAS - TIEMPOJUSTO
// ============================================================================

import { useState, useCallback, useMemo } from 'react';
import { Task } from '../../../shared/types';
import { useTasks } from './useTasks';

/**
 * Hook que maneja la lógica de UI para tareas
 * Separa la lógica de presentación de la lógica de negocio
 * Delega operaciones de negocio al hook useTasks
 */
export const useTaskUI = () => {
  // ============================================================================
  // ESTADO DE UI
  // ============================================================================

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // ============================================================================
  // HOOKS DE NEGOCIO
  // ============================================================================

  const {
    tasks,
    loading,
    error,
    statistics,
    addTask,
    updateTask,
    deleteTask,
    completeTask
  } = useTasks();

  // ============================================================================
  // LÓGICA DE UI
  // ============================================================================

  /**
   * Abre el modal para crear una nueva tarea
   */
  const openCreateModal = useCallback(() => {
    setSelectedTask(null);
    setIsModalVisible(true);
  }, []);

  /**
   * Abre el modal para editar una tarea existente
   */
  const openEditModal = useCallback((task: Task) => {
    setSelectedTask(task);
    setIsModalVisible(true);
  }, []);

  /**
   * Cierra el modal de tarea
   */
  const closeModal = useCallback(() => {
    setIsModalVisible(false);
    setSelectedTask(null);
  }, []);

  /**
   * Maneja el envío del formulario de tarea
   */
  const handleTaskSubmit = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (selectedTask) {
        // Editar tarea existente
        await updateTask(selectedTask.id, taskData);
      } else {
        // Crear nueva tarea
        await addTask(taskData);
      }
      closeModal();
    } catch (error) {
      // El error ya es manejado por el hook de negocio
      throw error;
    }
  }, [selectedTask, updateTask, addTask, closeModal]);

  /**
   * Maneja la eliminación de una tarea
   */
  const handleTaskDelete = useCallback(async (taskId: string) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      // El error ya es manejado por el hook de negocio
      throw error;
    }
  }, [deleteTask]);

  /**
   * Maneja la completación de una tarea
   */
  const handleTaskComplete = useCallback(async (taskId: string) => {
    try {
      await completeTask(taskId);
    } catch (error) {
      // El error ya es manejado por el hook de negocio
      throw error;
    }
  }, [completeTask]);

  /**
   * Cambia el filtro de tareas
   */
  const changeFilter = useCallback((newFilter: 'all' | 'pending' | 'completed') => {
    setFilter(newFilter);
  }, []);

  /**
   * Cambia el término de búsqueda
   */
  const changeSearchTerm = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  // ============================================================================
  // CÁLCULOS DERIVADOS
  // ============================================================================

  /**
   * Lista de tareas filtradas según el filtro y búsqueda actuales
   */
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Aplicar filtro de estado
    if (filter === 'pending') {
      filtered = filtered.filter(task => task.status === 'pending' || task.status === 'in_progress');
    } else if (filter === 'completed') {
      filtered = filtered.filter(task => task.status === 'completed');
    }

    // Aplicar búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(term) ||
        (task.description && task.description.toLowerCase().includes(term)) ||
        task.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    return filtered;
  }, [tasks, filter, searchTerm]);

  /**
   * Estadísticas de las tareas filtradas
   */
  const filteredStats = useMemo(() => {
    const filtered = filteredTasks;
    return {
      total: filtered.length,
      pending: filtered.filter(t => t.status === 'pending' || t.status === 'in_progress').length,
      completed: filtered.filter(t => t.status === 'completed').length,
      inProgress: filtered.filter(t => t.status === 'in_progress').length
    };
  }, [filteredTasks]);

  // ============================================================================
  // RETORNO DEL HOOK
  // ============================================================================

  return {
    // Estado de UI
    selectedTask,
    isModalVisible,
    filter,
    searchTerm,
    filteredTasks,
    filteredStats,

    // Estado de negocio
    allTasks: tasks,
    loading,
    error,
    statistics,

    // Acciones de UI
    openCreateModal,
    openEditModal,
    closeModal,
    handleTaskSubmit,
    handleTaskDelete,
    handleTaskComplete,
    changeFilter,
    changeSearchTerm,

    // Acciones de negocio (delegadas)
    addTask,
    updateTask,
    deleteTask,
    completeTask
  };
};
