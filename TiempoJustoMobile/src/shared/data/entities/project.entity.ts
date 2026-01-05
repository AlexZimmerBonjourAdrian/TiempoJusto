// ============================================================================
// ENTIDAD DE DOMINIO DE PROYECTO - TIEMPOJUSTO
// ============================================================================

import { Project, ProjectStatus } from '../../types';

/**
 * Entidad de dominio de Proyecto
 * Contiene lógica de negocio y validaciones
 * Representa el concepto de negocio de un proyecto
 */
export class ProjectEntity {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  color: string;
  icon?: string;
  startDate?: Date;
  endDate?: Date;
  estimatedHours?: number;
  actualHours: number;
  progress: number; // 0-100
  tags: string[];
  notes?: string;
  taskIds: string[];
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<ProjectEntity>) {
    this.id = data.id || this.generateId();
    this.name = data.name || '';
    this.description = data.description;
    this.status = data.status || 'open';
    this.color = data.color || '#3b82f6';
    this.icon = data.icon;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.estimatedHours = data.estimatedHours;
    this.actualHours = data.actualHours || 0;
    this.progress = data.progress || 0;
    this.tags = data.tags || [];
    this.notes = data.notes;
    this.taskIds = data.taskIds || [];
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();

    this.validate();
  }

  // ============================================================================
  // LÓGICA DE NEGOCIO
  // ============================================================================

  /**
   * Completa el proyecto
   */
  complete(): void {
    if (this.status === 'completed') {
      throw new Error('El proyecto ya está completado');
    }

    this.status = 'completed';
    this.progress = 100;
    this.updatedAt = new Date();
  }

  /**
   * Actualiza el progreso del proyecto
   */
  updateProgress(progress: number): void {
    if (progress < 0 || progress > 100) {
      throw new Error('El progreso debe estar entre 0 y 100');
    }

    this.progress = progress;

    // Si llega a 100%, marcar como completado
    if (progress === 100 && this.status === 'open') {
      this.complete();
    }

    this.updatedAt = new Date();
  }

  /**
   * Agrega una tarea al proyecto
   */
  addTask(taskId: string): void {
    if (!this.taskIds.includes(taskId)) {
      this.taskIds.push(taskId);
      this.updatedAt = new Date();
    }
  }

  /**
   * Remueve una tarea del proyecto
   */
  removeTask(taskId: string): void {
    this.taskIds = this.taskIds.filter(id => id !== taskId);
    this.updatedAt = new Date();
  }

  /**
   * Verifica si el proyecto está activo
   */
  isActive(): boolean {
    return this.status === 'open' || this.status === 'suspended';
  }

  /**
   * Verifica si el proyecto está vencido
   */
  isOverdue(): boolean {
    if (!this.endDate || this.status === 'completed') {
      return false;
    }
    return new Date() > this.endDate;
  }

  /**
   * Actualiza horas trabajadas
   */
  addActualHours(hours: number): void {
    this.actualHours += hours;
    this.updatedAt = new Date();
  }

  /**
   * Agrega un tag al proyecto
   */
  addTag(tag: string): void {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
      this.updatedAt = new Date();
    }
  }

  /**
   * Remueve un tag del proyecto
   */
  removeTag(tag: string): void {
    this.tags = this.tags.filter(t => t !== tag);
    this.updatedAt = new Date();
  }

  // ============================================================================
  // VALIDACIONES
  // ============================================================================

  /**
   * Valida el estado de la entidad
   */
  private validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('El nombre del proyecto es requerido');
    }

    if (this.name.length > 100) {
      throw new Error('El nombre no puede exceder 100 caracteres');
    }

    if (!this.color || !/^#[0-9A-F]{6}$/i.test(this.color)) {
      throw new Error('El color debe ser un código hexadecimal válido');
    }

    if (this.startDate && this.endDate && this.startDate > this.endDate) {
      throw new Error('La fecha de inicio no puede ser posterior a la fecha de fin');
    }

    if (this.progress < 0 || this.progress > 100) {
      throw new Error('El progreso debe estar entre 0 y 100');
    }

    if (this.actualHours < 0) {
      throw new Error('Las horas trabajadas no pueden ser negativas');
    }

    if (this.estimatedHours !== undefined && this.estimatedHours < 0) {
      throw new Error('Las horas estimadas no pueden ser negativas');
    }
  }

  // ============================================================================
  // CONVERSIÓN PARA COMPATIBILIDAD
  // ============================================================================

  /**
   * Convierte la entidad al tipo Project original
   */
  toProject(): Project {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      status: this.status,
      color: this.color,
      icon: this.icon,
      startDate: this.startDate,
      endDate: this.endDate,
      estimatedHours: this.estimatedHours,
      actualHours: this.actualHours,
      progress: this.progress,
      tags: this.tags,
      notes: this.notes,
      taskIds: this.taskIds,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Crea una entidad desde un objeto Project
   */
  static fromProject(project: Project): ProjectEntity {
    return new ProjectEntity({
      id: project.id,
      name: project.name,
      description: project.description,
      status: project.status,
      color: project.color,
      icon: project.icon,
      startDate: project.startDate,
      endDate: project.endDate,
      estimatedHours: project.estimatedHours,
      actualHours: project.actualHours,
      progress: project.progress,
      tags: project.tags,
      notes: project.notes,
      taskIds: project.taskIds,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt
    });
  }

  // ============================================================================
  // UTILIDADES
  // ============================================================================

  /**
   * Genera un ID único para proyectos
   */
  private generateId(): string {
    return `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Obtiene una representación de cadena de la entidad
   */
  toString(): string {
    return `ProjectEntity(id: ${this.id}, name: "${this.name}", status: ${this.status}, progress: ${this.progress}%)`;
  }
}
