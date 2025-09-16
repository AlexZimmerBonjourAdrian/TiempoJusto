// ============================================================================
// HOOK PARA MANEJO DE STORAGE LOCAL - TIEMPOJUSTO
// ============================================================================

import { useState, useEffect, useCallback } from 'react';
import { storageService } from '../storage';
import { debugUtils } from '../utils';

// ============================================================================
// TIPOS
// ============================================================================

interface UseLocalStorageReturn<T> {
  value: T | null;
  setValue: (value: T) => Promise<void>;
  removeValue: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

export function useLocalStorage<T>(key: string, defaultValue?: T): UseLocalStorageReturn<T> {
  const [value, setValueState] = useState<T | null>(defaultValue || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ============================================================================
  // CARGAR VALOR INICIAL
  // ============================================================================

  useEffect(() => {
    const loadValue = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const storedValue = await storageService.get<T>(key);
        setValueState(storedValue || defaultValue || null);
        
        debugUtils.log(`Loaded value for key: ${key}`, { hasValue: !!storedValue });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error loading value';
        setError(errorMessage);
        debugUtils.error(`Error loading value for key: ${key}`, err);
      } finally {
        setLoading(false);
      }
    };

    loadValue();
  }, [key, defaultValue]);

  // ============================================================================
  // FUNCIONES
  // ============================================================================

  const setValue = useCallback(async (newValue: T): Promise<void> => {
    try {
      setError(null);
      await storageService.set(key, newValue);
      setValueState(newValue);
      
      debugUtils.log(`Saved value for key: ${key}`, { hasValue: !!newValue });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error saving value';
      setError(errorMessage);
      debugUtils.error(`Error saving value for key: ${key}`, err);
      throw err;
    }
  }, [key]);

  const removeValue = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      await storageService.remove(key);
      setValueState(defaultValue || null);
      
      debugUtils.log(`Removed value for key: ${key}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error removing value';
      setError(errorMessage);
      debugUtils.error(`Error removing value for key: ${key}`, err);
      throw err;
    }
  }, [key, defaultValue]);

  return {
    value,
    setValue,
    removeValue,
    loading,
    error
  };
}
