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
