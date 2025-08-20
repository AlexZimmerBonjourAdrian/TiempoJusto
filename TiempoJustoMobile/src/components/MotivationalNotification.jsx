import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';

export default function MotivationalNotification({ visible, onClose, type = 'general' }) {
    const [fadeAnim] = useState(new Animated.Value(0));
    const [slideAnim] = useState(new Animated.Value(-100));

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: -100,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible, fadeAnim, slideAnim]);

    const getNotificationContent = () => {
        const notifications = {
            productivity: [
                {
                    title: "Enfoque en lo Importante",
                    message: "La clave del éxito es hacer las cosas más importantes primero. - Brian Tracy",
                    author: "Brian Tracy"
                },
                {
                    title: "Toma Acción",
                    message: "La acción es la diferencia fundamental entre el éxito y el fracaso. - Jordan Peterson",
                    author: "Jordan Peterson"
                },
                {
                    title: "Valor del Tiempo",
                    message: "El tiempo es tu recurso más valioso. Inviértelo sabiamente. - Brian Tracy",
                    author: "Brian Tracy"
                }
            ],
            motivation: [
                {
                    title: "Responsabilidad",
                    message: "La responsabilidad es el precio de la grandeza. - Winston Churchill",
                    author: "Winston Churchill"
                },
                {
                    title: "Transformación",
                    message: "No eres lo que eres, eres lo que puedes llegar a ser. - Carl Jung",
                    author: "Carl Jung"
                },
                {
                    title: "Propósito",
                    message: "Encuentra tu propósito y persíguelo con pasión. - Jordan Peterson",
                    author: "Jordan Peterson"
                }
            ],
            discipline: [
                {
                    title: "Disciplina",
                    message: "La disciplina es el puente entre las metas y los logros. - Jim Rohn",
                    author: "Jim Rohn"
                },
                {
                    title: "Hábitos",
                    message: "Los hábitos son las pequeñas decisiones que tomas cada día. - Brian Tracy",
                    author: "Brian Tracy"
                },
                {
                    title: "Mente Consciente",
                    message: "La mente inconsciente es el tesoro de la sabiduría. - Carl Jung",
                    author: "Carl Jung"
                }
            ],
            general: [
                {
                    title: "Excelencia",
                    message: "La excelencia no es una habilidad, es una actitud. - Ralph Marston",
                    author: "Ralph Marston"
                },
                {
                    title: "Valor",
                    message: "Tu valor no está en lo que tienes, sino en lo que eres. - Jordan Peterson",
                    author: "Jordan Peterson"
                },
                {
                    title: "Metas",
                    message: "Establece metas claras y trabaja hacia ellas cada día. - Brian Tracy",
                    author: "Brian Tracy"
                }
            ]
        };

        const typeNotifications = notifications[type] || notifications.general;
        return typeNotifications[Math.floor(Math.random() * typeNotifications.length)];
    };

    const content = getNotificationContent();

    if (!visible) return null;

    return (
        <Animated.View 
            pointerEvents="none"
            style={[
                styles.container,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                }
            ]}
        >
            <View style={styles.notification}>
                <Text style={styles.title}>{content.title}</Text>
                <Text style={styles.message}>{content.message}</Text>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 12,
        left: 12,
        right: 12,
        zIndex: 1000,
    },
    notification: {
        backgroundColor: 'rgba(15,23,42,0.95)',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    title: {
        fontSize: 14,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.9)',
        marginBottom: 4,
    },
    message: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.8)',
        lineHeight: 18,
    },
});
