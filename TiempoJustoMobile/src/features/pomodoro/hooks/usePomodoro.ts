// ============================================================================
// HOOK DE POMODORO - TIEMPOJUSTO
// ============================================================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import { PomodoroSession, CreatePomodoroSessionData, UpdatePomodoroSessionData, PomodoroConfig, PomodoroStatistics, UsePomodoroReturn } from '../../../shared/types';
import { pomodoroService } from '../services/pomodoroService';
import { debugUtils } from '../../../shared/utils';

// ============================================================================
// HOOK PRINCIPAL DE POMODORO
// ============================================================================

export const usePomodoro = (): UsePomodoroReturn => {
  // ============================================================================
  // ESTADO LOCAL
  // ============================================================================

  const [currentSession, setCurrentSession] = useState<PomodoroSession | null>(null);
  const [config, setConfig] = useState<PomodoroConfig>({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
    autoStartBreaks: false,
    autoStartWork: false,
    soundEnabled: true,
    vibrationEnabled: true,
    notificationsEnabled: true,
    backgroundMode: true
  });
  const [statistics, setStatistics] = useState<PomodoroStatistics>({
    totalSessions: 0,
    completedSessions: 0,
    totalWorkTime: 0,
    totalBreakTime: 0,
    averageSessionLength: 0,
    longestSession: 0,
    dailySessions: {},
    weeklySessions: {},
    monthlySessions: {},
    productivityScore: 0,
    consistencyScore: 0,
    focusScore: 0,
    averageCyclesPerDay: 0,
    bestDay: '',
    bestWeek: '',
    bestMonth: ''
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ============================================================================
  // EFECTOS
  // ============================================================================

  useEffect(() => {
    initializePomodoro();
  }, []);

  // ============================================================================
  // FUNCIONES DE INICIALIZACIÓN
  // ============================================================================

  const initializePomodoro = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      await pomodoroService.initialize();
      const loadedConfig = pomodoroService.getConfig();
      const loadedStatistics = pomodoroService.getStatistics();
      const loadedCurrentSession = pomodoroService.getCurrentSession();
      
      setConfig(loadedConfig);
      setStatistics(loadedStatistics);
      setCurrentSession(loadedCurrentSession);
      
      debugUtils.log('Pomodoro initialized successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error initializing pomodoro';
      setError(errorMessage);
      debugUtils.error('Error initializing pomodoro', err);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // FUNCIONES DE SESIÓN
  // ============================================================================

  const startSession = useCallback(async (data?: CreatePomodoroSessionData): Promise<void> => {
    try {
      setError(null);
      const session = await pomodoroService.startSession(data);
      
      setCurrentSession(session);
      setStatistics(pomodoroService.getStatistics());
      
      debugUtils.log('Pomodoro session started', { id: session.id });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error starting session';
      setError(errorMessage);
      debugUtils.error('Error starting pomodoro session', err);
      throw err;
    }
  }, []);

  const pauseSession = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      await pomodoroService.pauseSession();
      
      const updatedSession = pomodoroService.getCurrentSession();
      setCurrentSession(updatedSession);
      
      debugUtils.log('Pomodoro session paused');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error pausing session';
      setError(errorMessage);
      debugUtils.error('Error pausing pomodoro session', err);
      throw err;
    }
  }, []);

  const resumeSession = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      await pomodoroService.resumeSession();
      
      const updatedSession = pomodoroService.getCurrentSession();
      setCurrentSession(updatedSession);
      
      debugUtils.log('Pomodoro session resumed');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error resuming session';
      setError(errorMessage);
      debugUtils.error('Error resuming pomodoro session', err);
      throw err;
    }
  }, []);

  const stopSession = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      await pomodoroService.stopSession();
      
      setCurrentSession(null);
      setStatistics(pomodoroService.getStatistics());
      
      debugUtils.log('Pomodoro session stopped');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error stopping session';
      setError(errorMessage);
      debugUtils.error('Error stopping pomodoro session', err);
      throw err;
    }
  }, []);

  const resetSession = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      await pomodoroService.resetSession();
      
      const updatedSession = pomodoroService.getCurrentSession();
      setCurrentSession(updatedSession);
      
      debugUtils.log('Pomodoro session reset');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error resetting session';
      setError(errorMessage);
      debugUtils.error('Error resetting pomodoro session', err);
      throw err;
    }
  }, []);

  // ============================================================================
  // FUNCIONES DE CONFIGURACIÓN
  // ============================================================================

  const updateConfig = useCallback(async (newConfig: Partial<PomodoroConfig>): Promise<void> => {
    try {
      setError(null);
      await pomodoroService.updateConfig(newConfig);
      
      const updatedConfig = pomodoroService.getConfig();
      setConfig(updatedConfig);
      
      debugUtils.log('Pomodoro config updated', newConfig);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error updating config';
      setError(errorMessage);
      debugUtils.error('Error updating pomodoro config', err);
      throw err;
    }
  }, []);

  // ============================================================================
  // FUNCIONES DE CONSULTA
  // ============================================================================

  const getSessionsByDate = useCallback((date: Date): PomodoroSession[] => {
    return pomodoroService.getSessionsByDate(date);
  }, []);

  const getSessionsByTask = useCallback((taskId: string): PomodoroSession[] => {
    return pomodoroService.getSessionsByTask(taskId);
  }, []);

  const getSessionsByProject = useCallback((projectId: string): PomodoroSession[] => {
    return pomodoroService.getSessionsByProject(projectId);
  }, []);

  // ============================================================================
  // VALORES MEMOIZADOS
  // ============================================================================

  const isActive = useMemo(() => {
    return currentSession?.isActive || false;
  }, [currentSession]);

  const isPaused = useMemo(() => {
    return currentSession?.isPaused || false;
  }, [currentSession]);

  const remainingTime = useMemo(() => {
    return currentSession?.remainingTime || 0;
  }, [currentSession]);

  const currentState = useMemo(() => {
    return currentSession?.state || 'idle';
  }, [currentSession]);

  const progress = useMemo(() => {
    if (!currentSession) return 0;
    const totalTime = currentSession.duration * 60;
    const elapsed = totalTime - currentSession.remainingTime;
    return Math.max(0, Math.min(100, (elapsed / totalTime) * 100));
  }, [currentSession]);

  // ============================================================================
  // RETORNO DEL HOOK
  // ============================================================================

  return {
    // Estado
    currentSession,
    config,
    statistics,
    loading,
    error,
    
    // Funciones de sesión
    startSession,
    pauseSession,
    resumeSession,
    stopSession,
    resetSession,
    
    // Funciones de configuración
    updateConfig,
    
    // Funciones de consulta
    getSessionsByDate,
    getSessionsByTask,
    getSessionsByProject,
    
    // Valores memoizados
    isActive,
    isPaused,
    remainingTime,
    currentState,
    progress
  };
};
