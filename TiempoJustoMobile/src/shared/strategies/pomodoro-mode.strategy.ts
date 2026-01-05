// ============================================================================
// ESTRATEGIAS DE MODOS DE POMODORO - TIEMPOJUSTO
// ============================================================================

import { PomodoroConfig } from '../types';

/**
 * Interfaz para estrategias de modos de Pomodoro
 * Cada estrategia representa un tipo diferente de sesión
 */
export interface PomodoroModeStrategy {
  /**
   * Obtiene la duración del modo en minutos
   */
  getDuration(): number;

  /**
   * Obtiene el color representativo del modo
   */
  getColor(): string;

  /**
   * Obtiene el nombre identificador del modo
   */
  getName(): string;

  /**
   * Obtiene la etiqueta legible del modo
   */
  getLabel(): string;

  /**
   * Obtiene la descripción del modo
   */
  getDescription(): string;

  /**
   * Indica si el modo permite pausas
   */
  allowsPauses(): boolean;

  /**
   * Indica si el modo puede ser cancelado
   */
  canBeCancelled(): boolean;
}

/**
 * Estrategia para sesiones de trabajo
 */
export class WorkModeStrategy implements PomodoroModeStrategy {
  constructor(private config: PomodoroConfig) {}

  getName(): string {
    return 'work';
  }

  getLabel(): string {
    return 'TRABAJO';
  }

  getDescription(): string {
    return 'Sesión de concentración y trabajo enfocado';
  }

  getDuration(): number {
    return this.config.workDuration;
  }

  getColor(): string {
    return '#ef4444'; // red-500
  }

  allowsPauses(): boolean {
    return true;
  }

  canBeCancelled(): boolean {
    return true;
  }
}

/**
 * Estrategia para descansos cortos
 */
export class ShortBreakStrategy implements PomodoroModeStrategy {
  constructor(private config: PomodoroConfig) {}

  getName(): string {
    return 'shortBreak';
  }

  getLabel(): string {
    return 'DESCANSO CORTO';
  }

  getDescription(): string {
    return 'Pausa breve para descansar la mente';
  }

  getDuration(): number {
    return this.config.shortBreakDuration;
  }

  getColor(): string {
    return '#10b981'; // emerald-500
  }

  allowsPauses(): boolean {
    return false; // Los descansos no deberían pausarse
  }

  canBeCancelled(): boolean {
    return true;
  }
}

/**
 * Estrategia para descansos largos
 */
export class LongBreakStrategy implements PomodoroModeStrategy {
  constructor(private config: PomodoroConfig) {}

  getName(): string {
    return 'longBreak';
  }

  getLabel(): string {
    return 'DESCANSO LARGO';
  }

  getDescription(): string {
    return 'Descanso extendido después de varios ciclos de trabajo';
  }

  getDuration(): number {
    return this.config.longBreakDuration;
  }

  getColor(): string {
    return '#3b82f6'; // blue-500
  }

  allowsPauses(): boolean {
    return true; // Los descansos largos pueden pausarse
  }

  canBeCancelled(): boolean {
    return true;
  }
}

/**
 * Estrategia para sesiones de trabajo personalizadas
 */
export class CustomWorkStrategy implements PomodoroModeStrategy {
  constructor(
    private duration: number,
    private config: PomodoroConfig
  ) {}

  getName(): string {
    return 'customWork';
  }

  getLabel(): string {
    return `TRABAJO ${this.duration}MIN`;
  }

  getDescription(): string {
    return `Sesión de trabajo personalizada de ${this.duration} minutos`;
  }

  getDuration(): number {
    return this.duration;
  }

  getColor(): string {
    return '#f59e0b'; // amber-500
  }

  allowsPauses(): boolean {
    return true;
  }

  canBeCancelled(): boolean {
    return true;
  }
}

/**
 * Estrategia para descansos personalizados
 */
export class CustomBreakStrategy implements PomodoroModeStrategy {
  constructor(
    private duration: number,
    private config: PomodoroConfig
  ) {}

  getName(): string {
    return 'customBreak';
  }

  getLabel(): string {
    return `DESCANSO ${this.duration}MIN`;
  }

  getDescription(): string {
    return `Descanso personalizado de ${this.duration} minutos`;
  }

  getDuration(): number {
    return this.duration;
  }

  getColor(): string {
    return '#8b5cf6'; // violet-500
  }

  allowsPauses(): boolean {
    return false;
  }

  canBeCancelled(): boolean {
    return true;
  }
}

/**
 * Contexto que utiliza estrategias de modos de Pomodoro
 */
export class PomodoroModeContext {
  private strategy: PomodoroModeStrategy;

  constructor(
    strategy: PomodoroModeStrategy,
    private config: PomodoroConfig
  ) {
    this.strategy = strategy;
  }

  /**
   * Establece la estrategia de modo
   */
  setStrategy(strategy: PomodoroModeStrategy): void {
    this.strategy = strategy;
  }

  /**
   * Obtiene la estrategia actual
   */
  getStrategy(): PomodoroModeStrategy {
    return this.strategy;
  }

  /**
   * Cambia al siguiente modo en secuencia
   */
  nextMode(): PomodoroModeStrategy {
    const currentName = this.strategy.getName();

    switch (currentName) {
      case 'work':
        return new ShortBreakStrategy(this.config);
      case 'shortBreak':
        return new WorkModeStrategy(this.config);
      case 'longBreak':
        return new WorkModeStrategy(this.config);
      default:
        return new WorkModeStrategy(this.config);
    }
  }

  /**
   * Obtiene todas las estrategias disponibles
   */
  static getAvailableStrategies(config: PomodoroConfig): PomodoroModeStrategy[] {
    return [
      new WorkModeStrategy(config),
      new ShortBreakStrategy(config),
      new LongBreakStrategy(config)
    ];
  }

  /**
   * Crea una estrategia por nombre
   */
  static createStrategyByName(name: string, config: PomodoroConfig): PomodoroModeStrategy {
    const strategies = this.getAvailableStrategies(config);
    const strategy = strategies.find(s => s.getName() === name);

    if (!strategy) {
      throw new Error(`Estrategia de modo '${name}' no encontrada`);
    }

    return strategy;
  }

  /**
   * Crea una estrategia de trabajo personalizada
   */
  static createCustomWork(duration: number, config: PomodoroConfig): PomodoroModeStrategy {
    return new CustomWorkStrategy(duration, config);
  }

  /**
   * Crea una estrategia de descanso personalizada
   */
  static createCustomBreak(duration: number, config: PomodoroConfig): PomodoroModeStrategy {
    return new CustomBreakStrategy(duration, config);
  }
}