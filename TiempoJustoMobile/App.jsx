import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, StatusBar as RNStatusBar } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AppProvider, useAppContext } from './src/context/AppContext';
import TaskBoard from './src/components/TaskBoard';
import PomodoroTimer from './src/components/PomodoroTimer';
import ProjectBoard from './src/components/ProjectBoard';
import AnalyticsBoard from './src/components/AnalyticsBoard';
import SplashScreen from './src/components/SplashScreen';
import LoadingScreen from './src/components/LoadingScreen';
import backgroundService from './src/services/backgroundService';
import DateTimeDisplay from './src/components/DateTimeDisplay';
import MotivationalNotification from './src/components/MotivationalNotification';
import PomodoroNotification from './src/components/PomodoroNotification';
import { useMotivationalNotifications } from './src/hooks/useMotivationalNotifications';
import { useBackgroundNotifications } from './src/hooks/useBackgroundNotifications';
import { usePomodoroService } from './src/hooks/usePomodoroService';
import { useNavigationData, useNotificationData } from './src/hooks/useOptimizedComponents';
import TabButton from './src/components/optimized/TabButton';

function AppInner() {
    const { 
        showSplash, 
        setShowSplash, 
        activeTab, 
        pomodoroSettings,
        lastActivityAt,
        isLoading,
        storageError
    } = useAppContext();

    // Estado local para notificaciones motivacionales
    const [showNotification, setShowNotification] = useState(false);
    const [notificationType, setNotificationType] = useState(null);

    const { tabData, handleTabPress } = useNavigationData();
    const { 
        pomodoroNotification,
        handleClosePomodoroNotification 
    } = useNotificationData();

    // Función para cerrar notificaciones motivacionales
    const closeNotification = useCallback(() => {
        setShowNotification(false);
        setNotificationType(null);
    }, []);

    // Función para mostrar notificaciones motivacionales
    const handleShowNotification = useCallback((type) => {
        setNotificationType(type);
        setShowNotification(true);
        
        // Auto-ocultar después de 7 segundos
        setTimeout(() => {
            setShowNotification(false);
            setNotificationType(null);
        }, 7000);
    }, []);

    // Memoizar las opciones para evitar recreaciones
    const motivationalOptions = useMemo(() => ({
        minIntervalMs: 2 * 60 * 60 * 1000,
        idleThresholdMs: 4 * 60 * 60 * 1000,
        autoHideMs: 6000
    }), []);

    // Configurar notificaciones motivacionales
    const { showManualNotification } = useMotivationalNotifications(
        lastActivityAt,
        motivationalOptions,
        handleShowNotification
    );

    // Configurar notificaciones en segundo plano
    useBackgroundNotifications(lastActivityAt);

    // Configurar servicio de Pomodoro
    const pomodoroState = usePomodoroService(pomodoroSettings);

    // Configurar servicio de segundo plano
    useEffect(() => {
        // Inicializar servicio de segundo plano
        backgroundService.updateActivityTime();
        
        // Verificar si la app estuvo inactiva
        const checkInactivity = async () => {
            const inactivity = await backgroundService.checkInactivityPeriod();
            if (inactivity.isInactive) {
                console.log('App estuvo inactiva por', Math.round(inactivity.inactiveTime / (1000 * 60 * 60)), 'horas');
            }
        };
        
        checkInactivity();
        
        // Cleanup al desmontar
        return () => {
            backgroundService.cleanup();
        };
    }, []);

    const handleSplashComplete = () => {
        setShowSplash(false);
        backgroundService.updateActivityTime();
    };

    const insets = useSafeAreaInsets();
    
    // Mostrar pantalla de carga si los datos están cargando
    if (isLoading) {
        return <LoadingScreen message="Cargando datos..." />;
    }
    
    // Mostrar pantalla de inicio si showSplash es true
    if (showSplash) {
        return <SplashScreen onComplete={handleSplashComplete} />;
    }
    
    return (
        <View style={[styles.container, { paddingTop: Math.max(insets.top, RNStatusBar.currentHeight || 12) }]}>
            <StatusBar style="auto" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>TiempoJusto</Text>
                <Text style={styles.headerSubtitle}>Gestión de Productividad Personal</Text>
                <DateTimeDisplay />
            </View>

            <View style={styles.content}>
                {activeTab === 'tareas' && <TaskBoard />}
                {activeTab === 'pomodoro' && <PomodoroTimer />}
                {activeTab === 'proyectos' && <ProjectBoard />}
                {activeTab === 'analiticas' && <AnalyticsBoard />}
            </View>

            <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom + 5, 17) }]}>
                {tabData.map(tab => (
                    <TabButton
                        key={tab.id}
                        label={tab.label}
                        legend={tab.legend}
                        isActive={tab.isActive}
                        onPress={() => handleTabPress(tab.id)}
                        isRunning={tab.isRunning}
                    />
                ))}
            </View>

            <MotivationalNotification
                visible={showNotification}
                onClose={closeNotification}
                type={notificationType}
            />
            <PomodoroNotification
                visible={pomodoroNotification.visible}
                mode={pomodoroNotification.mode}
                onClose={handleClosePomodoroNotification}
            />
        </View>
    );
}

export default function App() {
    return (
        <SafeAreaProvider>
            <AppProvider>
                <AppInner />
            </AppProvider>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
        paddingTop: RNStatusBar.currentHeight || 12,
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgba(255,255,255,0.08)',
        alignItems: 'center',
    },
    headerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 2,
        textAlign: 'center',
    },
    headerSubtitle: {
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 6,
        fontSize: 12,
        textAlign: 'center',
    },
    content: {
        flex: 1,
        padding: 12,
    },
    tabBar: {
        flexDirection: 'row',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: 'rgba(255,255,255,0.08)',
        backgroundColor: 'rgba(15,23,42,0.98)',
        paddingHorizontal: 4,
    },
});