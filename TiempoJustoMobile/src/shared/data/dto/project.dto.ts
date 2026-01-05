// ============================================================================
// DTOs DE PROYECTOS - TIEMPOJUSTO
// ============================================================================

// ============================================================================
// DTOs DE ENTRADA (Request DTOs)
// ============================================================================

/**
 * DTO para crear un nuevo proyecto
 */
export interface CreateProjectDTO {
  name: string;
  description?: string;
  color: string; // Hex color
  icon?: string;
  startDate?: string; // ISO 8601
  endDate?: string; // ISO 8601
  estimatedHours?: number;
  tags?: string[];
}

/**
 * DTO para actualizar un proyecto existente
 */
export interface UpdateProjectDTO {
  name?: string;
  description?: string;
  status?: 'open' | 'suspended' | 'cancelled' | 'completed';
  color?: string; // Hex color
  icon?: string;
  startDate?: string; // ISO 8601
  endDate?: string; // ISO 8601
  estimatedHours?: number;
  actualHours?: number;
  progress?: number; // 0-100
  tags?: string[];
  notes?: string;
  taskIds?: string[];
}

/**
 * DTO para filtrar proyectos
 */
export interface FilterProjectsDTO {
  status?: string[];
  tags?: string[];
  dateRange?: {
    from?: string; // ISO 8601
    to?: string; // ISO 8601
  };
  search?: string;
}

// ============================================================================
// DTOs DE SALIDA (Response DTOs)
// ============================================================================

/**
 * DTO de respuesta para un proyecto
 * Optimizado para UI
 */
export interface ProjectResponseDTO {
  id: string;
  name: string;
  description?: string;
  status: 'open' | 'suspended' | 'cancelled' | 'completed';
  color: string; // Hex color
  icon?: string;
  startDate?: string; // ISO 8601
  endDate?: string; // ISO 8601
  estimatedHours?: number;
  actualHours?: number;
  progress: number; // 0-100
  tags: string[];
  taskCount: number; // Número total de tareas
  completedTaskCount: number; // Número de tareas completadas
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

/**
 * DTO de respuesta para lista de proyectos
 */
export interface ProjectListResponseDTO {
  projects: ProjectResponseDTO[];
  total: number;
  page?: number;
  limit?: number;
}

/**
 * DTO de respuesta para estadísticas de proyectos
 */
export interface ProjectStatisticsResponseDTO {
  totalProjects: number;
  openProjects: number;
  suspendedProjects: number;
  cancelledProjects: number;
  completedProjects: number;
  averageProgress: number; // 0-100
  totalEstimatedHours: number;
  totalActualHours: number;
  completionRate: number; // 0-100
  averageCompletionTime: number; // días
  statusDistribution: {
    open: number;
    suspended: number;
    cancelled: number;
    completed: number;
  };
}

// ============================================================================
// DTOs DE IMPORTACIÓN/EXPORTACIÓN
// ============================================================================

export interface ProjectExportDTO {
  projects: ProjectResponseDTO[];
  exportDate: string; // ISO 8601
  version: string;
  statistics: ProjectStatisticsResponseDTO;
}

export interface ProjectImportDTO {
  projects: CreateProjectDTO[];
  importOptions: {
    mergeWithExisting: boolean;
    updateExisting: boolean;
    skipDuplicates: boolean;
  };
}


