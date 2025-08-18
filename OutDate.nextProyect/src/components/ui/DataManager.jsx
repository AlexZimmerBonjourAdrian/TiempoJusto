'use client'

import React, { useState, useRef } from 'react';

function DataManager() {
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [importResults, setImportResults] = useState(null);
    const [dataStats, setDataStats] = useState({});
    const [showStats, setShowStats] = useState(false);
    const [importOptions, setImportOptions] = useState({
        overwrite: false,
        merge: true,
        validateOnly: false
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [validationResults, setValidationResults] = useState(null);
    const fileInputRef = useRef(null);

    // Función para obtener estadísticas de datos
    const getDataStats = () => {
        const stats = {};
        try {
            // Obtener datos de cookies (como usa tu app)
            const keys = ['tasks', 'projects', 'completedLog', 'taskLog', 'adhdReminders', 'adhdRoutines', 'hasADHD', 'productivityMode'];
            keys.forEach(key => {
                const data = document.cookie.match(new RegExp(key + '=([^;]+)'))?.[1];
                if (data) {
                    try {
                        const parsed = JSON.parse(decodeURIComponent(data));
                        if (Array.isArray(parsed)) {
                            stats[key] = { count: parsed.length, size: JSON.stringify(parsed).length };
                        } else {
                            stats[key] = { count: 1, size: JSON.stringify(parsed).length };
                        }
                    } catch {
                        stats[key] = { count: 0, size: 0 };
                    }
                } else {
                    stats[key] = { count: 0, size: 0 };
                }
            });
        } catch (error) {
            console.error('Error getting data stats:', error);
        }
        return stats;
    };

    // Función para exportar datos
    const exportData = () => {
        try {
            const data = {};
            const keys = ['tasks', 'projects', 'completedLog', 'taskLog', 'adhdReminders', 'adhdRoutines', 'hasADHD', 'productivityMode'];
            
            keys.forEach(key => {
                const value = document.cookie.match(new RegExp(key + '=([^;]+)'))?.[1];
                if (value) {
                    try {
                        data[key] = JSON.parse(decodeURIComponent(value));
                    } catch {
                        data[key] = value;
                    }
                }
            });

            data._exportMetadata = {
                exportedAt: new Date().toISOString(),
                appVersion: '1.0.0',
                dataVersion: '1.0'
            };

            const jsonString = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `tiempo-justo-data-${new Date().toISOString().split('T')[0]}.json`;
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
    const validateImportedData = (data) => {
        const errors = [];
        const warnings = [];

        if (!data || typeof data !== 'object') {
            errors.push('El archivo no contiene datos válidos');
            return { isValid: false, errors, warnings };
        }

        if (!data._exportMetadata) {
            warnings.push('El archivo no contiene metadatos de exportación');
        }

        const expectedKeys = ['tasks', 'projects', 'completedLog', 'taskLog'];
        const foundKeys = Object.keys(data).filter(key => !key.startsWith('_'));

        if (foundKeys.length === 0) {
            errors.push('No se encontraron datos válidos en el archivo');
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            dataSummary: {
                totalKeys: foundKeys.length,
                keys: foundKeys,
                exportedAt: data._exportMetadata?.exportedAt
            }
        };
    };

    // Función para leer archivo JSON
    const readJsonFile = (file) => {
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

    // Función para importar datos
    const importData = async (data, options) => {
        const { overwrite = false, merge = true } = options;
        
        try {
            const importResults = {
                imported: 0,
                skipped: 0,
                errors: 0,
                details: []
            };

            const keys = ['tasks', 'projects', 'completedLog', 'taskLog', 'adhdReminders', 'adhdRoutines', 'hasADHD', 'productivityMode'];
            
            keys.forEach(key => {
                if (data[key]) {
                    try {
                        const currentData = document.cookie.match(new RegExp(key + '=([^;]+)'))?.[1];
                        
                        if (overwrite || !currentData) {
                            // Usar js-cookie para guardar en cookies
                            document.cookie = `${key}=${encodeURIComponent(JSON.stringify(data[key]))}; expires=${new Date(Date.now() + 182 * 24 * 60 * 60 * 1000).toUTCString()}; path=/`;
                            importResults.imported++;
                            importResults.details.push(`✅ ${key}: Importado`);
                        } else if (merge) {
                            const currentParsed = JSON.parse(decodeURIComponent(currentData));
                            const mergedData = Array.isArray(currentParsed) && Array.isArray(data[key]) 
                                ? [...currentParsed, ...data[key]]
                                : { ...currentParsed, ...data[key] };
                            document.cookie = `${key}=${encodeURIComponent(JSON.stringify(mergedData))}; expires=${new Date(Date.now() + 182 * 24 * 60 * 60 * 1000).toUTCString()}; path=/`;
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

    // Cargar estadísticas de datos
    const loadDataStats = () => {
        const stats = getDataStats();
        setDataStats(stats);
        setShowStats(true);
    };

    // Manejar exportación
    const handleExport = async () => {
        setIsExporting(true);
        try {
            const result = exportData();
            if (result.success) {
                alert('✅ Datos exportados correctamente');
            } else {
                alert('❌ Error al exportar: ' + result.message);
            }
        } catch (error) {
            alert('❌ Error inesperado: ' + error.message);
        } finally {
            setIsExporting(false);
        }
    };

    // Manejar selección de archivo
    const handleFileSelect = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setSelectedFile(file);
        setIsImporting(true);

        try {
            const data = await readJsonFile(file);
            const validation = validateImportedData(data);
            setValidationResults(validation);

            if (!validation.isValid) {
                alert('❌ Archivo inválido: ' + validation.errors.join(', '));
                setSelectedFile(null);
                setValidationResults(null);
            } else {
                alert('✅ Archivo válido. Puedes proceder con la importación.');
            }
        } catch (error) {
            alert('❌ Error al leer el archivo: ' + error.message);
            setSelectedFile(null);
        } finally {
            setIsImporting(false);
        }
    };

    // Manejar importación
    const handleImport = async () => {
        if (!selectedFile || !validationResults?.isValid) {
            alert('❌ Por favor selecciona un archivo válido primero');
            return;
        }

        setIsImporting(true);
        try {
            const data = await readJsonFile(selectedFile);
            const result = await importData(data, importOptions);
            setImportResults(result);

            if (result.success) {
                alert('✅ Importación completada exitosamente. Los cambios se reflejarán automáticamente.');
            } else {
                alert('❌ Error en la importación: ' + result.message);
            }
        } catch (error) {
            alert('❌ Error inesperado: ' + error.message);
        } finally {
            setIsImporting(false);
        }
    };

    // Limpiar archivo seleccionado
    const clearSelectedFile = () => {
        setSelectedFile(null);
        setValidationResults(null);
        setImportResults(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="data-manager">
            <div className="data-manager-header">
                <h2>🔄 Gestor de Datos</h2>
                <p>Exporta e importa todos tus datos de Tiempo Justo</p>
            </div>

            {/* Estadísticas de datos */}
            <div className="data-stats-section">
                <button 
                    onClick={loadDataStats}
                    className="btn btn-secondary"
                    disabled={isExporting || isImporting}
                >
                    📊 Ver Estadísticas de Datos
                </button>
                
                {showStats && (
                    <div className="data-stats">
                        <h3>Estadísticas Actuales</h3>
                        <div className="stats-grid">
                            {Object.entries(dataStats).map(([key, stats]) => (
                                <div key={key} className="stat-item">
                                    <span className="stat-label">{key}:</span>
                                    <span className="stat-value">
                                        {stats.count} elementos ({Math.round(stats.size / 1024)}KB)
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Exportación */}
            <div className="export-section">
                <h3>📤 Exportar Datos</h3>
                <p>Descarga una copia de seguridad de todos tus datos</p>
                
                <button 
                    onClick={handleExport}
                    disabled={isExporting || isImporting}
                    className="btn btn-primary"
                >
                    {isExporting ? '⏳ Exportando...' : '📤 Exportar Datos'}
                </button>
            </div>

            {/* Importación */}
            <div className="import-section">
                <h3>📥 Importar Datos</h3>
                <p>Restaura datos desde un archivo de respaldo</p>

                {/* Opciones de importación */}
                <div className="import-options">
                    <h4>Opciones de Importación:</h4>
                    <div className="option-group">
                        <label>
                            <input
                                type="radio"
                                name="importMode"
                                checked={importOptions.merge && !importOptions.overwrite}
                                onChange={() => setImportOptions({ merge: true, overwrite: false, validateOnly: false })}
                            />
                            🔄 Combinar con datos existentes
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="importMode"
                                checked={importOptions.overwrite}
                                onChange={() => setImportOptions({ merge: false, overwrite: true, validateOnly: false })}
                            />
                            ⚠️ Sobrescribir todos los datos
                        </label>
                    </div>
                </div>

                {/* Selección de archivo */}
                <div className="file-selection">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleFileSelect}
                        disabled={isExporting || isImporting}
                        className="file-input"
                    />
                    
                    {selectedFile && (
                        <div className="selected-file">
                            <span>📁 {selectedFile.name}</span>
                            <button 
                                onClick={clearSelectedFile}
                                className="btn btn-small btn-danger"
                            >
                                ❌
                            </button>
                        </div>
                    )}
                </div>

                {/* Resultados de validación */}
                {validationResults && (
                    <div className={`validation-results ${validationResults.isValid ? 'valid' : 'invalid'}`}>
                        <h4>Resultados de Validación:</h4>
                        {validationResults.isValid ? (
                            <div className="valid-message">
                                ✅ Archivo válido
                                {validationResults.dataSummary && (
                                    <div className="data-summary">
                                        <p>📊 {validationResults.dataSummary.totalKeys} tipos de datos encontrados</p>
                                        <p>📅 Exportado: {new Date(validationResults.dataSummary.exportedAt).toLocaleString()}</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="invalid-message">
                                ❌ Archivo inválido
                                <ul>
                                    {validationResults.errors.map((error, index) => (
                                        <li key={index}>{error}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {/* Botón de importación */}
                {selectedFile && validationResults?.isValid && (
                    <button 
                        onClick={handleImport}
                        disabled={isExporting || isImporting}
                        className="btn btn-success"
                    >
                        {isImporting ? '⏳ Importando...' : '📥 Importar Datos'}
                    </button>
                )}

                {/* Resultados de importación */}
                {importResults && (
                    <div className={`import-results ${importResults.success ? 'success' : 'error'}`}>
                        <h4>Resultados de Importación:</h4>
                        <p>{importResults.message}</p>
                        {importResults.results && (
                            <div className="import-details">
                                <p>📊 Resumen:</p>
                                <ul>
                                    <li>✅ Importados: {importResults.results.imported}</li>
                                    <li>⏭️ Omitidos: {importResults.results.skipped}</li>
                                    <li>❌ Errores: {importResults.results.errors}</li>
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Advertencias */}
            <div className="warnings-section">
                <h3>⚠️ Advertencias Importantes</h3>
                <ul>
                    <li>💾 Haz una copia de seguridad antes de importar</li>
                    <li>🔄 La importación puede sobrescribir datos existentes</li>
                    <li>📱 Los datos se almacenan en el navegador</li>
                    <li>🔒 No compartas archivos de exportación que contengan información sensible</li>
                </ul>
            </div>

            <style jsx>{`
                .data-manager {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }

                .data-manager-header {
                    text-align: center;
                    margin-bottom: 30px;
                }

                .data-manager-header h2 {
                    color: #4A148C;
                    margin-bottom: 10px;
                }

                .data-manager-header p {
                    color: #666;
                    font-size: 16px;
                }

                .data-stats-section,
                .export-section,
                .import-section,
                .warnings-section {
                    background: #f8f9fa;
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 20px;
                    border: 1px solid #e9ecef;
                }

                .data-stats-section h3,
                .export-section h3,
                .import-section h3,
                .warnings-section h3 {
                    color: #4A148C;
                    margin-bottom: 15px;
                    font-size: 18px;
                }

                .btn {
                    padding: 12px 24px;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin: 5px;
                }

                .btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .btn-primary {
                    background: #4A148C;
                    color: white;
                }

                .btn-primary:hover:not(:disabled) {
                    background: #6a1b9a;
                }

                .btn-secondary {
                    background: #009688;
                    color: white;
                }

                .btn-secondary:hover:not(:disabled) {
                    background: #00796b;
                }

                .btn-success {
                    background: #4CAF50;
                    color: white;
                }

                .btn-success:hover:not(:disabled) {
                    background: #388e3c;
                }

                .btn-danger {
                    background: #f44336;
                    color: white;
                }

                .btn-small {
                    padding: 6px 12px;
                    font-size: 12px;
                }

                .data-stats {
                    margin-top: 15px;
                    padding: 15px;
                    background: white;
                    border-radius: 8px;
                    border: 1px solid #dee2e6;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 10px;
                }

                .stat-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px;
                    background: #f8f9fa;
                    border-radius: 4px;
                }

                .stat-label {
                    font-weight: 600;
                    color: #495057;
                }

                .stat-value {
                    color: #6c757d;
                }

                .import-options {
                    margin: 20px 0;
                    padding: 15px;
                    background: white;
                    border-radius: 8px;
                    border: 1px solid #dee2e6;
                }

                .option-group {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .option-group label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 4px;
                    transition: background 0.2s;
                }

                .option-group label:hover {
                    background: #f8f9fa;
                }

                .file-selection {
                    margin: 20px 0;
                }

                .file-input {
                    width: 100%;
                    padding: 10px;
                    border: 2px dashed #dee2e6;
                    border-radius: 8px;
                    background: white;
                }

                .selected-file {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-top: 10px;
                    padding: 10px;
                    background: #e8f5e8;
                    border-radius: 8px;
                    border: 1px solid #4CAF50;
                }

                .validation-results {
                    margin: 15px 0;
                    padding: 15px;
                    border-radius: 8px;
                }

                .validation-results.valid {
                    background: #e8f5e8;
                    border: 1px solid #4CAF50;
                }

                .validation-results.invalid {
                    background: #ffebee;
                    border: 1px solid #f44336;
                }

                .data-summary {
                    margin-top: 10px;
                    padding: 10px;
                    background: white;
                    border-radius: 4px;
                }

                .import-results {
                    margin: 15px 0;
                    padding: 15px;
                    border-radius: 8px;
                }

                .import-results.success {
                    background: #e8f5e8;
                    border: 1px solid #4CAF50;
                }

                .import-results.error {
                    background: #ffebee;
                    border: 1px solid #f44336;
                }

                .import-details {
                    margin-top: 10px;
                }

                .warnings-section ul {
                    list-style: none;
                    padding: 0;
                }

                .warnings-section li {
                    margin: 8px 0;
                    padding: 8px;
                    background: #fff3cd;
                    border-radius: 4px;
                    border-left: 4px solid #ffc107;
                }

                @media (max-width: 768px) {
                    .data-manager {
                        padding: 15px;
                    }

                    .stats-grid {
                        grid-template-columns: 1fr;
                    }

                    .option-group {
                        gap: 5px;
                    }
                }
            `}</style>
        </div>
    );
}

export default DataManager; 