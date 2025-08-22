// Constantes de la aplicación TiempoJusto

// Prioridades de tareas (Método ABCDE de Brian Tracy)
export const TASK_PRIORITIES = {
  A: 'A',
  B: 'B', 
  C: 'C',
  D: 'D'
};

// Puntuaciones por prioridad para el score de productividad
export const PRIORITY_SCORES = {
  [TASK_PRIORITIES.A]: 10,
  [TASK_PRIORITIES.B]: 7,
  [TASK_PRIORITIES.C]: 4,
  [TASK_PRIORITIES.D]: 1
};

// Niveles de rendimiento diario
export const DAILY_PERFORMANCE_LEVELS = {
  EXCELLENT: { min: 80, label: '¡Excelente día!', color: '#4CAF50' },
  GOOD: { min: 60, max: 79, label: 'Buen trabajo', color: '#FFC107' },
  ACCEPTABLE: { min: 40, max: 59, label: 'Día aceptable', color: '#FF9800' },
  NEEDS_IMPROVEMENT: { max: 39, label: 'Día difícil, pero cada paso cuenta', color: '#F44336' }
};

// Niveles de rendimiento mensual
export const MONTHLY_PERFORMANCE_LEVELS = {
  EXCELLENT: { min: 100, label: '🏆 Excelente', color: '#4CAF50' },
  VERY_GOOD: { min: 70, max: 99, label: '⭐ Muy Bueno', color: '#8BC34A' },
  GOOD: { min: 40, max: 69, label: '👍 Bueno', color: '#FFC107' },
  IN_PROGRESS: { max: 39, label: '🌱 En Progreso', color: '#FF9800' }
};

// Configuración del Pomodoro
export const POMODORO_CONFIG = {
  FOCUS_TIME: 25 * 60, // 25 minutos en segundos
  SHORT_BREAK: 5 * 60, // 5 minutos en segundos
  LONG_BREAK: 15 * 60, // 15 minutos en segundos
  SESSIONS_BEFORE_LONG_BREAK: 4
};

// Tipos de notificaciones motivacionales
export const NOTIFICATION_TYPES = {
  PRODUCTIVITY: 'productivity',
  MOTIVATION: 'motivation',
  DISCIPLINE: 'discipline',
  GENERAL: 'general'
};

// Intervalos de notificaciones (en milisegundos)
export const NOTIFICATION_INTERVALS = {
  PRODUCTIVITY_REMINDER: 30 * 60 * 1000, // 30 minutos
  TASK_COMPLETION: 0, // Inmediato
  PENDING_TASKS: 60 * 60 * 1000 // 1 hora
};

// Colores del tema
export const THEME_COLORS = {
  PRIMARY: '#2196F3',
  SECONDARY: '#FF9800',
  SUCCESS: '#4CAF50',
  WARNING: '#FFC107',
  ERROR: '#F44336',
  INFO: '#2196F3',
  LIGHT: '#F5F5F5',
  DARK: '#212121',
  BACKGROUND: '#121212',
  SURFACE: '#1E1E1E',
  TEXT_PRIMARY: '#FFFFFF',
  TEXT_SECONDARY: '#B0B0B0'
};

// Claves de almacenamiento local
export const STORAGE_KEYS = {
  TASKS: 'tiempojusto_tasks',
  PROJECTS: 'tiempojusto_projects',
  POMODORO_STATE: 'tiempojusto_pomodoro_state',
  SETTINGS: 'tiempojusto_settings',
  STATISTICS: 'tiempojusto_statistics'
};

// Configuración de la aplicación
export const APP_CONFIG = {
  NAME: 'TiempoJusto',
  VERSION: '0.1.0',
  DESCRIPTION: 'Aplicación de gestión de tareas y productividad',
  AUTHOR: 'Alex Zimmer'
};

// Mensajes de motivación por categoría
export const MOTIVATIONAL_MESSAGES = {
  [NOTIFICATION_TYPES.PRODUCTIVITY]: [
    "El tiempo es tu recurso más valioso. Úsalo sabiamente.",
    "Cada minuto cuenta. Enfócate en lo que realmente importa.",
    "La productividad no es hacer más cosas, sino hacer las cosas correctas.",
    "Tu futuro se construye hoy, una tarea a la vez."
  ],
  [NOTIFICATION_TYPES.MOTIVATION]: [
    "Eres más fuerte de lo que crees. Sigue adelante.",
    "Cada pequeño paso te acerca a tus metas.",
    "La consistencia supera a la perfección.",
    "Tu potencial es ilimitado. Confía en ti mismo."
  ],
  [NOTIFICATION_TYPES.DISCIPLINE]: [
    "La disciplina es el puente entre metas y logros.",
    "Los hábitos que construyes hoy definen tu mañana.",
    "La responsabilidad es el precio del éxito.",
    "Mantén el enfoque. Los resultados llegarán."
  ],
  [NOTIFICATION_TYPES.GENERAL]: [
    "El éxito no es final, el fracaso no es fatal: es el coraje para continuar lo que cuenta.",
    "La vida es 10% lo que te pasa y 90% cómo reaccionas a ello.",
    "No cuentes los días, haz que los días cuenten.",
    "El único lugar donde el éxito viene antes que el trabajo es en el diccionario."
  ]
};

// Autores de las citas inspiradoras
export const INSPIRATIONAL_AUTHORS = {
  BRIAN_TRACY: 'Brian Tracy',
  JORDAN_PETERSON: 'Jordan Peterson',
  CARL_JUNG: 'Carl Jung',
  GENERAL: 'General'
};
