// ============================================================================
// HOOK PARA MANEJO DE ERRORES - TIEMPOJUSTO
// ============================================================================

import { useState, useCallback } from 'react';
import { debugUtils } from '../utils';

// ============================================================================
// TIPOS
// ============================================================================

interface UseErrorHandlerReturn {
  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;
  handleError: (error: unknown, context?: string) => void;
}

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

export function useErrorHandler(): UseErrorHandlerReturn {
  const [error, setErrorState] = useState<string | null>(null);

  // ============================================================================
  // FUNCIONES
  // ============================================================================

  const setError = useCallback((newError: string | null): void => {
    setErrorState(newError);
    if (newError) {
      debugUtils.error('Error set by useErrorHandler', newError);
    }
  }, []);

  const clearError = useCallback((): void => {
    setErrorState(null);
  }, []);

  const handleError = useCallback((error: unknown, context?: string): void => {
    let errorMessage: string;
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else {
      errorMessage = 'Error desconocido';
    }

    const fullContext = context ? `${context}: ${errorMessage}` : errorMessage;
    setErrorState(fullContext);
    
    debugUtils.error('Error handled by useErrorHandler', { error, context });
  }, []);

  return {
    error,
    setError,
    clearError,
    handleError
  };
}
