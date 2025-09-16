// ============================================================================
// CONSTANTES COMPARTIDAS - TIEMPOJUSTO
// ============================================================================

import { TaskPriority, PriorityConfig, AppSettings, PomodoroConfig, NotificationConfig } from '../types';

// ============================================================================
// CONSTANTES DE PRIORIDAD (Método ABCDE de Brian Tracy)
// ============================================================================

export const TASK_PRIORITIES: Record<TaskPriority, PriorityConfig> = {
  A: {
    value: 'A',
    label: 'Crítica',
    description: 'Tareas críticas y urgentes que deben completarse hoy',
    color: '#ef4444', // red-500
    points: 10
  },
  B: {
    value: 'B',
    label: 'Importante',
    description: 'Tareas importantes pero no urgentes',
    color: '#f97316', // orange-500
    points: 7
  },
  C: {
    value: 'C',
    label: 'Delegable',
    description: 'Tareas que pueden delegarse a otros',
    color: '#eab308', // yellow-500
    points: 4
  },
  D: {
    value: 'D',
    label: 'Eliminar',
    description: 'Tareas que pueden eliminarse o posponerse',
    color: '#6b7280', // gray-500
    points: 1
  }
};

// ============================================================================
// CONSTANTES DE ESTADO
// ============================================================================

export const TASK_STATUS = {
  PENDING: 'pending' as const,
  IN_PROGRESS: 'in_progress' as const,
  COMPLETED: 'completed' as const,
  CANCELLED: 'cancelled' as const
};

export const PROJECT_STATUS = {
  OPEN: 'open' as const,
  SUSPENDED: 'suspended' as const,
  CANCELLED: 'cancelled' as const,
  COMPLETED: 'completed' as const
};

export const POMODORO_STATE = {
  IDLE: 'idle' as const,
  WORKING: 'working' as const,
  SHORT_BREAK: 'short_break' as const,
  LONG_BREAK: 'long_break' as const
};

export const POMODORO_DEFAULTS = {
  FOCUS_DURATION: 25, // minutos
  SHORT_BREAK_DURATION: 5, // minutos
  LONG_BREAK_DURATION: 15, // minutos
  LONG_BREAK_INTERVAL: 4 // número de sesiones de trabajo antes del descanso largo
};

// ============================================================================
// CONSTANTES DE CONFIGURACIÓN POR DEFECTO
// ============================================================================

export const DEFAULT_APP_SETTINGS: AppSettings = {
  theme: 'dark',
  language: 'es',
  notifications: {
    enabled: true,
    motivational: true,
    pomodoro: true,
    reminders: true
  },
  pomodoro: {
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4
  }
};

export const DEFAULT_POMODORO_CONFIG: PomodoroConfig = {
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
};

export const DEFAULT_NOTIFICATION_CONFIG: NotificationConfig = {
  enabled: true,
  types: {
    motivational: true,
    reminder: true,
    achievement: true,
    pomodoro: true
  },
  schedule: {
    startTime: '08:00',
    endTime: '22:00',
    daysOfWeek: [1, 2, 3, 4, 5], // lunes a viernes
    timezone: 'America/Mexico_City'
  },
  frequency: {
    motivational: 120, // 2 horas
    reminder: 15, // 15 minutos antes
    achievement: 5, // 5 segundos
    pomodoro: 3 // 3 segundos
  },
  sound: {
    enabled: true,
    volume: 70
  },
  vibration: {
    enabled: true,
    pattern: [200, 100, 200]
  },
  display: {
    duration: 5,
    position: 'top',
    style: 'banner'
  }
};

// ============================================================================
// CONSTANTES DE MÉTRICAS
// ============================================================================

export const PRODUCTIVITY_LEVELS = {
  EXCELLENT: { min: 80, max: 100, label: 'Excelente', color: '#10b981' }, // emerald-500
  GOOD: { min: 60, max: 79, label: 'Bueno', color: '#f59e0b' }, // amber-500
  AVERAGE: { min: 40, max: 59, label: 'Aceptable', color: '#f97316' }, // orange-500
  POOR: { min: 0, max: 39, label: 'Mejorar', color: '#ef4444' } // red-500
};

export const SCORE_WEIGHTS = {
  TASK_A: 10,
  TASK_B: 7,
  TASK_C: 4,
  TASK_D: 1,
  POMODORO_SESSION: 5,
  PROJECT_COMPLETION: 15
};

// ============================================================================
// CONSTANTES DE TIEMPO
// ============================================================================

export const TIME_CONSTANTS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
  YEAR: 365 * 24 * 60 * 60 * 1000
};

export const POMODORO_TIMES = {
  WORK: 25 * 60, // 25 minutos en segundos
  SHORT_BREAK: 5 * 60, // 5 minutos en segundos
  LONG_BREAK: 15 * 60, // 15 minutos en segundos
  LONG_BREAK_INTERVAL: 4 // cada 4 sesiones
};

// ============================================================================
// CONSTANTES DE STORAGE
// ============================================================================

export const STORAGE_KEYS = {
  TASKS: 'TJ_TASKS',
  PROJECTS: 'TJ_PROJECTS',
  POMODORO_SESSIONS: 'TJ_POMODORO_SESSIONS',
  SETTINGS: 'TJ_SETTINGS',
  ANALYTICS: 'TJ_ANALYTICS',
  NOTIFICATIONS: 'TJ_NOTIFICATIONS',
  BACKUP: 'TJ_BACKUP',
  LAST_SYNC: 'TJ_LAST_SYNC'
};

// ============================================================================
// CONSTANTES DE UI
// ============================================================================

export const COLORS = {
  PRIMARY: '#3b82f6', // blue-500
  SECONDARY: '#64748b', // slate-500
  SUCCESS: '#10b981', // emerald-500
  WARNING: '#f59e0b', // amber-500
  ERROR: '#ef4444', // red-500
  INFO: '#06b6d4', // cyan-500
  BACKGROUND: '#0f172a', // slate-900
  SURFACE: '#1e293b', // slate-800
  TEXT_PRIMARY: '#f8fafc', // slate-50
  TEXT_SECONDARY: '#94a3b8', // slate-400
  BORDER: '#334155' // slate-700
};

export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 48
};

export const BORDER_RADIUS = {
  SM: 4,
  MD: 8,
  LG: 12,
  XL: 16,
  FULL: 9999
};

export const FONT_SIZES = {
  XS: 12,
  SM: 14,
  MD: 16,
  LG: 18,
  XL: 20,
  XXL: 24,
  XXXL: 32
};

// ============================================================================
// CONSTANTES DE ANIMACIÓN
// ============================================================================

export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500
};

export const ANIMATION_EASING = {
  EASE_IN: 'ease-in',
  EASE_OUT: 'ease-out',
  EASE_IN_OUT: 'ease-in-out',
  LINEAR: 'linear'
};

// ============================================================================
// CONSTANTES DE NOTIFICACIONES
// ============================================================================

export const NOTIFICATION_TYPES = {
  MOTIVATIONAL: 'motivational' as const,
  REMINDER: 'reminder' as const,
  ACHIEVEMENT: 'achievement' as const,
  POMODORO: 'pomodoro' as const
};

export const NOTIFICATION_PRIORITIES = {
  LOW: 'low' as const,
  MEDIUM: 'medium' as const,
  HIGH: 'high' as const,
  URGENT: 'urgent' as const
};

// ============================================================================
// CONSTANTES DE VALIDACIÓN
// ============================================================================

export const VALIDATION_RULES = {
  TASK_TITLE_MIN_LENGTH: 1,
  TASK_TITLE_MAX_LENGTH: 100,
  TASK_DESCRIPTION_MAX_LENGTH: 500,
  PROJECT_NAME_MIN_LENGTH: 1,
  PROJECT_NAME_MAX_LENGTH: 50,
  PROJECT_DESCRIPTION_MAX_LENGTH: 200,
  POMODORO_DURATION_MIN: 1,
  POMODORO_DURATION_MAX: 60,
  MAX_TAGS_PER_TASK: 5,
  MAX_TAGS_PER_PROJECT: 3
};

// ============================================================================
// CONSTANTES DE EXPORTACIÓN/IMPORTACIÓN
// ============================================================================

export const EXPORT_FORMATS = {
  JSON: 'json',
  CSV: 'csv',
  PDF: 'pdf'
};

export const IMPORT_FORMATS = {
  JSON: 'json',
  CSV: 'csv'
};

// ============================================================================
// CONSTANTES DE VERSIONADO
// ============================================================================

export const APP_VERSION = '1.0.0';
export const DATA_VERSION = '1.0.0';
export const MIN_SUPPORTED_VERSION = '1.0.0';

// ============================================================================
// CONSTANTES DE DESARROLLO
// ============================================================================

export const IS_DEVELOPMENT = __DEV__;
export const IS_PRODUCTION = !__DEV__;

export const DEBUG_CONFIG = {
  ENABLE_LOGGING: IS_DEVELOPMENT,
  ENABLE_PERFORMANCE_MONITORING: IS_DEVELOPMENT,
  ENABLE_ERROR_REPORTING: IS_PRODUCTION,
  ENABLE_ANALYTICS: IS_PRODUCTION
};
