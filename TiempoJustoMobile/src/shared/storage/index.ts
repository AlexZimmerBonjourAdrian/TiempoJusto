// ============================================================================
// SISTEMA DE STORAGE COMPARTIDO - TIEMPOJUSTO
// ============================================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageData, AppSettings, ApiResponse } from '../types';
import { STORAGE_KEYS, DEFAULT_APP_SETTINGS } from '../constants';
import { debugUtils } from '../utils';

// ============================================================================
// INTERFAZ DEL STORAGE SERVICE
// ============================================================================

export interface StorageService {
  // Métodos básicos
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
  getAllKeys(): Promise<string[]>;
  
  // Métodos específicos de la app
  getSettings(): Promise<AppSettings>;
  setSettings(settings: AppSettings): Promise<void>;
  getData(): Promise<StorageData>;
  setData(data: StorageData): Promise<void>;
  
  // Métodos de backup
  exportData(): Promise<string>;
  importData(data: string): Promise<void>;
  
  // Métodos de limpieza
  cleanup(): Promise<void>;
  getStorageSize(): Promise<number>;
}

// ============================================================================
// IMPLEMENTACIÓN DEL STORAGE SERVICE
// ============================================================================

class TiempoJustoStorageService implements StorageService {
  private readonly prefix = 'TJ_';
  private readonly version = '1.0.0';

  // ============================================================================
  // MÉTODOS BÁSICOS
  // ============================================================================

  async get<T>(key: string): Promise<T | null> {
    try {
      const fullKey = this.getFullKey(key);
      const value = await AsyncStorage.getItem(fullKey);
      
      if (value === null) {
        return null;
      }
      
      const parsed = JSON.parse(value);
      debugUtils.log(`Storage GET: ${key}`, { hasValue: !!parsed });
      
      // Si el objeto tiene la estructura con 'data', devolver solo el data
      if (parsed && typeof parsed === 'object' && 'data' in parsed) {
        return parsed.data;
      }
      
      // Si no, devolver el objeto tal como está (para compatibilidad)
      return parsed;
    } catch (error) {
      debugUtils.error(`Error getting storage key: ${key}`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      const fullKey = this.getFullKey(key);
      const serialized = JSON.stringify({
        data: value,
        version: this.version,
        timestamp: new Date().toISOString()
      });
      
      await AsyncStorage.setItem(fullKey, serialized);
      debugUtils.log(`Storage SET: ${key}`, { hasValue: !!value });
    } catch (error) {
      debugUtils.error(`Error setting storage key: ${key}`, error);
      throw error;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      const fullKey = this.getFullKey(key);
      await AsyncStorage.removeItem(fullKey);
      debugUtils.log(`Storage REMOVE: ${key}`);
    } catch (error) {
      debugUtils.error(`Error removing storage key: ${key}`, error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = await this.getAllKeys();
      const appKeys = keys.filter(key => key.startsWith(this.prefix));
      
      if (appKeys.length > 0) {
        await AsyncStorage.multiRemove(appKeys);
        debugUtils.log(`Storage CLEAR: ${appKeys.length} keys removed`);
      }
    } catch (error) {
      debugUtils.error('Error clearing storage', error);
      throw error;
    }
  }

  async getAllKeys(): Promise<string[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return keys || [];
    } catch (error) {
      debugUtils.error('Error getting all keys', error);
      return [];
    }
  }

  // ============================================================================
  // MÉTODOS ESPECÍFICOS DE LA APP
  // ============================================================================

  async getSettings(): Promise<AppSettings> {
    try {
      const settings = await this.get<AppSettings>(STORAGE_KEYS.SETTINGS);
      return settings || DEFAULT_APP_SETTINGS;
    } catch (error) {
      debugUtils.error('Error getting settings', error);
      return DEFAULT_APP_SETTINGS;
    }
  }

  async setSettings(settings: AppSettings): Promise<void> {
    try {
      await this.set(STORAGE_KEYS.SETTINGS, settings);
      debugUtils.log('Settings saved successfully');
    } catch (error) {
      debugUtils.error('Error saving settings', error);
      throw error;
    }
  }

  async getData(): Promise<StorageData> {
    try {
      const data = await this.get<StorageData>(STORAGE_KEYS.BACKUP);
      return data || {
        tasks: [],
        projects: [],
        settings: DEFAULT_APP_SETTINGS,
        metrics: {
          totalTasks: 0,
          completedTasks: 0,
          completionRate: 0,
          productivityScore: 0,
          priorityDistribution: { A: 0, B: 0, C: 0, D: 0 },
          dailyStreak: 0,
          weeklyAverage: 0,
          monthlyAverage: 0
        },
        lastSync: new Date()
      };
    } catch (error) {
      debugUtils.error('Error getting app data', error);
      throw error;
    }
  }

  async setData(data: StorageData): Promise<void> {
    try {
      await this.set(STORAGE_KEYS.BACKUP, data);
      debugUtils.log('App data saved successfully');
    } catch (error) {
      debugUtils.error('Error saving app data', error);
      throw error;
    }
  }

  // ============================================================================
  // MÉTODOS DE BACKUP
  // ============================================================================

  async exportData(): Promise<string> {
    try {
      const data = await this.getData();
      const exportData = {
        ...data,
        exportDate: new Date().toISOString(),
        version: this.version,
        appVersion: '1.0.0'
      };
      
      const jsonString = JSON.stringify(exportData, null, 2);
      debugUtils.log('Data exported successfully', { size: jsonString.length });
      return jsonString;
    } catch (error) {
      debugUtils.error('Error exporting data', error);
      throw error;
    }
  }

  async importData(data: string): Promise<void> {
    try {
      const parsedData = JSON.parse(data);
      
      // Validar estructura básica
      if (!this.isValidImportData(parsedData)) {
        throw new Error('Invalid import data structure');
      }
      
      // Migrar datos si es necesario
      const migratedData = await this.migrateData(parsedData);
      
      // Guardar datos importados
      await this.setData(migratedData);
      debugUtils.log('Data imported successfully');
    } catch (error) {
      debugUtils.error('Error importing data', error);
      throw error;
    }
  }

  // ============================================================================
  // MÉTODOS DE LIMPIEZA
  // ============================================================================

  async cleanup(): Promise<void> {
    try {
      const keys = await this.getAllKeys();
      const appKeys = keys.filter(key => key.startsWith(this.prefix));
      
      // Limpiar datos antiguos (más de 30 días)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      for (const key of appKeys) {
        try {
          const value = await AsyncStorage.getItem(key);
          if (value) {
            const parsed = JSON.parse(value);
            if (parsed.timestamp) {
              const timestamp = new Date(parsed.timestamp);
              if (timestamp < thirtyDaysAgo) {
                await AsyncStorage.removeItem(key);
                debugUtils.log(`Cleaned up old data: ${key}`);
              }
            }
          }
        } catch (error) {
          debugUtils.warn(`Error cleaning up key: ${key}`, error);
        }
      }
      
      debugUtils.log('Storage cleanup completed');
    } catch (error) {
      debugUtils.error('Error during storage cleanup', error);
    }
  }

  async getStorageSize(): Promise<number> {
    try {
      const keys = await this.getAllKeys();
      const appKeys = keys.filter(key => key.startsWith(this.prefix));
      
      let totalSize = 0;
      for (const key of appKeys) {
        try {
          const value = await AsyncStorage.getItem(key);
          if (value) {
            totalSize += value.length;
          }
        } catch (error) {
          debugUtils.warn(`Error getting size for key: ${key}`, error);
        }
      }
      
      return totalSize;
    } catch (error) {
      debugUtils.error('Error calculating storage size', error);
      return 0;
    }
  }

  // ============================================================================
  // MÉTODOS PRIVADOS
  // ============================================================================

  private getFullKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  private isValidImportData(data: any): boolean {
    return (
      data &&
      typeof data === 'object' &&
      Array.isArray(data.tasks) &&
      Array.isArray(data.projects) &&
      data.settings &&
      data.metrics
    );
  }

  private async migrateData(data: any): Promise<StorageData> {
    // Implementar migración de datos si es necesario
    // Por ahora, simplemente retornar los datos tal como están
    return data;
  }
}

// ============================================================================
// INSTANCIA SINGLETON
// ============================================================================

export const storageService = new TiempoJustoStorageService();

// ============================================================================
// HOOKS DE STORAGE
// ============================================================================

export const useStorage = () => {
  return {
    get: storageService.get.bind(storageService),
    set: storageService.set.bind(storageService),
    remove: storageService.remove.bind(storageService),
    clear: storageService.clear.bind(storageService),
    getSettings: storageService.getSettings.bind(storageService),
    setSettings: storageService.setSettings.bind(storageService),
    getData: storageService.getData.bind(storageService),
    setData: storageService.setData.bind(storageService),
    exportData: storageService.exportData.bind(storageService),
    importData: storageService.importData.bind(storageService),
    cleanup: storageService.cleanup.bind(storageService),
    getStorageSize: storageService.getStorageSize.bind(storageService)
  };
};

// ============================================================================
// UTILIDADES DE STORAGE
// ============================================================================

export const storageUtils = {
  /**
   * Verifica si el storage está disponible
   */
  isAvailable: async (): Promise<boolean> => {
    try {
      await AsyncStorage.getItem('test');
      return true;
    } catch (error) {
      debugUtils.error('Storage not available', error);
      return false;
    }
  },

  /**
   * Obtiene información del storage
   */
  getInfo: async () => {
    try {
      const keys = await storageService.getAllKeys();
      const size = await storageService.getStorageSize();
      
      return {
        totalKeys: keys.length,
        appKeys: keys.filter(key => key.startsWith('TJ_')).length,
        size: size,
        sizeFormatted: `${(size / 1024).toFixed(2)} KB`
      };
    } catch (error) {
      debugUtils.error('Error getting storage info', error);
      return null;
    }
  }
};
