// ============================================================================
// HOOK DE PROYECTOS - TIEMPOJUSTO
// ============================================================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Project, CreateProjectData, UpdateProjectData, ProjectFilters, ProjectSortOptions, ProjectStatistics, UseProjectsReturn } from '../../../shared/types';
import { projectService } from '../services/projectService';
import { debugUtils } from '../../../shared/utils';

// ============================================================================
// HOOK PRINCIPAL DE PROYECTOS
// ============================================================================

export const useProjects = (): UseProjectsReturn => {
  // ============================================================================
  // ESTADO LOCAL
  // ============================================================================

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<ProjectStatistics>({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    pausedProjects: 0,
    archivedProjects: 0,
    averageProgress: 0,
    totalEstimatedHours: 0,
    totalActualHours: 0,
    completionRate: 0,
    averageCompletionTime: 0,
    statusDistribution: { active: 0, completed: 0, paused: 0, archived: 0 },
    progressDistribution: { '0-25': 0, '26-50': 0, '51-75': 0, '76-100': 0 }
  });

  // ============================================================================
  // EFECTOS
  // ============================================================================

  useEffect(() => {
    initializeProjects();
  }, []);

  // ============================================================================
  // FUNCIONES DE INICIALIZACIÓN
  // ============================================================================

  const initializeProjects = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      await projectService.initialize();
      const loadedProjects = projectService.getProjects();
      const loadedStatistics = projectService.getStatistics();
      
      setProjects(loadedProjects);
      setStatistics(loadedStatistics);
      
      debugUtils.log('Projects initialized successfully', { count: loadedProjects.length });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error initializing projects';
      setError(errorMessage);
      debugUtils.error('Error initializing projects', err);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // FUNCIONES DE CRUD
  // ============================================================================

  const addProject = useCallback(async (data: CreateProjectData): Promise<void> => {
    try {
      setError(null);
      const newProject = await projectService.createProject(data);
      
      setProjects(prevProjects => [...prevProjects, newProject]);
      setStatistics(projectService.getStatistics());
      
      debugUtils.log('Project added successfully', { id: newProject.id });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error adding project';
      setError(errorMessage);
      debugUtils.error('Error adding project', err);
      throw err;
    }
  }, []);

  const updateProject = useCallback(async (id: string, data: UpdateProjectData): Promise<void> => {
    try {
      setError(null);
      const updatedProject = await projectService.updateProject(id, data);
      
      setProjects(prevProjects => 
        prevProjects.map(project => project.id === id ? updatedProject : project)
      );
      setStatistics(projectService.getStatistics());
      
      debugUtils.log('Project updated successfully', { id });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error updating project';
      setError(errorMessage);
      debugUtils.error('Error updating project', err);
      throw err;
    }
  }, []);

  const deleteProject = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      await projectService.deleteProject(id);
      
      setProjects(prevProjects => prevProjects.filter(project => project.id !== id));
      setStatistics(projectService.getStatistics());
      
      debugUtils.log('Project deleted successfully', { id });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error deleting project';
      setError(errorMessage);
      debugUtils.error('Error deleting project', err);
      throw err;
    }
  }, []);

  const archiveProject = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      const archivedProject = await projectService.archiveProject(id);
      
      setProjects(prevProjects => 
        prevProjects.map(project => project.id === id ? archivedProject : project)
      );
      setStatistics(projectService.getStatistics());
      
      debugUtils.log('Project archived successfully', { id });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error archiving project';
      setError(errorMessage);
      debugUtils.error('Error archiving project', err);
      throw err;
    }
  }, []);

  const unarchiveProject = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      const unarchivedProject = await projectService.unarchiveProject(id);
      
      setProjects(prevProjects => 
        prevProjects.map(project => project.id === id ? unarchivedProject : project)
      );
      setStatistics(projectService.getStatistics());
      
      debugUtils.log('Project unarchived successfully', { id });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error unarchiving project';
      setError(errorMessage);
      debugUtils.error('Error unarchiving project', err);
      throw err;
    }
  }, []);

  // ============================================================================
  // FUNCIONES DE CONSULTA
  // ============================================================================

  const getProjectById = useCallback((id: string): Project | undefined => {
    return projectService.getProjectById(id);
  }, []);

  const getProjectsByStatus = useCallback((status: string): Project[] => {
    return projectService.getProjectsByStatus(status);
  }, []);

  const filterProjects = useCallback((filters: ProjectFilters): Project[] => {
    return projectService.filterProjects(filters);
  }, []);

  const sortProjects = useCallback((projects: Project[], options: ProjectSortOptions): Project[] => {
    return projectService.sortProjects(projects, options);
  }, []);

  const updateProjectProgress = useCallback(async (id: string, progress: number): Promise<void> => {
    try {
      await updateProject(id, { progress });
    } catch (err) {
      debugUtils.error('Error updating project progress', err);
      throw err;
    }
  }, [updateProject]);

  // ============================================================================
  // FUNCIONES DE UTILIDAD
  // ============================================================================

  const refreshProjects = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const loadedProjects = projectService.getProjects();
      const loadedStatistics = projectService.getStatistics();
      
      setProjects(loadedProjects);
      setStatistics(loadedStatistics);
      
      debugUtils.log('Projects refreshed successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error refreshing projects';
      setError(errorMessage);
      debugUtils.error('Error refreshing projects', err);
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

  const activeProjects = useMemo(() => {
    return projects.filter(project => project.status === 'active' && !project.isArchived);
  }, [projects]);

  const completedProjects = useMemo(() => {
    return projects.filter(project => project.status === 'completed');
  }, [projects]);

  const pausedProjects = useMemo(() => {
    return projects.filter(project => project.status === 'paused');
  }, [projects]);

  const archivedProjects = useMemo(() => {
    return projects.filter(project => project.isArchived);
  }, [projects]);

  const projectsInProgress = useMemo(() => {
    return projects.filter(project => 
      project.status === 'active' && 
      project.progress > 0 && 
      project.progress < 100
    );
  }, [projects]);

  const overdueProjects = useMemo(() => {
    const today = new Date();
    return projects.filter(project => 
      project.endDate && 
      project.endDate < today && 
      project.status !== 'completed'
    );
  }, [projects]);

  // ============================================================================
  // RETORNO DEL HOOK
  // ============================================================================

  return {
    // Estado
    projects,
    loading,
    error,
    statistics,
    
    // Funciones CRUD
    addProject,
    updateProject,
    deleteProject,
    archiveProject,
    unarchiveProject,
    
    // Funciones de consulta
    getProjectById,
    getProjectsByStatus,
    filterProjects,
    sortProjects,
    updateProjectProgress,
    
    // Funciones de utilidad
    refreshProjects,
    clearError,
    
    // Valores memoizados
    activeProjects,
    completedProjects,
    pausedProjects,
    archivedProjects,
    projectsInProgress,
    overdueProjects
  };
};

// ============================================================================
// HOOKS ESPECIALIZADOS
// ============================================================================

/**
 * Hook para obtener proyectos activos
 */
export const useActiveProjects = () => {
  const { projects, loading, error } = useProjects();
  
  const activeProjects = useMemo(() => {
    return projects.filter(project => project.status === 'active' && !project.isArchived);
  }, [projects]);
  
  return {
    projects: activeProjects,
    loading,
    error
  };
};

/**
 * Hook para obtener proyectos archivados
 */
export const useArchivedProjects = () => {
  const { projects, loading, error } = useProjects();
  
  const archivedProjects = useMemo(() => {
    return projects.filter(project => project.isArchived);
  }, [projects]);
  
  return {
    projects: archivedProjects,
    loading,
    error
  };
};

/**
 * Hook para obtener estadísticas de proyectos
 */
export const useProjectStatistics = () => {
  const { statistics, loading, error } = useProjects();
  
  return {
    statistics,
    loading,
    error
  };
};
