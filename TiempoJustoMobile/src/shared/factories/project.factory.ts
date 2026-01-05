// ============================================================================
// FACTORY DE PROYECTOS - TIEMPOJUSTO
// ============================================================================

import { Project, CreateProjectData, ProjectStatus } from '../types';

/**
 * Factory para crear proyectos con diferentes patrones de creación
 */
export class ProjectFactory {
  /**
   * Crea un proyecto estándar con validación
   */
  static createStandard(data: CreateProjectData): Project {
    this.validateCreateData(data);

    return {
      id: this.generateId(),
      name: data.name.trim(),
      description: data.description?.trim(),
      status: 'open' as ProjectStatus,
      color: data.color,
      icon: data.icon,
      startDate: data.startDate,
      endDate: data.endDate,
      estimatedHours: data.estimatedHours,
      actualHours: 0,
      progress: 0,
      tags: data.tags || [],
      notes: undefined,
      taskIds: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Crea un proyecto con fecha de inicio hoy
   */
  static createWithStartToday(data: Omit<CreateProjectData, 'startDate'>): Project {
    const project = this.createStandard(data);
    project.startDate = new Date();
    return project;
  }

  /**
   * Crea un proyecto rápido (solo nombre y color)
   */
  static createQuick(name: string, color: string = '#3b82f6'): Project {
    return this.createStandard({
      name,
      color,
      tags: []
    });
  }

  /**
   * Crea un proyecto desde un template
   */
  static createFromTemplate(templateName: string): Project {
    const templates: Record<string, Partial<CreateProjectData>> = {
      personal: {
        name: 'Proyecto Personal',
        color: '#3b82f6',
        icon: '👤'
      },
      work: {
        name: 'Proyecto de Trabajo',
        color: '#10b981',
        icon: '💼'
      },
      learning: {
        name: 'Proyecto de Aprendizaje',
        color: '#f59e0b',
        icon: '📚'
      }
    };

    const template = templates[templateName] || templates.personal;

    return this.createStandard({
      name: template.name || 'Nuevo Proyecto',
      color: template.color || '#3b82f6',
      icon: template.icon,
      tags: []
    });
  }

  /**
   * Valida datos de creación
   */
  private static validateCreateData(data: CreateProjectData): void {
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('El nombre es requerido');
    }

    if (data.name.length > 100) {
      throw new Error('El nombre no puede exceder 100 caracteres');
    }

    if (!data.color || !/^#[0-9A-F]{6}$/i.test(data.color)) {
      throw new Error('El color debe ser un código hexadecimal válido');
    }

    if (data.startDate && data.endDate && data.startDate > data.endDate) {
      throw new Error('La fecha de inicio no puede ser posterior a la fecha de fin');
    }

    if (data.estimatedHours !== undefined && data.estimatedHours < 0) {
      throw new Error('Las horas estimadas no pueden ser negativas');
    }
  }

  /**
   * Genera un ID único para proyectos
   */
  private static generateId(): string {
    return `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}


