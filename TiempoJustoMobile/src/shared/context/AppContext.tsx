// ============================================================================
// CONTEXT PRINCIPAL DE LA APLICACIÓN - TIEMPOJUSTO
// ============================================================================

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppContextType, AppSettings } from '../types';
import { DEFAULT_APP_SETTINGS } from '../constants';
import { storageService } from '../storage';
import { debugUtils } from '../utils';

// ============================================================================
// TIPOS DE ESTADO
// ============================================================================

interface AppState {
  isLoading: boolean;
  error: string | null;
  settings: AppSettings;
  isInitialized: boolean;
}

// ============================================================================
// TIPOS DE ACCIONES
// ============================================================================

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SETTINGS'; payload: AppSettings }
  | { type: 'SET_INITIALIZED'; payload: boolean }
  | { type: 'CLEAR_ERROR' };

// ============================================================================
// ESTADO INICIAL
// ============================================================================

const initialState: AppState = {
  isLoading: true,
  error: null,
  settings: DEFAULT_APP_SETTINGS,
  isInitialized: false
};

// ============================================================================
// REDUCER
// ============================================================================

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload };
    
    case 'SET_INITIALIZED':
      return { ...state, isInitialized: action.payload };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    default:
      return state;
  }
};

// ============================================================================
// CONTEXT
// ============================================================================

const AppContext = createContext<AppContextType | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // ============================================================================
  // EFECTOS
  // ============================================================================

  useEffect(() => {
    initializeApp();
  }, []);

  // ============================================================================
  // FUNCIONES DE INICIALIZACIÓN
  // ============================================================================

  const initializeApp = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // Cargar configuración
      const settings = await storageService.getSettings();
      dispatch({ type: 'SET_SETTINGS', payload: settings });

      // Verificar disponibilidad del storage
      const isStorageAvailable = await storageService.getAllKeys();
      if (!isStorageAvailable) {
        throw new Error('Storage no disponible');
      }

      // Limpiar datos antiguos
      await storageService.cleanup();

      dispatch({ type: 'SET_INITIALIZED', payload: true });
      debugUtils.log('App initialized successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error inicializando la aplicación';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      debugUtils.error('Error initializing app', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // ============================================================================
  // FUNCIONES DEL CONTEXT
  // ============================================================================

  const updateSettings = async (newSettings: Partial<AppSettings>): Promise<void> => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const updatedSettings = { ...state.settings, ...newSettings };
      await storageService.setSettings(updatedSettings);
      dispatch({ type: 'SET_SETTINGS', payload: updatedSettings });
      
      debugUtils.log('Settings updated successfully', newSettings);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error actualizando configuración';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      debugUtils.error('Error updating settings', error);
      throw error;
    }
  };

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const setLoading = (loading: boolean): void => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null): void => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  // ============================================================================
  // VALOR DEL CONTEXT
  // ============================================================================

  const contextValue: AppContextType = {
    isLoading: state.isLoading,
    error: state.error,
    settings: state.settings,
    updateSettings,
    clearError
  };

  // ============================================================================
  // RENDERIZADO
  // ============================================================================

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// ============================================================================
// HOOK PERSONALIZADO
// ============================================================================

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  
  return context;
};

// ============================================================================
// HOOKS ESPECIALIZADOS
// ============================================================================

/**
 * Hook para acceder solo a la configuración
 */
export const useAppSettings = () => {
  const { settings, updateSettings } = useAppContext();
  
  return {
    settings,
    updateSettings
  };
};

/**
 * Hook para acceder solo al estado de carga
 */
export const useAppLoading = () => {
  const { isLoading } = useAppContext();
  
  return { isLoading };
};

/**
 * Hook para acceder solo a los errores
 */
export const useAppError = () => {
  const { error, clearError } = useAppContext();
  
  return {
    error,
    clearError
  };
};

/**
 * Hook para acceder a las notificaciones
 */
export const useAppNotifications = () => {
  const { settings, updateSettings } = useAppContext();
  
  const updateNotificationSettings = (notificationSettings: Partial<AppSettings['notifications']>) => {
    updateSettings({
      notifications: {
        ...settings.notifications,
        ...notificationSettings
      }
    });
  };
  
  return {
    notifications: settings.notifications,
    updateNotificationSettings
  };
};

/**
 * Hook para acceder a la configuración del Pomodoro
 */
export const useAppPomodoro = () => {
  const { settings, updateSettings } = useAppContext();
  
  const updatePomodoroSettings = (pomodoroSettings: Partial<AppSettings['pomodoro']>) => {
    updateSettings({
      pomodoro: {
        ...settings.pomodoro,
        ...pomodoroSettings
      }
    });
  };
  
  return {
    pomodoro: settings.pomodoro,
    updatePomodoroSettings
  };
};
