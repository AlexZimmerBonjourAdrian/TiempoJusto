import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, StatusBar as RNStatusBar, Pressable } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAsyncStorageState } from './src/storage';
import TaskBoard from './src/components/TaskBoard';
import PomodoroTimer from './src/components/PomodoroTimer';
import ProjectBoard from './src/components/ProjectBoard';

function AppInner() {
    const [activeTab, setActiveTab] = useState('tareas');

    const [tasks, setTasks] = useAsyncStorageState('TJ_TASKS', []);
    const [projects, setProjects] = useAsyncStorageState('TJ_PROJECTS', []);
    const [pomodoroSettings, setPomodoroSettings] = useAsyncStorageState(
        'TJ_POMODORO_SETTINGS', { focusMinutes: 25, shortBreakMinutes: 5, longBreakMinutes: 15 }
    );

    const projectIdToProject = useMemo(() => {
        const mapping = {};
        for (const project of projects || []) {
            mapping[project.id] = project;
        }
        return mapping;
    }, [projects]);

    const insets = useSafeAreaInsets();
    return (
        <View style={[styles.container, { paddingTop: Math.max(insets.top, RNStatusBar.currentHeight || 12) }]}>
            <StatusBar style="auto" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>TiempoJusto</Text>
                <Text style={styles.headerSubtitle}>Modo local • Android • Expo</Text>
            </View>

            <View style={styles.content}>
                {activeTab === 'tareas' && (
                    <TaskBoard
                        tasks={tasks}
                        setTasks={setTasks}
                        projects={projects}
                        projectIdToProject={projectIdToProject}
                    />
                )}
                {activeTab === 'pomodoro' && (
                    <PomodoroTimer
                        settings={pomodoroSettings}
                        onChangeSettings={setPomodoroSettings}
                    />
                )}
                {activeTab === 'proyectos' && (
                    <ProjectBoard
                        projects={projects}
                        setProjects={setProjects}
                        tasks={tasks}
                    />
                )}
            </View>

            <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom + 5, 17) }]}>
                <TabButton label="Tareas" isActive={activeTab === 'tareas'} onPress={() => setActiveTab('tareas')} />
                <TabButton label="Pomodoro" isActive={activeTab === 'pomodoro'} onPress={() => setActiveTab('pomodoro')} />
                <TabButton label="Proyectos" isActive={activeTab === 'proyectos'} onPress={() => setActiveTab('proyectos')} />
            </View>
        </View>
    );
}

export default function App() {
    return (
        <SafeAreaProvider>
            <AppInner />
        </SafeAreaProvider>
    );
}

function TabButton({ label, isActive, onPress }) {
    return (
        <Pressable onPress={onPress} style={[styles.tabButton, isActive && styles.tabButtonActive]}>
            <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>{label}</Text>
        </Pressable>
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
    },
    headerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: '700',
    },
    headerSubtitle: {
        color: 'rgba(255,255,255,0.7)',
        marginTop: 2,
        fontSize: 12,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    tabBar: {
        flexDirection: 'row',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: 'rgba(255,255,255,0.08)',
        backgroundColor: 'rgba(15,23,42,0.98)'
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    tabButtonActive: {
        backgroundColor: 'rgba(255,255,255,0.06)',
    },
    tabButtonText: {
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '600',
    },
    tabButtonTextActive: {
        color: 'white',
    },
});