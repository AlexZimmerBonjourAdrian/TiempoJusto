import { useCallback, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Constantes de validación
const VALIDATION_RULES = {
  TASK_TITLE_MIN_LENGTH: 1,
  TASK_TITLE_MAX_LENGTH: 200,
  TASK_DESCRIPTION_MAX_LENGTH: 1000,
  PROJECT_NAME_MIN_LENGTH: 1,
  PROJECT_NAME_MAX_LENGTH: 100,
  POMODORO_MIN_TIME: 1,
  POMODORO_MAX_TIME: 120,
  MAX_TASKS_PER_DAY: 50,
  MAX_PROJECTS: 20
};

// Validación de datos
export function validateTask(task) {
  const errors = [];
  
  if (!task.title || task.title.trim().length === 0) {
    errors.push('El título de la tarea es requerido');
  } else if (task.title.length > VALIDATION_RULES.TASK_TITLE_MAX_LENGTH) {
    errors.push(`El título no puede tener más de ${VALIDATION_RULES.TASK_TITLE_MAX_LENGTH} caracteres`);
  }
  
  if (task.description && task.description.length > VALIDATION_RULES.TASK_DESCRIPTION_MAX_LENGTH) {
    errors.push(`La descripción no puede tener más de ${VALIDATION_RULES.TASK_DESCRIPTION_MAX_LENGTH} caracteres`);
  }
  
  if (!['A', 'B', 'C', 'D'].includes(task.priority)) {
    errors.push('La prioridad debe ser A, B, C o D');
  }
  
  return errors;
}

export function validateProject(project) {
  const errors = [];
  
  if (!project.name || project.name.trim().length === 0) {
    errors.push('El nombre del proyecto es requerido');
  } else if (project.name.length > VALIDATION_RULES.PROJECT_NAME_MAX_LENGTH) {
    errors.push(`El nombre no puede tener más de ${VALIDATION_RULES.PROJECT_NAME_MAX_LENGTH} caracteres`);
  }
  
  return errors;
}

export function validatePomodoroSettings(settings) {
  const errors = [];
  
  if (settings.focusMinutes < VALIDATION_RULES.POMODORO_MIN_TIME || 
      settings.focusMinutes > VALIDATION_RULES.POMODORO_MAX_TIME) {
    errors.push(`El tiempo de enfoque debe estar entre ${VALIDATION_RULES.POMODORO_MIN_TIME} y ${VALIDATION_RULES.POMODORO_MAX_TIME} minutos`);
  }
  
  if (settings.shortBreakMinutes < VALIDATION_RULES.POMODORO_MIN_TIME || 
      settings.shortBreakMinutes > VALIDATION_RULES.POMODORO_MAX_TIME) {
    errors.push(`El tiempo de descanso corto debe estar entre ${VALIDATION_RULES.POMODORO_MIN_TIME} y ${VALIDATION_RULES.POMODORO_MAX_TIME} minutos`);
  }
  
  if (settings.longBreakMinutes < VALIDATION_RULES.POMODORO_MIN_TIME || 
      settings.longBreakMinutes > VALIDATION_RULES.POMODORO_MAX_TIME) {
    errors.push(`El tiempo de descanso largo debe estar entre ${VALIDATION_RULES.POMODORO_MIN_TIME} y ${VALIDATION_RULES.POMODORO_MAX_TIME} minutos`);
  }
  
  return errors;
}

async function readJson(key, fallbackValue) {
    try {
        const raw = await AsyncStorage.getItem(key);
        if (raw == null) return fallbackValue;
        
        const parsed = JSON.parse(raw);
        
        // Validar datos críticos
        if (key === 'TJ_TASKS' && Array.isArray(parsed)) {
            const validTasks = parsed.filter(task => {
                const errors = validateTask(task);
                if (errors.length > 0) {
                    console.warn('Task validation failed:', errors, task);
                    return false;
                }
                return true;
            });
            
            if (validTasks.length !== parsed.length) {
                console.warn(`Removed ${parsed.length - validTasks.length} invalid tasks`);
            }
            
            return validTasks;
        }
        
        if (key === 'TJ_PROJECTS' && Array.isArray(parsed)) {
            const validProjects = parsed.filter(project => {
                const errors = validateProject(project);
                if (errors.length > 0) {
                    console.warn('Project validation failed:', errors, project);
                    return false;
                }
                return true;
            });
            
            if (validProjects.length !== parsed.length) {
                console.warn(`Removed ${parsed.length - validProjects.length} invalid projects`);
            }
            
            return validProjects;
        }
        
        if (key === 'TJ_POMODORO_SETTINGS' && parsed) {
            const errors = validatePomodoroSettings(parsed);
            if (errors.length > 0) {
                console.warn('Pomodoro settings validation failed:', errors);
                return fallbackValue;
            }
        }
        
        return parsed;
    } catch (error) {
        console.error('AsyncStorage read error for', key, error);
        // No UI en capa de datos: devolver fallback
        return fallbackValue;
    }
}

async function writeJson(key, value) {
    try {
        // Validar antes de escribir
        if (key === 'TJ_TASKS' && Array.isArray(value)) {
            const errors = value.flatMap(task => validateTask(task));
            if (errors.length > 0) {
                throw new Error(`Validation failed: ${errors.join(', ')}`);
            }
        }
        
        if (key === 'TJ_PROJECTS' && Array.isArray(value)) {
            const errors = value.flatMap(project => validateProject(project));
            if (errors.length > 0) {
                throw new Error(`Validation failed: ${errors.join(', ')}`);
            }
        }
        
        if (key === 'TJ_POMODORO_SETTINGS' && value) {
            const errors = validatePomodoroSettings(value);
            if (errors.length > 0) {
                throw new Error(`Validation failed: ${errors.join(', ')}`);
            }
        }
        
        await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('AsyncStorage write error for', key, error);
        // No UI en capa de datos: propagar error a capas superiores
        throw error;
    }
}

export function useAsyncStorageState(key, initialValue) {
    const [value, setValue] = useState(initialValue);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const isHydratedRef = useRef(false);

    useEffect(() => {
        let isMounted = true;
        (async() => {
            try {
                setError(null);
                setIsLoading(true);
                const stored = await readJson(key, initialValue);
                if (isMounted) {
                    setValue(stored);
                    isHydratedRef.current = true;
                }
            } catch (err) {
                if (isMounted) {
                    setError(err);
                    setValue(initialValue);
                    isHydratedRef.current = true;
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        })();
        return () => {
            isMounted = false;
        };
    }, [key]);

    const setPersistedValue = useCallback(
        async (updater) => {
            try {
                setError(null);
                const next = typeof updater === 'function' ? updater(value) : updater;
                
                if (isHydratedRef.current) {
                    await writeJson(key, next);
                }
                
                setValue(next);
            } catch (err) {
                setError(err);
                // El error ya se muestra en writeJson
            }
        }, [key, value]
    );

    return [value, setPersistedValue, { error, isLoading }];
}

// Función para crear backup
export async function createBackup() {
    try {
        // Respaldar por slices + UI para vertical slice
        const keys = ['TJ_UI_STATE', 'TJ_TASKS_STATE', 'TJ_PROJECTS_STATE', 'TJ_POMODORO_SETTINGS', 'TJ_DAILY_LOGS', 'TJ_MILESTONES'];
        const data = await AsyncStorage.multiGet(keys);
        let dataObject = Object.fromEntries(data.filter(([_, value]) => value !== null));
        // Compatibilidad: incluir antiguas si existen
        const legacyKeys = ['TJ_APP_STATE', 'TJ_TASKS', 'TJ_PROJECTS'];
        const legacyData = await AsyncStorage.multiGet(legacyKeys);
        legacyData.forEach(([k, v]) => { if (v && !dataObject[k]) dataObject[k] = v; });

        const backup = {
            timestamp: Date.now(),
            version: '1.1.0',
            data: dataObject
        };

        await AsyncStorage.setItem('TJ_BACKUP', JSON.stringify(backup));
        return backup;
    } catch (error) {
        console.error('Backup creation failed:', error);
        throw error;
    }
}

// Función para restaurar backup
export async function restoreBackup() {
    try {
        const backupStr = await AsyncStorage.getItem('TJ_BACKUP');
        if (!backupStr) {
            throw new Error('No backup found');
        }
        
        const backup = JSON.parse(backupStr);
        // Restaurar todas las entradas del backup (incluye TJ_APP_STATE o claves antiguas)
        await AsyncStorage.multiSet(Object.entries(backup.data));
        return backup;
    } catch (error) {
        console.error('Backup restoration failed:', error);
        throw error;
    }
}

// Función para limpiar datos corruptos
export async function cleanupCorruptedData() {
    try {
        const keys = ['TJ_TASKS', 'TJ_PROJECTS', 'TJ_DAILY_LOGS', 'TJ_MILESTONES', 'TJ_POMODORO_SETTINGS'];
        
        for (const key of keys) {
            try {
                const value = await AsyncStorage.getItem(key);
                if (value) {
                    JSON.parse(value); // Validar JSON
                }
            } catch (error) {
                console.warn(`Removing corrupted data for ${key}`);
                await AsyncStorage.removeItem(key);
            }
        }
    } catch (error) {
        console.error('Data cleanup failed:', error);
        throw error;
    }
}