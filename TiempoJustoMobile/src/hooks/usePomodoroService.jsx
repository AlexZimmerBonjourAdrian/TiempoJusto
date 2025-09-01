import { useState, useEffect } from 'react';
import pomodoroService from '../services/pomodoroService';

export const usePomodoroService = (settings) => {
    const [timerState, setTimerState] = useState(pomodoroService.getState());

    useEffect(() => {
        // Suscribirse a cambios del servicio
        const unsubscribe = pomodoroService.subscribe((state) => {
            setTimerState(state);
        });

        // Limpiar suscripción al desmontar
        return unsubscribe;
    }, []);

    // Sincronizar ajustes cuando cambian (cargar duración correcta si el timer no está corriendo)
    useEffect(() => {
        if (!timerState.isRunning) {
            // Si el temporizador está detenido, ajustar los segundos totales según el modo actual
            pomodoroService.reset(settings, timerState.mode || 'focus');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settings.focusMinutes, settings.shortBreakMinutes, settings.longBreakMinutes]);

    const start = (mode = 'focus') => {
        pomodoroService.start(settings, mode);
    };

    const pause = () => {
        pomodoroService.pause();
    };

    const resume = () => {
        pomodoroService.resume();
    };

    const reset = (mode = 'focus') => {
        pomodoroService.reset(settings, mode);
    };

    const switchMode = (newMode) => {
        pomodoroService.switchMode(settings, newMode);
    };

    const toggle = () => {
        if (timerState.isRunning) {
            pause();
        } else {
            if (timerState.secondsLeft > 0) {
                resume();
            } else {
                start(timerState.mode);
            }
        }
    };

    return {
        ...timerState,
        start,
        pause,
        resume,
        reset,
        switchMode,
        toggle,
    };
};
