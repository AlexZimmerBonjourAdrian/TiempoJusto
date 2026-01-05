// ============================================================================
// ESTRATEGIAS DE ORDENAMIENTO DE TAREAS - TIEMPOJUSTO
// ============================================================================

import { Task } from '../types';

/**
 * Interfaz para estrategias de ordenamiento de tareas
 */
export interface TaskSortStrategy {
  /**
   * Ordena un array de tareas según la estrategia específica
   */
  sort(tasks: Task[]): Task[];

  /**
   * Retorna el nombre identificador de la estrategia
   */
  getName(): string;

  /**
   * Retorna la descripción legible de la estrategia
   */
  getDescription(): string;
}

/**
 * Estrategia que ordena por prioridad (A > B > C > D)
 * Las tareas más importantes aparecen primero
 */
export class PrioritySortStrategy implements TaskSortStrategy {
  getName(): string {
    return 'priority';
  }

  getDescription(): string {
    return 'Ordenar por prioridad (A-D)';
  }

  sort(tasks: Task[]): Task[] {
    const priorityOrder = { A: 1, B: 2, C: 3, D: 4 };

    return [...tasks].sort((a, b) => {
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];

      // Si tienen la misma prioridad, ordenar por fecha de creación (más recientes primero)
      if (priorityDiff === 0) {
        return b.createdAt.getTime() - a.createdAt.getTime();
      }

      return priorityDiff;
    });
  }
}

/**
 * Estrategia que ordena por fecha de vencimiento
 * Las tareas más próximas a vencer aparecen primero
 */
export class DueDateSortStrategy implements TaskSortStrategy {
  getName(): string {
    return 'dueDate';
  }

  getDescription(): string {
    return 'Ordenar por fecha de vencimiento';
  }

  sort(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) => {
      // Tareas sin fecha van al final
      if (!a.dueDate && !b.dueDate) {
        return b.createdAt.getTime() - a.createdAt.getTime();
      }

      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;

      return a.dueDate.getTime() - b.dueDate.getTime();
    });
  }
}

/**
 * Estrategia que ordena por fecha de creación
 * Las tareas más recientes aparecen primero
 */
export class CreatedDateSortStrategy implements TaskSortStrategy {
  getName(): string {
    return 'createdDate';
  }

  getDescription(): string {
    return 'Ordenar por fecha de creación';
  }

  sort(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) =>
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }
}

/**
 * Estrategia que ordena por estado
 * Pendientes primero, luego en progreso, completadas y canceladas
 */
export class StatusSortStrategy implements TaskSortStrategy {
  getName(): string {
    return 'status';
  }

  getDescription(): string {
    return 'Ordenar por estado';
  }

  sort(tasks: Task[]): Task[] {
    const statusOrder = {
      pending: 1,
      in_progress: 2,
      completed: 3,
      cancelled: 4
    };

    return [...tasks].sort((a, b) => {
      const statusDiff = statusOrder[a.status] - statusOrder[b.status];

      // Si tienen el mismo estado, ordenar por prioridad
      if (statusDiff === 0) {
        const priorityOrder = { A: 1, B: 2, C: 3, D: 4 };
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];

        if (priorityDiff === 0) {
          return b.createdAt.getTime() - a.createdAt.getTime();
        }

        return priorityDiff;
      }

      return statusDiff;
    });
  }
}

/**
 * Estrategia que ordena por título alfabéticamente
 */
export class TitleSortStrategy implements TaskSortStrategy {
  getName(): string {
    return 'title';
  }

  getDescription(): string {
    return 'Ordenar alfabéticamente por título';
  }

  sort(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) =>
      a.title.toLowerCase().localeCompare(b.title.toLowerCase())
    );
  }
}

/**
 * Estrategia que ordena por proyecto y luego por prioridad
 */
export class ProjectSortStrategy implements TaskSortStrategy {
  getName(): string {
    return 'project';
  }

  getDescription(): string {
    return 'Ordenar por proyecto y prioridad';
  }

  sort(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) => {
      // Primero ordenar por proyecto
      const projectDiff = a.projectId.localeCompare(b.projectId);

      if (projectDiff !== 0) {
        return projectDiff;
      }

      // Dentro del mismo proyecto, ordenar por prioridad
      const priorityOrder = { A: 1, B: 2, C: 3, D: 4 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];

      if (priorityDiff === 0) {
        return b.createdAt.getTime() - a.createdAt.getTime();
      }

      return priorityDiff;
    });
  }
}

/**
 * Contexto que utiliza estrategias de ordenamiento
 * Permite cambiar la estrategia dinámicamente
 */
export class TaskSortContext {
  private strategy: TaskSortStrategy;

  constructor(strategy: TaskSortStrategy = new PrioritySortStrategy()) {
    this.strategy = strategy;
  }

  /**
   * Establece la estrategia de ordenamiento
   */
  setStrategy(strategy: TaskSortStrategy): void {
    this.strategy = strategy;
  }

  /**
   * Ordena las tareas usando la estrategia actual
   */
  sort(tasks: Task[]): Task[] {
    return this.strategy.sort(tasks);
  }

  /**
   * Obtiene el nombre de la estrategia actual
   */
  getStrategyName(): string {
    return this.strategy.getName();
  }

  /**
   * Obtiene la descripción de la estrategia actual
   */
  getStrategyDescription(): string {
    return this.strategy.getDescription();
  }

  /**
   * Obtiene todas las estrategias disponibles
   */
  static getAvailableStrategies(): TaskSortStrategy[] {
    return [
      new PrioritySortStrategy(),
      new DueDateSortStrategy(),
      new CreatedDateSortStrategy(),
      new StatusSortStrategy(),
      new TitleSortStrategy(),
      new ProjectSortStrategy()
    ];
  }

  /**
   * Crea una estrategia por nombre
   */
  static createStrategyByName(name: string): TaskSortStrategy {
    const strategies = this.getAvailableStrategies();
    const strategy = strategies.find(s => s.getName() === name);

    if (!strategy) {
      throw new Error(`Estrategia de ordenamiento '${name}' no encontrada`);
    }

    return strategy;
  }
}