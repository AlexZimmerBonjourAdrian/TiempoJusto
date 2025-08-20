// Componente de Notificación de Evolución - Capa de Presentación
// Principio KISS: Keep It Simple, Stupid

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export default function EvolutionNotification({ isVisible, newLevel, onComplete }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.5)).current;
    const slideAnim = useRef(new Animated.Value(-100)).current;

    useEffect(() => {
        if (isVisible) {
            // Animación de entrada
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start();

            // Auto-hide después de 3 segundos
            setTimeout(() => {
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 0,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 0.5,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(slideAnim, {
                        toValue: -100,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ]).start(() => {
                    if (onComplete) {
                        onComplete();
                    }
                });
            }, 3000);
        }
    }, [isVisible]);

    if (!isVisible) return null;

    const getEvolutionMessage = (level) => {
        switch (level) {
            case 2:
                return "¡Tu mascota ha evolucionado a Gusano Rosa!";
            case 3:
                return "¡Tu mascota ha evolucionado a Ratón Gris!";
            case 4:
                return "¡Tu mascota ha alcanzado su forma final!";
            default:
                return "¡Tu mascota ha evolucionado!";
        }
    };

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity: fadeAnim,
                    transform: [
                        { scale: scaleAnim },
                        { translateY: slideAnim }
                    ],
                }
            ]}
        >
            <View style={styles.notification}>
                <Text style={styles.icon}>🌟</Text>
                <Text style={styles.title}>¡Evolución!</Text>
                <Text style={styles.message}>
                    {getEvolutionMessage(newLevel)}
                </Text>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        zIndex: 1000,
    },
    notification: {
        backgroundColor: 'rgba(16, 185, 129, 0.95)',
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#10B981',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowRadius: 8,
        elevation: 8,
    },
    icon: {
        fontSize: 32,
        marginBottom: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 4,
    },
    message: {
        fontSize: 14,
        color: 'white',
        textAlign: 'center',
        lineHeight: 20,
    },
});
