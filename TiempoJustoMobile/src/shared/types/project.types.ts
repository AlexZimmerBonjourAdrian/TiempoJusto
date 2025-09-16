// ============================================================================
// TIPOS DE PROYECTOS - TIEMPOJUSTO
// ============================================================================

import { BaseEntity, ProjectStatus } from './index';

// ============================================================================
// TIPOS PRINCIPALES DE PROYECTO
// ============================================================================

export interface Project extends BaseEntity {
  name: string;
  description?: string;
  status: ProjectStatus;
  color: string;
  icon?: string;
  startDate?: Date;
  endDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  progress: number; // 0-100
  tags: string[];
  notes?: string;
  isArchived: boolean;
  archivedAt?: Date;
}

// ============================================================================
// TIPOS DE ESTADÍSTICAS DE PROYECTO
// ============================================================================

export interface ProjectStatistics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  pausedProjects: number;
  archivedProjects: number;
  averageProgress: number;
  totalEstimatedHours: number;
  totalActualHours: number;
  completionRate: number;
  averageCompletionTime: number; // días
  statusDistribution: Record<ProjectStatus, number>;
}

// ============================================================================
// TIPOS DE OPERACIONES DE PROYECTO
// ============================================================================

export interface CreateProjectData {
  name: string;
  description?: string;
  color: string;
  icon?: string;
  startDate?: Date;
  endDate?: Date;
  estimatedHours?: number;
  tags?: string[];
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  color?: string;
  icon?: string;
  startDate?: Date;
  endDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  progress?: number;
  tags?: string[];
  notes?: string;
  isArchived?: boolean;
}

// ============================================================================
// TIPOS DE FILTROS Y BÚSQUEDA
// ============================================================================

export interface ProjectFilters {
  status?: ProjectStatus[];
  tags?: string[];
  dateRange?: {
    from?: Date;
    to?: Date;
  };
  search?: string;
  isArchived?: boolean;
}

export interface ProjectSortOptions {
  field: 'name' | 'status' | 'progress' | 'startDate' | 'endDate' | 'createdAt';
  direction: 'asc' | 'desc';
}

// ============================================================================
// TIPOS DE HOOKS DE PROYECTOS
// ============================================================================

export interface UseProjectsReturn {
  projects: Project[];
  loading: boolean;
  error: string | null;
  statistics: ProjectStatistics;
  addProject: (data: CreateProjectData) => Promise<void>;
  updateProject: (id: string, data: UpdateProjectData) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  archiveProject: (id: string) => Promise<void>;
  unarchiveProject: (id: string) => Promise<void>;
  getProjectById: (id: string) => Project | undefined;
  getProjectsByStatus: (status: ProjectStatus) => Project[];
  filterProjects: (filters: ProjectFilters) => Project[];
  sortProjects: (projects: Project[], options: ProjectSortOptions) => Project[];
  updateProjectProgress: (id: string, progress: number) => Promise<void>;
}

// ============================================================================
// TIPOS DE VALIDACIÓN
// ============================================================================

export interface ProjectValidation {
  isValid: boolean;
  errors: {
    name?: string;
    color?: string;
    startDate?: string;
    endDate?: string;
    estimatedHours?: string;
  };
}

// ============================================================================
// TIPOS DE CONFIGURACIÓN DE PROYECTO
// ============================================================================

export interface ProjectConfig {
  defaultColor: string;
  defaultIcon: string;
  autoArchiveCompleted: boolean;
  archiveAfterDays: number;
  progressUpdateInterval: number; // minutos
}

// ============================================================================
// TIPOS DE IMPORTACIÓN/EXPORTACIÓN
// ============================================================================

export interface ProjectExportData {
  projects: Project[];
  exportDate: Date;
  version: string;
  statistics: ProjectStatistics;
}

export interface ProjectImportData {
  projects: CreateProjectData[];
  importOptions: {
    mergeWithExisting: boolean;
    updateExisting: boolean;
    skipDuplicates: boolean;
  };
}
