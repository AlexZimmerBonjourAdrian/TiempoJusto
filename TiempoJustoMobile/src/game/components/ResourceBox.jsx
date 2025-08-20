// Componente de Cajita de Recurso - Capa de Presentación
// Principio KISS: Keep It Simple, Stupid

import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Image } from 'react-native';
import { petAssets, assetSizes } from '../data/assetsConfig';

export default function ResourceBox({ resource, position, onUse, isAvailable }) {
    const [isPressed, setIsPressed] = useState(false);
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePress = () => {
        if (onUse && isAvailable) {
            onUse();
        }
    };

    const handlePressIn = () => {
        Animated.timing(scaleAnim, {
            toValue: 0.9,
            duration: 100,
            useNativeDriver: true,
        }).start();
        setIsPressed(true);
    };

    const handlePressOut = () => {
        Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
        }).start();
        setIsPressed(false);
    };

    return (
        <Pressable
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={styles.resourceBoxContainer}
            disabled={!isAvailable}
        >
            <Animated.View 
                style={[
                    styles.resourceBox,
                    { 
                        transform: [{ scale: scaleAnim }],
                        backgroundColor: resource.color,
                        opacity: isAvailable ? 1 : 0.6
                    }
                ]}
            >
                {/* Icono del recurso */}
                <View style={styles.resourceIconContainer}>
                    {resource.type === 'food' && (
                        <Image 
                            source={petAssets.states.hungry}
                            style={styles.resourceIcon}
                            resizeMode="contain"
                        />
                    )}
                    {resource.type === 'water' && (
                        <Image 
                            source={petAssets.states.thirsty}
                            style={styles.resourceIcon}
                            resizeMode="contain"
                        />
                    )}
                    {resource.type === 'toy' && (
                        <Image 
                            source={petAssets.states.playful}
                            style={styles.resourceIcon}
                            resizeMode="contain"
                        />
                    )}
                </View>
                
                {/* Nombre del recurso */}
                <Text style={styles.resourceName}>{resource.name}</Text>
                
                {/* Descripción */}
                <Text style={styles.resourceDescription}>{resource.description}</Text>
                
                {/* Indicador de disponibilidad */}
                <View style={styles.availableIndicator}>
                    <Text style={styles.availableText}>
                        {isAvailable ? "Tocar" : "No disponible"}
                    </Text>
                </View>
            </Animated.View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    resourceBoxContainer: {
        width: '48%',
        marginBottom: 16,
    },
    resourceBox: {
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.1)',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowRadius: 8,
        elevation: 5,
    },
    resourceIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    resourceIcon: {
        width: assetSizes.resourceIcon.width,
        height: assetSizes.resourceIcon.height,
    },
    resourceName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 4,
        textAlign: 'center',
    },
    resourceDescription: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        lineHeight: 12,
        marginBottom: 8,
    },
    availableIndicator: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    availableText: {
        fontSize: 10,
        color: 'white',
        fontWeight: '600',
    }
});
