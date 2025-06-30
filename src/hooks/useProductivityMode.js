'use client'

import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const ProductivityModeContext = createContext();

export function ProductivityModeProvider({ children }) {
    const [mode, setMode] = useState('default'); // 'adhd', 'focus', 'minimal', 'default'
    const [settings, setSettings] = useState({
        maxVisibleTasks: 5,
        showSubtasks: true,
        showGamification: true,
        showRewards: true,
        showAnimations: true,
        colorCoding: true,
        soundEffects: false
    });

    // Cargar configuración guardada
    useEffect(() => {
        try {
            const savedMode = Cookies.get('productivityMode');
            const savedSettings = Cookies.get('productivitySettings');

            if (savedMode) setMode(savedMode);
            if (savedSettings) setSettings(JSON.parse(savedSettings));
        } catch (error) {
            console.error('Error loading productivity settings:', error);
        }
    }, []);

    // Guardar configuración
    useEffect(() => {
        try {
            Cookies.set('productivityMode', mode, { expires: 365 });
            Cookies.set('productivitySettings', JSON.stringify(settings), { expires: 365 });
        } catch (error) {
            console.error('Error saving productivity settings:', error);
        }
    }, [mode, settings]);

    const updateMode = (newMode) => {
        setMode(newMode);

        // Aplicar configuraciones específicas del modo
        switch (newMode) {
            case 'adhd':
                setSettings({
                    maxVisibleTasks: 5,
                    showSubtasks: true,
                    showGamification: true,
                    showRewards: true,
                    showAnimations: true,
                    colorCoding: true,
                    soundEffects: false
                });
                break;
            case 'focus':
                setSettings({
                    maxVisibleTasks: 3,
                    showSubtasks: false,
                    showGamification: false,
                    showRewards: true,
                    showAnimations: false,
                    colorCoding: true,
                    soundEffects: false
                });
                break;
            case 'minimal':
                setSettings({
                    maxVisibleTasks: 8,
                    showSubtasks: false,
                    showGamification: false,
                    showRewards: false,
                    showAnimations: false,
                    colorCoding: false,
                    soundEffects: false
                });
                break;
            default:
                setSettings({
                    maxVisibleTasks: 6,
                    showSubtasks: true,
                    showGamification: false,
                    showRewards: true,
                    showAnimations: true,
                    colorCoding: true,
                    soundEffects: false
                });
        }
    };

    const updateSettings = (newSettings) => {
        setSettings({...settings, ...newSettings });
    };

    return ( <
        ProductivityModeContext.Provider value = {
            {
                mode,
                settings,
                updateMode,
                updateSettings
            }
        } > { children } <
        /ProductivityModeContext.Provider>
    );
}

export function useProductivityMode() {
    const context = useContext(ProductivityModeContext);
    if (!context) {
        throw new Error('useProductivityMode must be used within a ProductivityModeProvider');
    }
    return context;
}