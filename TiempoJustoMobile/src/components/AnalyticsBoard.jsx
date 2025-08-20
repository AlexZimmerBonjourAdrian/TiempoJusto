import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';

export default function AnalyticsBoard({ tasks, projects, projectIdToProject, onCloseBoard }) {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

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

    // Panel minimalista: sin mensajes ni citas, solo métricas funcionales

    return (
        <ScrollView style={styles.container}>
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
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: 'white',
        marginBottom: 4,
    },
    date: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 28,
        fontWeight: '700',
        color: 'white',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
        marginBottom: 12,
    },
    priorityGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    priorityCard: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    priorityLetter: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 8,
    },
    priorityA: { color: '#ef4444' },
    priorityB: { color: '#f97316' },
    priorityC: { color: '#eab308' },
    priorityD: { color: '#6b7280' },
    priorityCount: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
    },
    projectCard: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
    },
    projectName: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
        marginBottom: 4,
    },
    projectStats: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
    },
    // Eliminados estilos de mensajes/citas para un panel más minimalista
    closeButton: {
        backgroundColor: '#ef4444',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
});
