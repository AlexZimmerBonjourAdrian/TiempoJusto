// ============================================================================
// TIPOS DE TAREAS - TIEMPOJUSTO
// ============================================================================

import { BaseEntity, TaskPriority, TaskStatus } from './index';

// ============================================================================
// TIPOS PRINCIPALES DE TAREA
// ============================================================================

export interface Task extends BaseEntity {
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  projectId?: string;
  dueDate?: Date;
  estimatedTime?: number; // minutos
  actualTime?: number; // minutos
  tags: string[];
  isRecurring: boolean;
  recurringPattern?: RecurringPattern;
  completedAt?: Date;
  notes?: string;
}

// ============================================================================
// TIPOS DE PATRÓN RECURRENTE
// ============================================================================

export interface RecurringPattern {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  daysOfWeek?: number[]; // 0-6 (domingo-sábado)
  dayOfMonth?: number; // 1-31
  endDate?: Date;
  maxOccurrences?: number;
}

// ============================================================================
// TIPOS DE FILTROS Y BÚSQUEDA
// ============================================================================

export interface TaskFilters {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  projectId?: string;
  tags?: string[];
  dueDate?: {
    from?: Date;
    to?: Date;
  };
  search?: string;
}

export interface TaskSortOptions {
  field: 'title' | 'priority' | 'dueDate' | 'createdAt' | 'updatedAt';
  direction: 'asc' | 'desc';
}

// ============================================================================
// TIPOS DE ESTADÍSTICAS DE TAREAS
// ============================================================================

export interface TaskStatistics {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  cancelled: number;
  completionRate: number;
  averageCompletionTime: number;
  priorityDistribution: Record<TaskPriority, number>;
  statusDistribution: Record<TaskStatus, number>;
  dailyCompletion: Record<string, number>;
  weeklyCompletion: Record<string, number>;
  monthlyCompletion: Record<string, number>;
}

// ============================================================================
// TIPOS DE OPERACIONES DE TAREA
// ============================================================================

export interface CreateTaskData {
  title: string;
  description?: string;
  priority: TaskPriority;
  projectId?: string;
  dueDate?: Date;
  estimatedTime?: number;
  tags?: string[];
  isRecurring?: boolean;
  recurringPattern?: RecurringPattern;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  projectId?: string;
  dueDate?: Date;
  estimatedTime?: number;
  actualTime?: number;
  tags?: string[];
  notes?: string;
}

// ============================================================================
// TIPOS DE HOOKS DE TAREAS
// ============================================================================

export interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  statistics: TaskStatistics;
  addTask: (data: CreateTaskData) => Promise<void>;
  updateTask: (id: string, data: UpdateTaskData) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  getTasksByProject: (projectId: string) => Task[];
  getTasksByPriority: (priority: TaskPriority) => Task[];
  getTasksByStatus: (status: TaskStatus) => Task[];
  filterTasks: (filters: TaskFilters) => Task[];
  sortTasks: (tasks: Task[], options: TaskSortOptions) => Task[];
}

// ============================================================================
// TIPOS DE VALIDACIÓN
// ============================================================================

export interface TaskValidation {
  isValid: boolean;
  errors: {
    title?: string;
    priority?: string;
    dueDate?: string;
    estimatedTime?: string;
  };
}

// ============================================================================
// TIPOS DE IMPORTACIÓN/EXPORTACIÓN
// ============================================================================

export interface TaskExportData {
  tasks: Task[];
  exportDate: Date;
  version: string;
  statistics: TaskStatistics;
}

export interface TaskImportData {
  tasks: CreateTaskData[];
  importOptions: {
    mergeWithExisting: boolean;
    updateExisting: boolean;
    skipDuplicates: boolean;
  };
}
