import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, Animated } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { usePomodoroService } from '../hooks/usePomodoroService';

function secondsToMMSS(totalSeconds) {
    const m = Math.floor(totalSeconds / 60)
        .toString()
        .padStart(2, '0');
    const s = Math.floor(totalSeconds % 60)
        .toString()
        .padStart(2, '0');
    return `${m}:${s}`;
}

export default function PomodoroTimer() {
    const { pomodoroSettings, updatePomodoroSettings } = useAppContext();
    
    const {
        isRunning,
        mode,
        secondsLeft,
        totalSeconds,
        start,
        pause,
        resume,
        reset,
        switchMode,
        toggle
    } = usePomodoroService(pomodoroSettings);

    // Animación de entrada simple (consistente con otras pestañas)
    const [fadeAnim] = useState(new Animated.Value(0));

    // Efecto de entrada
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, []);

    // Función para cambiar modo
    const handleSwitchMode = (nextMode) => {
        switchMode(nextMode);
    };

    const handleSettingsChange = (updates) => {
        updatePomodoroSettings({ ...pomodoroSettings, ...updates });
    };

    // Calcular progreso para la barra de progreso
    const progress = useMemo(() => {
        if (totalSeconds === 0) return 0;
        return (totalSeconds - secondsLeft) / totalSeconds;
    }, [secondsLeft, totalSeconds]);

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <View style={styles.header}>
                <Text style={styles.title}>Pomodoro Timer</Text>
                <Text style={styles.subtitle}>Gestiona tu tiempo de trabajo</Text>
            </View>

            <View style={styles.modeRow}>
                <Pressable
                    onPress={() => handleSwitchMode('focus')}
                    style={[styles.modeBtn, mode === 'focus' && styles.modeBtnActive]}
                >
                    <Text style={[styles.modeBtnText, mode === 'focus' && styles.modeBtnTextActive]}>Enfoque</Text>
                </Pressable>
                <Pressable
                    onPress={() => handleSwitchMode('break')}
                    style={[styles.modeBtn, mode === 'break' && styles.modeBtnActive]}
                >
                    <Text style={[styles.modeBtnText, mode === 'break' && styles.modeBtnTextActive]}>Descanso</Text>
                </Pressable>
            </View>

            <View style={styles.timerContainer}>
                <Text style={styles.timerText}>
                    {secondsToMMSS(secondsLeft)}
                </Text>
                
                {/* Barra de progreso */}
                <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                        <View 
                            style={[
                                styles.progressFill, 
                                { 
                                    width: `${progress * 100}%`,
                                    backgroundColor: mode === 'focus' ? '#10b981' : '#3b82f6'
                                }
                            ]} 
                        />
                    </View>
                </View>
            </View>

            <View style={styles.controlsRow}>
                <Pressable 
                    onPress={toggle} 
                    style={[styles.controlBtn, isRunning ? styles.pause : styles.start]}
                >
                    <Text style={styles.controlBtnText}>
                        {isRunning ? 'Pausar' : 'Iniciar'}
                    </Text>
                </Pressable>
                <Pressable 
                    onPress={reset} 
                    style={[styles.controlBtn, styles.reset]}
                >
                    <Text style={styles.controlBtnText}>Reiniciar</Text>
                </Pressable>
            </View>

            <View style={styles.config}>
                <Text style={styles.configTitle}>Configuración (minutos)</Text>
                <View style={styles.configRow}>
                    <Text style={styles.configLabel}>Enfoque</Text>
                    <TextInput
                        keyboardType="numeric"
                        value={String(pomodoroSettings.focusMinutes)}
                        onChangeText={(v) =>
                            handleSettingsChange({ focusMinutes: Math.max(1, Number(v || 0)) })
                        }
                        style={styles.configInput}
                    />
                </View>
                <View style={styles.configRow}>
                    <Text style={styles.configLabel}>Descanso corto</Text>
                    <TextInput
                        keyboardType="numeric"
                        value={String(pomodoroSettings.shortBreakMinutes)}
                        onChangeText={(v) =>
                            handleSettingsChange({ shortBreakMinutes: Math.max(1, Number(v || 0)) })
                        }
                        style={styles.configInput}
                    />
                </View>
                <View style={styles.configRow}>
                    <Text style={styles.configLabel}>Descanso largo</Text>
                    <TextInput
                        keyboardType="numeric"
                        value={String(pomodoroSettings.longBreakMinutes)}
                        onChangeText={(v) =>
                            handleSettingsChange({ longBreakMinutes: Math.max(1, Number(v || 0)) })
                        }
                        style={styles.configInput}
                    />
                </View>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        color: 'white',
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 4,
    },
    subtitle: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
    },
    modeRow: {
        flexDirection: 'row',
        marginBottom: 32,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        padding: 4,
    },
    modeBtn: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    modeBtnActive: {
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    modeBtnText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 16,
        fontWeight: '600',
    },
    modeBtnTextActive: {
        color: 'white',
        fontWeight: '700',
    },
    timerContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    timerText: {
        fontSize: 72,
        fontWeight: '300',
        color: 'white',
        marginBottom: 16,
        fontVariant: ['tabular-nums'],
    },
    progressContainer: {
        width: '100%',
        paddingHorizontal: 20,
    },
    progressBar: {
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    controlsRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 32,
        justifyContent: 'center',
    },
    controlBtn: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        minWidth: 100,
        alignItems: 'center',
    },
    start: {
        backgroundColor: '#10b981',
    },
    pause: {
        backgroundColor: '#f59e0b',
    },
    reset: {
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    controlBtnText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    config: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 20,
    },
    configTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        textAlign: 'center',
    },
    configRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    configLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        flex: 1,
    },
    configInput: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        minWidth: 60,
    },
});