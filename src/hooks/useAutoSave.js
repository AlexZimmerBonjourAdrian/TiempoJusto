'use client'

import { useEffect, useRef, useCallback } from 'react';
import Cookies from 'js-cookie';

// Configuración de guardado
const SAVE_DELAY = 1000; // 1 segundo de delay
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 segundos entre reintentos

export function useAutoSave(key, data, options = {}) {
    const {
        enabled = true,
            delay = SAVE_DELAY,
            maxRetries = MAX_RETRIES,
            onSaveSuccess,
            onSaveError,
            onLoadSuccess,
            onLoadError
    } = options;

    const saveTimeoutRef = useRef(null);
    const retryCountRef = useRef(0);
    const lastSavedDataRef = useRef(null);

    // Función para guardar datos con reintentos
    const saveData = useCallback(async(dataToSave) => {
        if (!enabled || !key) return;

        try {
            // Verificar si los datos han cambiado
            if (JSON.stringify(dataToSave) === JSON.stringify(lastSavedDataRef.current)) {
                return;
            }

            // Intentar guardar
            Cookies.set(key, JSON.stringify(dataToSave), {
                expires: 365, // 1 año
                secure: true, // Solo HTTPS
                sameSite: 'strict' // Protección CSRF
            });

            lastSavedDataRef.current = JSON.stringify(dataToSave);
            retryCountRef.current = 0;

            if (onSaveSuccess) {
                onSaveSuccess(dataToSave);
            }

            console.log(`✅ Datos guardados exitosamente: ${key}`);
        } catch (error) {
            console.error(`❌ Error guardando datos (${key}):`, error);

            // Reintentar si no se han agotado los intentos
            if (retryCountRef.current < maxRetries) {
                retryCountRef.current++;
                console.log(`🔄 Reintentando guardado (${retryCountRef.current}/${maxRetries})...`);

                setTimeout(() => {
                    saveData(dataToSave);
                }, RETRY_DELAY);
            } else {
                if (onSaveError) {
                    onSaveError(error, dataToSave);
                }

                // Guardar en localStorage como respaldo
                try {
                    localStorage.setItem(`backup_${key}`, JSON.stringify({
                        data: dataToSave,
                        timestamp: new Date().toISOString(),
                        error: error.message
                    }));
                    console.log(`💾 Respaldo guardado en localStorage: ${key}`);
                } catch (localStorageError) {
                    console.error('Error guardando respaldo:', localStorageError);
                }
            }
        }
    }, [key, enabled, maxRetries, onSaveSuccess, onSaveError]);

    // Función para cargar datos
    const loadData = useCallback(async() => {
        if (!enabled || !key) return null;

        try {
            // Intentar cargar desde cookies
            const savedData = Cookies.get(key);
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                lastSavedDataRef.current = JSON.stringify(parsedData);

                if (onLoadSuccess) {
                    onLoadSuccess(parsedData);
                }

                console.log(`📂 Datos cargados exitosamente: ${key}`);
                return parsedData;
            }

            // Si no hay datos en cookies, intentar cargar desde localStorage
            const backupData = localStorage.getItem(`backup_${key}`);
            if (backupData) {
                const backup = JSON.parse(backupData);
                console.log(`🔄 Restaurando desde respaldo: ${key}`);

                // Intentar guardar en cookies nuevamente
                await saveData(backup.data);
                return backup.data;
            }

            return null;
        } catch (error) {
            console.error(`❌ Error cargando datos (${key}):`, error);

            if (onLoadError) {
                onLoadError(error);
            }

            return null;
        }
    }, [key, enabled, onLoadSuccess, onLoadError, saveData]);

    // Guardado automático con debounce
    useEffect(() => {
        if (!enabled || !data) return;

        // Limpiar timeout anterior
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        // Programar nuevo guardado
        saveTimeoutRef.current = setTimeout(() => {
            saveData(data);
        }, delay);

        // Cleanup
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [data, delay, enabled, saveData]);

    // Guardado inmediato al desmontar
    useEffect(() => {
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
            if (enabled && data) {
                saveData(data);
            }
        };
    }, []);

    return {
        saveData,
        loadData,
        isSaving: false, // Podrías implementar un estado de guardado si lo necesitas
        lastSaved: lastSavedDataRef.current ? JSON.parse(lastSavedDataRef.current) : null
    };
}

// Hook para sincronizar datos entre pestañas
export function useDataSync(key, data, onDataChange) {
    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === key && event.newValue) {
                try {
                    const newData = JSON.parse(event.newValue);
                    if (onDataChange) {
                        onDataChange(newData);
                    }
                } catch (error) {
                    console.error('Error parsing synced data:', error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [key, onDataChange]);

    // Notificar cambios a otras pestañas
    useEffect(() => {
        if (data) {
            localStorage.setItem(`sync_${key}`, JSON.stringify({
                data,
                timestamp: new Date().toISOString()
            }));
        }
    }, [key, data]);
}