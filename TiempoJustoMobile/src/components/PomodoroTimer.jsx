import React, { useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
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

export default function PomodoroTimer({ settings, onChangeSettings }) {
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
    } = usePomodoroService(settings);

    // Función para cambiar modo
    const handleSwitchMode = (nextMode) => {
        switchMode(nextMode);
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
                        value={String(settings.focusMinutes)}
                        onChangeText={(v) =>
                            onChangeSettings({ ...settings, focusMinutes: Math.max(1, Number(v || 0)) })
                        }
                        style={styles.configInput}
                    />
                </View>
                <View style={styles.configRow}>
                    <Text style={styles.configLabel}>Descanso corto</Text>
                    <TextInput
                        keyboardType="numeric"
                        value={String(settings.shortBreakMinutes)}
                        onChangeText={(v) =>
                            onChangeSettings({ ...settings, shortBreakMinutes: Math.max(1, Number(v || 0)) })
                        }
                        style={styles.configInput}
                    />
                </View>
                <View style={styles.configRow}>
                    <Text style={styles.configLabel}>Descanso largo</Text>
                    <TextInput
                        keyboardType="numeric"
                        value={String(settings.longBreakMinutes)}
                        onChangeText={(v) =>
                            onChangeSettings({ ...settings, longBreakMinutes: Math.max(1, Number(v || 0)) })
                        }
                        style={styles.configInput}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', paddingTop: 10 },
    modeRow: { flexDirection: 'row', gap: 8 },
    modeBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.08)' },
    modeBtnActive: { backgroundColor: 'rgba(59,130,246,0.25)' },
    modeBtnText: { color: 'rgba(255,255,255,0.8)' },
    modeBtnTextActive: { color: '#bfdbfe', fontWeight: '700' },
    timerText: { color: 'white', fontSize: 64, fontWeight: '800', marginVertical: 18 },
    controlsRow: { flexDirection: 'row', gap: 12 },
    controlBtn: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 10 },
    start: { backgroundColor: 'rgba(34,197,94,0.3)' },
    pause: { backgroundColor: 'rgba(234,179,8,0.3)' },
    reset: { backgroundColor: 'rgba(239,68,68,0.3)' },
    controlBtnText: { color: 'white', fontWeight: '700' },
    config: { alignSelf: 'stretch', marginTop: 20, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: 12 },
    configTitle: { color: 'white', fontWeight: '700', marginBottom: 8 },
    configRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
    configLabel: { color: 'rgba(255,255,255,0.8)' },
    configInput: {
        width: 72,
        backgroundColor: 'rgba(255,255,255,0.08)',
        color: 'white',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 8,
        textAlign: 'center',
    },
});