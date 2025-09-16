// ============================================================================
// HOOKS COMPARTIDOS - TIEMPOJUSTO
// ============================================================================

// Re-exportar hooks del Context
export * from '../context/AppContext';

// Hook para manejo de estado local con persistencia
export { useLocalStorage } from './useLocalStorage';

// Hook para manejo de errores
export { useErrorHandler } from './useErrorHandler';

// Hook para manejo de loading states
export { useLoading } from './useLoading';

// Hook para manejo de formularios
export { useForm } from './useForm';

// Hook para manejo de notificaciones
export { useNotifications } from './useNotifications';
