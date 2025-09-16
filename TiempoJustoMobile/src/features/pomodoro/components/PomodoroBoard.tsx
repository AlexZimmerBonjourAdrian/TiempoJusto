// ============================================================================
// COMPONENTE DE TABLERO DE POMODORO - TIEMPOJUSTO
// ============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, Vibration, Animated } from 'react-native';
import { usePomodoro } from '../hooks/usePomodoro';
import { COLORS, SPACING, FONT_SIZES, POMODORO_DEFAULTS } from '../../../shared/constants';
import { formatTime } from '../../../shared/utils';

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const PomodoroBoard: React.FC = () => {
  const {
    currentSession,
    config,
    statistics,
    loading,
    error,
    startSession,
    pauseSession,
    resumeSession,
    stopSession,
    resetSession,
    resetToMode,
    updateConfig
  } = usePomodoro();

  const [currentMode, setCurrentMode] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [isLongPressing, setIsLongPressing] = useState(false);
  const scaleAnim = useState(new Animated.Value(1))[0];

  // ============================================================================
  // FUNCIONES
  // ============================================================================

  const handleTimerPress = useCallback(async () => {
    try {
      if (currentSession?.isActive && !currentSession.isPaused) {
        await pauseSession();
      } else if (currentSession?.isPaused) {
        await resumeSession();
      } else {
        await startSession(currentMode);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo controlar la sesión');
    }
  }, [currentSession, startSession, pauseSession, resumeSession, currentMode]);

  const handleModeChange = useCallback(() => {
    const modes: Array<'work' | 'shortBreak' | 'longBreak'> = ['work', 'shortBreak', 'longBreak'];
    const currentIndex = modes.indexOf(currentMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setCurrentMode(modes[nextIndex]);
  }, [currentMode]);

  const handleLongPress = useCallback(async () => {
    try {
      setIsLongPressing(true);
      
      // Animación de escala hacia abajo
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 200,
        useNativeDriver: true,
      }).start();

      // Vibración para feedback
      Vibration.vibrate(100);

      // Reiniciar al modo actual con tiempo configurado
      await resetToMode(currentMode);
      
      // Pequeña pausa antes de restaurar la animación
      setTimeout(() => {
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          setIsLongPressing(false);
        });
      }, 300);

    } catch (error) {
      setIsLongPressing(false);
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      Alert.alert('Error', 'No se pudo reiniciar el temporizador');
    }
  }, [currentMode, resetToMode, scaleAnim]);

  const getModeText = () => {
    switch (currentMode) {
      case 'work': return 'TRABAJO';
      case 'shortBreak': return 'DESCANSO CORTO';
      case 'longBreak': return 'DESCANSO LARGO';
      default: return 'TRABAJO';
    }
  };

  const getModeDuration = () => {
    switch (currentMode) {
      case 'work': return config.workDuration;
      case 'shortBreak': return config.shortBreakDuration;
      case 'longBreak': return config.longBreakDuration;
      default: return config.workDuration;
    }
  };

  const getModeColor = () => {
    switch (currentMode) {
      case 'work': return '#ef4444'; // red-500
      case 'shortBreak': return '#10b981'; // emerald-500
      case 'longBreak': return '#3b82f6'; // blue-500
      default: return '#ef4444';
    }
  };

  const getProgress = () => {
    if (!currentSession) return 0;
    const totalTime = currentSession.duration * 60;
    const elapsed = totalTime - currentSession.remainingTime;
    return Math.max(0, Math.min(100, (elapsed / totalTime) * 100));
  };

  const getDisplayTime = () => {
    if (currentSession) {
      return formatTime(currentSession.remainingTime);
    }
    return formatTime(getModeDuration() * 60);
  };

  // ============================================================================
  // RENDERIZADO
  // ============================================================================

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Cargando Pomodoro...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Timer Circular - Botón Principal */}
      <View style={styles.timerContainer}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity 
            style={[
              styles.timerCircle, 
              { 
                borderColor: getModeColor(),
                opacity: isLongPressing ? 0.8 : 1
              }
            ]}
            onPress={handleTimerPress}
            onLongPress={handleLongPress}
            delayLongPress={800}
            activeOpacity={0.8}
          >
          {/* Marcas del reloj */}
          <View style={styles.clockMarks}>
            {Array.from({ length: 60 }, (_, i) => (
              <View
                key={i}
                style={[
                  styles.clockMark,
                  {
                    transform: [{ rotate: `${i * 6}deg` }],
                    opacity: i % 5 === 0 ? 1 : 0.3
                  }
                ]}
              />
            ))}
          </View>
          
          {/* Tiempo */}
          <Text style={styles.timeText}>
            {getDisplayTime()}
          </Text>
          
          {/* Indicador de progreso circular */}
          <View style={styles.progressContainer}>
            <View 
              style={[
                styles.progressCircle,
                { 
                  borderColor: getModeColor(),
                  transform: [{ rotate: `${(getProgress() / 100) * 360}deg` }]
                }
              ]} 
            />
          </View>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Indicadores de página */}
      <View style={styles.pageIndicators}>
        {[0, 1, 2, 3, 4].map((index) => (
          <View
            key={index}
            style={[
              styles.pageIndicator,
              { opacity: index === 0 ? 1 : 0.3 }
            ]}
          />
        ))}
      </View>

      {/* Modo y duración */}
      <View style={styles.modeContainer}>
        <TouchableOpacity 
          style={styles.modeButton}
          onPress={handleModeChange}
          activeOpacity={0.7}
        >
          <Text style={styles.modeText}>
            {getModeText()} {getModeDuration()} MIN
          </Text>
          <View style={styles.chevronContainer}>
            <Text style={styles.chevron}>‹</Text>
            <Text style={styles.chevron}>›</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Estadísticas simplificadas */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{statistics.completedSessions}</Text>
          <Text style={styles.statLabel}>Sesiones</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {Math.floor(statistics.totalWorkTime / 60)}
          </Text>
          <Text style={styles.statLabel}>Min Trabajo</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {Math.floor(statistics.totalBreakTime / 60)}
          </Text>
          <Text style={styles.statLabel}>Min Descanso</Text>
        </View>
      </View>
    </View>
  );
};

// ============================================================================
// ESTILOS
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0f2fe', // light blue background similar to the image
    padding: SPACING.MD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: SPACING.XL,
  },
  timerCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    position: 'relative',
  },
  clockMarks: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  clockMark: {
    position: 'absolute',
    width: 2,
    height: 12,
    backgroundColor: '#ffffff',
    top: 8,
    left: '50%',
    marginLeft: -1,
    transformOrigin: '1px 132px',
  },
  timeText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#1f2937', // dark gray
    textAlign: 'center',
  },
  progressContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  progressCircle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 140,
    borderWidth: 3,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  pageIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.LG,
  },
  pageIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    marginHorizontal: 4,
  },
  modeContainer: {
    alignItems: 'center',
    marginBottom: SPACING.XL,
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.MD,
  },
  modeText: {
    fontSize: FONT_SIZES.LG,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginRight: SPACING.SM,
  },
  chevronContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevron: {
    fontSize: FONT_SIZES.XL,
    fontWeight: '700',
    color: '#ffffff',
    marginHorizontal: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: SPACING.MD,
    width: '100%',
    maxWidth: 300,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FONT_SIZES.XL,
    fontWeight: '700',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: FONT_SIZES.SM,
    color: '#ffffff',
    marginTop: 4,
    opacity: 0.8,
  },
  loadingText: {
    fontSize: FONT_SIZES.LG,
    color: '#1f2937',
    textAlign: 'center',
    marginTop: SPACING.XL,
  },
  errorText: {
    fontSize: FONT_SIZES.LG,
    color: '#ef4444',
    textAlign: 'center',
    marginTop: SPACING.XL,
  },
});
