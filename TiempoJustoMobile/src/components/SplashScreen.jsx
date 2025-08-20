import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Pressable, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onComplete }) {
    const [showTransition, setShowTransition] = useState(false);
    const titleAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const circleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Animación del título levitando
        Animated.loop(
            Animated.sequence([
                Animated.timing(titleAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(titleAnim, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Animación de escala sutil
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 3000,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 0.95,
                    duration: 3000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const handlePress = () => {
        setShowTransition(true);
        
        // Animación del círculo que se expande
        Animated.timing(circleAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();

        // Fade out del contenido
        Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
        }).start();

        // Llamar onComplete después de la transición
        setTimeout(() => {
            onComplete();
        }, 800);
    };

    const titleTranslateY = titleAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -10],
    });

    const titleScale = scaleAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.05],
    });

    const circleScale = circleAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, Math.max(width, height) * 2],
    });

    if (showTransition) {
        return (
            <View style={styles.transitionContainer}>
                <Animated.View 
                    style={[
                        styles.expandingCircle,
                        {
                            transform: [{ scale: circleScale }],
                        }
                    ]} 
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Pressable onPress={handlePress} style={styles.pressableArea}>
                <Animated.View
                    style={[
                        styles.titleContainer,
                        {
                            transform: [
                                { translateY: titleTranslateY },
                                { scale: titleScale }
                            ],
                            opacity: opacityAnim,
                        }
                    ]}
                >
                    <Text style={styles.title}>TiempoJusto</Text>
                    <Text style={styles.subtitle}>Gestión de Productividad Personal</Text>
                    <Text style={styles.tapInstruction}>Toca para comenzar</Text>
                </Animated.View>
            </Pressable>
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
    pressableArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    titleContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        marginBottom: 30,
    },
    tapInstruction: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.6)',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    transitionContainer: {
        flex: 1,
        backgroundColor: '#0f172a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    expandingCircle: {
        width: 1,
        height: 1,
        backgroundColor: '#ffffff',
        borderRadius: 0.5,
    },
});
