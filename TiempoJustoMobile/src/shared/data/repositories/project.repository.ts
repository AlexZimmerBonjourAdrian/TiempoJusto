// ============================================================================
// PROJECT REPOSITORY - TIEMPOJUSTO
// ============================================================================

import { Project } from '../../types';
import { STORAGE_KEYS } from '../../constants';
import { ProjectEntity } from '../entities/project.entity';
import { BaseRepository } from './base.repository';

/**
 * Repositorio específico para Proyectos
 * Abstrae las operaciones de persistencia de proyectos
 */
export class ProjectRepository extends BaseRepository<ProjectEntity, Project> {
  protected storageKey = STORAGE_KEYS.PROJECTS;

  /**
   * Serializa ProjectEntity a Project para persistencia
   */
  protected serialize(entity: ProjectEntity): Project {
    return entity.toProject();
  }

  /**
   * Deserializa Project a ProjectEntity desde persistencia
   */
  protected deserialize(model: Project): ProjectEntity {
    return ProjectEntity.fromProject(model);
  }

  /**
   * Busca proyectos por estado
   */
  async findByStatus(status: 'open' | 'suspended' | 'cancelled' | 'completed'): Promise<ProjectEntity[]> {
    return this.findBy(entity => entity.status === status);
  }

  /**
   * Busca proyectos por tag
   */
  async findByTag(tag: string): Promise<ProjectEntity[]> {
    return this.findBy(entity => entity.tags.includes(tag));
  }

  /**
   * Busca proyectos activos (no completados ni cancelados)
   */
  async findActive(): Promise<ProjectEntity[]> {
    return this.findBy(entity => entity.status === 'open' || entity.status === 'suspended');
  }

  /**
   * Busca proyectos completados
   */
  async findCompleted(): Promise<ProjectEntity[]> {
    return this.findBy(entity => entity.status === 'completed');
  }

  /**
   * Obtiene estadísticas básicas
   */
  async getStats(): Promise<{
    total: number;
    active: number;
    completed: number;
    suspended: number;
    cancelled: number;
  }> {
    const allProjects = await this.findAll();

    return {
      total: allProjects.length,
      active: allProjects.filter(p => p.status === 'open').length,
      completed: allProjects.filter(p => p.status === 'completed').length,
      suspended: allProjects.filter(p => p.status === 'suspended').length,
      cancelled: allProjects.filter(p => p.status === 'cancelled').length
    };
  }

  /**
   * Obtiene todas las tags disponibles
   */
  async getTags(): Promise<string[]> {
    const projects = await this.findAll();
    const allTags = projects.flatMap(project => project.tags);
    return [...new Set(allTags)].sort();
  }
}
