// ============================================================================
// HOOK PARA MANEJO DE FORMULARIOS - TIEMPOJUSTO
// ============================================================================

import { useState, useCallback } from 'react';
import { validationUtils } from '../utils';

// ============================================================================
// TIPOS
// ============================================================================

interface FormField<T> {
  value: T;
  error: string | null;
  touched: boolean;
}

interface FormState<T> {
  [K in keyof T]: FormField<T[K]>;
}

interface UseFormReturn<T> {
  values: T;
  errors: { [K in keyof T]: string | null };
  touched: { [K in keyof T]: boolean };
  isValid: boolean;
  setValue: <K extends keyof T>(field: K, value: T[K]) => void;
  setError: <K extends keyof T>(field: K, error: string | null) => void;
  setTouched: <K extends keyof T>(field: K, touched: boolean) => void;
  setFieldValue: <K extends keyof T>(field: K, value: T[K]) => void;
  setFieldError: <K extends keyof T>(field: K, error: string | null) => void;
  setFieldTouched: <K extends keyof T>(field: K, touched: boolean) => void;
  resetForm: () => void;
  validateForm: () => boolean;
  validateField: <K extends keyof T>(field: K) => boolean;
  handleSubmit: (onSubmit: (values: T) => void | Promise<void>) => (e?: any) => void;
}

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validationRules?: { [K in keyof T]?: (value: T[K]) => string | null }
): UseFormReturn<T> {
  const [formState, setFormState] = useState<FormState<T>>(() => {
    const state: any = {};
    Object.keys(initialValues).forEach(key => {
      state[key] = {
        value: initialValues[key],
        error: null,
        touched: false
      };
    });
    return state;
  });

  // ============================================================================
  // FUNCIONES
  // ============================================================================

  const setValue = useCallback(<K extends keyof T>(field: K, value: T[K]): void => {
    setFormState(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        value,
        error: null // Clear error when value changes
      }
    }));
  }, []);

  const setError = useCallback(<K extends keyof T>(field: K, error: string | null): void => {
    setFormState(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        error
      }
    }));
  }, []);

  const setTouched = useCallback(<K extends keyof T>(field: K, touched: boolean): void => {
    setFormState(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        touched
      }
    }));
  }, []);

  const setFieldValue = useCallback(<K extends keyof T>(field: K, value: T[K]): void => {
    setValue(field, value);
    setTouched(field, true);
  }, [setValue, setTouched]);

  const setFieldError = useCallback(<K extends keyof T>(field: K, error: string | null): void => {
    setError(field, error);
  }, [setError]);

  const setFieldTouched = useCallback(<K extends keyof T>(field: K, touched: boolean): void => {
    setTouched(field, touched);
  }, [setTouched]);

  const resetForm = useCallback((): void => {
    setFormState(() => {
      const state: any = {};
      Object.keys(initialValues).forEach(key => {
        state[key] = {
          value: initialValues[key],
          error: null,
          touched: false
        };
      });
      return state;
    });
  }, [initialValues]);

  const validateField = useCallback(<K extends keyof T>(field: K): boolean => {
    if (!validationRules || !validationRules[field]) {
      return true;
    }

    const value = formState[field].value;
    const error = validationRules[field]!(value);
    
    setError(field, error);
    return !error;
  }, [formState, validationRules, setError]);

  const validateForm = useCallback((): boolean => {
    if (!validationRules) {
      return true;
    }

    let isValid = true;
    Object.keys(validationRules).forEach(key => {
      const fieldKey = key as keyof T;
      const fieldValid = validateField(fieldKey);
      if (!fieldValid) {
        isValid = false;
      }
    });

    return isValid;
  }, [validationRules, validateField]);

  const handleSubmit = useCallback((onSubmit: (values: T) => void | Promise<void>) => {
    return (e?: any) => {
      if (e) {
        e.preventDefault();
      }

      // Mark all fields as touched
      Object.keys(formState).forEach(key => {
        setTouched(key as keyof T, true);
      });

      // Validate form
      if (validateForm()) {
        const values = Object.keys(formState).reduce((acc, key) => {
          acc[key as keyof T] = formState[key as keyof T].value;
          return acc;
        }, {} as T);

        onSubmit(values);
      }
    };
  }, [formState, setTouched, validateForm]);

  // ============================================================================
  // VALORES COMPUTADOS
  // ============================================================================

  const values = Object.keys(formState).reduce((acc, key) => {
    acc[key as keyof T] = formState[key as keyof T].value;
    return acc;
  }, {} as T);

  const errors = Object.keys(formState).reduce((acc, key) => {
    acc[key as keyof T] = formState[key as keyof T].error;
    return acc;
  }, {} as { [K in keyof T]: string | null });

  const touched = Object.keys(formState).reduce((acc, key) => {
    acc[key as keyof T] = formState[key as keyof T].touched;
    return acc;
  }, {} as { [K in keyof T]: boolean });

  const isValid = Object.values(errors).every(error => !error);

  return {
    values,
    errors,
    touched,
    isValid,
    setValue,
    setError,
    setTouched,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    resetForm,
    validateForm,
    validateField,
    handleSubmit
  };
}
