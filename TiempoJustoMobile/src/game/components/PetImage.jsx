// Componente de Imagen del Tamagotchi - Capa de Presentación
// Principio KISS: Keep It Simple, Stupid

import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';
import { petAssets, assetSizes, stateToAsset, levelToAsset } from '../data/assetsConfig';

export default function PetImage({ 
    petState = 'default', 
    petLevel = 1,
    isDead = false,
    size = 'main',
    showAnimation = true,
    style = {},
    isEvolving = false,
    onEvolutionComplete = null
}) {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(1)).current;
    const scaleXAnim = useRef(new Animated.Value(1)).current;
    const scaleYAnim = useRef(new Animated.Value(1)).current;
    const whiteFlashAnim = useRef(new Animated.Value(0)).current;

    // Obtener la imagen correspondiente al estado
    const getPetImage = () => {
        // Si está muerto, mostrar imagen de muerte
        if (isDead) {
            return stateToAsset.dead;
        }
        
        // Si es estado por defecto, usar imagen de evolución según nivel
        if (petState === 'default') {
            return levelToAsset[petLevel] || levelToAsset[1];
        }
        
        // Para otros estados, usar las imágenes de estado
        return stateToAsset[petState] || levelToAsset[petLevel] || levelToAsset[1];
    };

    // Obtener el tamaño correspondiente
    const getSize = () => {
        switch (size) {
            case 'main':
                return assetSizes.petMain;
            case 'state':
                return assetSizes.petState;
            case 'icon':
                return assetSizes.resourceIcon;
            default:
                return assetSizes.petMain;
        }
    };

    // Animación de respiración (simplificada)
    const startBreathingAnimation = () => {
        if (!showAnimation) return;

        const breathing = Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.05,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 0.95,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );

        breathing.start();
    };

    // Animación de parpadeo (simplificada)
    const startBlinkingAnimation = () => {
        if (!showAnimation) return;

        const blinking = Animated.loop(
            Animated.sequence([
                Animated.timing(opacityAnim, {
                    toValue: 0.8,
                    duration: 750,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1.0,
                    duration: 750,
                    useNativeDriver: true,
                }),
                Animated.delay(1500),
            ])
        );

        blinking.start();
    };

    // Animación de felicidad (salto) - simplificada
    const startHappyAnimation = () => {
        if (!showAnimation || petState !== 'happy' || isDead) return;

        const happy = Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 1.1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1.0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]);

        happy.start();
    };

    // Animación de muerte (pulso lento)
    const startDeathAnimation = () => {
        if (!showAnimation || !isDead) return;

        const deathPulse = Animated.loop(
            Animated.sequence([
                Animated.timing(opacityAnim, {
                    toValue: 0.6,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1.0,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        );

        deathPulse.start();
    };

    // Animación de Squash and Stretch - simplificada
    const startSquashAndStretch = () => {
        if (!showAnimation || isDead) return;

        const squashAndStretch = Animated.sequence([
            // Squash (comprimir horizontalmente, expandir verticalmente)
            Animated.parallel([
                Animated.timing(scaleXAnim, {
                    toValue: 0.8,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleYAnim, {
                    toValue: 1.2,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]),
            // Stretch (expandir horizontalmente, comprimir verticalmente)
            Animated.parallel([
                Animated.timing(scaleXAnim, {
                    toValue: 1.2,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleYAnim, {
                    toValue: 0.8,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]),
            // Volver a normal
            Animated.parallel([
                Animated.timing(scaleXAnim, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleYAnim, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]),
        ]);

        squashAndStretch.start();
    };

    // Animación de evolución (simplificada)
    const startEvolutionAnimation = () => {
        if (!isEvolving) return;

        const evolutionSequence = Animated.sequence([
            // Escalar hacia arriba
            Animated.timing(scaleAnim, {
                toValue: 1.3,
                duration: 500,
                useNativeDriver: true,
            }),
            // Parpadeos blancos (simplificados)
            Animated.timing(whiteFlashAnim, {
                toValue: 0.8,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(whiteFlashAnim, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(whiteFlashAnim, {
                toValue: 0.8,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(whiteFlashAnim, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            }),
            // Escalar hacia abajo
            Animated.timing(scaleAnim, {
                toValue: 0.8,
                duration: 500,
                useNativeDriver: true,
            }),
            // Volver a normal
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
        ]);

        evolutionSequence.start(() => {
            if (onEvolutionComplete) {
                onEvolutionComplete();
            }
        });
    };

    useEffect(() => {
        // Si está evolucionando, solo mostrar animación de evolución
        if (isEvolving) {
            startEvolutionAnimation();
            return;
        }

        // Si está muerto, solo mostrar animación de muerte
        if (isDead) {
            startDeathAnimation();
            return;
        }

        // Iniciar animaciones según el estado
        startBreathingAnimation();
        startBlinkingAnimation();
        
        // Animación especial para estado feliz
        if (petState === 'happy') {
            const interval = setInterval(() => {
                startHappyAnimation();
            }, 3000);
            
            return () => clearInterval(interval);
        }
    }, [petState, showAnimation, isDead, isEvolving]);

    // Efecto para Squash and Stretch en interacciones
    useEffect(() => {
        if (!isDead && !isEvolving && showAnimation) {
            // Trigger Squash and Stretch cada 5 segundos
            const interval = setInterval(() => {
                startSquashAndStretch();
            }, 5000);
            
            return () => clearInterval(interval);
        }
    }, [isDead, isEvolving, showAnimation]);

    const imageSize = getSize();

    return (
        <View style={[styles.container, style]}>
            <Animated.View
                style={[
                    styles.imageContainer,
                    {
                        width: imageSize.width,
                        height: imageSize.height,
                        transform: [
                            { scale: scaleAnim },
                            { scaleX: scaleXAnim },
                            { scaleY: scaleYAnim }
                        ],
                        opacity: opacityAnim,
                    }
                ]}
            >
                <Image
                    source={getPetImage()}
                    style={[
                        styles.petImage,
                        {
                            width: imageSize.width,
                            height: imageSize.height,
                        }
                    ]}
                    resizeMode="contain"
                />
                
                {/* Overlay blanco para animación de evolución */}
                {isEvolving && (
                    <Animated.View
                        style={[
                            styles.whiteOverlay,
                            {
                                opacity: whiteFlashAnim,
                                backgroundColor: 'white',
                            }
                        ]}
                    />
                )}
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    petImage: {
        borderRadius: 8,
    },
    whiteOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 8,
    },
});
