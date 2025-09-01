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
        this.appStateSubscription = null;
        // Asegurar que el handler mantenga el contexto correcto
        this.handleAppStateChange = this.handleAppStateChange.bind(this);
        
        this.setupAppStateListener();
        this.loadState();
    }

    setupAppStateListener() {
        try {
            // Usar la API moderna que retorna una suscripción removible
            this.appStateSubscription = AppState.addEventListener('change', this.handleAppStateChange);
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
                    completedMode: String(this.mode || 'focus')
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
            // Crear un objeto de estado limpio sin referencias circulares
            const state = {
                isRunning: Boolean(this.isRunning),
                mode: String(this.mode || 'focus'),
                secondsLeft: Number(this.secondsLeft || 0),
                totalSeconds: Number(this.totalSeconds || 0),
                startTime: this.startTime ? Number(this.startTime) : null,
                pauseTime: this.pauseTime ? Number(this.pauseTime) : null,
                timestamp: Date.now(),
            };
            
            // Validar que todos los valores sean serializables
            const serializedState = JSON.stringify(state);
            await AsyncStorage.setItem('TJ_POMODORO_STATE', serializedState);
        } catch (error) {
            console.error('Error guardando estado del Pomodoro:', error);
            // En caso de error, intentar guardar un estado mínimo
            try {
                const minimalState = {
                    isRunning: false,
                    mode: 'focus',
                    secondsLeft: 0,
                    totalSeconds: 0,
                    startTime: null,
                    pauseTime: null,
                    timestamp: Date.now(),
                };
                await AsyncStorage.setItem('TJ_POMODORO_STATE', JSON.stringify(minimalState));
            } catch (fallbackError) {
                console.error('Error guardando estado mínimo del Pomodoro:', fallbackError);
            }
        }
    }

    // Cargar estado desde AsyncStorage
    async loadState() {
        try {
            const state = await AsyncStorage.getItem('TJ_POMODORO_STATE');
            if (state) {
                const parsedState = JSON.parse(state);
                
                // Validar que el estado tenga la estructura correcta
                if (parsedState && typeof parsedState === 'object') {
                    // Solo restaurar si el estado es reciente (menos de 1 hora)
                    const isRecent = parsedState.timestamp && (Date.now() - parsedState.timestamp < 60 * 60 * 1000);
                    
                    if (isRecent) {
                        // Asignar valores con validación de tipos
                        this.isRunning = Boolean(parsedState.isRunning);
                        this.mode = String(parsedState.mode || 'focus');
                        this.secondsLeft = Number(parsedState.secondsLeft || 0);
                        this.totalSeconds = Number(parsedState.totalSeconds || 0);
                        this.startTime = parsedState.startTime ? Number(parsedState.startTime) : null;
                        this.pauseTime = parsedState.pauseTime ? Number(parsedState.pauseTime) : null;
                        
                        // Si estaba corriendo, sincronizar el tiempo
                        if (this.isRunning && this.startTime) {
                            this.syncTime();
                        }
                        
                        this.notifyCallbacks();
                    }
                }
            }
        } catch (error) {
            console.error('Error cargando estado del Pomodoro:', error);
            // En caso de error, limpiar el estado corrupto
            try {
                await AsyncStorage.removeItem('TJ_POMODORO_STATE');
            } catch (cleanupError) {
                console.error('Error limpiando estado corrupto del Pomodoro:', cleanupError);
            }
        }
    }

    // Suscribirse a cambios del temporizador
    subscribe(callback) {
        this.callbacks.add(callback);
        return () => this.callbacks.delete(callback);
    }

    // Notificar a todos los suscriptores
    notifyCallbacks() {
        // Crear un objeto de estado limpio sin referencias circulares
        const state = {
            isRunning: Boolean(this.isRunning),
            mode: String(this.mode || 'focus'),
            secondsLeft: Number(this.secondsLeft || 0),
            totalSeconds: Number(this.totalSeconds || 0),
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
            isRunning: Boolean(this.isRunning),
            mode: String(this.mode || 'focus'),
            secondsLeft: Number(this.secondsLeft || 0),
            totalSeconds: Number(this.totalSeconds || 0),
        };
    }

    // Limpiar estado corrupto
    async clearCorruptedState() {
        try {
            await AsyncStorage.removeItem('TJ_POMODORO_STATE');
            console.log('Estado corrupto del Pomodoro limpiado');
        } catch (error) {
            console.error('Error limpiando estado corrupto del Pomodoro:', error);
        }
    }

    // Limpiar recursos
    cleanup() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        try {
            if (this.appStateSubscription && typeof this.appStateSubscription.remove === 'function') {
                this.appStateSubscription.remove();
            }
        } catch (error) {
            console.error('Error removiendo listener de AppState:', error);
        }
        this.callbacks.clear();
    }
}

// Crear instancia singleton
const pomodoroService = new PomodoroService();

export default pomodoroService;
