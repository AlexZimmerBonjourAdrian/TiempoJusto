// ============================================================================
// HOOK DE POMODORO - TIEMPOJUSTO
// ============================================================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import { PomodoroConfig, PomodoroStatistics } from '../../../shared/types';
import { POMODORO_DEFAULTS } from '../../../shared/constants';
import { debugUtils } from '../../../shared/utils';

// ============================================================================
// TIPOS LOCALES
// ============================================================================

interface PomodoroSession {
  id: string;
  state: 'work' | 'shortBreak' | 'longBreak' | 'idle';
  duration: number; // en minutos
  remainingTime: number; // en segundos
  isActive: boolean;
  isPaused: boolean;
  startTime?: number;
  pauseTime?: number;
  totalPauseTime: number;
}

interface UsePomodoroReturn {
  currentSession: PomodoroSession | null;
  config: PomodoroConfig;
  statistics: PomodoroStatistics;
  loading: boolean;
  error: string | null;
  startSession: (mode?: 'work' | 'shortBreak' | 'longBreak') => Promise<void>;
  pauseSession: () => Promise<void>;
  resumeSession: () => Promise<void>;
  stopSession: () => Promise<void>;
  resetSession: () => Promise<void>;
  resetToMode: (mode: 'work' | 'shortBreak' | 'longBreak') => Promise<void>;
  updateConfig: (newConfig: Partial<PomodoroConfig>) => Promise<void>;
}

// ============================================================================
// HOOK PRINCIPAL DE POMODORO
// ============================================================================

export const usePomodoro = (): UsePomodoroReturn => {
  // ============================================================================
  // ESTADO LOCAL
  // ============================================================================

  const [currentSession, setCurrentSession] = useState<PomodoroSession | null>(null);
  const [config, setConfig] = useState<PomodoroConfig>({
    workDuration: POMODORO_DEFAULTS.FOCUS_DURATION,
    shortBreakDuration: POMODORO_DEFAULTS.SHORT_BREAK_DURATION,
    longBreakDuration: POMODORO_DEFAULTS.LONG_BREAK_DURATION,
    longBreakInterval: POMODORO_DEFAULTS.LONG_BREAK_INTERVAL,
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
    focusScore: 0
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  // ============================================================================
  // EFECTOS
  // ============================================================================

  useEffect(() => {
    // Limpiar timer al desmontar
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [timer]);

  // ============================================================================
  // FUNCIONES AUXILIARES
  // ============================================================================

  const createSession = (state: 'work' | 'shortBreak' | 'longBreak'): PomodoroSession => {
    const duration = state === 'work' 
      ? config.workDuration 
      : state === 'shortBreak' 
        ? config.shortBreakDuration 
        : config.longBreakDuration;

    return {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      state,
      duration,
      remainingTime: duration * 60,
      isActive: false,
      isPaused: false,
      totalPauseTime: 0
    };
  };

  const startTimer = () => {
    if (timer) {
      clearInterval(timer);
    }

    const newTimer = setInterval(() => {
      setCurrentSession(prev => {
        if (!prev || !prev.isActive || prev.isPaused) return prev;

        const newRemainingTime = prev.remainingTime - 1;
        
        if (newRemainingTime <= 0) {
          // Sesión completada
          clearInterval(newTimer);
          setTimer(null);
          
          // Actualizar estadísticas
          setStatistics(prevStats => ({
            ...prevStats,
            totalSessions: prevStats.totalSessions + 1,
            completedSessions: prevStats.completedSessions + 1,
            totalWorkTime: prev.state === 'work' 
              ? prevStats.totalWorkTime + prev.duration * 60
              : prevStats.totalWorkTime,
            totalBreakTime: prev.state !== 'work' 
              ? prevStats.totalBreakTime + prev.duration * 60
              : prevStats.totalBreakTime
          }));

          // Crear siguiente sesión
          if (prev.state === 'work') {
            const nextState = statistics.completedSessions % config.longBreakInterval === 0 
              ? 'longBreak' 
              : 'shortBreak';
            return createSession(nextState);
          } else {
            return createSession('work');
          }
        }

        return {
          ...prev,
          remainingTime: newRemainingTime
        };
      });
    }, 1000);

    setTimer(newTimer);
  };

  const stopTimer = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  };

  // ============================================================================
  // FUNCIONES DE SESIÓN
  // ============================================================================

  const startSession = useCallback(async (mode: 'work' | 'shortBreak' | 'longBreak' = 'work'): Promise<void> => {
    try {
      setError(null);
      
      if (!currentSession) {
        // Crear nueva sesión con el modo especificado
        const newSession = createSession(mode);
        setCurrentSession(newSession);
      }
      
      setCurrentSession(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          isActive: true,
          isPaused: false,
          startTime: Date.now()
        };
      });
      
      startTimer();
      debugUtils.log('Pomodoro session started', { mode });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error starting session';
      setError(errorMessage);
      debugUtils.error('Error starting pomodoro session', err);
      throw err;
    }
  }, [currentSession, config, statistics.completedSessions]);

  const pauseSession = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      stopTimer();
      
      setCurrentSession(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          isActive: false,
          isPaused: true,
          pauseTime: Date.now()
        };
      });
      
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
      
      setCurrentSession(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          isActive: true,
          isPaused: false,
          startTime: Date.now()
        };
      });
      
      startTimer();
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
      stopTimer();
      
      setCurrentSession(null);
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
      stopTimer();
      
      if (currentSession && currentSession.state !== 'idle') {
        const resetSession = createSession(currentSession.state as 'work' | 'shortBreak' | 'longBreak');
        setCurrentSession(resetSession);
      }
      
      debugUtils.log('Pomodoro session reset');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error resetting session';
      setError(errorMessage);
      debugUtils.error('Error resetting pomodoro session', err);
      throw err;
    }
  }, [currentSession]);

  const resetToMode = useCallback(async (mode: 'work' | 'shortBreak' | 'longBreak'): Promise<void> => {
    try {
      setError(null);
      stopTimer();
      
      // Crear nueva sesión con el modo especificado y tiempo configurado
      const newSession = createSession(mode);
      setCurrentSession(newSession);
      
      debugUtils.log('Pomodoro session reset to mode', { mode });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error resetting session to mode';
      setError(errorMessage);
      debugUtils.error('Error resetting pomodoro session to mode', err);
      throw err;
    }
  }, [config]);

  // ============================================================================
  // FUNCIONES DE CONFIGURACIÓN
  // ============================================================================

  const updateConfig = useCallback(async (newConfig: Partial<PomodoroConfig>): Promise<void> => {
    try {
      setError(null);
      setConfig(prev => ({ ...prev, ...newConfig }));
      debugUtils.log('Pomodoro config updated', newConfig);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error updating config';
      setError(errorMessage);
      debugUtils.error('Error updating pomodoro config', err);
      throw err;
    }
  }, []);

  // ============================================================================
  // RETORNO DEL HOOK
  // ============================================================================

  return {
    currentSession,
    config,
    statistics,
    loading,
    error,
    startSession,
    pauseSession,
    resumeSession,
    stopSession,
    resetSession,
    resetToMode,
    updateConfig
  };
};
