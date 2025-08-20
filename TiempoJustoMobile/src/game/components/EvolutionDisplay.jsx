// Componente de Visualización de Evolución - Capa de Presentación
// Principio KISS: Keep It Simple, Stupid

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PetImage from './PetImage';

export default function EvolutionDisplay({ currentLevel, maxLevel = 4 }) {
    const getEvolutionDescription = (level) => {
        switch (level) {
            case 1:
                return "Organismo unicelular - Un pequeño ser que necesita mucho cuidado";
            case 2:
                return "Gusano rosa - ¡Ha evolucionado! Ahora es más curioso";
            case 3:
                return "Ratón gris - ¡Casi adulto! Muy inteligente y activo";
            case 4:
                return "Forma final - ¡Un ser majestuoso y sabio!";
            default:
                return "Evolucionando...";
        }
    };

    const getProgressPercentage = () => {
        return (currentLevel / maxLevel) * 100;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🔄 Evolución</Text>
            
            {/* Imagen de evolución actual */}
            <View style={styles.evolutionImageContainer}>
                <PetImage 
                    petState="default"
                    petLevel={currentLevel}
                    isDead={false}
                    size="state"
                    showAnimation={true}
                />
            </View>
            
            {/* Información de evolución */}
            <View style={styles.evolutionInfo}>
                <Text style={styles.levelText}>Nivel {currentLevel} de {maxLevel}</Text>
                <Text style={styles.descriptionText}>
                    {getEvolutionDescription(currentLevel)}
                </Text>
                
                {/* Barra de progreso de evolución */}
                <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                        <View 
                            style={[
                                styles.progressFill, 
                                { width: `${getProgressPercentage()}%` }
                            ]} 
                        />
                    </View>
                    <Text style={styles.progressText}>
                        {Math.round(getProgressPercentage())}% completado
                    </Text>
                </View>
            </View>
            
            {/* Próximo nivel */}
            {currentLevel < maxLevel && (
                <View style={styles.nextLevelContainer}>
                    <Text style={styles.nextLevelTitle}>Próximo nivel:</Text>
                    <Text style={styles.nextLevelDescription}>
                        {getEvolutionDescription(currentLevel + 1)}
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 16,
        textAlign: 'center',
    },
    evolutionImageContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    evolutionInfo: {
        alignItems: 'center',
    },
    levelText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#10B981',
        marginBottom: 8,
    },
    descriptionText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 16,
    },
    progressContainer: {
        width: '100%',
        alignItems: 'center',
    },
    progressBar: {
        width: '100%',
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 4,
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#10B981',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.6)',
    },
    nextLevelContainer: {
        marginTop: 16,
        padding: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 8,
    },
    nextLevelTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#F59E0B',
        marginBottom: 4,
    },
    nextLevelDescription: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
        lineHeight: 16,
    },
});
