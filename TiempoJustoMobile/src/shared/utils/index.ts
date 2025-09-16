// ============================================================================
// UTILIDADES COMPARTIDAS - TIEMPOJUSTO
// ============================================================================

import { TaskPriority, TaskStatus, ProjectStatus, PomodoroState } from '../types';
import { TASK_PRIORITIES, PRODUCTIVITY_LEVELS, TIME_CONSTANTS } from '../constants';

// ============================================================================
// UTILIDADES DE FECHA Y TIEMPO
// ============================================================================

export const dateUtils = {
  /**
   * Formatea una fecha en formato legible
   */
  formatDate: (date: Date, format: 'short' | 'long' | 'time' = 'short'): string => {
    const options: Intl.DateTimeFormatOptions = {
      short: { day: '2-digit', month: '2-digit', year: 'numeric' },
      long: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
      time: { hour: '2-digit', minute: '2-digit' }
    };
    
    return new Intl.DateTimeFormat('es-ES', options[format]).format(date);
  },

  /**
   * Obtiene la fecha de inicio del día
   */
  startOfDay: (date: Date): Date => {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  },

  /**
   * Obtiene la fecha de fin del día
   */
  endOfDay: (date: Date): Date => {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
  },

  /**
   * Calcula la diferencia en días entre dos fechas
   */
  daysBetween: (date1: Date, date2: Date): number => {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diffTime / TIME_CONSTANTS.DAY);
  },

  /**
   * Verifica si una fecha es hoy
   */
  isToday: (date: Date): boolean => {
    const today = new Date();
    return dateUtils.startOfDay(date).getTime() === dateUtils.startOfDay(today).getTime();
  },

  /**
   * Verifica si una fecha es ayer
   */
  isYesterday: (date: Date): boolean => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return dateUtils.startOfDay(date).getTime() === dateUtils.startOfDay(yesterday).getTime();
  },

  /**
   * Obtiene el nombre del día de la semana
   */
  getDayName: (date: Date): string => {
    return new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(date);
  },

  /**
   * Obtiene el nombre del mes
   */
  getMonthName: (date: Date): string => {
    return new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(date);
  }
};

// ============================================================================
// UTILIDADES DE PRODUCTIVIDAD
// ============================================================================

export const productivityUtils = {
  /**
   * Calcula el score de productividad basado en tareas completadas
   */
  calculateProductivityScore: (tasks: Array<{ priority: TaskPriority; status: TaskStatus }>): number => {
    const completedTasks = tasks.filter(task => task.status === 'completed');
    const totalScore = completedTasks.reduce((score, task) => {
      return score + TASK_PRIORITIES[task.priority].points;
    }, 0);
    
    return Math.min(totalScore, 100);
  },

  /**
   * Obtiene el nivel de productividad basado en el score
   */
  getProductivityLevel: (score: number) => {
    for (const [key, level] of Object.entries(PRODUCTIVITY_LEVELS)) {
      if (score >= level.min && score <= level.max) {
        return { key, ...level };
      }
    }
    return { key: 'POOR', ...PRODUCTIVITY_LEVELS.POOR };
  },

  /**
   * Calcula la tasa de completitud
   */
  calculateCompletionRate: (total: number, completed: number): number => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  },

  /**
   * Calcula el tiempo promedio de completitud
   */
  calculateAverageCompletionTime: (tasks: Array<{ estimatedTime?: number; actualTime?: number }>): number => {
    const tasksWithTime = tasks.filter(task => task.actualTime && task.estimatedTime);
    if (tasksWithTime.length === 0) return 0;
    
    const totalTime = tasksWithTime.reduce((sum, task) => sum + (task.actualTime || 0), 0);
    return Math.round(totalTime / tasksWithTime.length);
  }
};

// ============================================================================
// UTILIDADES DE VALIDACIÓN
// ============================================================================

export const validationUtils = {
  /**
   * Valida un email
   */
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Valida que una cadena no esté vacía
   */
  isNotEmpty: (value: string): boolean => {
    return value.trim().length > 0;
  },

  /**
   * Valida que una cadena tenga una longitud mínima
   */
  hasMinLength: (value: string, minLength: number): boolean => {
    return value.trim().length >= minLength;
  },

  /**
   * Valida que una cadena tenga una longitud máxima
   */
  hasMaxLength: (value: string, maxLength: number): boolean => {
    return value.trim().length <= maxLength;
  },

  /**
   * Valida que un número esté en un rango
   */
  isInRange: (value: number, min: number, max: number): boolean => {
    return value >= min && value <= max;
  },

  /**
   * Valida que una fecha sea válida
   */
  isValidDate: (date: any): boolean => {
    return date instanceof Date && !isNaN(date.getTime());
  }
};

// ============================================================================
// UTILIDADES DE ARRAY
// ============================================================================

export const arrayUtils = {
  /**
   * Agrupa elementos de un array por una propiedad
   */
  groupBy: <T>(array: T[], key: keyof T): Record<string, T[]> => {
    return array.reduce((groups, item) => {
      const group = String(item[key]);
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  },

  /**
   * Ordena un array por una propiedad
   */
  sortBy: <T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] => {
    return [...array].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  },

  /**
   * Elimina duplicados de un array
   */
  unique: <T>(array: T[]): T[] => {
    return [...new Set(array)];
  },

  /**
   * Obtiene elementos únicos por una propiedad
   */
  uniqueBy: <T>(array: T[], key: keyof T): T[] => {
    const seen = new Set();
    return array.filter(item => {
      const value = item[key];
      if (seen.has(value)) return false;
      seen.add(value);
      return true;
    });
  },

  /**
   * Divide un array en chunks
   */
  chunk: <T>(array: T[], size: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
};

// ============================================================================
// UTILIDADES DE STRING
// ============================================================================

export const stringUtils = {
  /**
   * Capitaliza la primera letra de una cadena
   */
  capitalize: (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  /**
   * Convierte una cadena a título (cada palabra capitalizada)
   */
  toTitleCase: (str: string): string => {
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  },

  /**
   * Trunca una cadena a una longitud específica
   */
  truncate: (str: string, length: number, suffix: string = '...'): string => {
    if (str.length <= length) return str;
    return str.substring(0, length - suffix.length) + suffix;
  },

  /**
   * Genera un slug a partir de una cadena
   */
  slugify: (str: string): string => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  /**
   * Verifica si una cadena contiene otra
   */
  contains: (str: string, search: string, caseSensitive: boolean = false): boolean => {
    const haystack = caseSensitive ? str : str.toLowerCase();
    const needle = caseSensitive ? search : search.toLowerCase();
    return haystack.includes(needle);
  }
};

// ============================================================================
// UTILIDADES DE NÚMEROS
// ============================================================================

export const numberUtils = {
  /**
   * Formatea un número con separadores de miles
   */
  formatNumber: (num: number, locale: string = 'es-ES'): string => {
    return new Intl.NumberFormat(locale).format(num);
  },

  /**
   * Formatea un porcentaje
   */
  formatPercentage: (num: number, decimals: number = 0): string => {
    return `${num.toFixed(decimals)}%`;
  },

  /**
   * Formatea un tiempo en formato legible
   */
  formatTime: (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours}h`;
    }
    
    return `${hours}h ${remainingMinutes}m`;
  },

  /**
   * Redondea un número a un número específico de decimales
   */
  round: (num: number, decimals: number = 0): number => {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
  },

  /**
   * Clampa un número entre un mínimo y máximo
   */
  clamp: (num: number, min: number, max: number): number => {
    return Math.min(Math.max(num, min), max);
  }
};

// ============================================================================
// UTILIDADES DE STORAGE
// ============================================================================

export const storageUtils = {
  /**
   * Genera una clave única para storage
   */
  generateKey: (prefix: string, suffix?: string): string => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `${prefix}_${timestamp}_${random}${suffix ? `_${suffix}` : ''}`;
  },

  /**
   * Verifica si una clave de storage es válida
   */
  isValidKey: (key: string): boolean => {
    return typeof key === 'string' && key.length > 0 && key.length <= 100;
  },

  /**
   * Limpia datos antiguos del storage
   */
  cleanupOldData: (keys: string[], maxAge: number = TIME_CONSTANTS.DAY * 30): void => {
    // Implementación para limpiar datos antiguos
    console.log('Cleaning up old data...', { keys, maxAge });
  }
};

// ============================================================================
// UTILIDADES DE DEBUGGING
// ============================================================================

export const debugUtils = {
  /**
   * Log con timestamp
   */
  log: (message: string, data?: any): void => {
    if (__DEV__) {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] ${message}`, data || '');
    }
  },

  /**
   * Log de error
   */
  error: (message: string, error?: any): void => {
    if (__DEV__) {
      const timestamp = new Date().toISOString();
      console.error(`[${timestamp}] ERROR: ${message}`, error || '');
    }
  },

  /**
   * Log de warning
   */
  warn: (message: string, data?: any): void => {
    if (__DEV__) {
      const timestamp = new Date().toISOString();
      console.warn(`[${timestamp}] WARNING: ${message}`, data || '');
    }
  },

  /**
   * Mide el tiempo de ejecución de una función
   */
  measureTime: async <T>(fn: () => Promise<T>, label: string): Promise<T> => {
    if (!__DEV__) return fn();
    
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    
    debugUtils.log(`${label} took ${(end - start).toFixed(2)}ms`);
    return result;
  }
};
