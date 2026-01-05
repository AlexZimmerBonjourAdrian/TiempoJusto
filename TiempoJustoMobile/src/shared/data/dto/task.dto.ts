// ============================================================================
// DTOs DE TAREAS - TIEMPOJUSTO
// ============================================================================

// ============================================================================
// DTOs DE ENTRADA (Request DTOs)
// ============================================================================

/**
 * DTO para crear una nueva tarea
 * Usado en formularios y APIs - fechas como strings ISO 8601
 */
export interface CreateTaskDTO {
  title: string;
  description?: string;
  priority: 'A' | 'B' | 'C' | 'D';
  projectId: string; // OBLIGATORIO: Una tarea debe pertenecer a un proyecto
  dueDate?: string; // ISO 8601 string
  estimatedTime?: number; // minutos
  tags?: string[];
  isRecurring?: boolean;
  recurringPattern?: {
    type: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    daysOfWeek?: number[]; // 0-6 (domingo-sábado)
    dayOfMonth?: number; // 1-31
    endDate?: string; // ISO 8601
    maxOccurrences?: number;
  };
}

/**
 * DTO para actualizar una tarea existente
 * Todos los campos son opcionales
 */
export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  priority?: 'A' | 'B' | 'C' | 'D';
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  projectId?: string;
  dueDate?: string; // ISO 8601 string
  estimatedTime?: number;
  actualTime?: number;
  tags?: string[];
  notes?: string;
}

/**
 * DTO para reordenar tareas
 */
export interface ReorderTasksDTO {
  taskIds: string[]; // Orden nuevo
  projectId?: string; // Si es específico de proyecto
}

/**
 * DTO para filtrar tareas
 */
export interface FilterTasksDTO {
  status?: string[];
  priority?: string[];
  projectId?: string;
  tags?: string[];
  dueDateFrom?: string;
  dueDateTo?: string;
  search?: string;
}

// ============================================================================
// DTOs DE SALIDA (Response DTOs)
// ============================================================================

/**
 * DTO de respuesta para una tarea
 * Optimizado para UI (solo campos necesarios)
 */
export interface TaskResponseDTO {
  id: string;
  title: string;
  description?: string;
  priority: 'A' | 'B' | 'C' | 'D';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  projectId: string;
  projectName?: string; // Incluido para evitar joins en UI
  dueDate?: string; // ISO 8601
  estimatedTime?: number;
  actualTime?: number;
  tags: string[];
  isRecurring: boolean;
  completedAt?: string; // ISO 8601
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

/**
 * DTO de respuesta para lista de tareas
 */
export interface TaskListResponseDTO {
  tasks: TaskResponseDTO[];
  total: number;
  page?: number;
  limit?: number;
}

/**
 * DTO de respuesta para estadísticas
 */
export interface TaskStatisticsResponseDTO {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  cancelled: number;
  completionRate: number;
  averageCompletionTime: number;
  priorityDistribution: {
    A: number;
    B: number;
    C: number;
    D: number;
  };
  statusDistribution: {
    pending: number;
    in_progress: number;
    completed: number;
    cancelled: number;
  };
}

// ============================================================================
// DTOs DE IMPORTACIÓN/EXPORTACIÓN
// ============================================================================

export interface TaskExportDTO {
  tasks: TaskResponseDTO[];
  exportDate: string; // ISO 8601
  version: string;
  statistics: TaskStatisticsResponseDTO;
}

export interface TaskImportDTO {
  tasks: CreateTaskDTO[];
  importOptions: {
    mergeWithExisting: boolean;
    updateExisting: boolean;
    skipDuplicates: boolean;
  };
}


