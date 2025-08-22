// Utilidades de la aplicación TiempoJusto

import { PRIORITY_SCORES, DAILY_PERFORMANCE_LEVELS, MONTHLY_PERFORMANCE_LEVELS } from '../constants';

/**
 * Calcula el score de productividad basado en las tareas completadas
 * @param {Array} tasks - Array de tareas
 * @returns {number} - Score de productividad
 */
export const calculateProductivityScore = (tasks) => {
  if (!tasks || tasks.length === 0) return 0;
  
  return tasks
    .filter(task => task.completed)
    .reduce((score, task) => {
      return score + (PRIORITY_SCORES[task.priority] || 0);
    }, 0);
};

/**
 * Calcula la tasa de éxito (porcentaje de tareas completadas)
 * @param {Array} tasks - Array de tareas
 * @returns {number} - Porcentaje de éxito (0-100)
 */
export const calculateSuccessRate = (tasks) => {
  if (!tasks || tasks.length === 0) return 0;
  
  const completedTasks = tasks.filter(task => task.completed).length;
  return Math.round((completedTasks / tasks.length) * 100);
};

/**
 * Obtiene el nivel de rendimiento diario basado en el score
 * @param {number} score - Score de productividad
 * @returns {Object} - Objeto con información del nivel
 */
export const getDailyPerformanceLevel = (score) => {
  for (const [level, config] of Object.entries(DAILY_PERFORMANCE_LEVELS)) {
    const { min = 0, max = Infinity, label, color } = config;
    if (score >= min && score <= max) {
      return { level, label, color, score };
    }
  }
  return DAILY_PERFORMANCE_LEVELS.NEEDS_IMPROVEMENT;
};

/**
 * Obtiene el nivel de rendimiento mensual basado en el score
 * @param {number} score - Score de productividad mensual
 * @returns {Object} - Objeto con información del nivel
 */
export const getMonthlyPerformanceLevel = (score) => {
  for (const [level, config] of Object.entries(MONTHLY_PERFORMANCE_LEVELS)) {
    const { min = 0, max = Infinity, label, color } = config;
    if (score >= min && score <= max) {
      return { level, label, color, score };
    }
  }
  return MONTHLY_PERFORMANCE_LEVELS.IN_PROGRESS;
};

/**
 * Formatea el tiempo en formato MM:SS
 * @param {number} seconds - Segundos totales
 * @returns {string} - Tiempo formateado
 */
export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Formatea la fecha en formato legible
 * @param {Date} date - Fecha a formatear
 * @returns {string} - Fecha formateada
 */
export const formatDate = (date) => {
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('es-ES', options);
};

/**
 * Formatea la hora en formato HH:MM
 * @param {Date} date - Fecha con hora
 * @returns {string} - Hora formateada
 */
export const formatTimeOnly = (date) => {
  const options = { 
    hour: '2-digit', 
    minute: '2-digit' 
  };
  return date.toLocaleTimeString('es-ES', options);
};

/**
 * Obtiene el nombre del día de la semana
 * @param {Date} date - Fecha
 * @returns {string} - Nombre del día
 */
export const getDayName = (date) => {
  const options = { weekday: 'long' };
  return date.toLocaleDateString('es-ES', options);
};

/**
 * Obtiene el nombre del mes
 * @param {Date} date - Fecha
 * @returns {string} - Nombre del mes
 */
export const getMonthName = (date) => {
  const options = { month: 'long' };
  return date.toLocaleDateString('es-ES', options);
};

/**
 * Verifica si una fecha es hoy
 * @param {Date} date - Fecha a verificar
 * @returns {boolean} - True si es hoy
 */
export const isToday = (date) => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
};

/**
 * Verifica si una fecha es ayer
 * @param {Date} date - Fecha a verificar
 * @returns {boolean} - True si es ayer
 */
export const isYesterday = (date) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.getDate() === yesterday.getDate() &&
         date.getMonth() === yesterday.getMonth() &&
         date.getFullYear() === yesterday.getFullYear();
};

/**
 * Obtiene el primer día del mes
 * @param {Date} date - Fecha de referencia
 * @returns {Date} - Primer día del mes
 */
export const getFirstDayOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

/**
 * Obtiene el último día del mes
 * @param {Date} date - Fecha de referencia
 * @returns {Date} - Último día del mes
 */
export const getLastDayOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

/**
 * Obtiene todos los días de un mes
 * @param {Date} date - Fecha de referencia
 * @returns {Array} - Array de fechas del mes
 */
export const getDaysInMonth = (date) => {
  const days = [];
  const firstDay = getFirstDayOfMonth(date);
  const lastDay = getLastDayOfMonth(date);
  
  for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }
  
  return days;
};

/**
 * Genera un ID único
 * @returns {string} - ID único
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Debounce function para optimizar llamadas
 * @param {Function} func - Función a debounce
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} - Función debounced
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function para limitar la frecuencia de llamadas
 * @param {Function} func - Función a throttle
 * @param {number} limit - Límite de tiempo en ms
 * @returns {Function} - Función throttled
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Valida si un objeto está vacío
 * @param {Object} obj - Objeto a validar
 * @returns {boolean} - True si está vacío
 */
export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

/**
 * Clona un objeto de forma profunda
 * @param {Object} obj - Objeto a clonar
 * @returns {Object} - Objeto clonado
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};
