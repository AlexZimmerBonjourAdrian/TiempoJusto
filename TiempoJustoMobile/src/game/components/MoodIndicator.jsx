// Componente Indicador de Estado de Ánimo - Capa de Presentación
// Principio KISS: Keep It Simple, Stupid

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PetImage from './PetImage';

export default function MoodIndicator({ moodState, petLevel = 1, isDead = false, showDescription = true }) {
    const getMoodDescription = (state) => {
        if (isDead) {
            return "Tu mascota ha fallecido. ¡Cuida mejor a tu próxima mascota!";
        }
        
        switch (state) {
            case 'happy':
                return "¡Tu mascota está muy feliz! ¡Excelente trabajo!";
            case 'content':
                return "Tu mascota está contenta. Sigue así.";
            case 'neutral':
                return "Tu mascota está bien. Podrías hacer más actividades.";
            case 'sad':
                return "Tu mascota está triste. Necesita más atención.";
            case 'hungry':
                return "¡Tu mascota tiene hambre! Dale comida.";
            case 'thirsty':
                return "¡Tu mascota tiene sed! Dale agua.";
            default:
                return "Tu mascota está bien.";
        }
    };

    const getMoodColor = (state) => {
        if (isDead) {
            return '#EF4444';
        }
        
        switch (state) {
            case 'happy':
                return '#10B981';
            case 'content':
                return '#3B82F6';
            case 'neutral':
                return '#F59E0B';
            case 'sad':
                return '#EF4444';
            case 'hungry':
                return '#FF6B6B';
            case 'thirsty':
                return '#4ECDC4';
            default:
                return '#6B7280';
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.moodDisplay}>
                <PetImage 
                    petState={isDead ? 'dead' : moodState}
                    petLevel={petLevel}
                    isDead={isDead}
                    size="state"
                    showAnimation={true}
                />
                <View style={styles.moodInfo}>
                    <Text style={styles.moodTitle}>
                        {isDead ? '💀 Estado' : '😊 Estado de Ánimo'}
                    </Text>
                    {showDescription && (
                        <Text style={[
                            styles.moodDescription,
                            { color: getMoodColor(moodState) }
                        ]}>
                            {getMoodDescription(moodState)}
                        </Text>
                    )}
                </View>
            </View>
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
    moodDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    moodInfo: {
        flex: 1,
        marginLeft: 16,
    },
    moodTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
    },
    moodDescription: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '500',
    },
});
