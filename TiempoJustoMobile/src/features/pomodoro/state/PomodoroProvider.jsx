import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { useAsyncStorageState, validatePomodoroSettings } from '../../../storage';

const PomodoroContext = createContext(null);

export function usePomodoroContext() {
    const ctx = useContext(PomodoroContext);
    if (!ctx) throw new Error('usePomodoroContext debe usarse dentro de PomodoroProvider');
    return ctx;
}

export function PomodoroProvider({ children }) {
    const [pomodoroSettings, setPomodoroSettings, { error, isLoading }] = useAsyncStorageState('TJ_POMODORO_SETTINGS', { focusMinutes: 25, shortBreakMinutes: 5, longBreakMinutes: 15 });

    const updatePomodoroSettings = useCallback((settings) => {
        const errors = validatePomodoroSettings(settings);
        if (errors.length > 0) return { ok: false, errors };
        setPomodoroSettings(settings);
        return { ok: true };
    }, [setPomodoroSettings]);

    const value = useMemo(() => ({
        pomodoroSettings,
        updatePomodoroSettings,
        isLoading,
        error,
    }), [pomodoroSettings, updatePomodoroSettings, isLoading, error]);

    return (
        <PomodoroContext.Provider value={value}>
            {children}
        </PomodoroContext.Provider>
    );
}


