// Tipos y estructuras de datos de la aplicación TiempoJusto
// Este archivo documenta las estructuras de datos utilizadas en la aplicación

/**
 * Estructura de una tarea
 * @typedef {Object} Task
 * @property {string} id - ID único de la tarea
 * @property {string} title - Título de la tarea
 * @property {string} description - Descripción opcional
 * @property {string} priority - Prioridad (A, B, C, D)
 * @property {boolean} completed - Estado de completitud
 * @property {string} projectId - ID del proyecto asociado (opcional)
 * @property {Date} createdAt - Fecha de creación
 * @property {Date} completedAt - Fecha de completitud (opcional)
 * @property {Date} dueDate - Fecha límite (opcional)
 */

/**
 * Estructura de un proyecto
 * @typedef {Object} Project
 * @property {string} id - ID único del proyecto
 * @property {string} name - Nombre del proyecto
 * @property {string} description - Descripción del proyecto
 * @property {string} color - Color del proyecto
 * @property {Date} createdAt - Fecha de creación
 * @property {boolean} active - Estado activo/inactivo
 */

/**
 * Estructura del estado del Pomodoro
 * @typedef {Object} PomodoroState
 * @property {boolean} isRunning - Si el timer está corriendo
 * @property {string} mode - Modo actual (focus, shortBreak, longBreak)
 * @property {number} secondsLeft - Segundos restantes
 * @property {number} totalSeconds - Segundos totales del modo
 * @property {number} startTime - Timestamp de inicio
 * @property {number|null} pauseTime - Timestamp de pausa
 * @property {number} sessionsCompleted - Sesiones completadas
 */

/**
 * Estructura de estadísticas diarias
 * @typedef {Object} DailyStats
 * @property {string} date - Fecha en formato YYYY-MM-DD
 * @property {number} totalTasks - Total de tareas
 * @property {number} completedTasks - Tareas completadas
 * @property {number} successRate - Tasa de éxito (0-100)
 * @property {number} productivityScore - Score de productividad
 * @property {Object} priorityBreakdown - Desglose por prioridad
 * @property {Object} projectBreakdown - Desglose por proyecto
 */

/**
 * Estructura de estadísticas mensuales
 * @typedef {Object} MonthlyStats
 * @property {string} month - Mes en formato YYYY-MM
 * @property {number} totalTasks - Total de tareas del mes
 * @property {number} completedTasks - Tareas completadas del mes
 * @property {number} averageSuccessRate - Tasa de éxito promedio
 * @property {number} totalProductivityScore - Score total del mes
 * @property {Array<DailyStats>} dailyStats - Estadísticas diarias
 * @property {Object} weeklyProgress - Progreso semanal
 * @property {Object} priorityBreakdown - Desglose por prioridad
 */

/**
 * Estructura de una notificación motivacional
 * @typedef {Object} MotivationalNotification
 * @property {string} id - ID único de la notificación
 * @property {string} type - Tipo de notificación
 * @property {string} message - Mensaje motivacional
 * @property {string} author - Autor de la cita (opcional)
 * @property {Date} createdAt - Fecha de creación
 * @property {boolean} read - Si ha sido leída
 */

/**
 * Estructura de configuración de la aplicación
 * @typedef {Object} AppSettings
 * @property {Object} pomodoro - Configuración del Pomodoro
 * @property {Object} notifications - Configuración de notificaciones
 * @property {Object} theme - Configuración del tema
 * @property {Object} productivity - Configuración de productividad
 */

/**
 * Estructura de configuración del Pomodoro
 * @typedef {Object} PomodoroSettings
 * @property {number} focusTime - Tiempo de enfoque en minutos
 * @property {number} shortBreak - Tiempo de descanso corto en minutos
 * @property {number} longBreak - Tiempo de descanso largo en minutos
 * @property {number} sessionsBeforeLongBreak - Sesiones antes del descanso largo
 * @property {boolean} autoStartBreaks - Auto-iniciar descansos
 * @property {boolean} autoStartSessions - Auto-iniciar sesiones
 */

/**
 * Estructura de configuración de notificaciones
 * @typedef {Object} NotificationSettings
 * @property {boolean} enabled - Si las notificaciones están habilitadas
 * @property {boolean} productivityReminders - Recordatorios de productividad
 * @property {boolean} taskCompletion - Notificaciones de completitud
 * @property {boolean} motivationalMessages - Mensajes motivacionales
 * @property {number} reminderInterval - Intervalo de recordatorios en minutos
 */

/**
 * Estructura de configuración del tema
 * @typedef {Object} ThemeSettings
 * @property {string} mode - Modo del tema (light, dark, auto)
 * @property {string} primaryColor - Color primario
 * @property {string} accentColor - Color de acento
 * @property {boolean} animations - Si las animaciones están habilitadas
 */

/**
 * Estructura de configuración de productividad
 * @typedef {Object} ProductivitySettings
 * @property {boolean} showPriorityScores - Mostrar puntuaciones de prioridad
 * @property {boolean} autoSortTasks - Ordenar tareas automáticamente
 * @property {boolean} showProgressBars - Mostrar barras de progreso
 * @property {number} dailyGoal - Meta diaria de tareas
 * @property {boolean} enableAnalytics - Habilitar analíticas detalladas
 */

/**
 * Estructura de un evento de la aplicación
 * @typedef {Object} AppEvent
 * @property {string} id - ID único del evento
 * @property {string} type - Tipo de evento
 * @property {string} action - Acción realizada
 * @property {Object} data - Datos del evento
 * @property {Date} timestamp - Timestamp del evento
 * @property {string} userId - ID del usuario (opcional)
 */

/**
 * Estructura de un log de actividad
 * @typedef {Object} ActivityLog
 * @property {string} id - ID único del log
 * @property {string} action - Acción realizada
 * @property {string} entityType - Tipo de entidad afectada
 * @property {string} entityId - ID de la entidad
 * @property {Object} changes - Cambios realizados
 * @property {Date} timestamp - Timestamp del log
 */

/**
 * Estructura de un backup de datos
 * @typedef {Object} DataBackup
 * @property {string} id - ID único del backup
 * @property {Date} createdAt - Fecha de creación
 * @property {string} version - Versión de la aplicación
 * @property {Object} data - Datos del backup
 * @property {number} size - Tamaño del backup en bytes
 * @property {string} checksum - Checksum para verificación
 */

// Exportar las estructuras para documentación
export const DATA_STRUCTURES = {
  Task: {
    description: 'Estructura de una tarea individual',
    properties: {
      id: 'string - ID único de la tarea',
      title: 'string - Título de la tarea',
      description: 'string - Descripción opcional',
      priority: 'string - Prioridad (A, B, C, D)',
      completed: 'boolean - Estado de completitud',
      projectId: 'string - ID del proyecto asociado (opcional)',
      createdAt: 'Date - Fecha de creación',
      completedAt: 'Date - Fecha de completitud (opcional)',
      dueDate: 'Date - Fecha límite (opcional)'
    }
  },
  Project: {
    description: 'Estructura de un proyecto',
    properties: {
      id: 'string - ID único del proyecto',
      name: 'string - Nombre del proyecto',
      description: 'string - Descripción del proyecto',
      color: 'string - Color del proyecto',
      createdAt: 'Date - Fecha de creación',
      active: 'boolean - Estado activo/inactivo'
    }
  },
  PomodoroState: {
    description: 'Estructura del estado del Pomodoro',
    properties: {
      isRunning: 'boolean - Si el timer está corriendo',
      mode: 'string - Modo actual (focus, shortBreak, longBreak)',
      secondsLeft: 'number - Segundos restantes',
      totalSeconds: 'number - Segundos totales del modo',
      startTime: 'number - Timestamp de inicio',
      pauseTime: 'number|null - Timestamp de pausa',
      sessionsCompleted: 'number - Sesiones completadas'
    }
  }
};

// Constantes de validación
export const VALIDATION_RULES = {
  TASK_TITLE_MIN_LENGTH: 1,
  TASK_TITLE_MAX_LENGTH: 200,
  TASK_DESCRIPTION_MAX_LENGTH: 1000,
  PROJECT_NAME_MIN_LENGTH: 1,
  PROJECT_NAME_MAX_LENGTH: 100,
  POMODORO_MIN_TIME: 1, // 1 minuto
  POMODORO_MAX_TIME: 120, // 2 horas
  MAX_TASKS_PER_DAY: 50,
  MAX_PROJECTS: 20
};

// Tipos de eventos de la aplicación
export const EVENT_TYPES = {
  TASK_CREATED: 'task_created',
  TASK_UPDATED: 'task_updated',
  TASK_COMPLETED: 'task_completed',
  TASK_DELETED: 'task_deleted',
  PROJECT_CREATED: 'project_created',
  PROJECT_UPDATED: 'project_updated',
  PROJECT_DELETED: 'project_deleted',
  POMODORO_STARTED: 'pomodoro_started',
  POMODORO_PAUSED: 'pomodoro_paused',
  POMODORO_COMPLETED: 'pomodoro_completed',
  NOTIFICATION_SENT: 'notification_sent',
  SETTINGS_UPDATED: 'settings_updated'
};

// Estados de la aplicación
export const APP_STATES = {
  LOADING: 'loading',
  READY: 'ready',
  ERROR: 'error',
  OFFLINE: 'offline',
  SYNCING: 'syncing'
};
