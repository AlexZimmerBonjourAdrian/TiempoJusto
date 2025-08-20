import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class PomodoroService {
    constructor() {
        this.timer = null;
        this.isRunning = false;
        this.mode = 'focus'; // 'focus' | 'break'
        this.secondsLeft = 0;
        this.totalSeconds = 0;
        this.startTime = null;
        this.pauseTime = null;
        this.callbacks = new Set();
        this.appState = AppState.currentState; // Inicializar appState
        
        this.setupAppStateListener();
        this.loadState();
    }

    setupAppStateListener() {
        try {
            AppState.addEventListener('change', this.handleAppStateChange.bind(this));
        } catch (error) {
            console.error('Error configurando listener de AppState:', error);
        }
    }

    handleAppStateChange(nextAppState) {
        if (this.appState && this.appState === 'active' && nextAppState && nextAppState.match(/inactive|background/)) {
            // App va al segundo plano - pausar visualmente pero mantener el timer
            this.pauseVisual();
        } else if (this.appState && this.appState.match(/inactive|background/) && nextAppState && nextAppState === 'active') {
            // App vuelve al primer plano - sincronizar el tiempo
            this.syncTime();
        }
        
        this.appState = nextAppState;
    }

    // Iniciar el temporizador
    start(settings, mode = 'focus') {
        this.mode = mode;
        this.totalSeconds = (mode === 'focus' ? settings.focusMinutes : settings.shortBreakMinutes) * 60;
        this.secondsLeft = this.totalSeconds;
        this.startTime = Date.now();
        this.isRunning = true;
        
        this.saveState();
        this.startTimer();
        this.notifyCallbacks();
    }

    // Pausar el temporizador
    pause() {
        this.isRunning = false;
        this.pauseTime = Date.now();
        
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        this.saveState();
        this.notifyCallbacks();
    }

    // Reanudar el temporizador
    resume() {
        if (!this.isRunning && this.secondsLeft > 0) {
            this.isRunning = true;
            this.startTime = Date.now() - (this.totalSeconds - this.secondsLeft) * 1000;
            this.pauseTime = null;
            
            this.startTimer();
            this.saveState();
            this.notifyCallbacks();
        }
    }

    // Reiniciar el temporizador
    reset(settings, mode = 'focus') {
        this.isRunning = false;
        this.mode = mode;
        this.totalSeconds = (mode === 'focus' ? settings.focusMinutes : settings.shortBreakMinutes) * 60;
        this.secondsLeft = this.totalSeconds;
        this.startTime = null;
        this.pauseTime = null;
        
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        this.saveState();
        this.notifyCallbacks();
    }

    // Cambiar modo (focus/break)
    switchMode(settings, newMode) {
        this.reset(settings, newMode);
    }

    // Iniciar el timer interno
    startTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        this.timer = setInterval(() => {
            if (this.isRunning) {
                const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
                this.secondsLeft = Math.max(0, this.totalSeconds - elapsed);
                
                if (this.secondsLeft <= 0) {
                    this.complete();
                }
                
                this.notifyCallbacks();
            }
        }, 1000);
    }

    // Completar el temporizador
    complete() {
        this.isRunning = false;
        this.secondsLeft = 0;
        
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        this.saveState();
        this.notifyCallbacks();
        
        // Notificar completado
        this.notifyCompletion();
        
        console.log(`Pomodoro ${this.mode} completado!`);
    }

    // Notificar completado a todos los suscriptores
    notifyCompletion() {
        this.callbacks.forEach(callback => {
            try {
                callback({
                    ...this.getState(),
                    completed: true,
                    completedMode: this.mode
                });
            } catch (error) {
                console.error('Error en callback de completado del Pomodoro:', error);
            }
        });
    }

    // Pausar visualmente (cuando la app va al segundo plano)
    pauseVisual() {
        // No pausamos realmente, solo guardamos el estado
        this.saveState();
    }

    // Sincronizar tiempo cuando la app vuelve al primer plano
    syncTime() {
        if (this.isRunning && this.startTime) {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            this.secondsLeft = Math.max(0, this.totalSeconds - elapsed);
            
            if (this.secondsLeft <= 0) {
                this.complete();
            } else {
                this.notifyCallbacks();
            }
        }
    }

    // Guardar estado en AsyncStorage
    async saveState() {
        try {
            const state = {
                isRunning: this.isRunning,
                mode: this.mode,
                secondsLeft: this.secondsLeft,
                totalSeconds: this.totalSeconds,
                startTime: this.startTime,
                pauseTime: this.pauseTime,
                timestamp: Date.now(),
            };
            await AsyncStorage.setItem('TJ_POMODORO_STATE', JSON.stringify(state));
        } catch (error) {
            console.error('Error guardando estado del Pomodoro:', error);
        }
    }

    // Cargar estado desde AsyncStorage
    async loadState() {
        try {
            const state = await AsyncStorage.getItem('TJ_POMODORO_STATE');
            if (state) {
                const parsedState = JSON.parse(state);
                
                // Solo restaurar si el estado es reciente (menos de 1 hora)
                const isRecent = Date.now() - parsedState.timestamp < 60 * 60 * 1000;
                
                if (isRecent) {
                    this.isRunning = parsedState.isRunning;
                    this.mode = parsedState.mode;
                    this.secondsLeft = parsedState.secondsLeft;
                    this.totalSeconds = parsedState.totalSeconds;
                    this.startTime = parsedState.startTime;
                    this.pauseTime = parsedState.pauseTime;
                    
                    // Si estaba corriendo, sincronizar el tiempo
                    if (this.isRunning && this.startTime) {
                        this.syncTime();
                    }
                    
                    this.notifyCallbacks();
                }
            }
        } catch (error) {
            console.error('Error cargando estado del Pomodoro:', error);
        }
    }

    // Suscribirse a cambios del temporizador
    subscribe(callback) {
        this.callbacks.add(callback);
        return () => this.callbacks.delete(callback);
    }

    // Notificar a todos los suscriptores
    notifyCallbacks() {
        const state = {
            isRunning: this.isRunning,
            mode: this.mode,
            secondsLeft: this.secondsLeft,
            totalSeconds: this.totalSeconds,
        };
        
        this.callbacks.forEach(callback => {
            try {
                callback(state);
            } catch (error) {
                console.error('Error en callback del Pomodoro:', error);
            }
        });
    }

    // Obtener estado actual
    getState() {
        return {
            isRunning: this.isRunning,
            mode: this.mode,
            secondsLeft: this.secondsLeft,
            totalSeconds: this.totalSeconds,
        };
    }

    // Limpiar recursos
    cleanup() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        try {
            AppState.removeEventListener('change', this.handleAppStateChange);
        } catch (error) {
            console.error('Error removiendo listener de AppState:', error);
        }
        this.callbacks.clear();
    }
}

// Crear instancia singleton
const pomodoroService = new PomodoroService();

export default pomodoroService;
