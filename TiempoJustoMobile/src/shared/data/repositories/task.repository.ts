// ============================================================================
// TASK REPOSITORY - TIEMPOJUSTO
// ============================================================================

import { Task } from '../../types';
import { STORAGE_KEYS } from '../../constants';
import { TaskEntity } from '../entities/task.entity';
import { BaseRepository } from './base.repository';

/**
 * Repositorio específico para Tareas
 * Abstrae las operaciones de persistencia de tareas
 */
export class TaskRepository extends BaseRepository<TaskEntity, Task> {
  protected storageKey = STORAGE_KEYS.TASKS;

  /**
   * Serializa TaskEntity a Task para persistencia
   * Convierte la entidad al formato original para compatibilidad
   */
  protected serialize(entity: TaskEntity): Task {
    return entity.toTask();
  }

  /**
   * Deserializa Task a TaskEntity desde persistencia
   * Convierte el formato de persistencia a entidad de dominio
   */
  protected deserialize(model: Task): TaskEntity {
    return TaskEntity.fromTask(model);
  }

  /**
   * Busca tareas por proyecto
   */
  async findByProject(projectId: string): Promise<TaskEntity[]> {
    return this.findBy(entity => entity.projectId === projectId);
  }

  /**
   * Busca tareas por prioridad
   */
  async findByPriority(priority: 'A' | 'B' | 'C' | 'D'): Promise<TaskEntity[]> {
    return this.findBy(entity => entity.priority === priority);
  }

  /**
   * Busca tareas por estado
   */
  async findByStatus(status: 'pending' | 'in_progress' | 'completed' | 'cancelled'): Promise<TaskEntity[]> {
    return this.findBy(entity => entity.status === status);
  }

  /**
   * Busca tareas completadas
   */
  async findCompleted(): Promise<TaskEntity[]> {
    return this.findBy(entity => entity.status === 'completed');
  }

  /**
   * Busca tareas pendientes
   */
  async findPending(): Promise<TaskEntity[]> {
    return this.findBy(entity => entity.status === 'pending');
  }

  /**
   * Busca tareas vencidas
   */
  async findOverdue(): Promise<TaskEntity[]> {
    const allTasks = await this.findAll();
    return allTasks.filter(entity => entity.isOverdue());
  }

  /**
   * Busca tareas por tag
   */
  async findByTag(tag: string): Promise<TaskEntity[]> {
    return this.findBy(entity => entity.tags.includes(tag));
  }

  /**
   * Obtiene todas las prioridades disponibles
   */
  async getPriorities(): Promise<('A' | 'B' | 'C' | 'D')[]> {
    const tasks = await this.findAll();
    const priorities = [...new Set(tasks.map(task => task.priority))];
    return priorities.sort(); // A, B, C, D
  }

  /**
   * Obtiene todas las tags disponibles
   */
  async getTags(): Promise<string[]> {
    const tasks = await this.findAll();
    const allTags = tasks.flatMap(task => task.tags);
    return [...new Set(allTags)].sort();
  }

  /**
   * Obtiene estadísticas básicas
   */
  async getStats(): Promise<{
    total: number;
    completed: number;
    pending: number;
    inProgress: number;
    overdue: number;
  }> {
    const allTasks = await this.findAll();
    const overdueTasks = await this.findOverdue();

    return {
      total: allTasks.length,
      completed: allTasks.filter(t => t.status === 'completed').length,
      pending: allTasks.filter(t => t.status === 'pending').length,
      inProgress: allTasks.filter(t => t.status === 'in_progress').length,
      overdue: overdueTasks.length
    };
  }
}


