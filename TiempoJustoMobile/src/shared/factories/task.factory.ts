// ============================================================================
// FACTORY DE TAREAS - TIEMPOJUSTO
// ============================================================================

import { Task, CreateTaskData, TaskPriority } from '../types';

/**
 * Factory para crear tareas con diferentes patrones de creación
 */
export class TaskFactory {
  /**
   * Crea una tarea estándar con validación
   */
  static createStandard(data: CreateTaskData): Task {
    this.validateCreateData(data);

    return {
      id: this.generateId(),
      title: data.title.trim(),
      description: data.description?.trim(),
      priority: data.priority,
      status: 'pending',
      projectId: data.projectId,
      dueDate: data.dueDate,
      estimatedTime: data.estimatedTime,
      actualTime: undefined,
      tags: data.tags || [],
      isRecurring: data.isRecurring || false,
      recurringPattern: data.recurringPattern,
      completedAt: undefined,
      notes: undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Crea una tarea recurrente
   */
  static createRecurring(data: CreateTaskData): Task {
    if (!data.isRecurring || !data.recurringPattern) {
      throw new Error('Tarea recurrente requiere recurringPattern');
    }
    return this.createStandard(data);
  }

  /**
   * Crea una tarea urgente (Prioridad A, fecha hoy)
   */
  static createUrgent(
    title: string,
    projectId: string,
    description?: string
  ): Task {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Final del día

    return this.createStandard({
      title,
      description,
      priority: 'A' as TaskPriority,
      projectId,
      dueDate: today
    });
  }

  /**
   * Crea una tarea rápida (mínimos campos)
   */
  static createQuick(title: string, projectId: string): Task {
    return this.createStandard({
      title,
      priority: 'D' as TaskPriority,
      projectId
    });
  }

  /**
   * Valida datos de creación
   */
  private static validateCreateData(data: CreateTaskData): void {
    if (!data.title || data.title.trim().length === 0) {
      throw new Error('El título es requerido');
    }

    if (data.title.length > 200) {
      throw new Error('El título no puede exceder 200 caracteres');
    }

    if (!data.projectId || data.projectId.trim().length === 0) {
      throw new Error('El proyecto es requerido');
    }

    if (!['A', 'B', 'C', 'D'].includes(data.priority)) {
      throw new Error('La prioridad debe ser A, B, C o D');
    }

    if (data.estimatedTime !== undefined && data.estimatedTime < 0) {
      throw new Error('El tiempo estimado no puede ser negativo');
    }
  }

  /**
   * Genera un ID único para tareas
   */
  private static generateId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}


