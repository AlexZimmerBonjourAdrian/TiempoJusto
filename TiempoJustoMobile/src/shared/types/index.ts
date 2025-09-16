// ============================================================================
// TIPOS COMPARTIDOS - TIEMPOJUSTO
// ============================================================================
// Tipos globales utilizados en toda la aplicación

// ============================================================================
// TIPOS BASE
// ============================================================================

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// TIPOS DE PRIORIDAD (Método ABCDE de Brian Tracy)
// ============================================================================

export type TaskPriority = 'A' | 'B' | 'C' | 'D';

export interface PriorityConfig {
  value: TaskPriority;
  label: string;
  description: string;
  color: string;
  points: number;
}

// ============================================================================
// TIPOS DE ESTADO
// ============================================================================

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type ProjectStatus = 'active' | 'completed' | 'paused' | 'archived';
export type PomodoroState = 'idle' | 'working' | 'short_break' | 'long_break';

// ============================================================================
// TIPOS DE NOTIFICACIÓN
// ============================================================================

export type NotificationType = 'motivational' | 'reminder' | 'achievement' | 'pomodoro';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

// ============================================================================
// TIPOS DE CONFIGURACIÓN
// ============================================================================

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: {
    enabled: boolean;
    motivational: boolean;
    pomodoro: boolean;
    reminders: boolean;
  };
  pomodoro: {
    workDuration: number; // minutos
    shortBreakDuration: number; // minutos
    longBreakDuration: number; // minutos
    longBreakInterval: number; // sesiones
  };
}

// ============================================================================
// TIPOS DE MÉTRICAS
// ============================================================================

export interface ProductivityMetrics {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  productivityScore: number;
  priorityDistribution: Record<TaskPriority, number>;
  dailyStreak: number;
  weeklyAverage: number;
  monthlyAverage: number;
}

// ============================================================================
// TIPOS DE RESPUESTA DE API
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ============================================================================
// TIPOS DE CONTEXTO
// ============================================================================

export interface AppContextType {
  isLoading: boolean;
  error: string | null;
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  clearError: () => void;
}

// ============================================================================
// TIPOS DE UTILIDADES
// ============================================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// ============================================================================
// TIPOS DE EVENTOS
// ============================================================================

export interface AppEvent {
  type: string;
  payload?: any;
  timestamp: Date;
}

// ============================================================================
// TIPOS DE STORAGE
// ============================================================================

export interface StorageData {
  tasks: any[];
  projects: any[];
  settings: AppSettings;
  metrics: ProductivityMetrics;
  lastSync: Date;
}

// ============================================================================
// EXPORTACIONES
// ============================================================================

export * from './task.types';
export * from './project.types';
export * from './pomodoro.types';
export * from './analytics.types';
export * from './notification.types';
