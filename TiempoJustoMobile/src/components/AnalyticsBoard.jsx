import React, { useMemo, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated } from 'react-native';

export default function AnalyticsBoard({ tasks, projects, projectIdToProject, onCloseBoard }) {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    const [fadeAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, []);

    const analytics = useMemo(() => {
        if (!tasks || tasks.length === 0) {
            return {
                totalTasks: 0,
                completedTasks: 0,
                completionRate: 0,
                priorityBreakdown: { A: 0, B: 0, C: 0, D: 0 },
                projectBreakdown: {},
                productivityScore: 0,
                timeSpent: 0,
            };
        }

        const todayTasks = tasks.filter(task => {
            const taskDate = task.createdAt ? new Date(task.createdAt).toISOString().split('T')[0] : todayString;
            return taskDate === todayString;
        });

        const completedTasks = todayTasks.filter(task => task.done);
        const completionRate = todayTasks.length > 0 ? (completedTasks.length / todayTasks.length) * 100 : 0;

        const priorityBreakdown = { A: 0, B: 0, C: 0, D: 0 };
        todayTasks.forEach(task => {
            const priority = task.priority || 'C';
            priorityBreakdown[priority]++;
        });

        const projectBreakdown = {};
        todayTasks.forEach(task => {
            if (task.projectId) {
                const projectName = projectIdToProject?.[task.projectId]?.name || 'Sin proyecto';
                if (!projectBreakdown[projectName]) {
                    projectBreakdown[projectName] = { total: 0, completed: 0 };
                }
                projectBreakdown[projectName].total++;
                if (task.done) {
                    projectBreakdown[projectName].completed++;
                }
            }
        });

        // Calcular score de productividad basado en prioridades completadas
        let productivityScore = 0;
        completedTasks.forEach(task => {
            const priority = task.priority || 'C';
            switch (priority) {
                case 'A': productivityScore += 10; break;
                case 'B': productivityScore += 7; break;
                case 'C': productivityScore += 4; break;
                case 'D': productivityScore += 1; break;
            }
        });

        return {
            totalTasks: todayTasks.length,
            completedTasks: completedTasks.length,
            completionRate: Math.round(completionRate),
            priorityBreakdown,
            projectBreakdown,
            productivityScore,
            timeSpent: completedTasks.length * 25, // Estimación: 25 min por tarea
        };
    }, [tasks, projects, projectIdToProject, todayString]);

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>Análisis del Día</Text>
                    <Text style={styles.date}>{today.toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}</Text>
                </View>

                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{analytics.totalTasks}</Text>
                        <Text style={styles.statLabel}>Total Tareas</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{analytics.completedTasks}</Text>
                        <Text style={styles.statLabel}>Completadas</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{analytics.completionRate}%</Text>
                        <Text style={styles.statLabel}>Tasa de Éxito</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{analytics.productivityScore}</Text>
                        <Text style={styles.statLabel}>Score Productividad</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Desglose por Prioridad</Text>
                    <View style={styles.priorityGrid}>
                        {Object.entries(analytics.priorityBreakdown).map(([priority, count]) => (
                            <View key={priority} style={styles.priorityCard}>
                                <Text style={[styles.priorityLetter, styles[`priority${priority}`]]}>
                                    {priority}
                                </Text>
                                <Text style={styles.priorityCount}>{count}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {Object.keys(analytics.projectBreakdown).length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Proyectos</Text>
                        {Object.entries(analytics.projectBreakdown).map(([projectName, data]) => (
                            <View key={projectName} style={styles.projectCard}>
                                <Text style={styles.projectName}>{projectName}</Text>
                                <Text style={styles.projectStats}>
                                    {data.completed}/{data.total} completadas
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                <Pressable onPress={onCloseBoard} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Cerrar Tablero</Text>
                </Pressable>
            </ScrollView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
        width: '100%',
    },
    scrollContent: {
        padding: 12,
        alignItems: 'center',
    },
    header: {
        width: '100%',
        marginBottom: 16,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: 'white',
        marginBottom: 6,
        textAlign: 'center',
    },
    date: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
        width: '100%',
        justifyContent: 'center',
    },
    statCard: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '700',
        color: 'white',
        marginBottom: 6,
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        fontWeight: '500',
    },
    section: {
        marginBottom: 16,
        width: '100%',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
        marginBottom: 12,
        textAlign: 'center',
    },
    priorityGrid: {
        flexDirection: 'row',
        gap: 8,
        width: '100%',
        justifyContent: 'center',
    },
    priorityCard: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    priorityLetter: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 6,
    },
    priorityA: { color: '#ef4444' },
    priorityB: { color: '#f97316' },
    priorityC: { color: '#eab308' },
    priorityD: { color: '#6b7280' },
    priorityCount: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
    projectCard: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
        width: '100%',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    projectName: {
        fontSize: 14,
        fontWeight: '600',
        color: 'white',
        marginBottom: 2,
    },
    projectStats: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
    },
    closeButton: {
        backgroundColor: '#ef4444',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: 'rgba(239,68,68,0.3)',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '700',
    },
});
