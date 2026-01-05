// ============================================================================
// ENTIDAD DE DOMINIO DE TAREA - TIEMPOJUSTO
// ============================================================================

import { Task, TaskPriority, TaskStatus } from '../../types';

/**
 * Entidad de dominio de Tarea
 * Contiene lógica de negocio y validaciones
 * Representa el concepto de negocio de una tarea
 */
export class TaskEntity {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  projectId: string;
  dueDate?: Date;
  estimatedTime?: number; // minutos
  actualTime?: number; // minutos
  tags: string[];
  isRecurring: boolean;
  recurringPattern?: any; // TODO: Definir tipo específico
  completedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<TaskEntity>) {
    this.id = data.id || this.generateId();
    this.title = data.title || '';
    this.description = data.description;
    this.priority = data.priority || 'D';
    this.status = data.status || 'pending';
    this.projectId = data.projectId || '';
    this.dueDate = data.dueDate;
    this.estimatedTime = data.estimatedTime;
    this.actualTime = data.actualTime;
    this.tags = data.tags || [];
    this.isRecurring = data.isRecurring || false;
    this.recurringPattern = data.recurringPattern;
    this.completedAt = data.completedAt;
    this.notes = data.notes;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();

    this.validate();
  }

  // ============================================================================
  // LÓGICA DE NEGOCIO
  // ============================================================================

  /**
   * Marca la tarea como completada
   * Actualiza el estado, fecha de completado y timestamps
   */
  complete(): void {
    if (this.status === 'completed') {
      throw new Error('La tarea ya está completada');
    }

    this.status = 'completed';
    this.completedAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * Verifica si la tarea está vencida
   * Una tarea está vencida si tiene fecha de vencimiento, no está completada
   * y la fecha actual es posterior a la fecha de vencimiento
   */
  isOverdue(): boolean {
    if (!this.dueDate || this.status === 'completed') {
      return false;
    }
    return new Date() > this.dueDate;
  }

  /**
   * Verifica si la tarea puede ser completada
   * Una tarea puede completarse si no está completada ni cancelada
   */
  canComplete(): boolean {
    return this.status !== 'completed' && this.status !== 'cancelled';
  }

  /**
   * Actualiza la prioridad de la tarea
   */
  updatePriority(priority: TaskPriority): void {
    this.priority = priority;
    this.updatedAt = new Date();
  }

  /**
   * Agrega un tag a la tarea
   */
  addTag(tag: string): void {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
      this.updatedAt = new Date();
    }
  }

  /**
   * Remueve un tag de la tarea
   */
  removeTag(tag: string): void {
    this.tags = this.tags.filter(t => t !== tag);
    this.updatedAt = new Date();
  }

  /**
   * Calcula el tiempo restante estimado
   */
  getRemainingTime(): number | null {
    if (!this.estimatedTime || !this.actualTime) {
      return null;
    }
    return Math.max(0, this.estimatedTime - this.actualTime);
  }

  /**
   * Verifica si la tarea está en progreso
   */
  isInProgress(): boolean {
    return this.status === 'in_progress';
  }

  /**
   * Verifica si la tarea está pendiente
   */
  isPending(): boolean {
    return this.status === 'pending';
  }

  // ============================================================================
  // VALIDACIONES
  // ============================================================================

  /**
   * Valida el estado de la entidad
   */
  private validate(): void {
    if (!this.title || this.title.trim().length === 0) {
      throw new Error('El título de la tarea es requerido');
    }

    if (this.title.length > 200) {
      throw new Error('El título no puede exceder 200 caracteres');
    }

    if (!this.projectId || this.projectId.trim().length === 0) {
      throw new Error('La tarea debe pertenecer a un proyecto');
    }

    if (!['A', 'B', 'C', 'D'].includes(this.priority)) {
      throw new Error('La prioridad debe ser A, B, C o D');
    }

    if (!['pending', 'in_progress', 'completed', 'cancelled'].includes(this.status)) {
      throw new Error('El estado no es válido');
    }

    if (this.estimatedTime !== undefined && this.estimatedTime < 0) {
      throw new Error('El tiempo estimado no puede ser negativo');
    }

    if (this.actualTime !== undefined && this.actualTime < 0) {
      throw new Error('El tiempo actual no puede ser negativo');
    }

    if (this.dueDate && this.dueDate < this.createdAt) {
      throw new Error('La fecha de vencimiento no puede ser anterior a la creación');
    }
  }

  // ============================================================================
  // CONVERSIÓN PARA COMPATIBILIDAD
  // ============================================================================

  /**
   * Convierte la entidad al tipo Task original
   * Para mantener compatibilidad con código existente
   */
  toTask(): Task {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      priority: this.priority,
      status: this.status,
      projectId: this.projectId,
      dueDate: this.dueDate,
      estimatedTime: this.estimatedTime,
      actualTime: this.actualTime,
      tags: this.tags,
      isRecurring: this.isRecurring,
      recurringPattern: this.recurringPattern,
      completedAt: this.completedAt,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Crea una entidad desde un objeto Task
   * Para conversión desde tipos existentes
   */
  static fromTask(task: Task): TaskEntity {
    return new TaskEntity({
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      projectId: task.projectId,
      dueDate: task.dueDate,
      estimatedTime: task.estimatedTime,
      actualTime: task.actualTime,
      tags: task.tags,
      isRecurring: task.isRecurring,
      recurringPattern: task.recurringPattern,
      completedAt: task.completedAt,
      notes: task.notes,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    });
  }

  // ============================================================================
  // UTILIDADES
  // ============================================================================

  /**
   * Genera un ID único para tareas
   */
  private generateId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Obtiene una representación de cadena de la entidad
   */
  toString(): string {
    return `TaskEntity(id: ${this.id}, title: "${this.title}", priority: ${this.priority}, status: ${this.status})`;
  }
}


