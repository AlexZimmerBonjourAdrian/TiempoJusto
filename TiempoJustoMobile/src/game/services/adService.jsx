// Servicio de Anuncios - Capa de Servicios
// Principio KISS: Keep It Simple, Stupid

import { adConfig } from '../data/petData';

export class AdService {
    
    // Mostrar anuncio para obtener recurso
    static async showResourceAd(resourceType, onSuccess, onCancel) {
        const adData = adConfig[resourceType];
        
        if (!adData) {
            console.warn(`No se encontró configuración de anuncio para: ${resourceType}`);
            return;
        }

        // Simular anuncio (aquí se integraría con AdMob, Facebook Ads, etc.)
        return new Promise((resolve, reject) => {
            // Simular tiempo de anuncio
            setTimeout(() => {
                if (onSuccess) {
                    onSuccess(adData.reward);
                }
                resolve(adData.reward);
            }, adData.duration * 1000);
        });
    }

    // Verificar si hay anuncios disponibles
    static isAdAvailable(resourceType) {
        return !!adConfig[resourceType];
    }

    // Obtener información del anuncio
    static getAdInfo(resourceType) {
        return adConfig[resourceType] || null;
    }

    // Obtener duración del anuncio
    static getAdDuration(resourceType) {
        const adData = adConfig[resourceType];
        return adData ? adData.duration : 15; // Default 15 segundos
    }

    // Obtener mensaje del anuncio
    static getAdMessage(resourceType) {
        const adData = adConfig[resourceType];
        return adData ? adData.message : 'Mira un anuncio para obtener el recurso';
    }

    // Obtener recompensa del anuncio
    static getAdReward(resourceType) {
        const adData = adConfig[resourceType];
        return adData ? adData.reward : {};
    }
}
