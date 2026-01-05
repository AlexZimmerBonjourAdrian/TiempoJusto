// ============================================================================
// FACTORY DE POMODORO - TIEMPOJUSTO
// ============================================================================

import { PomodoroSession, CreatePomodoroSessionData, PomodoroConfig, PomodoroState } from '../types';

/**
 * Factory para crear sesiones de Pomodoro con diferentes patrones
 */
export class PomodoroFactory {
  /**
   * Crea una sesión de trabajo
   */
  static createWorkSession(
    config: PomodoroConfig,
    data?: CreatePomodoroSessionData
  ): PomodoroSession {
    return {
      id: this.generateId(),
      taskId: data?.taskId,
      projectId: data?.projectId,
      state: 'working' as PomodoroState,
      duration: data?.duration || config.workDuration,
      remainingTime: (data?.duration || config.workDuration) * 60,
      isActive: true,
      isPaused: false,
      startTime: new Date(),
      endTime: undefined,
      pauseTime: undefined,
      totalPauseTime: 0,
      completedCycles: 0,
      totalCycles: data?.totalCycles || 1,
      notes: data?.notes,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Crea una sesión de descanso corto
   */
  static createShortBreak(config: PomodoroConfig): PomodoroSession {
    return {
      id: this.generateId(),
      state: 'short_break' as PomodoroState,
      duration: config.shortBreakDuration,
      remainingTime: config.shortBreakDuration * 60,
      isActive: true,
      isPaused: false,
      startTime: new Date(),
      endTime: undefined,
      pauseTime: undefined,
      totalPauseTime: 0,
      completedCycles: 0,
      totalCycles: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Crea una sesión de descanso largo
   */
  static createLongBreak(config: PomodoroConfig): PomodoroSession {
    return {
      id: this.generateId(),
      state: 'long_break' as PomodoroState,
      duration: config.longBreakDuration,
      remainingTime: config.longBreakDuration * 60,
      isActive: true,
      isPaused: false,
      startTime: new Date(),
      endTime: undefined,
      pauseTime: undefined,
      totalPauseTime: 0,
      completedCycles: 0,
      totalCycles: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Crea una sesión asociada a una tarea
   */
  static createTaskSession(
    config: PomodoroConfig,
    taskId: string,
    projectId?: string,
    duration?: number
  ): PomodoroSession {
    const session = this.createWorkSession(config, { taskId, projectId, duration });
    return session;
  }

  /**
   * Crea una sesión personalizada
   */
  static createCustom(
    duration: number,
    state: PomodoroState = 'working'
  ): PomodoroSession {
    return {
      id: this.generateId(),
      state,
      duration,
      remainingTime: duration * 60,
      isActive: true,
      isPaused: false,
      startTime: new Date(),
      endTime: undefined,
      pauseTime: undefined,
      totalPauseTime: 0,
      completedCycles: 0,
      totalCycles: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Genera un ID único para sesiones de pomodoro
   */
  private static generateId(): string {
    return `pomodoro_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}


