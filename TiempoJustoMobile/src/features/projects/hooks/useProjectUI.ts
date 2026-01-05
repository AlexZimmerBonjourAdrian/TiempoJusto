// ============================================================================
// HOOK DE UI PARA PROYECTOS - TIEMPOJUSTO
// ============================================================================

import { useState, useCallback, useMemo } from 'react';
import { Project, ProjectStatus } from '../../../shared/types';
import { useProjects } from './useProjects';

/**
 * Hook que maneja la lógica de UI para proyectos
 * Separa la lógica de presentación de la lógica de negocio
 * Delega operaciones de negocio al hook useProjects
 */
export const useProjectUI = () => {
  // ============================================================================
  // ESTADO DE UI
  // ============================================================================

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'open' | 'closed'>('open');
  const [searchTerm, setSearchTerm] = useState('');

  // ============================================================================
  // HOOKS DE NEGOCIO
  // ============================================================================

  const {
    projects,
    loading,
    error,
    statistics,
    addProject,
    updateProject,
    deleteProject,
    getOpenProjects,
    getClosedProjects
  } = useProjects();

  // ============================================================================
  // LÓGICA DE UI
  // ============================================================================

  /**
   * Abre el modal para crear un nuevo proyecto
   */
  const openCreateModal = useCallback(() => {
    setSelectedProject(null);
    setIsModalVisible(true);
  }, []);

  /**
   * Abre el modal para editar un proyecto existente
   */
  const openEditModal = useCallback((project: Project) => {
    setSelectedProject(project);
    setIsModalVisible(true);
  }, []);

  /**
   * Cierra el modal de proyecto
   */
  const closeModal = useCallback(() => {
    setIsModalVisible(false);
    setSelectedProject(null);
  }, []);

  /**
   * Maneja el envío del formulario de proyecto
   */
  const handleProjectSubmit = useCallback(async (projectData: any) => {
    try {
      if (selectedProject) {
        // Editar proyecto existente
        await updateProject(selectedProject.id, projectData);
      } else {
        // Crear nuevo proyecto
        await addProject(projectData);
      }
      closeModal();
    } catch (error) {
      // El error ya es manejado por el hook de negocio
      throw error;
    }
  }, [selectedProject, updateProject, addProject, closeModal]);

  /**
   * Maneja la eliminación de un proyecto
   */
  const handleProjectDelete = useCallback(async (projectId: string) => {
    try {
      await deleteProject(projectId);
    } catch (error) {
      // El error ya es manejado por el hook de negocio
      throw error;
    }
  }, [deleteProject]);

  /**
   * Maneja el cambio de estado de un proyecto
   */
  const handleStatusChange = useCallback(async (projectId: string, newStatus: ProjectStatus) => {
    try {
      await updateProject(projectId, { status: newStatus });
    } catch (error) {
      // El error ya es manejado por el hook de negocio
      throw error;
    }
  }, [updateProject]);

  const handleProjectDelete = useCallback(async (projectId: string) => {
    try {
      await deleteProject(projectId);
    } catch (error) {
      // El error ya es manejado por el hook de negocio
      throw error;
    }
  }, [deleteProject]);

  /**
   * Cambia la pestaña activa
   */
  const changeTab = useCallback((tab: 'open' | 'closed') => {
    setActiveTab(tab);
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
   * Lista de proyectos filtrados según la pestaña y búsqueda actuales
   */
  const filteredProjects = useMemo(() => {
    let filtered = activeTab === 'open' ? getOpenProjects() : getClosedProjects();

    // Aplicar búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(term) ||
        (project.description && project.description.toLowerCase().includes(term)) ||
        project.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    return filtered;
  }, [activeTab, getOpenProjects, getClosedProjects, searchTerm]);

  /**
   * Estadísticas de las pestañas
   */
  const tabStats = useMemo(() => {
    const open = getOpenProjects();
    const closed = getClosedProjects();

    return {
      open: open.length,
      closed: closed.length
    };
  }, [getOpenProjects, getClosedProjects]);

  // ============================================================================
  // RETORNO DEL HOOK
  // ============================================================================

  return {
    // Estado de UI
    selectedProject,
    isModalVisible,
    activeTab,
    searchTerm,
    filteredProjects,
    tabStats,

    // Estado de negocio
    allProjects: projects,
    loading,
    error,
    statistics,

    // Acciones de UI
    openCreateModal,
    openEditModal,
    closeModal,
    handleProjectSubmit,
    handleProjectDelete,
    handleStatusChange,
    changeTab,
    changeSearchTerm,

    // Acciones de negocio (delegadas)
    addProject,
    updateProject,
    deleteProject,
    getOpenProjects,
    getClosedProjects
  };
};
