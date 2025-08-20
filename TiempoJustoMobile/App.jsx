import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, StatusBar as RNStatusBar, Pressable } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAsyncStorageState } from './src/storage';
import TaskBoard from './src/components/TaskBoard';
import PomodoroTimer from './src/components/PomodoroTimer';
import ProjectBoard from './src/components/ProjectBoard';
import AnalyticsBoard from './src/components/AnalyticsBoard';
import ProductiPet from './src/components/ProductiPet';
import DateTimeDisplay from './src/components/DateTimeDisplay';
import MotivationalNotification from './src/components/MotivationalNotification';
import { useMotivationalNotifications } from './src/hooks/useMotivationalNotifications';

function AppInner() {
    const [activeTab, setActiveTab] = useState('tareas');

    const [tasks, setTasks] = useAsyncStorageState('TJ_TASKS', []);
    const [projects, setProjects] = useAsyncStorageState('TJ_PROJECTS', []);
    const [dailyLogs, setDailyLogs] = useAsyncStorageState('TJ_DAILY_LOGS', []);
    const [milestones, setMilestones] = useAsyncStorageState('TJ_MILESTONES', []);
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

    const [lastActivityAt, setLastActivityAt] = useState(Date.now());
    const { showNotification, notificationType, closeNotification, showManualNotification } = useMotivationalNotifications(
        tasks,
        lastActivityAt,
        { minIntervalMs: 2 * 60 * 60 * 1000, idleThresholdMs: 4 * 60 * 60 * 1000, autoHideMs: 6000 }
    );

    function archiveTodayAndClean() {
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];
        const priorityOrder = { A: 0, B: 1, C: 2, D: 3 };

        const todayTasks = (tasks || []).filter((t) => {
            const dateStr = t.createdAt ? new Date(t.createdAt).toISOString().split('T')[0] : todayString;
            return dateStr === todayString;
        });

        const completed = todayTasks.filter((t) => t.done);
        const completionRate = todayTasks.length ? Math.round((completed.length / todayTasks.length) * 100) : 0;

        const priorityBreakdown = { A: 0, B: 0, C: 0, D: 0 };
        for (const t of todayTasks) {
            const p = t.priority || 'C';
            priorityBreakdown[p]++;
        }

        const projectBreakdown = {};
        for (const t of todayTasks) {
            const projectName = t.projectId ? (projects?.find(p=>p.id===t.projectId)?.name || 'Sin proyecto') : 'Sin proyecto';
            if (!projectBreakdown[projectName]) projectBreakdown[projectName] = { total: 0, completed: 0 };
            projectBreakdown[projectName].total++;
            if (t.done) projectBreakdown[projectName].completed++;
        }

        let productivityScore = 0;
        for (const t of completed) {
            const p = t.priority || 'C';
            productivityScore += p === 'A' ? 10 : p === 'B' ? 7 : p === 'C' ? 4 : 1;
        }

        const logEntry = {
            date: todayString,
            totalTasks: todayTasks.length,
            completedTasks: completed.length,
            completionRate,
            productivityScore,
            priorityBreakdown,
            projectBreakdown,
        };

        setDailyLogs((prev) => {
            const arr = Array.isArray(prev) ? [...prev] : [];
            const idx = arr.findIndex((e) => e.date === todayString);
            if (idx >= 0) arr[idx] = logEntry; else arr.push(logEntry);
            return arr;
        });

        // Eliminar tareas sin proyecto
        setTasks((prev) => (prev || []).filter((t) => t.projectId));

        // Mostrar analíticas
        setActiveTab('analiticas');
    }

    function completeProjectAndRegisterMilestone(projectId) {
        const project = (projects || []).find((p) => p.id === projectId);
        if (!project) return;
        const completedAt = new Date().toISOString();
        setProjects((prev) => (prev || []).map((p) => (p.id === projectId ? { ...p, completedAt, status: 'completed' } : p)));
        setMilestones((prev) => ([...(prev || []), { id: `${projectId}-${completedAt}`, projectId, name: project.name, completedAt }]));
    }

    const insets = useSafeAreaInsets();
    return (
        <View style={[styles.container, { paddingTop: Math.max(insets.top, RNStatusBar.currentHeight || 12) }]}>
            <StatusBar style="auto" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>TiempoJusto</Text>
                <Text style={styles.headerSubtitle}>Gestión de Productividad Personal</Text>
                <DateTimeDisplay />
            </View>

            <View style={styles.content}>
                {activeTab === 'tareas' && (
                    <TaskBoard
                        tasks={tasks}
                        setTasks={setTasks}
                        projects={projects}
                        projectIdToProject={projectIdToProject}
                        onShowAnalytics={archiveTodayAndClean}
                        onShowNotification={showManualNotification}
                        onActivity={() => setLastActivityAt(Date.now())}
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
                        setTasks={setTasks}
                        onCompleteProject={completeProjectAndRegisterMilestone}
                        onActivity={() => setLastActivityAt(Date.now())}
                    />
                )}
                {activeTab === 'analiticas' && (
                    <AnalyticsBoard
                        tasks={tasks}
                        projects={projects}
                        projectIdToProject={projectIdToProject}
                        onCloseBoard={() => setActiveTab('tareas')}
                    />
                )}
                {activeTab === 'tamagotchi' && (
                    <ProductiPet
                        tasks={tasks}
                        projects={projects}
                        onActivity={() => setLastActivityAt(Date.now())}
                    />
                )}
            </View>

            <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom + 5, 17) }]}>
                <TabButton 
                    label="Tareas" 
                    legend="Organizar tareas"
                    isActive={activeTab === 'tareas'} 
                    onPress={() => setActiveTab('tareas')} 
                />
                <TabButton 
                    label="Pomodoro" 
                    legend="Técnica de tiempo"
                    isActive={activeTab === 'pomodoro'} 
                    onPress={() => setActiveTab('pomodoro')} 
                />
                <TabButton 
                    label="Proyectos" 
                    legend="Gestión de proyectos"
                    isActive={activeTab === 'proyectos'} 
                    onPress={() => setActiveTab('proyectos')} 
                />
                <TabButton 
                    label="Analíticas" 
                    legend="Estadísticas diarias"
                    isActive={activeTab === 'analiticas'} 
                    onPress={() => setActiveTab('analiticas')} 
                />
                <TabButton 
                    label="Tamagotchi" 
                    legend="Mascota virtual"
                    isActive={activeTab === 'tamagotchi'} 
                    onPress={() => setActiveTab('tamagotchi')} 
                />
            </View>

            <MotivationalNotification
                visible={showNotification}
                onClose={closeNotification}
                type={notificationType}
            />
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

function TabButton({ label, legend, isActive, onPress }) {
    return (
        <Pressable onPress={onPress} style={[styles.tabButton, isActive && styles.tabButtonActive]}>
            <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>{label}</Text>
            <Text style={[styles.tabButtonLegend, isActive && styles.tabButtonLegendActive]}>{legend}</Text>
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
    tabButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 4,
        alignItems: 'center',
        borderRadius: 6,
        marginHorizontal: 2,
    },
    tabButtonActive: {
        backgroundColor: 'rgba(255,255,255,0.06)',
    },
    tabButtonText: {
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '600',
        fontSize: 11,
        marginBottom: 1,
    },
    tabButtonTextActive: {
        color: 'white',
        fontWeight: '700',
    },
    tabButtonLegend: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 8,
        textAlign: 'center',
        lineHeight: 10,
    },
    tabButtonLegendActive: {
        color: 'rgba(255,255,255,0.7)',
    },
});