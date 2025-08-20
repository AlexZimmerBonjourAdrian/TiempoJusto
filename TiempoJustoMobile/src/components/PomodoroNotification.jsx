import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Pressable } from 'react-native';

export default function PomodoroNotification({ visible, mode, onClose }) {
    const slideAnim = useRef(new Animated.Value(-100)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            // Animación de entrada
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();

            // Auto-ocultar después de 5 segundos
            const timer = setTimeout(() => {
                hideNotification();
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [visible]);

    const hideNotification = () => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onClose();
        });
    };

    if (!visible) return null;

    const getMessage = () => {
        if (mode === 'focus') {
            return {
                title: '¡Sesión de Enfoque Completada!',
                message: 'Excelente trabajo. Es hora de tomar un descanso.',
                color: '#10b981',
            };
        } else {
            return {
                title: '¡Descanso Completado!',
                message: 'Listo para la próxima sesión de enfoque.',
                color: '#3b82f6',
            };
        }
    };

    const message = getMessage();

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [{ translateY: slideAnim }],
                    opacity: opacityAnim,
                },
            ]}
        >
            <View style={[styles.content, { borderLeftColor: message.color }]}>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{message.title}</Text>
                    <Text style={styles.message}>{message.message}</Text>
                </View>
                <Pressable onPress={hideNotification} style={styles.closeButton}>
                    <Text style={styles.closeText}>×</Text>
                </Pressable>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        paddingHorizontal: 16,
        paddingTop: 50,
    },
    content: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    message: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
    },
    closeButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
    },
    closeText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        lineHeight: 20,
    },
});
