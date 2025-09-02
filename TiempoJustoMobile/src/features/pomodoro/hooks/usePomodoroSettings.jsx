import { useCallback } from 'react';
import { useAppContext } from '../../../context/AppContext';

export const usePomodoroSettings = () => {
    const { pomodoroSettings, updatePomodoroSettings } = useAppContext();

    const update = useCallback((settings) => updatePomodoroSettings(settings), [updatePomodoroSettings]);

    return { settings: pomodoroSettings, update };
};


