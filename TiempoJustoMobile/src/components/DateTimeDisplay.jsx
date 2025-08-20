import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DateTimeDisplay() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.date}>
                {currentTime.toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                })}
            </Text>
            <Text style={styles.time}>
                {currentTime.toLocaleTimeString('es-ES', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit'
                })}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: 8,
    },
    date: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 2,
    },
    time: {
        fontSize: 16,
        fontWeight: '600',
        color: '#22c55e',
    },
});
