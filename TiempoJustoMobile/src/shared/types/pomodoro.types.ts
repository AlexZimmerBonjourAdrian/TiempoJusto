// ============================================================================
// TIPOS DE POMODORO - TIEMPOJUSTO
// ============================================================================

import { BaseEntity, PomodoroState } from './index';

// ============================================================================
// TIPOS PRINCIPALES DE POMODORO
// ============================================================================

export interface PomodoroSession extends BaseEntity {
  taskId?: string;
  projectId?: string;
  state: PomodoroState;
  duration: number; // minutos
  remainingTime: number; // segundos
  isActive: boolean;
  isPaused: boolean;
  startTime?: Date;
  endTime?: Date;
  pauseTime?: Date;
  totalPauseTime: number; // segundos
  completedCycles: number;
  totalCycles: number;
  notes?: string;
}

// ============================================================================
// TIPOS DE CONFIGURACIÓN DE POMODORO
// ============================================================================

export interface PomodoroConfig {
  workDuration: number; // minutos (default: 25)
  shortBreakDuration: number; // minutos (default: 5)
  longBreakDuration: number; // minutos (default: 15)
  longBreakInterval: number; // sesiones (default: 4)
  autoStartBreaks: boolean;
  autoStartWork: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  notificationsEnabled: boolean;
  backgroundMode: boolean;
}

// ============================================================================
// TIPOS DE ESTADÍSTICAS DE POMODORO
// ============================================================================

export interface PomodoroStatistics {
  totalSessions: number;
  completedSessions: number;
  totalWorkTime: number; // minutos
  totalBreakTime: number; // minutos
  averageSessionLength: number; // minutos
  longestSession: number; // minutos
  dailySessions: Record<string, number>;
  weeklySessions: Record<string, number>;
  monthlySessions: Record<string, number>;
  productivityScore: number; // 0-100
  consistencyScore: number; // 0-100
  focusScore: number; // 0-100
}

// ============================================================================
// TIPOS DE OPERACIONES DE POMODORO
// ============================================================================

export interface CreatePomodoroSessionData {
  taskId?: string;
  projectId?: string;
  duration?: number;
  totalCycles?: number;
  notes?: string;
}

export interface UpdatePomodoroSessionData {
  state?: PomodoroState;
  duration?: number;
  remainingTime?: number;
  isActive?: boolean;
  isPaused?: boolean;
  startTime?: Date;
  endTime?: Date;
  pauseTime?: Date;
  totalPauseTime?: number;
  completedCycles?: number;
  notes?: string;
}

// ============================================================================
// TIPOS DE HOOKS DE POMODORO
// ============================================================================

export interface UsePomodoroReturn {
  currentSession: PomodoroSession | null;
  config: PomodoroConfig;
  statistics: PomodoroStatistics;
  loading: boolean;
  error: string | null;
  startSession: (data?: CreatePomodoroSessionData) => Promise<void>;
  pauseSession: () => Promise<void>;
  resumeSession: () => Promise<void>;
  stopSession: () => Promise<void>;
  resetSession: () => Promise<void>;
  updateConfig: (config: Partial<PomodoroConfig>) => Promise<void>;
  getSessionsByDate: (date: Date) => PomodoroSession[];
  getSessionsByTask: (taskId: string) => PomodoroSession[];
  getSessionsByProject: (projectId: string) => PomodoroSession[];
}

// ============================================================================
// TIPOS DE NOTIFICACIONES DE POMODORO
// ============================================================================

export interface PomodoroNotification {
  type: 'work_start' | 'work_end' | 'break_start' | 'break_end' | 'session_complete';
  title: string;
  message: string;
  timestamp: Date;
  sessionId: string;
}

// ============================================================================
// TIPOS DE VALIDACIÓN
// ============================================================================

export interface PomodoroValidation {
  isValid: boolean;
  errors: {
    duration?: string;
    totalCycles?: string;
    workDuration?: string;
    shortBreakDuration?: string;
    longBreakDuration?: string;
    longBreakInterval?: string;
  };
}

// ============================================================================
// TIPOS DE TIMER
// ============================================================================

export interface PomodoroTimer {
  sessionId: string;
  state: PomodoroState;
  remainingTime: number; // segundos
  isActive: boolean;
  isPaused: boolean;
  currentCycle: number;
  totalCycles: number;
  startTime: Date;
  endTime: Date;
}

// ============================================================================
// TIPOS DE SONIDOS
// ============================================================================

export interface PomodoroSound {
  id: string;
  name: string;
  file: string;
  volume: number;
  enabled: boolean;
}

// ============================================================================
// TIPOS DE IMPORTACIÓN/EXPORTACIÓN
// ============================================================================

export interface PomodoroExportData {
  sessions: PomodoroSession[];
  config: PomodoroConfig;
  statistics: PomodoroStatistics;
  exportDate: Date;
  version: string;
}

export interface PomodoroImportData {
  sessions: CreatePomodoroSessionData[];
  config?: Partial<PomodoroConfig>;
  importOptions: {
    mergeWithExisting: boolean;
    updateExisting: boolean;
    skipDuplicates: boolean;
  };
}
