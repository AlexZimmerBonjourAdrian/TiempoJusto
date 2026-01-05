// ============================================================================
// SERVICIO DE POMODORO - TIEMPOJUSTO
// ============================================================================

import { PomodoroSession, CreatePomodoroSessionData, UpdatePomodoroSessionData, PomodoroConfig, PomodoroStatistics } from '../../../shared/types';
import { storageService } from '../../../shared/storage';
import { STORAGE_KEYS, DEFAULT_POMODORO_CONFIG } from '../../../shared/constants';
import { debugUtils } from '../../../shared/utils';
import { PomodoroFactory } from '../../../shared/factories';

// ============================================================================
// CLASE DEL SERVICIO DE POMODORO
// ============================================================================

export class PomodoroService {
  private sessions: PomodoroSession[] = [];
  private currentSession: PomodoroSession | null = null;
  private config: PomodoroConfig = DEFAULT_POMODORO_CONFIG;
  private timer: NodeJS.Timeout | null = null;
  private readonly storageKey = STORAGE_KEYS.POMODORO_SESSIONS;

  // ============================================================================
  // MÉTODOS DE INICIALIZACIÓN
  // ============================================================================

  async initialize(): Promise<void> {
    try {
      await this.loadSessions();
      await this.loadConfig();
      debugUtils.log('PomodoroService initialized successfully');
    } catch (error) {
      debugUtils.error('Error initializing PomodoroService', error);
      throw error;
    }
  }

  // ============================================================================
  // MÉTODOS DE SESIÓN
  // ============================================================================

  async startSession(data: CreatePomodoroSessionData = {}): Promise<PomodoroSession> {
    try {
      // Detener sesión actual si existe
      if (this.currentSession) {
        await this.stopSession();
      }

      // Crear sesión usando Factory
      const session = PomodoroFactory.createWorkSession(this.config, data);

      this.currentSession = session;
      this.sessions.push(session);
      await this.saveSessions();
      
      this.startTimer();
      
      debugUtils.log('Pomodoro session started', { id: session.id });
      return session;
    } catch (error) {
      debugUtils.error('Error starting pomodoro session', error);
      throw error;
    }
  }

  async pauseSession(): Promise<void> {
    try {
      if (!this.currentSession || !this.currentSession.isActive) {
        throw new Error('No active session to pause');
      }

      this.stopTimer();
      
      this.currentSession.isPaused = true;
      this.currentSession.pauseTime = new Date();
      this.currentSession.updatedAt = new Date();
      
      await this.saveSessions();
      
      debugUtils.log('Pomodoro session paused', { id: this.currentSession.id });
    } catch (error) {
      debugUtils.error('Error pausing pomodoro session', error);
      throw error;
    }
  }

  async resumeSession(): Promise<void> {
    try {
      if (!this.currentSession || !this.currentSession.isPaused) {
        throw new Error('No paused session to resume');
      }

      // Calcular tiempo de pausa
      if (this.currentSession.pauseTime) {
        const pauseDuration = Date.now() - this.currentSession.pauseTime.getTime();
        this.currentSession.totalPauseTime += Math.floor(pauseDuration / 1000);
      }

      this.currentSession.isPaused = false;
      this.currentSession.pauseTime = undefined;
      this.currentSession.updatedAt = new Date();
      
      await this.saveSessions();
      this.startTimer();
      
      debugUtils.log('Pomodoro session resumed', { id: this.currentSession.id });
    } catch (error) {
      debugUtils.error('Error resuming pomodoro session', error);
      throw error;
    }
  }

  async stopSession(): Promise<void> {
    try {
      if (!this.currentSession) {
        return;
      }

      this.stopTimer();
      
      this.currentSession.isActive = false;
      this.currentSession.endTime = new Date();
      this.currentSession.updatedAt = new Date();
      
      await this.saveSessions();
      
      debugUtils.log('Pomodoro session stopped', { id: this.currentSession.id });
      this.currentSession = null;
    } catch (error) {
      debugUtils.error('Error stopping pomodoro session', error);
      throw error;
    }
  }

  async resetSession(): Promise<void> {
    try {
      if (!this.currentSession) {
        return;
      }

      this.stopTimer();
      
      this.currentSession.remainingTime = this.currentSession.duration * 60;
      this.currentSession.isPaused = false;
      this.currentSession.pauseTime = undefined;
      this.currentSession.totalPauseTime = 0;
      this.currentSession.updatedAt = new Date();
      
      await this.saveSessions();
      
      debugUtils.log('Pomodoro session reset', { id: this.currentSession.id });
    } catch (error) {
      debugUtils.error('Error resetting pomodoro session', error);
      throw error;
    }
  }

  // ============================================================================
  // MÉTODOS DE CONFIGURACIÓN
  // ============================================================================

  async updateConfig(newConfig: Partial<PomodoroConfig>): Promise<void> {
    try {
      this.config = { ...this.config, ...newConfig };
      await this.saveConfig();
      
      debugUtils.log('Pomodoro config updated', newConfig);
    } catch (error) {
      debugUtils.error('Error updating pomodoro config', error);
      throw error;
    }
  }

  getConfig(): PomodoroConfig {
    return { ...this.config };
  }

  // ============================================================================
  // MÉTODOS DE CONSULTA
  // ============================================================================

  getCurrentSession(): PomodoroSession | null {
    return this.currentSession ? { ...this.currentSession } : null;
  }

  getSessions(): PomodoroSession[] {
    return [...this.sessions];
  }

  getSessionsByDate(date: Date): PomodoroSession[] {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return this.sessions.filter(session => {
      if (!session.startTime) return false;
      return session.startTime >= startOfDay && session.startTime <= endOfDay;
    });
  }

  getSessionsByTask(taskId: string): PomodoroSession[] {
    return this.sessions.filter(session => session.taskId === taskId);
  }

  getSessionsByProject(projectId: string): PomodoroSession[] {
    return this.sessions.filter(session => session.projectId === projectId);
  }

  // ============================================================================
  // MÉTODOS DE ESTADÍSTICAS
  // ============================================================================

  getStatistics(): PomodoroStatistics {
    const totalSessions = this.sessions.length;
    const completedSessions = this.sessions.filter(session => 
      session.endTime && session.completedCycles > 0
    ).length;

    const totalWorkTime = this.sessions.reduce((sum, session) => {
      if (session.endTime && session.startTime) {
        const duration = session.endTime.getTime() - session.startTime.getTime();
        return sum + Math.floor(duration / (1000 * 60)); // Convertir a minutos
      }
      return sum;
    }, 0);

    const totalBreakTime = this.sessions.reduce((sum, session) => {
      return sum + Math.floor(session.totalPauseTime / 60); // Convertir a minutos
    }, 0);

    const averageSessionLength = totalSessions > 0 ? totalWorkTime / totalSessions : 0;

    const longestSession = this.sessions.reduce((max, session) => {
      if (session.endTime && session.startTime) {
        const duration = session.endTime.getTime() - session.startTime.getTime();
        return Math.max(max, Math.floor(duration / (1000 * 60)));
      }
      return max;
    }, 0);

    // Estadísticas diarias (últimos 7 días)
    const dailySessions: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      dailySessions[dateKey] = this.getSessionsByDate(date).length;
    }

    // Estadísticas semanales (últimas 4 semanas)
    const weeklySessions: Record<string, number> = {};
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i * 7));
      const weekKey = `Week ${i + 1}`;
      let weekSessions = 0;
      
      for (let j = 0; j < 7; j++) {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + j);
        weekSessions += this.getSessionsByDate(date).length;
      }
      
      weeklySessions[weekKey] = weekSessions;
    }

    // Estadísticas mensuales (últimos 6 meses)
    const monthlySessions: Record<string, number> = {};
    for (let i = 5; i >= 0; i--) {
      const month = new Date();
      month.setMonth(month.getMonth() - i);
      const monthKey = month.toISOString().substring(0, 7);
      const monthSessions = this.sessions.filter(session => {
        if (!session.startTime) return false;
        const sessionMonth = session.startTime.toISOString().substring(0, 7);
        return sessionMonth === monthKey;
      }).length;
      monthlySessions[monthKey] = monthSessions;
    }

    // Calcular scores
    const productivityScore = this.calculateProductivityScore();
    const consistencyScore = this.calculateConsistencyScore();
    const focusScore = this.calculateFocusScore();

    return {
      totalSessions,
      completedSessions,
      totalWorkTime,
      totalBreakTime,
      averageSessionLength,
      longestSession,
      dailySessions,
      weeklySessions,
      monthlySessions,
      productivityScore,
      consistencyScore,
      focusScore,
      averageCyclesPerDay: this.calculateAverageCyclesPerDay(),
      bestDay: this.getBestDay(),
      bestWeek: this.getBestWeek(),
      bestMonth: this.getBestMonth()
    };
  }

  // ============================================================================
  // MÉTODOS PRIVADOS
  // ============================================================================

  private startTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(() => {
      if (this.currentSession && this.currentSession.isActive && !this.currentSession.isPaused) {
        this.currentSession.remainingTime--;
        
        if (this.currentSession.remainingTime <= 0) {
          this.handleSessionComplete();
        }
      }
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private async handleSessionComplete(): Promise<void> {
    if (!this.currentSession) return;

    this.stopTimer();
    
    this.currentSession.completedCycles++;
    this.currentSession.isActive = false;
    this.currentSession.endTime = new Date();
    this.currentSession.updatedAt = new Date();
    
    await this.saveSessions();
    
    debugUtils.log('Pomodoro session completed', { 
      id: this.currentSession.id, 
      cycles: this.currentSession.completedCycles 
    });

    // Emitir evento de sesión completada
    this.emitSessionComplete(this.currentSession);
    
    this.currentSession = null;
  }

  private emitSessionComplete(session: PomodoroSession): void {
    // TODO: Implementar sistema de eventos
    debugUtils.log('Session complete event emitted', { sessionId: session.id });
  }

  private calculateProductivityScore(): number {
    // Implementar cálculo de score de productividad
    return 75; // Placeholder
  }

  private calculateConsistencyScore(): number {
    // Implementar cálculo de score de consistencia
    return 80; // Placeholder
  }

  private calculateFocusScore(): number {
    // Implementar cálculo de score de enfoque
    return 70; // Placeholder
  }

  private calculateAverageCyclesPerDay(): number {
    // Implementar cálculo de ciclos promedio por día
    return 4; // Placeholder
  }

  private getBestDay(): string {
    // Implementar obtención del mejor día
    return 'Monday'; // Placeholder
  }

  private getBestWeek(): string {
    // Implementar obtención de la mejor semana
    return 'Week 1'; // Placeholder
  }

  private getBestMonth(): string {
    // Implementar obtención del mejor mes
    return '2024-01'; // Placeholder
  }

  private async loadSessions(): Promise<void> {
    try {
      const sessions = await storageService.get<PomodoroSession[]>(this.storageKey);
      this.sessions = sessions || [];
      debugUtils.log(`Loaded ${this.sessions.length} pomodoro sessions from storage`);
    } catch (error) {
      debugUtils.error('Error loading pomodoro sessions from storage', error);
      this.sessions = [];
    }
  }

  private async saveSessions(): Promise<void> {
    try {
      await storageService.set(this.storageKey, this.sessions);
      debugUtils.log(`Saved ${this.sessions.length} pomodoro sessions to storage`);
    } catch (error) {
      debugUtils.error('Error saving pomodoro sessions to storage', error);
      throw error;
    }
  }

  private async loadConfig(): Promise<void> {
    try {
      const config = await storageService.get<PomodoroConfig>('TJ_POMODORO_CONFIG');
      this.config = config || DEFAULT_POMODORO_CONFIG;
      debugUtils.log('Loaded pomodoro config from storage');
    } catch (error) {
      debugUtils.error('Error loading pomodoro config from storage', error);
      this.config = DEFAULT_POMODORO_CONFIG;
    }
  }

  private async saveConfig(): Promise<void> {
    try {
      await storageService.set('TJ_POMODORO_CONFIG', this.config);
      debugUtils.log('Saved pomodoro config to storage');
    } catch (error) {
      debugUtils.error('Error saving pomodoro config to storage', error);
      throw error;
    }
  }

  private generateId(): string {
    return `pomodoro_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// ============================================================================
// INSTANCIA SINGLETON
// ============================================================================

export const pomodoroService = new PomodoroService();
