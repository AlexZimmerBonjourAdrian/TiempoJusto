// ============================================================================
// HOOK PARA MANEJO DE ESTADOS DE CARGA - TIEMPOJUSTO
// ============================================================================

import { useState, useCallback } from 'react';

// ============================================================================
// TIPOS
// ============================================================================

interface UseLoadingReturn {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  withLoading: <T>(asyncFn: () => Promise<T>) => Promise<T>;
  isLoading: boolean;
}

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

export function useLoading(initialState: boolean = false): UseLoadingReturn {
  const [loading, setLoadingState] = useState(initialState);

  // ============================================================================
  // FUNCIONES
  // ============================================================================

  const setLoading = useCallback((newLoading: boolean): void => {
    setLoadingState(newLoading);
  }, []);

  const withLoading = useCallback(async <T>(asyncFn: () => Promise<T>): Promise<T> => {
    try {
      setLoadingState(true);
      const result = await asyncFn();
      return result;
    } finally {
      setLoadingState(false);
    }
  }, []);

  return {
    loading,
    setLoading,
    withLoading,
    isLoading: loading
  };
}
