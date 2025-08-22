import { useEffect, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import backupService from '../services/backupService';

export function useBackupService() {
    const { setLastActivity } = useAppContext();

    // Inicializar servicio de backup
    useEffect(() => {
        // Programar backup automático
        backupService.scheduleAutoBackup();
        
        // Validar backups existentes al iniciar
        backupService.validateBackups().catch(error => {
            console.warn('Error validando backups:', error);
        });
        
        return () => {
            // Cleanup si es necesario
        };
    }, []);

    // Crear backup manual
    const createManualBackup = useCallback(async () => {
        try {
            setLastActivity();
            const backup = await backupService.createManualBackup();
            return backup;
        } catch (error) {
            console.error('Error en backup manual:', error);
            throw error;
        }
    }, [setLastActivity]);

    // Restaurar backup
    const restoreBackup = useCallback(async (backupTimestamp = null) => {
        try {
            setLastActivity();
            const backup = await backupService.restoreBackup(backupTimestamp);
            return backup;
        } catch (error) {
            console.error('Error en restauración:', error);
            throw error;
        }
    }, [setLastActivity]);

    // Obtener historial de backups
    const getBackupHistory = useCallback(async () => {
        try {
            return await backupService.getBackupHistory();
        } catch (error) {
            console.error('Error obteniendo historial:', error);
            return [];
        }
    }, []);

    // Obtener estadísticas de backup
    const getBackupStats = useCallback(async () => {
        try {
            return await backupService.getBackupStats();
        } catch (error) {
            console.error('Error obteniendo estadísticas:', error);
            return {
                totalBackups: 0,
                lastBackup: null,
                totalSize: 0,
                averageSize: 0
            };
        }
    }, []);

    // Validar backups
    const validateBackups = useCallback(async () => {
        try {
            return await backupService.validateBackups();
        } catch (error) {
            console.error('Error validando backups:', error);
            return [];
        }
    }, []);

    return {
        createManualBackup,
        restoreBackup,
        getBackupHistory,
        getBackupStats,
        validateBackups
    };
}
