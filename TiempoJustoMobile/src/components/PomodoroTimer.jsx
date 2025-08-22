import React, { useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
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

    // Función para cambiar modo
    const handleSwitchMode = (nextMode) => {
        switchMode(nextMode);
    };

    const handleSettingsChange = (updates) => {
        updatePomodoroSettings({ ...pomodoroSettings, ...updates });
    };

    return (
        <View style={styles.container}>
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

            <Text style={styles.timerText}>{secondsToMMSS(secondsLeft)}</Text>

            <View style={styles.controlsRow}>
                <Pressable onPress={toggle} style={[styles.controlBtn, isRunning ? styles.pause : styles.start]}>
                    <Text style={styles.controlBtnText}>{isRunning ? 'Pausar' : 'Iniciar'}</Text>
                </Pressable>
                <Pressable onPress={reset} style={[styles.controlBtn, styles.reset]}>
                    <Text style={styles.controlBtnText}>Reiniciar</Text>
                </Pressable>
            </View>

            <View style={styles.config}>
                <Text style={styles.configTitle}>Ajustes (minutos)</Text>
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    modeRow: {
        flexDirection: 'row',
        marginBottom: 30,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        padding: 4,
    },
    modeBtn: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        minWidth: 100,
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
    timerText: {
        fontSize: 72,
        fontWeight: '300',
        color: 'white',
        marginBottom: 30,
        fontVariant: ['tabular-nums'],
    },
    controlsRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 40,
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
        width: '100%',
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