import React, { useMemo, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { useTaskStats } from '../hooks/useOptimizedComponents';

// Componente de gráfica de barras simple
const MonthlyProgressChart = ({ data }) => {
    const maxValue = Math.max(...data.map(item => item.completionRate), 1);
    
    return (
        <View style={styles.chartContainer}>
            <View style={styles.chartBars}>
                {data.map((item, index) => (
                    <View key={index} style={styles.barContainer}>
                        <View style={styles.barWrapper}>
                            <View 
                                style={[
                                    styles.bar, 
                                    { 
                                        height: `${(item.completionRate / maxValue) * 100}%`,
                                        backgroundColor: item.completionRate >= 80 ? '#10b981' : 
                                                       item.completionRate >= 60 ? '#f59e0b' : 
                                                       item.completionRate >= 40 ? '#f97316' : '#ef4444'
                                    }
                                ]} 
                            />
                        </View>
                        <Text style={styles.barLabel}>{item.day}</Text>
                        <Text style={styles.barValue}>{item.completionRate}%</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

export default function AnalyticsBoard() {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    const [fadeAnim] = useState(new Animated.Value(0));

    const { tasks, projects, projectIdToProject, setActiveTab, dailyLogs } = useAppContext();
    
    const todayTasks = useMemo(() => {
        return tasks.filter(task => {
            const taskDate = task.createdAt ? new Date(task.createdAt).toISOString().split('T')[0] : todayString;
            return taskDate === todayString;
        });
    }, [tasks, todayString]);

    const taskStats = useTaskStats(todayTasks);

    // Datos para la gráfica mensual
    const monthlyData = useMemo(() => {
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        // Obtener logs del mes actual
        const monthLogs = dailyLogs.filter(log => {
            const logDate = new Date(log.date);
            return logDate.getMonth() === currentMonth && logDate.getFullYear() === currentYear;
        });

        // Crear array con todos los días del mes
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const monthProgress = [];

        for (let day = 1; day <= daysInMonth; day++) {
            const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const logEntry = monthLogs.find(log => log.date === dateString);
            
            monthProgress.push({
                day: day,
                date: dateString,
                completionRate: logEntry ? logEntry.completionRate : 0,
                totalTasks: logEntry ? logEntry.totalTasks : 0,
                completedTasks: logEntry ? logEntry.completedTasks : 0,
                productivityScore: logEntry ? logEntry.productivityScore : 0
            });
        }

        return monthProgress;
    }, [dailyLogs, today]);

    // Estadísticas del mes
    const monthlyStats = useMemo(() => {
        const completedDays = monthlyData.filter(day => day.completionRate > 0);
        const totalDays = monthlyData.length;
        const activeDays = completedDays.length;
        
        const avgCompletionRate = completedDays.length > 0 
            ? Math.round(completedDays.reduce((sum, day) => sum + day.completionRate, 0) / completedDays.length)
            : 0;
        
        const totalTasks = monthlyData.reduce((sum, day) => sum + day.totalTasks, 0);
        const totalCompleted = monthlyData.reduce((sum, day) => sum + day.completedTasks, 0);
        const totalProductivityScore = monthlyData.reduce((sum, day) => sum + day.productivityScore, 0);

        return {
            totalDays,
            activeDays,
            avgCompletionRate,
            totalTasks,
            totalCompleted,
            totalProductivityScore,
            consistencyRate: totalDays > 0 ? Math.round((activeDays / totalDays) * 100) : 0
        };
    }, [monthlyData]);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, []);

    const analytics = useMemo(() => {
        if (!todayTasks || todayTasks.length === 0) {
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
    }, [todayTasks, projectIdToProject]);

    const handleCloseBoard = () => {
        setActiveTab('tareas');
    };

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
                        <Text style={styles.statLabel}>Puntuación</Text>
                    </View>
                </View>

                {/* Nueva sección de progreso mensual */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Progreso Mensual</Text>
                    <Text style={styles.sectionSubtitle}>
                        {today.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                    </Text>
                    
                    <View style={styles.monthlyStatsGrid}>
                        <View style={styles.monthlyStatCard}>
                            <Text style={styles.monthlyStatNumber}>{monthlyStats.activeDays}</Text>
                            <Text style={styles.monthlyStatLabel}>Días Activos</Text>
                        </View>
                        <View style={styles.monthlyStatCard}>
                            <Text style={styles.monthlyStatNumber}>{monthlyStats.avgCompletionRate}%</Text>
                            <Text style={styles.monthlyStatLabel}>Promedio</Text>
                        </View>
                        <View style={styles.monthlyStatCard}>
                            <Text style={styles.monthlyStatNumber}>{monthlyStats.consistencyRate}%</Text>
                            <Text style={styles.monthlyStatLabel}>Consistencia</Text>
                        </View>
                        <View style={styles.monthlyStatCard}>
                            <Text style={styles.monthlyStatNumber}>{monthlyStats.totalProductivityScore}</Text>
                            <Text style={styles.monthlyStatLabel}>Score Total</Text>
                        </View>
                    </View>

                    <MonthlyProgressChart data={monthlyData} />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Distribución por Prioridad</Text>
                    <View style={styles.priorityGrid}>
                        {Object.entries(analytics.priorityBreakdown).map(([priority, count]) => (
                            <View key={priority} style={styles.priorityItem}>
                                <Text style={[styles.priorityLabel, styles[`priority${priority}`]]}>
                                    {priority}
                                </Text>
                                <Text style={styles.priorityCount}>{count}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {Object.keys(analytics.projectBreakdown).length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Rendimiento por Proyecto</Text>
                        {Object.entries(analytics.projectBreakdown).map(([projectName, stats]) => (
                            <View key={projectName} style={styles.projectItem}>
                                <Text style={styles.projectName}>{projectName}</Text>
                                <Text style={styles.projectStats}>
                                    {stats.completed}/{stats.total} completadas
                                </Text>
                                <View style={styles.progressBar}>
                                    <View 
                                        style={[
                                            styles.progressFill, 
                                            { width: `${(stats.completed / stats.total) * 100}%` }
                                        ]} 
                                    />
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Resumen de Tiempo</Text>
                    <View style={styles.timeCard}>
                        <Text style={styles.timeEstimate}>
                            Tiempo estimado: {Math.round(analytics.timeSpent / 60)} horas
                        </Text>
                        <Text style={styles.timeNote}>
                            Basado en 25 minutos por tarea completada
                        </Text>
                    </View>
                </View>

                <Pressable style={styles.closeButton} onPress={handleCloseBoard}>
                    <Text style={styles.closeButtonText}>Cerrar Análisis</Text>
                </Pressable>
            </ScrollView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
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
        marginBottom: 8,
    },
    date: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        textAlign: 'center',
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
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    statNumber: {
        color: 'white',
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 4,
    },
    statLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        textAlign: 'center',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    sectionSubtitle: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
        marginBottom: 16,
    },
    monthlyStatsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    monthlyStatCard: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
    },
    monthlyStatNumber: {
        color: 'white',
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 2,
    },
    monthlyStatLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 10,
        textAlign: 'center',
    },
    chartContainer: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 16,
        marginTop: 8,
    },
    chartBars: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 120,
        paddingBottom: 20,
    },
    barContainer: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 1,
    },
    barWrapper: {
        height: 80,
        width: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    bar: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        borderRadius: 4,
    },
    barLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 10,
        marginBottom: 2,
    },
    barValue: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 8,
        fontWeight: '600',
    },
    priorityGrid: {
        flexDirection: 'row',
        gap: 8,
    },
    priorityItem: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
    },
    priorityLabel: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    priorityCount: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        fontWeight: '600',
    },
    priorityA: { color: '#ef4444' },
    priorityB: { color: '#f97316' },
    priorityC: { color: '#eab308' },
    priorityD: { color: '#6b7280' },
    projectItem: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    projectName: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    projectStats: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        marginBottom: 8,
    },
    progressBar: {
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#10b981',
    },
    timeCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 8,
        padding: 16,
    },
    timeEstimate: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    timeNote: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
    },
    closeButton: {
        backgroundColor: '#10b981',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignItems: 'center',
        marginTop: 16,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
