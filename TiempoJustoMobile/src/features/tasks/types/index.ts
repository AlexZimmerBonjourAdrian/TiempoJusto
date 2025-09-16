// ============================================================================
// TIPOS DEL SLICE DE TAREAS - TIEMPOJUSTO
// ============================================================================

// Re-exportar tipos desde shared
export * from '../../../shared/types/task.types';

// Tipos específicos del slice de tareas
export interface TaskSliceState {
  tasks: any[];
  loading: boolean;
  error: string | null;
  filters: any;
  sortOptions: any;
  statistics: any;
}

export interface TaskSliceActions {
  addTask: (task: any) => void;
  updateTask: (id: string, updates: any) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  setFilters: (filters: any) => void;
  setSortOptions: (options: any) => void;
  clearError: () => void;
}
