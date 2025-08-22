import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export default function LoadingScreen({ message = 'Cargando...', onComplete }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        const animation = Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            })
        ]);

        animation.start(() => {
            if (onComplete) {
                setTimeout(onComplete, 1000);
            }
        });

        return () => animation.stop();
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View 
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }]
                    }
                ]}
            >
                <View style={styles.spinner}>
                    <Text style={styles.spinnerText}>⏳</Text>
                </View>
                <Text style={styles.message}>{message}</Text>
                <Text style={styles.subMessage}>Preparando tu espacio de productividad...</Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        padding: 20,
    },
    spinner: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    spinnerText: {
        fontSize: 32,
    },
    message: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 8,
    },
    subMessage: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 14,
        textAlign: 'center',
    },
});
