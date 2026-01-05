// ============================================================================
// SERVICIO DE PROYECTOS - TIEMPOJUSTO
// ============================================================================

import { Project, CreateProjectData, UpdateProjectData, ProjectFilters, ProjectSortOptions, ProjectStatistics } from '../../../shared/types';
import { storageService } from '../../../shared/storage';
import { STORAGE_KEYS } from '../../../shared/constants';
import { debugUtils, arrayUtils } from '../../../shared/utils';
import { ProjectFactory } from '../../../shared/factories';
import { ProjectRepository } from '../../../shared/data/repositories';
import { ProjectEntity } from '../../../shared/data/entities';

// ============================================================================
// CLASE DEL SERVICIO DE PROYECTOS
// ============================================================================

export class ProjectService {
  private projects: Project[] = [];
  private readonly storageKey = STORAGE_KEYS.PROJECTS;
  private repository: ProjectRepository;

  // ============================================================================
  // MÉTODOS DE INICIALIZACIÓN
  // ============================================================================

  async initialize(): Promise<void> {
    try {
      // Initialize repository
      this.repository = new ProjectRepository();

      await this.loadProjects();
      debugUtils.log('ProjectService initialized successfully');
    } catch (error) {
      debugUtils.error('Error initializing ProjectService', error);
      throw error;
    }
  }

  // ============================================================================
  // MÉTODOS DE CRUD
  // ============================================================================

  async createProject(data: CreateProjectData): Promise<Project> {
    try {
      // 1. Crear proyecto usando Factory
      const project = ProjectFactory.createStandard(data);

      // 2. Convertir a Entity
      const entity = ProjectEntity.fromProject(project);

      // 3. Guardar en repository
      const savedEntity = await this.repository.create(entity);

      // 4. Mantener sincronización con lista local (compatibilidad)
      const savedProject = savedEntity.toProject();
      this.projects.push(savedProject);
      await this.saveProjects();

      debugUtils.log('Project created successfully', { id: savedProject.id, name: savedProject.name });
      return savedProject; // Retornar Project para compatibilidad
    } catch (error) {
      debugUtils.error('Error creating project', error);
      throw error;
    }
  }

  async updateProject(id: string, data: UpdateProjectData): Promise<Project> {
    try {
      // 1. Obtener la entidad del repository
      const entity = await this.repository.findById(id);
      if (!entity) {
        throw new Error(`Project with id ${id} not found`);
      }

      // 2. Aplicar lógica de negocio usando la entidad
      if (data.progress !== undefined) {
        entity.updateProgress(data.progress);
      } else {
        // Aplicar otras actualizaciones
        if (data.name !== undefined) entity.name = data.name;
        if (data.description !== undefined) entity.description = data.description;
        if (data.status !== undefined) entity.status = data.status;
        if (data.color !== undefined) entity.color = data.color;
        if (data.icon !== undefined) entity.icon = data.icon;
        if (data.startDate !== undefined) entity.startDate = data.startDate ? new Date(data.startDate) : undefined;
        if (data.endDate !== undefined) entity.endDate = data.endDate ? new Date(data.endDate) : undefined;
        if (data.estimatedHours !== undefined) entity.estimatedHours = data.estimatedHours;
        if (data.actualHours !== undefined) entity.actualHours = data.actualHours;
        if (data.tags !== undefined) entity.tags = data.tags;
        if (data.notes !== undefined) entity.notes = data.notes;
        if (data.taskIds !== undefined) entity.taskIds = data.taskIds;
        entity.updatedAt = new Date();
      }

      // 3. Guardar en repository
      const updatedEntity = await this.repository.update(id, entity);

      // 4. Mantener sincronización con lista local (compatibilidad)
      const updatedProject = updatedEntity.toProject();
      const projectIndex = this.projects.findIndex(p => p.id === id);
      if (projectIndex !== -1) {
        this.projects[projectIndex] = updatedProject;
        await this.saveProjects();
      }

      debugUtils.log('Project updated successfully', { id, updates: data });
      return updatedProject; // Retornar Project para compatibilidad
    } catch (error) {
      debugUtils.error('Error updating project', error);
      throw error;
    }
  }

  async deleteProject(id: string): Promise<void> {
    try {
      const projectIndex = this.projects.findIndex(project => project.id === id);
      if (projectIndex === -1) {
        throw new Error(`Project with id ${id} not found`);
      }

      this.projects.splice(projectIndex, 1);
      await this.saveProjects();
      
      debugUtils.log('Project deleted successfully', { id });
    } catch (error) {
      debugUtils.error('Error deleting project', error);
      throw error;
    }
  }

  async archiveProject(id: string): Promise<Project> {
    try {
      return await this.updateProject(id, { 
        isArchived: true,
        archivedAt: new Date()
      });
    } catch (error) {
      debugUtils.error('Error archiving project', error);
      throw error;
    }
  }

  async unarchiveProject(id: string): Promise<Project> {
    try {
      return await this.updateProject(id, { 
        isArchived: false,
        archivedAt: undefined
      });
    } catch (error) {
      debugUtils.error('Error unarchiving project', error);
      throw error;
    }
  }

  // ============================================================================
  // MÉTODOS DE CONSULTA
  // ============================================================================

  getProjects(): Project[] {
    return [...this.projects];
  }

  getProjectById(id: string): Project | undefined {
    return this.projects.find(project => project.id === id);
  }

  getProjectsByStatus(status: string): Project[] {
    return this.projects.filter(project => project.status === status);
  }

  getActiveProjects(): Project[] {
    return this.projects.filter(project => project.status === 'active' && !project.isArchived);
  }

  getArchivedProjects(): Project[] {
    return this.projects.filter(project => project.isArchived);
  }

  // ============================================================================
  // MÉTODOS DE FILTRADO Y ORDENAMIENTO
  // ============================================================================

  filterProjects(filters: ProjectFilters): Project[] {
    let filteredProjects = [...this.projects];

    // Filtrar por estado
    if (filters.status && filters.status.length > 0) {
      filteredProjects = filteredProjects.filter(project => 
        filters.status!.includes(project.status)
      );
    }

    // Filtrar por tags
    if (filters.tags && filters.tags.length > 0) {
      filteredProjects = filteredProjects.filter(project => 
        filters.tags!.some(tag => project.tags.includes(tag))
      );
    }

    // Filtrar por rango de fechas
    if (filters.dateRange) {
      if (filters.dateRange.from) {
        filteredProjects = filteredProjects.filter(project => 
          project.startDate && project.startDate >= filters.dateRange!.from!
        );
      }
      if (filters.dateRange.to) {
        filteredProjects = filteredProjects.filter(project => 
          project.endDate && project.endDate <= filters.dateRange!.to!
        );
      }
    }

    // Filtrar por búsqueda
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredProjects = filteredProjects.filter(project => 
        project.name.toLowerCase().includes(searchTerm) ||
        (project.description && project.description.toLowerCase().includes(searchTerm))
      );
    }

    // Filtrar por estado de archivado
    if (filters.isArchived !== undefined) {
      filteredProjects = filteredProjects.filter(project => 
        project.isArchived === filters.isArchived
      );
    }

    return filteredProjects;
  }

  sortProjects(projects: Project[], options: ProjectSortOptions): Project[] {
    return arrayUtils.sortBy(projects, options.field, options.direction);
  }

  // ============================================================================
  // MÉTODOS DE GESTIÓN DE TAREAS
  // ============================================================================

  async addTaskToProject(projectId: string, taskId: string): Promise<void> {
    try {
      const project = this.projects.find(p => p.id === projectId);
      if (!project) {
        throw new Error(`Project with id ${projectId} not found`);
      }

      if (!project.taskIds.includes(taskId)) {
        project.taskIds.push(taskId);
        project.updatedAt = new Date();
        await this.saveProjects();
        debugUtils.log('Task added to project', { projectId, taskId });
      }
    } catch (error) {
      debugUtils.error('Error adding task to project', error);
      throw error;
    }
  }

  async removeTaskFromProject(projectId: string, taskId: string): Promise<void> {
    try {
      const project = this.projects.find(p => p.id === projectId);
      if (!project) {
        throw new Error(`Project with id ${projectId} not found`);
      }

      project.taskIds = project.taskIds.filter(id => id !== taskId);
      project.updatedAt = new Date();
      await this.saveProjects();
      debugUtils.log('Task removed from project', { projectId, taskId });
    } catch (error) {
      debugUtils.error('Error removing task from project', error);
      throw error;
    }
  }

  getProjectsByTaskId(taskId: string): Project[] {
    return this.projects.filter(project => project.taskIds.includes(taskId));
  }

  // ============================================================================
  // MÉTODOS DE ESTADÍSTICAS
  // ============================================================================

  getStatistics(): ProjectStatistics {
    const total = this.projects.length;
    const open = this.projects.filter(project => project.status === 'open').length;
    const suspended = this.projects.filter(project => project.status === 'suspended').length;
    const cancelled = this.projects.filter(project => project.status === 'cancelled').length;
    const completed = this.projects.filter(project => project.status === 'completed').length;

    const averageProgress = this.projects.length > 0 
      ? this.projects.reduce((sum, project) => sum + project.progress, 0) / this.projects.length
      : 0;

    const totalEstimatedHours = this.projects.reduce((sum, project) => 
      sum + (project.estimatedHours || 0), 0
    );

    const totalActualHours = this.projects.reduce((sum, project) => 
      sum + (project.actualHours || 0), 0
    );

    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    // Distribución por estado
    const statusDistribution = this.projects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Distribución por progreso
    const progressDistribution = {
      '0-25': this.projects.filter(p => p.progress >= 0 && p.progress <= 25).length,
      '26-50': this.projects.filter(p => p.progress > 25 && p.progress <= 50).length,
      '51-75': this.projects.filter(p => p.progress > 50 && p.progress <= 75).length,
      '76-100': this.projects.filter(p => p.progress > 75 && p.progress <= 100).length
    };

    return {
      totalProjects: total,
      openProjects: open,
      suspendedProjects: suspended,
      cancelledProjects: cancelled,
      completedProjects: completed,
      averageProgress,
      totalEstimatedHours,
      totalActualHours,
      completionRate,
      averageCompletionTime: 0, // TODO: Implementar cálculo
      statusDistribution,
      progressDistribution
    };
  }

  // ============================================================================
  // MÉTODOS PRIVADOS
  // ============================================================================

  private async loadProjects(): Promise<void> {
    try {
      const projects = await storageService.get<Project[]>(this.storageKey);
      this.projects = projects || [];
      debugUtils.log(`Loaded ${this.projects.length} projects from storage`);
    } catch (error) {
      debugUtils.error('Error loading projects from storage', error);
      this.projects = [];
    }
  }

  private async saveProjects(): Promise<void> {
    try {
      await storageService.set(this.storageKey, this.projects);
      debugUtils.log(`Saved ${this.projects.length} projects to storage`);
    } catch (error) {
      debugUtils.error('Error saving projects to storage', error);
      throw error;
    }
  }

  private generateId(): string {
    return `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// ============================================================================
// INSTANCIA SINGLETON
// ============================================================================

export const projectService = new ProjectService();
