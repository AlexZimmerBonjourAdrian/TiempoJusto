import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class BackgroundService {
    constructor() {
        this.appState = AppState.currentState;
        this.isActive = true;
        this.lastActivityTime = Date.now();
        this.backgroundTasks = [];
        
        this.setupAppStateListener();
    }

    setupAppStateListener() {
        try {
            AppState.addEventListener('change', this.handleAppStateChange.bind(this));
        } catch (error) {
            console.error('Error configurando listener de AppState:', error);
        }
    }

    handleAppStateChange(nextAppState) {
        if (this.appState && this.appState.match(/inactive|background/) && nextAppState && nextAppState === 'active') {
            // App vuelve al primer plano
            this.onAppForeground();
        } else if (this.appState && this.appState === 'active' && nextAppState && nextAppState.match(/inactive|background/)) {
            // App va al segundo plano
            this.onAppBackground();
        }
        
        this.appState = nextAppState;
    }

    onAppForeground() {
        this.isActive = true;
        console.log('TiempoJusto: App en primer plano');
        
        // Ejecutar tareas pendientes
        this.executePendingTasks();
        
        // Actualizar tiempo de actividad
        this.updateActivityTime();
    }

    onAppBackground() {
        this.isActive = false;
        console.log('TiempoJusto: App en segundo plano');
        
        // Guardar estado actual
        this.saveCurrentState();
        
        // Programar tareas en segundo plano
        this.scheduleBackgroundTasks();
    }

    updateActivityTime() {
        this.lastActivityTime = Date.now();
        this.saveActivityTime();
    }

    async saveActivityTime() {
        try {
            await AsyncStorage.setItem('TJ_LAST_ACTIVITY', this.lastActivityTime.toString());
        } catch (error) {
            console.error('Error guardando tiempo de actividad:', error);
        }
    }

    async getLastActivityTime() {
        try {
            const time = await AsyncStorage.getItem('TJ_LAST_ACTIVITY');
            return time ? parseInt(time) : Date.now();
        } catch (error) {
            console.error('Error obteniendo tiempo de actividad:', error);
            return Date.now();
        }
    }

    async saveCurrentState() {
        try {
            const state = {
                lastActivityTime: this.lastActivityTime,
                timestamp: Date.now(),
            };
            await AsyncStorage.setItem('TJ_BACKGROUND_STATE', JSON.stringify(state));
        } catch (error) {
            console.error('Error guardando estado en segundo plano:', error);
        }
    }

    async loadBackgroundState() {
        try {
            const state = await AsyncStorage.getItem('TJ_BACKGROUND_STATE');
            if (state) {
                const parsedState = JSON.parse(state);
                this.lastActivityTime = parsedState.lastActivityTime || Date.now();
                return parsedState;
            }
        } catch (error) {
            console.error('Error cargando estado en segundo plano:', error);
        }
        return null;
    }

    addBackgroundTask(task) {
        this.backgroundTasks.push(task);
    }

    async executePendingTasks() {
        if (this.backgroundTasks.length === 0) return;
        
        console.log(`Ejecutando ${this.backgroundTasks.length} tareas pendientes`);
        
        for (const task of this.backgroundTasks) {
            try {
                await task();
            } catch (error) {
                console.error('Error ejecutando tarea en segundo plano:', error);
            }
        }
        
        this.backgroundTasks = [];
    }

    scheduleBackgroundTasks() {
        // Aquí puedes programar tareas específicas para ejecutar en segundo plano
        // Por ejemplo, sincronización de datos, notificaciones, etc.
        
        // Ejemplo: Verificar si hay tareas pendientes importantes
        this.addBackgroundTask(async () => {
            try {
                const tasks = await AsyncStorage.getItem('TJ_TASKS');
                if (tasks) {
                    const parsedTasks = JSON.parse(tasks);
                    const pendingImportantTasks = parsedTasks.filter(
                        task => !task.done && (task.priority === 'A' || task.priority === 'B')
                    );
                    
                    if (pendingImportantTasks.length > 0) {
                        console.log(`Tienes ${pendingImportantTasks.length} tareas importantes pendientes`);
                        // Aquí podrías mostrar una notificación
                    }
                }
            } catch (error) {
                console.error('Error verificando tareas pendientes:', error);
            }
        });
    }

    // Método para verificar si la app estuvo inactiva por mucho tiempo
    async checkInactivityPeriod() {
        const lastActivity = await this.getLastActivityTime();
        const now = Date.now();
        const inactiveTime = now - lastActivity;
        
        // Considerar inactivo después de 4 horas
        const inactiveThreshold = 4 * 60 * 60 * 1000; // 4 horas en milisegundos
        
        return {
            isInactive: inactiveTime > inactiveThreshold,
            inactiveTime,
            lastActivity
        };
    }

    // Método para limpiar recursos
    cleanup() {
        try {
            AppState.removeEventListener('change', this.handleAppStateChange);
        } catch (error) {
            console.error('Error removiendo listener de AppState:', error);
        }
    }
}

// Crear instancia singleton
const backgroundService = new BackgroundService();

export default backgroundService;
