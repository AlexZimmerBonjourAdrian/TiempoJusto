import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Alert, ScrollView } from 'react-native';
import { useAsyncStorageState } from '../storage';
import PetRoom from '../game/components/PetRoom';
import { usePetLogic } from '../game/logic/usePetLogic';
import { calculatePetXP } from '../game/logic/petCalculations';

export default function ProductiPet({ tasks, projects, onActivity }) {
    const [showPetRoom, setShowPetRoom] = useState(false);
    const [pet, setPet] = useAsyncStorageState('TJ_PET', {
        name: "Producti",
        xp: 0,
        level: 1,
        hunger: 100,
        thirst: 100,
        energy: 100,
        happiness: 100,
        lastFed: Date.now(),
        lastWatered: Date.now(),
        mood: 'happy',
        createdAt: Date.now()
    });

    const bounceAnim = useRef(new Animated.Value(1)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;

    // Usar la lógica del pet
    const { updatePetStats, getPetEmoji, getPetLevel, getMoodState } = usePetLogic();

    // Actualizar XP basado en productividad
    useEffect(() => {
        const newXP = calculatePetXP(tasks, projects);
        if (newXP !== pet.xp) {
            setPet(prev => ({ ...prev, xp: newXP }));
            onActivity && onActivity();
        }
    }, [tasks, projects]);

    // Animación de rebote cuando está feliz
    useEffect(() => {
        if (pet.mood === 'happy') {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(bounceAnim, { toValue: 1.1, duration: 500, useNativeDriver: true }),
                    Animated.timing(bounceAnim, { toValue: 1, duration: 500, useNativeDriver: true })
                ])
            ).start();
        }
    }, [pet.mood]);

    // Actualizar estadísticas del pet cada minuto
    useEffect(() => {
        const interval = setInterval(() => {
            const updatedPet = updatePetStats(pet);
            setPet(updatedPet);
        }, 60000); // Cada minuto

        return () => clearInterval(interval);
    }, [pet]);

    const handlePetPress = () => {
        setShowPetRoom(true);
        onActivity && onActivity();
    };

    const getStatusColor = (value) => {
        if (value > 70) return '#10B981'; // Verde
        if (value > 40) return '#F59E0B'; // Amarillo
        return '#EF4444'; // Rojo
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Header del Tamagotchi */}
                <View style={styles.header}>
                    <Text style={styles.title}>🐾 ProductiPet</Text>
                    <Text style={styles.subtitle}>Tu mascota de productividad</Text>
                </View>

                {/* Mascota principal */}
                <Pressable onPress={handlePetPress} style={styles.petSection}>
                    <Animated.View style={[styles.petContainer, { transform: [{ scale: bounceAnim }] }]}>
                        <Text style={styles.petEmoji}>{getPetEmoji(pet.level, pet.mood)}</Text>
                        <Text style={styles.petName}>{pet.name}</Text>
                        <Text style={styles.petLevel}>Nivel {getPetLevel(pet.xp)}</Text>
                        <Text style={styles.petXP}>{pet.xp} XP</Text>
                    </Animated.View>
                </Pressable>

                {/* Estado de la mascota */}
                <View style={styles.statusSection}>
                    <Text style={styles.statusTitle}>Estado de {pet.name}</Text>
                    
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

                {/* Botón para entrar a la habitación */}
                <Pressable 
                    style={styles.roomButton}
                    onPress={() => setShowPetRoom(true)}
                >
                    <Text style={styles.roomButtonIcon}>🏠</Text>
                    <Text style={styles.roomButtonText}>Entrar a la Habitación</Text>
                </Pressable>

                {/* Información de productividad */}
                <View style={styles.productivitySection}>
                    <Text style={styles.productivityTitle}>Tu Productividad</Text>
                    <Text style={styles.productivityText}>
                        Tareas completadas hoy: {tasks?.filter(t => t.done).length || 0}
                    </Text>
                    <Text style={styles.productivityText}>
                        Proyectos activos: {projects?.filter(p => !p.completedAt).length || 0}
                    </Text>
                    <Text style={styles.productivityText}>
                        XP ganado: {pet.xp}
                    </Text>
                </View>
            </ScrollView>

            {/* Habitación del Tamagotchi */}
            {showPetRoom && (
                <PetRoom 
                    pet={pet}
                    setPet={setPet}
                    onClose={() => setShowPetRoom(false)}
                    onActivity={onActivity}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
    },
    petSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    petContainer: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    petEmoji: {
        fontSize: 64,
        marginBottom: 8,
    },
    petName: {
        fontSize: 18,
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
    roomButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    roomButtonIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    roomButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
    productivitySection: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 16,
        borderRadius: 12,
    },
    productivityTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 12,
    },
    productivityText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 4,
    },
});
