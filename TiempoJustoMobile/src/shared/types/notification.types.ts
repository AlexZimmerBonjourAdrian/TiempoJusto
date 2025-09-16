// ============================================================================
// TIPOS DE NOTIFICACIONES - TIEMPOJUSTO
// ============================================================================

import { NotificationType, NotificationPriority } from './index';

// ============================================================================
// TIPOS PRINCIPALES DE NOTIFICACIÓN
// ============================================================================

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  isRead: boolean;
  isVisible: boolean;
  createdAt: Date;
  readAt?: Date;
  expiresAt?: Date;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

// ============================================================================
// TIPOS DE NOTIFICACIONES MOTIVACIONALES
// ============================================================================

export interface MotivationalNotification extends Notification {
  type: 'motivational';
  category: 'productivity' | 'discipline' | 'inspiration' | 'achievement';
  author?: string;
  quote?: string;
  emoji?: string;
  backgroundColor?: string;
  textColor?: string;
}

// ============================================================================
// TIPOS DE NOTIFICACIONES DE RECORDATORIO
// ============================================================================

export interface ReminderNotification extends Notification {
  type: 'reminder';
  reminderType: 'task' | 'project' | 'pomodoro' | 'break' | 'custom';
  entityId?: string; // ID de la tarea, proyecto, etc.
  scheduledTime: Date;
  isRecurring: boolean;
  recurringPattern?: RecurringPattern;
}

// ============================================================================
// TIPOS DE NOTIFICACIONES DE LOGRO
// ============================================================================

export interface AchievementNotification extends Notification {
  type: 'achievement';
  achievementType: 'streak' | 'milestone' | 'goal' | 'improvement';
  achievementId: string;
  badge?: string;
  points?: number;
  level?: number;
  progress?: number;
  maxProgress?: number;
}

// ============================================================================
// TIPOS DE NOTIFICACIONES DE POMODORO
// ============================================================================

export interface PomodoroNotification extends Notification {
  type: 'pomodoro';
  pomodoroType: 'work_start' | 'work_end' | 'break_start' | 'break_end' | 'session_complete';
  sessionId: string;
  remainingTime?: number;
  cycle?: number;
  totalCycles?: number;
}

// ============================================================================
// TIPOS DE PATRÓN RECURRENTE
// ============================================================================

export interface RecurringPattern {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  daysOfWeek?: number[]; // 0-6 (domingo-sábado)
  dayOfMonth?: number; // 1-31
  endDate?: Date;
  maxOccurrences?: number;
}

// ============================================================================
// TIPOS DE CONFIGURACIÓN DE NOTIFICACIONES
// ============================================================================

export interface NotificationConfig {
  enabled: boolean;
  types: {
    motivational: boolean;
    reminder: boolean;
    achievement: boolean;
    pomodoro: boolean;
  };
  schedule: {
    startTime: string; // HH:MM
    endTime: string; // HH:MM
    daysOfWeek: number[]; // 0-6
    timezone: string;
  };
  frequency: {
    motivational: number; // minutos entre notificaciones
    reminder: number; // minutos antes del evento
    achievement: number; // segundos de duración
    pomodoro: number; // segundos de duración
  };
  sound: {
    enabled: boolean;
    volume: number; // 0-100
    customSound?: string;
  };
  vibration: {
    enabled: boolean;
    pattern?: number[];
  };
  display: {
    duration: number; // segundos
    position: 'top' | 'center' | 'bottom';
    style: 'banner' | 'modal' | 'toast';
  };
}

// ============================================================================
// TIPOS DE ESTADÍSTICAS DE NOTIFICACIONES
// ============================================================================

export interface NotificationStatistics {
  total: number;
  read: number;
  unread: number;
  byType: Record<NotificationType, number>;
  byPriority: Record<NotificationPriority, number>;
  readRate: number; // porcentaje
  averageReadTime: number; // segundos
  dailyNotifications: Record<string, number>;
  weeklyNotifications: Record<string, number>;
  monthlyNotifications: Record<string, number>;
  mostEffectiveType: NotificationType;
  leastEffectiveType: NotificationType;
}

// ============================================================================
// TIPOS DE HOOKS DE NOTIFICACIONES
// ============================================================================

export interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  config: NotificationConfig;
  statistics: NotificationStatistics;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  updateConfig: (config: Partial<NotificationConfig>) => Promise<void>;
  scheduleReminder: (reminder: Omit<ReminderNotification, 'id' | 'createdAt'>) => Promise<void>;
  cancelReminder: (id: string) => Promise<void>;
  getNotificationsByType: (type: NotificationType) => Notification[];
  getNotificationsByPriority: (priority: NotificationPriority) => Notification[];
  refreshNotifications: () => Promise<void>;
}

// ============================================================================
// TIPOS DE TEMPLATES DE NOTIFICACIÓN
// ============================================================================

export interface NotificationTemplate {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  variables: string[]; // variables que se pueden reemplazar
  category?: string;
  isActive: boolean;
  usageCount: number;
  lastUsed?: Date;
}

// ============================================================================
// TIPOS DE VALIDACIÓN
// ============================================================================

export interface NotificationValidation {
  isValid: boolean;
  errors: {
    title?: string;
    message?: string;
    type?: string;
    priority?: string;
    scheduledTime?: string;
  };
}

// ============================================================================
// TIPOS DE IMPORTACIÓN/EXPORTACIÓN
// ============================================================================

export interface NotificationExportData {
  notifications: Notification[];
  config: NotificationConfig;
  statistics: NotificationStatistics;
  exportDate: Date;
  version: string;
}

export interface NotificationImportData {
  notifications: Omit<Notification, 'id' | 'createdAt'>[];
  config?: Partial<NotificationConfig>;
  importOptions: {
    mergeWithExisting: boolean;
    updateExisting: boolean;
    skipDuplicates: boolean;
  };
}
