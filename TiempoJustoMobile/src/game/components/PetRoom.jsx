// Componente de la Habitación del Tamagotchi - Capa de Presentación
// Principio KISS: Keep It Simple, Stupid

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Alert, ScrollView, Image } from 'react-native';
import { usePetLogic } from '../logic/usePetLogic';
import { useEvolution } from '../hooks/useEvolution';
import ResourceBox from './ResourceBox';
import PetImage from './PetImage';
import MoodIndicator from './MoodIndicator';
import EvolutionDisplay from './EvolutionDisplay';
import EvolutionNotification from './EvolutionNotification';
import { resourceTypes } from '../data/petData';
import { petAssets } from '../data/assetsConfig';
import { AdService } from '../services/adService';

export default function PetRoom({ pet, setPet, onClose, onActivity }) {
    const [fadeAnim] = useState(new Animated.Value(0));
    const { feedPet, getPetEmoji, getPetLevel, getMoodState, petLevelConfig } = usePetLogic();
    
    // Hook para manejar la evolución
    const { isEvolving, evolutionLevel, forceEvolution } = useEvolution(
        pet.xp, 
        pet.previousXP || 0, 
        getPetLevel(pet.xp)
    );

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, []);

    // Configuración de recursos (solo 3 recursos principales)
    const roomResources = [
        resourceTypes.food,
        resourceTypes.water,
        resourceTypes.toy
    ];

    const handleResourceUse = (resourceType) => {
        const resource = resourceTypes[resourceType];
        if (!resource) return;

        const adMessage = AdService.getAdMessage(resourceType);
        const adDuration = AdService.getAdDuration(resourceType);

        Alert.alert(
            `🎁 Obtener ${resource.name}`,
            adMessage,
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "¡Ver Anuncio!", 
                    onPress: async () => {
                        try {
                            await AdService.showResourceAd(resourceType, (reward) => {
                                const updatedPet = feedPet(pet, resourceType);
                                setPet(updatedPet);
                                onActivity && onActivity();
                                
                                Alert.alert(
                                    "✅ ¡Éxito!",
                                    `Tu mascota ha recibido ${resource.name.toLowerCase()}`
                                );
                            });
                        } catch (error) {
                            console.error('Error al mostrar anuncio:', error);
                            Alert.alert("Error", "No se pudo mostrar el anuncio");
                        }
                    }
                }
            ]
        );
    };

    const getStatusColor = (value) => {
        if (value > 70) return '#10B981'; // Verde
        if (value > 40) return '#F59E0B'; // Amarillo
        return '#EF4444'; // Rojo
    };

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            {/* Notificación de evolución */}
            <EvolutionNotification 
                isVisible={isEvolving}
                newLevel={evolutionLevel}
                onComplete={() => {
                    // Callback cuando se oculta la notificación
                }}
            />
            
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Header de la habitación */}
                <View style={styles.header}>
                    <Text style={styles.roomTitle}>🏠 Habitación de {pet.name}</Text>
                    <Pressable onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeText}>✕</Text>
                    </Pressable>
                </View>

                {/* Fondo de la habitación (temporalmente deshabilitado) */}
                {/* <View style={styles.roomBackground}>
                    <Image 
                        source={petAssets.room}
                        style={styles.roomImage}
                        resizeMode="cover"
                    />
                </View> */}

                {/* Mascota en el centro */}
                <View style={styles.petDisplay}>
                    <View style={styles.petCharacter}>
                        <PetImage 
                            petState={getMoodState(pet)}
                            petLevel={isEvolving ? evolutionLevel : getPetLevel(pet.xp)}
                            isDead={pet.hunger <= 0 || pet.thirst <= 0 || pet.energy <= 0}
                            size="main"
                            showAnimation={true}
                            isEvolving={isEvolving}
                            onEvolutionComplete={() => {
                                // Callback cuando termina la evolución
                                console.log('¡Evolución completada!');
                            }}
                        />
                        <Text style={styles.petName}>{pet.name}</Text>
                        <Text style={styles.petLevel}>Nivel {getPetLevel(pet.xp)} - {petLevelConfig[getPetLevel(pet.xp)]?.name}</Text>
                        <Text style={styles.petXP}>{pet.xp} XP</Text>
                    </View>
                </View>

                {/* Cajitas de recursos */}
                <View style={styles.sideContainer}>
                    <Text style={styles.sideTitle}>📦 Recursos</Text>
                    <View style={styles.resourcesGrid}>
                        {roomResources.map((resource, index) => (
                            <ResourceBox 
                                key={resource.name}
                                resource={resource}
                                position={index}
                                onUse={() => handleResourceUse(Object.keys(resourceTypes)[index])}
                                isAvailable={true}
                            />
                        ))}
                    </View>
                </View>

                {/* Estado detallado de la mascota */}
                <View style={styles.statusSection}>
                    <Text style={styles.statusTitle}>📊 Estado Detallado</Text>
                    
                    <View style={styles.statusItem}>
                        <Text style={styles.statusLabel}>🍎 Hambre</Text>
                        <View style={styles.statusBarContainer}>
                            <View style={[styles.statusBar, { width: `${pet.hunger}%`, backgroundColor: getStatusColor(pet.hunger) }]} />
                        </View>
                        <Text style={styles.statusValue}>{pet.hunger}%</Text>
                    </View>

                    <View style={styles.statusItem}>
                        <Text style={styles.statusLabel}>💧 Sed</Text>
                        <View style={styles.statusBarContainer}>
                            <View style={[styles.statusBar, { width: `${pet.thirst}%`, backgroundColor: getStatusColor(pet.thirst) }]} />
                        </View>
                        <Text style={styles.statusValue}>{pet.thirst}%</Text>
                    </View>

                    <View style={styles.statusItem}>
                        <Text style={styles.statusLabel}>⚡ Energía</Text>
                        <View style={styles.statusBarContainer}>
                            <View style={[styles.statusBar, { width: `${pet.energy}%`, backgroundColor: getStatusColor(pet.energy) }]} />
                        </View>
                        <Text style={styles.statusValue}>{pet.energy}%</Text>
                    </View>

                    <View style={styles.statusItem}>
                        <Text style={styles.statusLabel}>😊 Felicidad</Text>
                        <View style={styles.statusBarContainer}>
                            <View style={[styles.statusBar, { width: `${pet.happiness}%`, backgroundColor: getStatusColor(pet.happiness) }]} />
                        </View>
                        <Text style={styles.statusValue}>{pet.happiness}%</Text>
                    </View>
                </View>

                {/* Información del estado de ánimo */}
                <MoodIndicator 
                    moodState={getMoodState(pet)}
                    petLevel={getPetLevel(pet.xp)}
                    isDead={pet.hunger <= 0 || pet.thirst <= 0 || pet.energy <= 0}
                />

                {/* Visualización de evolución */}
                <EvolutionDisplay 
                    currentLevel={getPetLevel(pet.xp)}
                    maxLevel={4}
                />

                {/* Consejos de cuidado */}
                <View style={styles.tipsSection}>
                    <Text style={styles.tipsTitle}>💡 Consejos de Cuidado</Text>
                    <Text style={styles.tipText}>• Completa tareas para que tu mascota gane XP</Text>
                    <Text style={styles.tipText}>• Usa las cajitas de recursos para cuidar a tu mascota</Text>
                    <Text style={styles.tipText}>• Mantén las estadísticas altas para que esté feliz</Text>
                </View>
            </ScrollView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#0f172a',
        zIndex: 1000,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    roomTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    petDisplay: {
        alignItems: 'center',
        marginBottom: 32,
    },
    petCharacter: {
        alignItems: 'center',
        padding: 24,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    roomBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
    },
    roomImage: {
        width: '100%',
        height: '100%',
        opacity: 0.3,
    },
    petName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 4,
    },
    petLevel: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 4,
    },
    petXP: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.6)',
    },
    sideContainer: {
        marginBottom: 24,
    },
    sideTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 16,
    },
    resourcesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statusSection: {
        marginBottom: 24,
    },
    statusTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 16,
    },
    statusItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    statusLabel: {
        fontSize: 14,
        color: 'white',
        width: 80,
    },
    statusBarContainer: {
        flex: 1,
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 4,
        marginHorizontal: 12,
    },
    statusBar: {
        height: '100%',
        borderRadius: 4,
    },
    statusValue: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
        width: 40,
        textAlign: 'right',
    },

    tipsSection: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 16,
        borderRadius: 12,
    },
    tipsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 12,
    },
    tipText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 6,
        lineHeight: 18,
    },
});
