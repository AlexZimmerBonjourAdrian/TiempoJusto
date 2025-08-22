import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// Configuración del servicio de backup
const BACKUP_CONFIG = {
    AUTO_BACKUP_INTERVAL: 24 * 60 * 60 * 1000, // 24 horas
    MAX_BACKUPS: 5, // Máximo 5 backups
    BACKUP_KEYS: ['TJ_APP_STATE', 'TJ_BACKUP_HISTORY'],
    VERSION: '1.0.0'
};

class BackupService {
    constructor() {
        this.isBackupScheduled = false;
        this.lastBackupTime = null;
    }

    // Crear backup automático
    async createAutoBackup() {
        try {
            console.log('🔄 Iniciando backup automático...');
            
            const backup = await this.createBackup();
            await this.saveBackupHistory(backup);
            await this.cleanupOldBackups();
            
            this.lastBackupTime = Date.now();
            console.log('✅ Backup automático completado');
            
            return backup;
        } catch (error) {
            console.error('❌ Error en backup automático:', error);
            throw error;
        }
    }

    // Crear backup manual
    async createManualBackup() {
        try {
            console.log('🔄 Iniciando backup manual...');
            
            const backup = await this.createBackup();
            await this.saveBackupHistory(backup);
            
            console.log('✅ Backup manual completado');
            Alert.alert(
                'Backup Completado',
                'Se ha creado un backup de tus datos exitosamente.',
                [{ text: 'OK' }]
            );
            
            return backup;
        } catch (error) {
            console.error('❌ Error en backup manual:', error);
            Alert.alert(
                'Error de Backup',
                'No se pudo crear el backup. Verifica el espacio disponible.',
                [{ text: 'OK' }]
            );
            throw error;
        }
    }

    // Crear backup base
    async createBackup() {
        try {
            const data = await AsyncStorage.multiGet(BACKUP_CONFIG.BACKUP_KEYS);
            
            const backup = {
                timestamp: Date.now(),
                version: BACKUP_CONFIG.VERSION,
                data: Object.fromEntries(data.filter(([_, value]) => value !== null)),
                type: 'auto',
                size: JSON.stringify(data).length
            };
            
            const backupKey = `TJ_BACKUP_${backup.timestamp}`;
            await AsyncStorage.setItem(backupKey, JSON.stringify(backup));
            
            return backup;
        } catch (error) {
            console.error('Error creando backup:', error);
            throw error;
        }
    }

    // Guardar historial de backups
    async saveBackupHistory(backup) {
        try {
            const historyKey = 'TJ_BACKUP_HISTORY';
            const existingHistory = await AsyncStorage.getItem(historyKey);
            const history = existingHistory ? JSON.parse(existingHistory) : [];
            
            history.push({
                timestamp: backup.timestamp,
                size: backup.size,
                type: backup.type,
                version: backup.version
            });
            
            // Mantener solo los últimos MAX_BACKUPS
            if (history.length > BACKUP_CONFIG.MAX_BACKUPS) {
                history.splice(0, history.length - BACKUP_CONFIG.MAX_BACKUPS);
            }
            
            await AsyncStorage.setItem(historyKey, JSON.stringify(history));
        } catch (error) {
            console.error('Error guardando historial:', error);
        }
    }

    // Limpiar backups antiguos
    async cleanupOldBackups() {
        try {
            const historyKey = 'TJ_BACKUP_HISTORY';
            const historyStr = await AsyncStorage.getItem(historyKey);
            
            if (!historyStr) return;
            
            const history = JSON.parse(historyStr);
            const currentBackups = history.slice(-BACKUP_CONFIG.MAX_BACKUPS);
            
            // Eliminar backups antiguos
            for (const backup of history) {
                if (!currentBackups.find(b => b.timestamp === backup.timestamp)) {
                    const backupKey = `TJ_BACKUP_${backup.timestamp}`;
                    await AsyncStorage.removeItem(backupKey);
                    console.log(`🗑️ Eliminado backup antiguo: ${backup.timestamp}`);
                }
            }
            
            // Actualizar historial
            await AsyncStorage.setItem(historyKey, JSON.stringify(currentBackups));
        } catch (error) {
            console.error('Error limpiando backups:', error);
        }
    }

    // Restaurar backup
    async restoreBackup(backupTimestamp = null) {
        try {
            console.log('🔄 Iniciando restauración...');
            
            let backupKey;
            if (backupTimestamp) {
                backupKey = `TJ_BACKUP_${backupTimestamp}`;
            } else {
                // Usar el backup más reciente
                const historyStr = await AsyncStorage.getItem('TJ_BACKUP_HISTORY');
                if (!historyStr) {
                    throw new Error('No hay backups disponibles');
                }
                
                const history = JSON.parse(historyStr);
                if (history.length === 0) {
                    throw new Error('No hay backups disponibles');
                }
                
                const latestBackup = history[history.length - 1];
                backupKey = `TJ_BACKUP_${latestBackup.timestamp}`;
            }
            
            const backupStr = await AsyncStorage.getItem(backupKey);
            if (!backupStr) {
                throw new Error('Backup no encontrado');
            }
            
            const backup = JSON.parse(backupStr);
            
            // Validar backup
            if (!backup.data || !backup.timestamp) {
                throw new Error('Backup corrupto');
            }
            
            // Restaurar datos
            await AsyncStorage.multiSet(Object.entries(backup.data));
            
            console.log('✅ Restauración completada');
            Alert.alert(
                'Restauración Completada',
                'Los datos han sido restaurados exitosamente. La aplicación se reiniciará.',
                [{ text: 'OK' }]
            );
            
            return backup;
        } catch (error) {
            console.error('❌ Error en restauración:', error);
            Alert.alert(
                'Error de Restauración',
                error.message || 'No se pudo restaurar el backup.',
                [{ text: 'OK' }]
            );
            throw error;
        }
    }

    // Obtener historial de backups
    async getBackupHistory() {
        try {
            const historyStr = await AsyncStorage.getItem('TJ_BACKUP_HISTORY');
            return historyStr ? JSON.parse(historyStr) : [];
        } catch (error) {
            console.error('Error obteniendo historial:', error);
            return [];
        }
    }

    // Verificar si necesita backup automático
    async shouldCreateAutoBackup() {
        try {
            const history = await this.getBackupHistory();
            if (history.length === 0) return true;
            
            const lastBackup = history[history.length - 1];
            const timeSinceLastBackup = Date.now() - lastBackup.timestamp;
            
            return timeSinceLastBackup >= BACKUP_CONFIG.AUTO_BACKUP_INTERVAL;
        } catch (error) {
            console.error('Error verificando backup automático:', error);
            return false;
        }
    }

    // Programar backup automático
    scheduleAutoBackup() {
        if (this.isBackupScheduled) return;
        
        this.isBackupScheduled = true;
        
        // Verificar cada hora si necesita backup
        setInterval(async () => {
            try {
                const shouldBackup = await this.shouldCreateAutoBackup();
                if (shouldBackup) {
                    await this.createAutoBackup();
                }
            } catch (error) {
                console.error('Error en backup automático programado:', error);
            }
        }, 60 * 60 * 1000); // Cada hora
    }

    // Obtener estadísticas de backup
    async getBackupStats() {
        try {
            const history = await this.getBackupHistory();
            
            if (history.length === 0) {
                return {
                    totalBackups: 0,
                    lastBackup: null,
                    totalSize: 0,
                    averageSize: 0
                };
            }
            
            const totalSize = history.reduce((sum, backup) => sum + (backup.size || 0), 0);
            const averageSize = Math.round(totalSize / history.length);
            
            return {
                totalBackups: history.length,
                lastBackup: history[history.length - 1],
                totalSize,
                averageSize
            };
        } catch (error) {
            console.error('Error obteniendo estadísticas:', error);
            return {
                totalBackups: 0,
                lastBackup: null,
                totalSize: 0,
                averageSize: 0
            };
        }
    }

    // Validar integridad de backups
    async validateBackups() {
        try {
            const history = await this.getBackupHistory();
            const validBackups = [];
            
            for (const backupInfo of history) {
                const backupKey = `TJ_BACKUP_${backupInfo.timestamp}`;
                const backupStr = await AsyncStorage.getItem(backupKey);
                
                if (backupStr) {
                    try {
                        const backup = JSON.parse(backupStr);
                        if (backup.data && backup.timestamp) {
                            validBackups.push(backupInfo);
                        }
                    } catch (error) {
                        console.warn(`Backup corrupto: ${backupKey}`);
                    }
                }
            }
            
            // Actualizar historial con solo backups válidos
            await AsyncStorage.setItem('TJ_BACKUP_HISTORY', JSON.stringify(validBackups));
            
            return validBackups;
        } catch (error) {
            console.error('Error validando backups:', error);
            return [];
        }
    }
}

// Instancia singleton del servicio
const backupService = new BackupService();

export default backupService;
