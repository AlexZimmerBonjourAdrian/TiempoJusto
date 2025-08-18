import Cookies from 'js-cookie';
import { STORAGE_KEYS } from '../constants';

// Función para obtener todos los datos de la aplicación
export const getAllAppData = () => {
    const data = {};

    try {
        // Datos principales
        Object.keys(STORAGE_KEYS).forEach(key => {
            const value = Cookies.get(STORAGE_KEYS[key]);
            if (value) {
                data[key] = JSON.parse(value);
            }
        });

        // Datos adicionales específicos de ADHD
        const adhdData = {
            adhdReminders: Cookies.get('adhdReminders'),
            adhdRoutines: Cookies.get('adhdRoutines'),
            adhdPoints: Cookies.get('adhdPoints'),
            adhdBadges: Cookies.get('adhdBadges'),
            adhdStreak: Cookies.get('adhdStreak'),
            adhdTrees: Cookies.get('adhdTrees'),
            hasADHD: Cookies.get('hasADHD'),
            productivityMode: Cookies.get('productivityMode'),
            productivitySettings: Cookies.get('productivitySettings')
        };

        // Solo incluir datos que existan
        Object.keys(adhdData).forEach(key => {
            if (adhdData[key]) {
                data[key] = JSON.parse(adhdData[key]);
            }
        });

        // Datos del calculador de horas
        const calculatorData = {
            calculatorTasks: Cookies.get('calculatorTasks'),
            accuracyData: Cookies.get('accuracyData')
        };

        Object.keys(calculatorData).forEach(key => {
            if (calculatorData[key]) {
                data[key] = JSON.parse(calculatorData[key]);
            }
        });

        // Metadatos de exportación
        data._exportMetadata = {
            exportedAt: new Date().toISOString(),
            appVersion: '1.0.0',
            dataVersion: '1.0',
            totalKeys: Object.keys(data).length
        };

        return data;
    } catch (error) {
        console.error('Error getting app data:', error);
        throw new Error('Error al obtener los datos de la aplicación');
    }
};

// Función para exportar datos a JSON
export const exportData = (filename = 'tiempo-justo-data') => {
    try {
        const data = getAllAppData();
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        return { success: true, message: 'Datos exportados correctamente' };
    } catch (error) {
        console.error('Error exporting data:', error);
        return { success: false, message: 'Error al exportar los datos' };
    }
};

// Función para validar datos importados
export const validateImportedData = (data) => {
    const errors = [];
    const warnings = [];

    // Verificar estructura básica
    if (!data || typeof data !== 'object') {
        errors.push('El archivo no contiene datos válidos');
        return { isValid: false, errors, warnings };
    }

    // Verificar metadatos
    if (!data._exportMetadata) {
        warnings.push('El archivo no contiene metadatos de exportación');
    }

    // Verificar datos principales
    const expectedKeys = Object.keys(STORAGE_KEYS);
    const foundKeys = Object.keys(data).filter(key => !key.startsWith('_'));

    if (foundKeys.length === 0) {
        errors.push('No se encontraron datos válidos en el archivo');
    }

    // Verificar formato de datos específicos
    if (data.tasks && !Array.isArray(data.tasks)) {
        errors.push('Los datos de tareas no tienen el formato correcto');
    }

    if (data.projects && !Array.isArray(data.projects)) {
        errors.push('Los datos de proyectos no tienen el formato correcto');
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
        dataSummary: {
            totalKeys: foundKeys.length,
            keys: foundKeys,
            exportedAt: data._exportMetadata ? data._exportMetadata.exportedAt : null
        }
    };
};

// Función para importar datos
export const importData = (jsonData, options = {}) => {
    const {
        overwrite = false,
            merge = true,
            validateOnly = false
    } = options;

    try {
        // Parsear JSON si es string
        const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

        // Validar datos
        const validation = validateImportedData(data);
        if (!validation.isValid) {
            return {
                success: false,
                message: 'Datos inválidos',
                errors: validation.errors,
                warnings: validation.warnings
            };
        }

        if (validateOnly) {
            return {
                success: true,
                message: 'Datos válidos',
                dataSummary: validation.dataSummary,
                warnings: validation.warnings
            };
        }

        // Preparar datos para importación
        const importResults = {
            imported: 0,
            skipped: 0,
            errors: 0,
            details: []
        };

        // Importar datos principales
        Object.keys(STORAGE_KEYS).forEach(key => {
            if (data[key]) {
                try {
                    const currentData = Cookies.get(STORAGE_KEYS[key]);

                    if (overwrite || !currentData) {
                        // Sobrescribir o crear nuevo
                        Cookies.set(STORAGE_KEYS[key], JSON.stringify(data[key]), { expires: 182 });
                        importResults.imported++;
                        importResults.details.push(`✅ ${key}: Importado`);
                    } else if (merge) {
                        // Combinar datos
                        const currentParsed = JSON.parse(currentData);
                        const mergedData = mergeData(currentParsed, data[key], key);
                        Cookies.set(STORAGE_KEYS[key], JSON.stringify(mergedData), { expires: 182 });
                        importResults.imported++;
                        importResults.details.push(`🔄 ${key}: Combinado`);
                    } else {
                        importResults.skipped++;
                        importResults.details.push(`⏭️ ${key}: Omitido (ya existe)`);
                    }
                } catch (error) {
                    importResults.errors++;
                    importResults.details.push(`❌ ${key}: Error - ${error.message}`);
                }
            }
        });

        // Importar datos ADHD
        const adhdKeys = [
            'adhdReminders', 'adhdRoutines', 'adhdPoints',
            'adhdBadges', 'adhdStreak', 'adhdTrees',
            'hasADHD', 'productivityMode', 'productivitySettings'
        ];

        adhdKeys.forEach(key => {
            if (data[key]) {
                try {
                    const currentData = Cookies.get(key);

                    if (overwrite || !currentData) {
                        Cookies.set(key, JSON.stringify(data[key]), { expires: 365 });
                        importResults.imported++;
                        importResults.details.push(`✅ ${key}: Importado`);
                    } else if (merge) {
                        const currentParsed = JSON.parse(currentData);
                        const mergedData = mergeData(currentParsed, data[key], key);
                        Cookies.set(key, JSON.stringify(mergedData), { expires: 365 });
                        importResults.imported++;
                        importResults.details.push(`🔄 ${key}: Combinado`);
                    } else {
                        importResults.skipped++;
                        importResults.details.push(`⏭️ ${key}: Omitido (ya existe)`);
                    }
                } catch (error) {
                    importResults.errors++;
                    importResults.details.push(`❌ ${key}: Error - ${error.message}`);
                }
            }
        });

        // Importar datos del calculador
        const calculatorKeys = ['calculatorTasks', 'accuracyData'];
        calculatorKeys.forEach(key => {
            if (data[key]) {
                try {
                    const currentData = Cookies.get(key);

                    if (overwrite || !currentData) {
                        Cookies.set(key, JSON.stringify(data[key]), { expires: 182 });
                        importResults.imported++;
                        importResults.details.push(`✅ ${key}: Importado`);
                    } else if (merge) {
                        const currentParsed = JSON.parse(currentData);
                        const mergedData = mergeData(currentParsed, data[key], key);
                        Cookies.set(key, JSON.stringify(mergedData), { expires: 182 });
                        importResults.imported++;
                        importResults.details.push(`🔄 ${key}: Combinado`);
                    } else {
                        importResults.skipped++;
                        importResults.details.push(`⏭️ ${key}: Omitido (ya existe)`);
                    }
                } catch (error) {
                    importResults.errors++;
                    importResults.details.push(`❌ ${key}: Error - ${error.message}`);
                }
            }
        });

        return {
            success: true,
            message: `Importación completada: ${importResults.imported} importados, ${importResults.skipped} omitidos, ${importResults.errors} errores`,
            results: importResults
        };

    } catch (error) {
        console.error('Error importing data:', error);
        return {
            success: false,
            message: 'Error al importar los datos',
            error: error.message
        };
    }
};

// Función para combinar datos existentes con nuevos datos
const mergeData = (currentData, newData, dataType) => {
    if (Array.isArray(currentData) && Array.isArray(newData)) {
        // Para arrays, combinar y eliminar duplicados
        const combined = [...currentData, ...newData];

        if (dataType === 'tasks' || dataType === 'projects') {
            // Eliminar duplicados por ID
            const seen = new Set();
            return combined.filter(item => {
                if (seen.has(item.id)) {
                    return false;
                }
                seen.add(item.id);
                return true;
            });
        }

        return combined;
    } else if (typeof currentData === 'object' && typeof newData === 'object') {
        // Para objetos, combinar propiedades
        return {...currentData, ...newData };
    } else {
        // Para otros tipos, usar los nuevos datos
        return newData;
    }
};

// Función para leer archivo JSON
export const readJsonFile = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                resolve(data);
            } catch (error) {
                reject(new Error('El archivo no es un JSON válido'));
            }
        };

        reader.onerror = () => {
            reject(new Error('Error al leer el archivo'));
        };

        reader.readAsText(file);
    });
};

// Función para obtener estadísticas de datos
export const getDataStats = () => {
    const stats = {};

    try {
        Object.keys(STORAGE_KEYS).forEach(key => {
            const value = Cookies.get(STORAGE_KEYS[key]);
            if (value) {
                const data = JSON.parse(value);
                if (Array.isArray(data)) {
                    stats[key] = {
                        count: data.length,
                        size: JSON.stringify(data).length
                    };
                } else if (typeof data === 'object') {
                    stats[key] = {
                        count: Object.keys(data).length,
                        size: JSON.stringify(data).length
                    };
                } else {
                    stats[key] = {
                        count: 1,
                        size: JSON.stringify(data).length
                    };
                }
            } else {
                stats[key] = { count: 0, size: 0 };
            }
        });

        return stats;
    } catch (error) {
        console.error('Error getting data stats:', error);
        return {};
    }
};